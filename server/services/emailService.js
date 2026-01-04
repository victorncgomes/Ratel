const { google } = require('googleapis');

/**
 * Cria um cliente Gmail autenticado
 */
function createGmailClient(accessToken) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return google.gmail({ version: 'v1', auth: oauth2Client });
}

/**
 * Busca emails da caixa de entrada
 * @param {string} accessToken - Token OAuth do usuário
 * @param {number} maxResults - Número máximo de emails (default: 50)
 * @returns {Promise<Array>} Lista de emails formatados
 */
async function fetchGmailEmails(accessToken, maxResults = 50) {
    try {
        const gmail = createGmailClient(accessToken);

        // Buscar lista de IDs de mensagens
        const listResponse = await gmail.users.messages.list({
            userId: 'me',
            maxResults,
            labelIds: ['INBOX']
        });

        const messages = listResponse.data.messages || [];

        // Buscar detalhes de cada mensagem
        const emails = await Promise.all(
            messages.map(async (msg) => {
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id,
                    format: 'metadata',
                    metadataHeaders: ['From', 'Subject', 'Date', 'List-Unsubscribe']
                });

                const headers = detail.data.payload?.headers || [];
                const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

                return {
                    id: msg.id,
                    threadId: msg.threadId,
                    from: getHeader('From'),
                    subject: getHeader('Subject'),
                    date: getHeader('Date'),
                    snippet: detail.data.snippet,
                    labelIds: detail.data.labelIds || [],
                    hasUnsubscribe: !!getHeader('List-Unsubscribe'),
                    unsubscribeLink: getHeader('List-Unsubscribe')
                };
            })
        );

        return emails;
    } catch (error) {
        console.error('Erro ao buscar emails do Gmail:', error.message);
        throw error;
    }
}

/**
 * Busca detalhes completos de um email
 */
async function getGmailEmailDetails(accessToken, emailId) {
    try {
        const gmail = createGmailClient(accessToken);

        const response = await gmail.users.messages.get({
            userId: 'me',
            id: emailId,
            format: 'full'
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar detalhes do email:', error.message);
        throw error;
    }
}

/**
 * Arquiva um email (remove da INBOX)
 */
async function archiveGmailEmail(accessToken, emailId) {
    try {
        const gmail = createGmailClient(accessToken);

        await gmail.users.messages.modify({
            userId: 'me',
            id: emailId,
            requestBody: {
                removeLabelIds: ['INBOX']
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Erro ao arquivar email:', error.message);
        throw error;
    }
}

/**
 * Move email para a lixeira
 */
async function trashGmailEmail(accessToken, emailId) {
    try {
        const gmail = createGmailClient(accessToken);

        await gmail.users.messages.trash({
            userId: 'me',
            id: emailId
        });

        return { success: true };
    } catch (error) {
        console.error('Erro ao excluir email:', error.message);
        throw error;
    }
}

/**
 * Exclui permanentemente um email
 */
async function deleteGmailEmail(accessToken, emailId) {
    try {
        const gmail = createGmailClient(accessToken);

        await gmail.users.messages.delete({
            userId: 'me',
            id: emailId
        });

        return { success: true };
    } catch (error) {
        console.error('Erro ao excluir permanentemente email:', error.message);
        throw error;
    }
}

/**
 * Busca estatísticas da caixa de entrada
 */
async function getGmailStats(accessToken) {
    try {
        const gmail = createGmailClient(accessToken);

        // Buscar contagem de emails não lidos
        const unreadResponse = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['INBOX', 'UNREAD'],
            maxResults: 1
        });

        // Buscar total na inbox
        const inboxResponse = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['INBOX'],
            maxResults: 1
        });

        // Buscar spam
        const spamResponse = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['SPAM'],
            maxResults: 1
        });

        return {
            unreadCount: unreadResponse.data.resultSizeEstimate || 0,
            inboxCount: inboxResponse.data.resultSizeEstimate || 0,
            spamCount: spamResponse.data.resultSizeEstimate || 0
        };
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error.message);
        throw error;
    }
}

module.exports = {
    fetchGmailEmails,
    getGmailEmailDetails,
    archiveGmailEmail,
    trashGmailEmail,
    deleteGmailEmail,
    getGmailStats
};
