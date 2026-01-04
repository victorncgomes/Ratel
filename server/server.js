const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;

// Services
const { fetchGmailEmails, archiveGmailEmail, trashGmailEmail, deleteGmailEmail, getGmailStats } = require('./services/emailService');
const { fetchOutlookEmails, archiveOutlookEmail, trashOutlookEmail, deleteOutlookEmail, getOutlookStats } = require('./services/outlookService');
const { detectSubscriptions } = require('./services/subscriptionDetector');
const { generateAnalytics } = require('./services/analyticsService');
const { classifyEmails, generateClassificationStats, groupByLabel } = require('./services/geminiService');
const { analyzeInbox, getOldDrafts, emptyTrash, emptySpam } = require('./services/cleanupService');

// Load env vars
dotenv.config();

// Initialize Express
const app = express();
const PORT = 3109;

// Middleware
app.use(cors({
    origin: 'http://localhost:3009',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'ratel-secret-key-v2',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    }
}));

// Debug Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - User: ${req.user?.displayName || 'Guest'}`);
    next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialization - Agora inclui accessToken
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// ========================================
// GOOGLE OAUTH - Com escopos de Gmail
// ========================================
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
    callbackURL: "http://localhost:3109/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        // Armazenar accessToken no perfil para uso posterior
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        profile.provider = 'google';
        return cb(null, profile);
    }
));

// ========================================
// MICROSOFT OAUTH - Com escopos de Mail
// ========================================
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || 'dummy_secret',
    callbackURL: "http://localhost:3109/auth/microsoft/callback",
    scope: ['user.read', 'Mail.Read', 'Mail.ReadWrite']
},
    function (accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        profile.provider = 'microsoft';
        return done(null, profile);
    }
));

// ========================================
// AUTH ROUTES
// ========================================

// Google Auth - Escopos expandidos para Gmail
app.get('/auth/google',
    passport.authenticate('google', {
        scope: [
            'profile',
            'email',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify'
        ],
        accessType: 'offline',
        prompt: 'consent'
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3009?error=true' }),
    (req, res) => {
        const user = req.user;
        const userData = encodeURIComponent(JSON.stringify({
            name: user.displayName,
            email: user.emails?.[0]?.value || '',
            photo: user.photos?.[0]?.value || '',
            provider: 'google',
            accessToken: user.accessToken // Incluir token
        }));
        res.redirect(`http://localhost:3009?auth=success&user=${userData}`);
    }
);

// Microsoft Auth
app.get('/auth/microsoft',
    passport.authenticate('microsoft', {
        prompt: 'select_account',
    })
);

app.get('/auth/microsoft/callback',
    passport.authenticate('microsoft', { failureRedirect: 'http://localhost:3009?error=true' }),
    (req, res) => {
        const user = req.user;
        const userData = encodeURIComponent(JSON.stringify({
            name: user.displayName,
            email: user.emails?.[0]?.value || '',
            photo: user.photos?.[0]?.value || '',
            provider: 'microsoft',
            accessToken: user.accessToken // Incluir token
        }));
        res.redirect(`http://localhost:3009?auth=success&user=${userData}`);
    }
);

// User Info
app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                name: req.user.displayName,
                email: req.user.emails?.[0]?.value || '',
                photo: req.user.photos?.[0]?.value || '',
                provider: req.user.provider
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Logout
app.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('http://localhost:3009/login');
    });
});

// ========================================
// EMAIL API ROUTES
// ========================================

// Middleware para verificar autenticação (sessão OU header)
const requireAuth = (req, res, next) => {
    // Tenta da sessão primeiro
    if (req.isAuthenticated() && req.user.accessToken) {
        return next();
    }

    // Fallback: pegar do header Authorization
    const authHeader = req.headers.authorization;
    const provider = req.headers['x-provider'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const accessToken = authHeader.substring(7);
        // Injeta no req.user para compatibilidade
        req.user = {
            accessToken,
            provider: provider || 'google'
        };
        return next();
    }

    return res.status(401).json({ error: 'Não autenticado. Faça login novamente.' });
};

// GET /api/emails - Lista emails
app.get('/api/emails', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;
        const maxResults = parseInt(req.query.limit) || 50;

        let emails;
        if (provider === 'google') {
            emails = await fetchGmailEmails(accessToken, maxResults);
        } else if (provider === 'microsoft') {
            emails = await fetchOutlookEmails(accessToken, maxResults);
        } else {
            return res.status(400).json({ error: 'Provedor não suportado' });
        }

        res.json({ emails, count: emails.length });
    } catch (error) {
        console.error('Erro ao buscar emails:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/subscriptions - Lista inscrições/newsletters
app.get('/api/subscriptions', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;

        let emails;
        if (provider === 'google') {
            emails = await fetchGmailEmails(accessToken, 200); // Buscar mais para melhor detecção
        } else if (provider === 'microsoft') {
            emails = await fetchOutlookEmails(accessToken, 200);
        } else {
            return res.status(400).json({ error: 'Provedor não suportado' });
        }

        const subscriptions = detectSubscriptions(emails);

        res.json({ subscriptions, count: subscriptions.length });
    } catch (error) {
        console.error('Erro ao detectar inscrições:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/stats - Estatísticas da caixa de entrada
app.get('/api/stats', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;

        let stats;
        if (provider === 'google') {
            stats = await getGmailStats(accessToken);
        } else if (provider === 'microsoft') {
            stats = await getOutlookStats(accessToken);
        } else {
            return res.status(400).json({ error: 'Provedor não suportado' });
        }

        res.json(stats);
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/analytics - Analytics completos para Dashboard
app.get('/api/analytics', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;

        let emails;
        if (provider === 'google') {
            emails = await fetchGmailEmails(accessToken, 200);
        } else if (provider === 'microsoft') {
            emails = await fetchOutlookEmails(accessToken, 200);
        } else {
            return res.status(400).json({ error: 'Provedor não suportado' });
        }

        const analytics = generateAnalytics(emails);

        res.json(analytics);
    } catch (error) {
        console.error('Erro ao gerar analytics:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/labels/classify - Classifica emails com IA Gemini
app.get('/api/labels/classify', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;
        const limit = parseInt(req.query.limit) || 20;

        let emails;
        if (provider === 'google') {
            emails = await fetchGmailEmails(accessToken, limit);
        } else if (provider === 'microsoft') {
            emails = await fetchOutlookEmails(accessToken, limit);
        } else {
            return res.status(400).json({ error: 'Provedor não suportado' });
        }

        // Classificar com Gemini
        const classifiedEmails = await classifyEmails(emails);
        const stats = generateClassificationStats(classifiedEmails);
        const labels = groupByLabel(classifiedEmails);

        res.json({
            classified: classifiedEmails,
            stats,
            labels
        });
    } catch (error) {
        console.error('Erro ao classificar emails:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/emails/:id/archive - Arquiva email
app.post('/api/emails/:id/archive', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;
        const { id } = req.params;

        let result;
        if (provider === 'google') {
            result = await archiveGmailEmail(accessToken, id);
        } else if (provider === 'microsoft') {
            result = await archiveOutlookEmail(accessToken, id);
        } else {
            return res.status(400).json({ error: 'Provedor não suportado' });
        }

        res.json(result);
    } catch (error) {
        console.error('Erro ao arquivar email:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/emails/:id/trash - Move para lixeira
app.post('/api/emails/:id/trash', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;
        const { id } = req.params;

        let result;
        if (provider === 'google') {
            result = await trashGmailEmail(accessToken, id);
        } else if (provider === 'microsoft') {
            result = await trashOutlookEmail(accessToken, id);
        } else {
            return res.status(400).json({ error: 'Provedor não suportado' });
        }

        res.json(result);
    } catch (error) {
        console.error('Erro ao mover para lixeira:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/emails/:id - Exclui permanentemente
app.delete('/api/emails/:id', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;
        const { id } = req.params;

        let result;
        if (provider === 'google') {
            result = await deleteGmailEmail(accessToken, id);
        } else if (provider === 'microsoft') {
            result = await deleteOutlookEmail(accessToken, id);
        } else {
            return res.status(400).json({ error: 'Provedor não suportado' });
        }

        res.json(result);
    } catch (error) {
        console.error('Erro ao excluir email:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/subscriptions/:id/archive-all - Arquiva todos emails de uma inscrição
app.post('/api/subscriptions/archive-all', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;
        const { emailIds } = req.body;

        if (!emailIds || !Array.isArray(emailIds)) {
            return res.status(400).json({ error: 'emailIds é obrigatório' });
        }

        const results = await Promise.allSettled(
            emailIds.map(id => {
                if (provider === 'google') {
                    return archiveGmailEmail(accessToken, id);
                } else {
                    return archiveOutlookEmail(accessToken, id);
                }
            })
        );

        const success = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        res.json({ success, failed, total: emailIds.length });
    } catch (error) {
        console.error('Erro ao arquivar emails:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/subscriptions/delete-all - Exclui todos emails de uma inscrição
app.post('/api/subscriptions/delete-all', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;
        const { emailIds } = req.body;

        if (!emailIds || !Array.isArray(emailIds)) {
            return res.status(400).json({ error: 'emailIds é obrigatório' });
        }

        const results = await Promise.allSettled(
            emailIds.map(id => {
                if (provider === 'google') {
                    return trashGmailEmail(accessToken, id);
                } else {
                    return trashOutlookEmail(accessToken, id);
                }
            })
        );

        const success = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        res.json({ success, failed, total: emailIds.length });
    } catch (error) {
        console.error('Erro ao excluir emails:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/subscriptions/ratel-furioso - Bulk unsubscribe (Ratel Furioso)
app.post('/api/subscriptions/ratel-furioso', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;
        const { subscriptionIds, deleteHistory } = req.body;

        if (!Array.isArray(subscriptionIds) || subscriptionIds.length === 0) {
            return res.status(400).json({ error: 'subscriptionIds deve ser um array não vazio' });
        }

        const startTime = Date.now();
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        // Buscar emails para cada inscrição
        let allEmails = [];
        if (provider === 'google') {
            allEmails = await fetchGmailEmails(accessToken, 500);
        } else if (provider === 'microsoft') {
            allEmails = await fetchOutlookEmails(accessToken, 500);
        }

        // Detectar inscrições
        const subscriptions = await detectSubscriptions(allEmails);

        // Processar cada inscrição selecionada
        for (const subId of subscriptionIds) {
            try {
                const subscription = subscriptions.find(s => s.id === subId);

                if (!subscription) {
                    results.failed++;
                    results.errors.push(`Inscrição ${subId} não encontrada`);
                    continue;
                }

                // Tentar cancelar via link de unsubscribe (se disponível)
                if (subscription.hasUnsubscribe && subscription.unsubscribeLink) {
                    try {
                        // Fazer requisição HTTP para o link de unsubscribe
                        await fetch(subscription.unsubscribeLink, { method: 'GET' });
                    } catch (e) {
                        console.warn(`Falha ao acessar link de unsubscribe: ${e.message}`);
                    }
                }

                // Deletar histórico se solicitado
                if (deleteHistory && subscription.emailIds && subscription.emailIds.length > 0) {
                    const deletePromises = subscription.emailIds.map(emailId => {
                        if (provider === 'google') {
                            return deleteGmailEmail(accessToken, emailId).catch(e => null);
                        } else {
                            return deleteOutlookEmail(accessToken, emailId).catch(e => null);
                        }
                    });

                    await Promise.allSettled(deletePromises);
                }

                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push(`Erro ao processar inscrição ${subId}: ${error.message}`);
            }
        }

        const totalTime = Date.now() - startTime;

        res.json({
            success: results.success,
            failed: results.failed,
            errors: results.errors,
            totalTime,
            total: subscriptionIds.length
        });
    } catch (error) {
        console.error('Erro no Ratel Furioso:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// CLEANUP ROUTES
// ========================================

// GET /api/cleanup/analyze - Analisar caixa de entrada
app.get('/api/cleanup/analyze', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;

        const analysis = await analyzeInbox(accessToken, provider);
        const drafts = await getOldDrafts(accessToken, provider, 7);

        res.json({
            ...analysis,
            drafts,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao analisar inbox:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/cleanup/drafts - Buscar rascunhos antigos
app.get('/api/cleanup/drafts', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;
        const daysOld = parseInt(req.query.days) || 7;

        const drafts = await getOldDrafts(accessToken, provider, daysOld);
        res.json(drafts);
    } catch (error) {
        console.error('Erro ao buscar rascunhos:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/cleanup/empty-trash - Esvaziar lixeira
app.post('/api/cleanup/empty-trash', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;

        const result = await emptyTrash(accessToken, provider);
        res.json(result);
    } catch (error) {
        console.error('Erro ao esvaziar lixeira:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/cleanup/empty-spam - Esvaziar spam
app.post('/api/cleanup/empty-spam', requireAuth, async (req, res) => {
    try {
        const { accessToken, provider } = req.user;

        const result = await emptySpam(accessToken, provider);
        res.json(result);
    } catch (error) {
        console.error('Erro ao esvaziar spam:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
    console.log(`🚀 Ratel Server running on http://localhost:${PORT}`);
    console.log(`📧 Gmail API: Ready`);
    console.log(`📧 Outlook API: Ready`);
});
