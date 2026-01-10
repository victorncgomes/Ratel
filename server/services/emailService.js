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
 * ESTRATÉGIA EFICIENTE para buscar emails do Gmail
 * 
 * Problema: Gmail API tem limite de 250 queries/segundo/usuário
 * Solução: 
 *   1. Usar messages.list para pegar IDs (1 chamada = até 500 IDs)
 *   2. Usar batchGet quando disponível, ou
 *   3. Fazer chamadas paralelas controladas com delays
 *   4. Usar format=METADATA com fields mínimos
 */
async function fetchGmailEmails(accessToken, maxResults = 100, query = null) {
    try {
        const gmail = createGmailClient(accessToken);

        // ETAPA 1: Buscar lista de IDs (muito rápido, 1 chamada = até 500 IDs)
        let allMessageIds = [];
        let nextPageToken = null;

        do {
            const listParams = {
                userId: 'me',
                maxResults: Math.min(maxResults - allMessageIds.length, 500),
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

        console.log(`[Gmail] Encontrados ${allMessageIds.length} emails. Buscando metadados...`);

        // ETAPA 2: Buscar detalhes com Concurrency Pool
        // Maximiza throughput respeitando rate limits via backoff individual
        const CONCURRENCY = 45; // Seguro para evitar bursts muito grandes
        const emails = [];
        let completed = 0;

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Helper para fetch com retry
        const fetchMessageWithRetry = async (msgId) => {
            let retries = 3;
            while (retries > 0) {
                try {
                    // Usar format=METADATA com apenas os headers necessários
                    const detail = await gmail.users.messages.get({
                        userId: 'me',
                        id: msgId,
                        format: 'metadata',
                        metadataHeaders: ['From', 'Subject', 'Date', 'List-Unsubscribe'],
                        // Usar fields para reduzir payload
                        fields: 'id,threadId,snippet,labelIds,sizeEstimate,payload/headers'
                    });

                    const headers = detail.data.payload?.headers || [];
                    const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

                    return {
                        id: msgId,
                        threadId: detail.data.threadId,
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
                    if (err.code === 429 || err.code === 403) { // Rate limit or quota
                        retries--;
                        if (retries === 0) throw err;
                        // Backoff exponencial: 1s, 2s, 4s... com jitter
                        const waitTime = (1000 * Math.pow(2, 3 - retries)) + (Math.random() * 500);
                        await delay(waitTime);
                        continue;
                    }
                    throw err;
                }
            }
        };

        // Implementação simplificada de p-limit/pool
        const pool = [];
        const results = [];

        // Função para executar um item e gerenciar o pool
        const executeItem = async (msg) => {
            try {
                const result = await fetchMessageWithRetry(msg.id);
                if (result) results.push(result);
            } catch (err) {
                console.warn(`[Gmail] Failed to fetch message ${msg.id}: ${err.message}`);
            } finally {
                completed++;
                if (completed % 100 === 0) {
                     console.log(`[Gmail] Carregados ${completed}/${allMessageIds.length} emails`);
                }
            }
        };

        // Iniciar pool inicial
        const initialBatch = allMessageIds.slice(0, CONCURRENCY);
        const remainingItems = allMessageIds.slice(CONCURRENCY);

        const executing = new Set();

        for (const msg of initialBatch) {
            const p = executeItem(msg).then(() => executing.delete(p));
            executing.add(p);
        }

        // Processar restante
        for (const msg of remainingItems) {
            // Esperar que pelo menos um termine se o pool estiver cheio
            if (executing.size >= CONCURRENCY) {
                await Promise.race(executing);
            }
            const p = executeItem(msg).then(() => executing.delete(p));
            executing.add(p);
        }

        // Esperar todos terminarem
        await Promise.all(executing);

        emails.push(...results);

        console.log(`[Gmail] Concluído! ${emails.length} emails carregados.`);
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
 * Arquiva email
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
        return true;
    } catch (error) {
        console.error('Erro ao arquivar email:', error.message);
        throw error;
    }
}

/**
 * Move para lixeira
 */
async function trashGmailEmail(accessToken, emailId) {
    try {
        const gmail = createGmailClient(accessToken);
        await gmail.users.messages.trash({
            userId: 'me',
            id: emailId
        });
        return true;
    } catch (error) {
        console.error('Erro ao mover para lixeira:', error.message);
        throw error;
    }
}

/**
 * Exclui permanentemente
 */
async function deleteGmailEmail(accessToken, emailId) {
    try {
        const gmail = createGmailClient(accessToken);
        await gmail.users.messages.delete({
            userId: 'me',
            id: emailId
        });
        return true;
    } catch (error) {
        console.error('Erro ao excluir email:', error.message);
        throw error;
    }
}

/**
 * Obtém estatísticas da caixa
 */
async function getGmailStats(accessToken) {
    try {
        const gmail = createGmailClient(accessToken);

        // Buscar contagens de forma eficiente (apenas contagem, sem detalhes)
        const [inbox, unread, spam, trash] = await Promise.all([
            gmail.users.messages.list({ userId: 'me', labelIds: ['INBOX'], maxResults: 1 }),
            gmail.users.messages.list({ userId: 'me', labelIds: ['UNREAD'], maxResults: 1 }),
            gmail.users.messages.list({ userId: 'me', labelIds: ['SPAM'], maxResults: 1 }),
            gmail.users.messages.list({ userId: 'me', labelIds: ['TRASH'], maxResults: 1 })
        ]);

        // Para contagem exata, usar labels.get
        const inboxLabel = await gmail.users.labels.get({ userId: 'me', id: 'INBOX' });
        const spamLabel = await gmail.users.labels.get({ userId: 'me', id: 'SPAM' });
        const trashLabel = await gmail.users.labels.get({ userId: 'me', id: 'TRASH' });

        return {
            inboxCount: inboxLabel.data.messagesTotal || 0,
            unreadCount: inboxLabel.data.messagesUnread || 0,
            spamCount: spamLabel.data.messagesTotal || 0,
            trashCount: trashLabel.data.messagesTotal || 0
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
