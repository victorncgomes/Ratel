const { google } = require('googleapis');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

/**
 * Analisa a caixa de entrada e retorna estatísticas de limpeza
 */
async function analyzeInbox(accessToken, provider) {
    try {
        let emails = [];
        let spamCount = 0;
        let trashCount = 0;
        let draftsData = { count: 0, size: '0 MB', ids: [] };

        if (provider === 'google') {
            emails = await fetchGmailForAnalysis(accessToken);
            // Buscar contagem de spam e lixeira
            const spamTrashData = await getGmailSpamTrashCount(accessToken);
            spamCount = spamTrashData.spam;
            trashCount = spamTrashData.trash;
            // Buscar rascunhos
            draftsData = await getGmailDrafts(accessToken, 7);
        } else if (provider === 'microsoft') {
            emails = await fetchOutlookForAnalysis(accessToken);
            // Buscar contagem de spam e lixeira
            const spamTrashData = await getOutlookSpamTrashCount(accessToken);
            spamCount = spamTrashData.spam;
            trashCount = spamTrashData.trash;
            // Buscar rascunhos
            draftsData = await getOutlookDrafts(accessToken, 7);
        }


        const now = new Date();
        const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Análise de emails antigos
        const oldEmails = emails.filter(e => new Date(e.date) < sixMonthsAgo);

        // Emails não lidos antigos
        const oldUnread = emails.filter(e =>
            !e.isRead && new Date(e.date) < thirtyDaysAgo
        );

        // Emails com anexos grandes (> 5MB)
        const largeAttachments = emails.filter(e =>
            e.hasAttachment && e.size > 5 * 1024 * 1024
        );

        // Calcular tamanhos
        const calculateSize = (emailList) => {
            const totalBytes = emailList.reduce((sum, e) => sum + (e.size || 0), 0);
            return formatBytes(totalBytes);
        };

        return {
            oldEmails: {
                count: oldEmails.length,
                size: calculateSize(oldEmails),
                ids: oldEmails.map(e => e.id)
            },
            oldUnread: {
                count: oldUnread.length,
                size: calculateSize(oldUnread),
                ids: oldUnread.map(e => e.id)
            },
            largeAttachments: {
                count: largeAttachments.length,
                size: calculateSize(largeAttachments),
                ids: largeAttachments.map(e => e.id)
            },
            drafts: draftsData,
            spam: {
                count: spamCount,
                size: '...' // Tamanho não calculado para performance
            },
            trash: {
                count: trashCount,
                size: '...'
            },
            totalAnalyzed: emails.length
        };
    } catch (error) {
        console.error('Erro ao analisar inbox:', error);
        throw error;
    }
}

/**
 * Busca emails do Gmail para análise
 */
async function fetchGmailForAnalysis(accessToken) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    try {
        // Buscar até 500 emails da inbox
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 500,
            q: 'in:inbox'
        });

        if (!response.data.messages) {
            return [];
        }

        // Buscar detalhes de cada email
        const emailPromises = response.data.messages.map(async (msg) => {
            const detail = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id,
                format: 'metadata',
                metadataHeaders: ['From', 'Subject', 'Date']
            });

            const headers = detail.data.payload.headers;
            const getHeader = (name) => headers.find(h => h.name === name)?.value || '';

            return {
                id: msg.id,
                from: getHeader('From'),
                subject: getHeader('Subject'),
                date: getHeader('Date'),
                isRead: !detail.data.labelIds?.includes('UNREAD'),
                hasAttachment: detail.data.payload.parts?.some(p => p.filename) || false,
                size: detail.data.sizeEstimate || 0
            };
        });

        return await Promise.all(emailPromises);
    } catch (error) {
        console.error('Erro ao buscar emails do Gmail:', error);
        throw error;
    }
}

/**
 * Busca contagem de spam e lixeira do Gmail
 */
async function getGmailSpamTrashCount(accessToken) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    try {
        const [spamResponse, trashResponse] = await Promise.all([
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
            spam: spamResponse.data.resultSizeEstimate || 0,
            trash: trashResponse.data.resultSizeEstimate || 0
        };
    } catch (error) {
        console.error('Erro ao buscar contagem de spam/trash:', error);
        return { spam: 0, trash: 0 };
    }
}

/**
 * Busca contagem de spam e lixeira do Outlook
 */
async function getOutlookSpamTrashCount(accessToken) {
    const client = Client.init({
        authProvider: (done) => done(null, accessToken)
    });

    try {
        const [spamResponse, trashResponse] = await Promise.all([
            client.api('/me/mailFolders/junkemail/messages')
                .count(true)
                .top(1)
                .get(),
            client.api('/me/mailFolders/deleteditems/messages')
                .count(true)
                .top(1)
                .get()
        ]);

        return {
            spam: spamResponse['@odata.count'] || 0,
            trash: trashResponse['@odata.count'] || 0
        };
    } catch (error) {
        console.error('Erro ao buscar contagem de spam/trash do Outlook:', error);
        return { spam: 0, trash: 0 };
    }
}


/**
 * Busca emails do Outlook para análise
 */
async function fetchOutlookForAnalysis(accessToken) {
    const client = Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    try {
        const response = await client
            .api('/me/mailFolders/inbox/messages')
            .top(500)
            .select('id,from,subject,receivedDateTime,isRead,hasAttachments,body')
            .get();

        return response.value.map(msg => ({
            id: msg.id,
            from: msg.from?.emailAddress?.address || '',
            subject: msg.subject || '',
            date: msg.receivedDateTime,
            isRead: msg.isRead,
            hasAttachment: msg.hasAttachments,
            size: msg.body?.content?.length || 0 // Estimativa
        }));
    } catch (error) {
        console.error('Erro ao buscar emails do Outlook:', error);
        throw error;
    }
}

/**
 * Busca rascunhos antigos
 */
async function getOldDrafts(accessToken, provider, daysOld = 7) {
    try {
        if (provider === 'google') {
            return await getGmailDrafts(accessToken, daysOld);
        } else if (provider === 'microsoft') {
            return await getOutlookDrafts(accessToken, daysOld);
        }
        return { count: 0, size: '0 MB', ids: [] };
    } catch (error) {
        console.error('Erro ao buscar rascunhos:', error);
        throw error;
    }
}

async function getGmailDrafts(accessToken, daysOld) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const response = await gmail.users.drafts.list({ userId: 'me' });

    if (!response.data.drafts) {
        return { count: 0, size: '0 MB', ids: [] };
    }

    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    const oldDrafts = [];

    for (const draft of response.data.drafts) {
        const detail = await gmail.users.drafts.get({
            userId: 'me',
            id: draft.id
        });

        const internalDate = parseInt(detail.data.message.internalDate);
        if (new Date(internalDate) < cutoffDate) {
            oldDrafts.push({
                id: draft.id,
                size: detail.data.message.sizeEstimate || 0
            });
        }
    }

    const totalSize = oldDrafts.reduce((sum, d) => sum + d.size, 0);

    return {
        count: oldDrafts.length,
        size: formatBytes(totalSize),
        ids: oldDrafts.map(d => d.id)
    };
}

async function getOutlookDrafts(accessToken, daysOld) {
    const client = Client.init({
        authProvider: (done) => done(null, accessToken)
    });

    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    const response = await client
        .api('/me/mailFolders/drafts/messages')
        .select('id,createdDateTime,body')
        .get();

    const oldDrafts = response.value.filter(draft =>
        new Date(draft.createdDateTime) < cutoffDate
    );

    const totalSize = oldDrafts.reduce((sum, d) =>
        sum + (d.body?.content?.length || 0), 0
    );

    return {
        count: oldDrafts.length,
        size: formatBytes(totalSize),
        ids: oldDrafts.map(d => d.id)
    };
}

/**
 * Esvaziar lixeira
 */
async function emptyTrash(accessToken, provider) {
    try {
        if (provider === 'google') {
            const oauth2Client = new google.auth.OAuth2();
            oauth2Client.setCredentials({ access_token: accessToken });
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

            // Gmail: deletar todos os emails na lixeira
            await gmail.users.messages.batchDelete({
                userId: 'me',
                requestBody: {
                    ids: await getTrashIds(gmail)
                }
            });

            return { success: true, message: 'Lixeira esvaziada' };
        } else if (provider === 'microsoft') {
            const client = Client.init({
                authProvider: (done) => done(null, accessToken)
            });

            // Outlook: esvaziar pasta de itens excluídos
            await client.api('/me/mailFolders/deleteditems/messages').delete();

            return { success: true, message: 'Lixeira esvaziada' };
        }
    } catch (error) {
        console.error('Erro ao esvaziar lixeira:', error);
        throw error;
    }
}

async function getTrashIds(gmail) {
    const response = await gmail.users.messages.list({
        userId: 'me',
        labelIds: ['TRASH'],
        maxResults: 500
    });
    return response.data.messages?.map(m => m.id) || [];
}

/**
 * Esvaziar spam
 */
async function emptySpam(accessToken, provider) {
    try {
        if (provider === 'google') {
            const oauth2Client = new google.auth.OAuth2();
            oauth2Client.setCredentials({ access_token: accessToken });
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

            const response = await gmail.users.messages.list({
                userId: 'me',
                labelIds: ['SPAM'],
                maxResults: 500
            });

            if (response.data.messages) {
                await gmail.users.messages.batchDelete({
                    userId: 'me',
                    requestBody: {
                        ids: response.data.messages.map(m => m.id)
                    }
                });
            }

            return { success: true, message: 'Spam esvaziado', count: response.data.messages?.length || 0 };
        } else if (provider === 'microsoft') {
            const client = Client.init({
                authProvider: (done) => done(null, accessToken)
            });

            const response = await client
                .api('/me/mailFolders/junkemail/messages')
                .get();

            for (const msg of response.value) {
                await client.api(`/me/messages/${msg.id}`).delete();
            }

            return { success: true, message: 'Spam esvaziado', count: response.value.length };
        }
    } catch (error) {
        console.error('Erro ao esvaziar spam:', error);
        throw error;
    }
}

/**
 * Formatar bytes para formato legível
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Busca emails por tamanho mínimo (Deep Cleaning)
 */
async function getEmailsBySize(accessToken, provider, minSizeMB = 5) {
    try {
        const minSizeBytes = minSizeMB * 1024 * 1024;

        if (provider === 'google') {
            const oauth2Client = new google.auth.OAuth2();
            oauth2Client.setCredentials({ access_token: accessToken });
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

            // Usar query do Gmail para buscar emails grandes
            const query = `larger:${minSizeMB}M`;
            const response = await gmail.users.messages.list({
                userId: 'me',
                maxResults: 500,
                q: query
            });

            if (!response.data.messages) {
                return { emails: [], totalSize: '0 MB', count: 0 };
            }

            // Buscar detalhes dos emails
            const emailPromises = response.data.messages.map(async (msg) => {
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id,
                    format: 'metadata',
                    metadataHeaders: ['From', 'Subject', 'Date']
                });

                const headers = detail.data.payload.headers;
                const getHeader = (name) => headers.find(h => h.name === name)?.value || '';

                return {
                    id: msg.id,
                    from: getHeader('From'),
                    subject: getHeader('Subject'),
                    date: getHeader('Date'),
                    size: detail.data.sizeEstimate || 0,
                    sizeFormatted: formatBytes(detail.data.sizeEstimate || 0),
                    hasAttachment: detail.data.payload.parts?.some(p => p.filename) || false
                };
            });

            const emails = await Promise.all(emailPromises);
            const totalSize = emails.reduce((sum, e) => sum + e.size, 0);

            return {
                emails,
                totalSize: formatBytes(totalSize),
                count: emails.length
            };
        } else if (provider === 'microsoft') {
            // Outlook não tem query nativa para tamanho, então filtramos manualmente
            const client = Client.init({
                authProvider: (done) => done(null, accessToken)
            });

            const response = await client
                .api('/me/messages')
                .top(500)
                .select('id,from,subject,receivedDateTime,hasAttachments,body')
                .get();

            const largeEmails = response.value
                .map(msg => ({
                    id: msg.id,
                    from: msg.from?.emailAddress?.address || '',
                    subject: msg.subject || '',
                    date: msg.receivedDateTime,
                    size: msg.body?.content?.length || 0,
                    sizeFormatted: formatBytes(msg.body?.content?.length || 0),
                    hasAttachment: msg.hasAttachments
                }))
                .filter(e => e.size >= minSizeBytes);

            const totalSize = largeEmails.reduce((sum, e) => sum + e.size, 0);

            return {
                emails: largeEmails,
                totalSize: formatBytes(totalSize),
                count: largeEmails.length
            };
        }

        return { emails: [], totalSize: '0 MB', count: 0 };
    } catch (error) {
        console.error('Erro ao buscar emails por tamanho:', error);
        throw error;
    }
}

/**
 * Busca emails por data (antes de uma data específica)
 */
async function getEmailsByDate(accessToken, provider, beforeDate) {
    try {
        const cutoffDate = new Date(beforeDate);

        if (provider === 'google') {
            const oauth2Client = new google.auth.OAuth2();
            oauth2Client.setCredentials({ access_token: accessToken });
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

            // Formatar data para query do Gmail (YYYY/MM/DD)
            const dateStr = cutoffDate.toISOString().split('T')[0].replace(/-/g, '/');
            const query = `before:${dateStr}`;

            const response = await gmail.users.messages.list({
                userId: 'me',
                maxResults: 500,
                q: query
            });

            if (!response.data.messages) {
                return { emails: [], totalSize: '0 MB', count: 0 };
            }

            // Buscar detalhes dos emails
            const emailPromises = response.data.messages.map(async (msg) => {
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id,
                    format: 'metadata',
                    metadataHeaders: ['From', 'Subject', 'Date']
                });

                const headers = detail.data.payload.headers;
                const getHeader = (name) => headers.find(h => h.name === name)?.value || '';

                return {
                    id: msg.id,
                    from: getHeader('From'),
                    subject: getHeader('Subject'),
                    date: getHeader('Date'),
                    size: detail.data.sizeEstimate || 0,
                    sizeFormatted: formatBytes(detail.data.sizeEstimate || 0)
                };
            });

            const emails = await Promise.all(emailPromises);
            const totalSize = emails.reduce((sum, e) => sum + e.size, 0);

            return {
                emails,
                totalSize: formatBytes(totalSize),
                count: emails.length
            };
        } else if (provider === 'microsoft') {
            const client = Client.init({
                authProvider: (done) => done(null, accessToken)
            });

            const response = await client
                .api('/me/messages')
                .top(500)
                .filter(`receivedDateTime lt ${cutoffDate.toISOString()}`)
                .select('id,from,subject,receivedDateTime,body')
                .get();

            const emails = response.value.map(msg => ({
                id: msg.id,
                from: msg.from?.emailAddress?.address || '',
                subject: msg.subject || '',
                date: msg.receivedDateTime,
                size: msg.body?.content?.length || 0,
                sizeFormatted: formatBytes(msg.body?.content?.length || 0)
            }));

            const totalSize = emails.reduce((sum, e) => sum + e.size, 0);

            return {
                emails,
                totalSize: formatBytes(totalSize),
                count: emails.length
            };
        }

        return { emails: [], totalSize: '0 MB', count: 0 };
    } catch (error) {
        console.error('Erro ao buscar emails por data:', error);
        throw error;
    }
}

module.exports = {
    analyzeInbox,
    getOldDrafts,
    emptyTrash,
    emptySpam,
    getEmailsBySize,
    getEmailsByDate
};
