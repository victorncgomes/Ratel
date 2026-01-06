const { google } = require('googleapis');

// Cache para evitar chamadas repetidas
const emailCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

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
async function fetchGmailEmails(accessToken, maxResults = 50, query = null) {
    try {
        const gmail = createGmailClient(accessToken);

        // Buscar lista de IDs de mensagens com paginação
        let allMessages = [];
        let nextPageToken = null;

        do {
            const listParams = {
                userId: 'me',
                maxResults: Math.min(maxResults - allMessages.length, 100),
                pageToken: nextPageToken
            };

            // Se houver query, usa 'q', caso contrário, restringe à INBOX
            if (query) {
                listParams.q = query;
            } else {
                listParams.labelIds = ['INBOX'];
            }

            const listResponse = await gmail.users.messages.list(listParams);

            const messages = listResponse.data.messages || [];
            allMessages = allMessages.concat(messages);
            nextPageToken = listResponse.data.nextPageToken;

            // Parar se atingir o limite ou não houver mais páginas
        } while (nextPageToken && allMessages.length < maxResults);

        // Limitar ao número exato solicitado caso tenha passado um pouco
        allMessages = allMessages.slice(0, maxResults);

        console.log(`[Gmail] Total messages found: ${allMessages.length}`);

        // Buscar detalhes de cada mensagem
        // OTIMIZADO: batch menor e delay maior para evitar rate limit
        const emails = [];
        const BATCH_SIZE = 5; // Reduzido de 10 para 5

        // Verificar cache primeiro
        const cachedResults = [];
        const toFetch = [];

        for (const msg of allMessages) {
            const cached = emailCache.get(msg.id);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                cachedResults.push(cached.data);
            } else {
                toFetch.push(msg);
            }
        }

        console.log(`[Gmail] Using ${cachedResults.length} cached, fetching ${toFetch.length} new`);

        for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
            const batch = toFetch.slice(i, i + BATCH_SIZE);

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
                            hasUnsubscribe: !!getHeader('List-Unsubscribe'),
                            unsubscribeLink: getHeader('List-Unsubscribe')
                        };
                    } catch (err) {
                        console.warn(`[Gmail] Failed to fetch message ${msg.id}: ${err.message}`);
                        return null;
                    }
                })
            );

            // Salvar no cache
            batchResults.forEach(result => {
                if (result) {
                    emailCache.set(result.id, { data: result, timestamp: Date.now() });
                }
            });

            emails.push(...batchResults.filter(e => e !== null));

            // AUMENTADO delay entre batches para evitar rate limit
            if (i + BATCH_SIZE < toFetch.length) {
                await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay (era 100ms)
            }
        }

        // Combinar cached + novos
        return [...cachedResults, ...emails];
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
