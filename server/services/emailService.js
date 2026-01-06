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
 * Busca emails usando Batch API do Google para eficiência máxima
 * Em vez de 500 chamadas para 500 emails, fazemos apenas algumas chamadas batch
 */
async function fetchGmailEmails(accessToken, maxResults = 500, query = null) {
    try {
        const gmail = createGmailClient(accessToken);
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        // Buscar lista de IDs de mensagens com paginação
        let allMessageIds = [];
        let nextPageToken = null;

        do {
            const listParams = {
                userId: 'me',
                maxResults: Math.min(maxResults - allMessageIds.length, 500), // Gmail aceita até 500
                pageToken: nextPageToken
            };

            if (query) {
                listParams.q = query;
            } else {
                listParams.labelIds = ['INBOX'];
            }

            const listResponse = await gmail.users.messages.list(listParams);
            const messages = listResponse.data.messages || [];
            allMessageIds = allMessageIds.concat(messages);
            nextPageToken = listResponse.data.nextPageToken;

        } while (nextPageToken && allMessageIds.length < maxResults);

        allMessageIds = allMessageIds.slice(0, maxResults);


        if (allMessageIds.length === 0) {
            return [];
        }

        // USAR BATCH API: Buscar todos os emails em paralelo com Promise.all
        // mas com controle de concorrência para não sobrecarregar
        const CONCURRENT_REQUESTS = 50; // 50 requests paralelos
        const emails = [];

        for (let i = 0; i < allMessageIds.length; i += CONCURRENT_REQUESTS) {
            const batch = allMessageIds.slice(i, i + CONCURRENT_REQUESTS);

            const batchResults = await Promise.all(
                batch.map(async (msg) => {
                    try {
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
                            sizeEstimate: detail.data.sizeEstimate || 0,
                            hasUnsubscribe: !!getHeader('List-Unsubscribe'),
                            unsubscribeLink: getHeader('List-Unsubscribe')
                        };
                    } catch (err) {
                        console.warn(`[Gmail] Failed to fetch message ${msg.id}: ${err.message}`);
                        return null;
                    }
                })
            );

            emails.push(...batchResults.filter(e => e !== null));

        }

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

        // Usar Promise.all para buscar todas as estatísticas em paralelo
        const [unreadResponse, inboxResponse, spamResponse, trashResponse] = await Promise.all([
            gmail.users.messages.list({
                userId: 'me',
                labelIds: ['INBOX', 'UNREAD'],
                maxResults: 1
            }),
            gmail.users.messages.list({
                userId: 'me',
                labelIds: ['INBOX'],
                maxResults: 1
            }),
            gmail.users.messages.list({
                userId: 'me',
                labelIds: ['SPAM'],
                maxResults: 1
            }),
            gmail.users.messages.list({
                userId: 'me',
                labelIds: ['TRASH'],
                maxResults: 1
            })
        ]);

        return {
            unreadCount: unreadResponse.data.resultSizeEstimate || 0,
            inboxCount: inboxResponse.data.resultSizeEstimate || 0,
            spamCount: spamResponse.data.resultSizeEstimate || 0,
            trashCount: trashResponse.data.resultSizeEstimate || 0
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
