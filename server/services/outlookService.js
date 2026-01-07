require('isomorphic-fetch');
const { Client } = require('@microsoft/microsoft-graph-client');

/**
 * Cria um cliente Microsoft Graph autenticado
 */
function createGraphClient(accessToken) {
    return Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        }
    });
}

/**
 * Busca emails da caixa de entrada do Outlook
 */
async function fetchOutlookEmails(accessToken, maxResults = 50) {
    try {
        const client = createGraphClient(accessToken);

        const response = await client
            .api('/me/mailFolders/inbox/messages')
            .top(maxResults)
            .select('id,subject,from,receivedDateTime,bodyPreview,isRead,internetMessageHeaders')
            .orderby('receivedDateTime desc')
            .get();

        const emails = response.value.map(msg => {
            // Procurar header List-Unsubscribe
            const unsubscribeHeader = msg.internetMessageHeaders?.find(
                h => h.name.toLowerCase() === 'list-unsubscribe'
            );

            return {
                id: msg.id,
                from: msg.from?.emailAddress?.address || '',
                fromName: msg.from?.emailAddress?.name || '',
                subject: msg.subject,
                date: msg.receivedDateTime,
                snippet: msg.bodyPreview,
                isRead: msg.isRead,
                hasUnsubscribe: !!unsubscribeHeader,
                unsubscribeLink: unsubscribeHeader?.value || ''
            };
        });

        return emails;
    } catch (error) {
        console.error('Erro ao buscar emails do Outlook:', error.message);
        throw error;
    }
}

/**
 * Busca detalhes completos de um email
 */
async function getOutlookEmailDetails(accessToken, emailId) {
    try {
        const client = createGraphClient(accessToken);

        const response = await client
            .api(`/me/messages/${emailId}`)
            .get();

        return response;
    } catch (error) {
        console.error('Erro ao buscar detalhes do email:', error.message);
        throw error;
    }
}

/**
 * Move email para a pasta de arquivo morto
 */
async function archiveOutlookEmail(accessToken, emailId) {
    try {
        const client = createGraphClient(accessToken);

        // Primeiro, buscar a pasta Archive
        const folders = await client
            .api('/me/mailFolders')
            .filter("displayName eq 'Archive'")
            .get();

        let archiveFolderId = folders.value[0]?.id;

        // Se não existir, criar
        if (!archiveFolderId) {
            const newFolder = await client
                .api('/me/mailFolders')
                .post({ displayName: 'Archive' });
            archiveFolderId = newFolder.id;
        }

        // Mover email para Archive
        await client
            .api(`/me/messages/${emailId}/move`)
            .post({ destinationId: archiveFolderId });

        return { success: true };
    } catch (error) {
        console.error('Erro ao arquivar email:', error.message);
        throw error;
    }
}

/**
 * Move email para a lixeira
 */
async function trashOutlookEmail(accessToken, emailId) {
    try {
        const client = createGraphClient(accessToken);

        // Buscar pasta Deleted Items
        const folders = await client
            .api('/me/mailFolders')
            .filter("displayName eq 'Deleted Items'")
            .get();

        const trashFolderId = folders.value[0]?.id;

        if (trashFolderId) {
            await client
                .api(`/me/messages/${emailId}/move`)
                .post({ destinationId: trashFolderId });
        }

        return { success: true };
    } catch (error) {
        console.error('Erro ao mover para lixeira:', error.message);
        throw error;
    }
}

/**
 * Exclui permanentemente um email
 */
async function deleteOutlookEmail(accessToken, emailId) {
    try {
        const client = createGraphClient(accessToken);

        await client
            .api(`/me/messages/${emailId}`)
            .delete();

        return { success: true };
    } catch (error) {
        console.error('Erro ao excluir email:', error.message);
        throw error;
    }
}

/**
 * Busca estatísticas da caixa de entrada
 */
async function getOutlookStats(accessToken) {
    try {
        const client = createGraphClient(accessToken);

        // Buscar contagem de não lidos na inbox
        const inboxFolder = await client
            .api('/me/mailFolders/inbox')
            .select('unreadItemCount,totalItemCount')
            .get();

        // Buscar pasta de spam/junk
        const junkFolder = await client
            .api('/me/mailFolders/junkemail')
            .select('totalItemCount')
            .get();

        return {
            unreadCount: inboxFolder.unreadItemCount || 0,
            inboxCount: inboxFolder.totalItemCount || 0,
            spamCount: junkFolder.totalItemCount || 0
        };
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error.message);
        throw error;
    }
}

module.exports = {
    fetchOutlookEmails,
    getOutlookEmailDetails,
    archiveOutlookEmail,
    trashOutlookEmail,
    deleteOutlookEmail,
    getOutlookStats
};
