/**
 * Serviço de Analytics - Processa emails para gerar estatísticas
 */

/**
 * Analisa emails e retorna dados para o gráfico de Volume Semanal
 * @param {Array} emails - Lista de emails
 * @returns {Array} Dados por dia da semana
 */
function analyzeWeeklyVolume(emails) {
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const dayCount = [0, 0, 0, 0, 0, 0, 0]; // Dom a Sab

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    emails.forEach(email => {
        const emailDate = new Date(email.date);
        if (emailDate >= sevenDaysAgo) {
            const dayOfWeek = emailDate.getDay(); // 0 = Domingo
            dayCount[dayOfWeek]++;
        }
    });

    // Reordenar para começar em Segunda
    const reordered = [
        { name: 'Seg', emails: dayCount[1], color: '#3B82F6' },
        { name: 'Ter', emails: dayCount[2], color: '#10B981' },
        { name: 'Qua', emails: dayCount[3], color: '#F59E0B' },
        { name: 'Qui', emails: dayCount[4], color: '#8B5CF6' },
        { name: 'Sex', emails: dayCount[5], color: '#EC4899' },
        { name: 'Sab', emails: dayCount[6], color: '#06B6D4' },
        { name: 'Dom', emails: dayCount[0], color: '#EF4444' },
    ];

    return reordered;
}

/**
 * Analisa emails por hora do dia
 * @param {Array} emails - Lista de emails
 * @returns {Array} Dados por faixa horária
 */
function analyzeHourlyActivity(emails) {
    const hourRanges = [
        { name: '00:00', start: 0, end: 4, value: 0 },
        { name: '04:00', start: 4, end: 8, value: 0 },
        { name: '08:00', start: 8, end: 12, value: 0 },
        { name: '12:00', start: 12, end: 16, value: 0 },
        { name: '16:00', start: 16, end: 20, value: 0 },
        { name: '20:00', start: 20, end: 24, value: 0 },
    ];

    emails.forEach(email => {
        const emailDate = new Date(email.date);
        const hour = emailDate.getHours();

        for (const range of hourRanges) {
            if (hour >= range.start && hour < range.end) {
                range.value++;
                break;
            }
        }
    });

    return hourRanges.map(r => ({ name: r.name, value: r.value }));
}

/**
 * Categoriza emails baseado no remetente e assunto
 * @param {Array} emails - Lista de emails
 * @returns {Array} Dados por categoria
 */
function analyzeCategories(emails) {
    const categories = {
        work: { count: 0, keywords: ['invoice', 'meeting', 'report', 'project', 'deadline', 'client', 'contract', 'proposal', 'budget', 'schedule', 'trabalho', 'reunião', 'relatório', 'projeto', 'cliente'] },
        social: { count: 0, keywords: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'tiktok', 'social', 'friend', 'invitation', 'amigo', 'convite'] },
        promotions: { count: 0, keywords: ['sale', 'discount', 'offer', 'promo', 'deal', 'coupon', 'free', 'limited', 'exclusive', 'promoção', 'desconto', 'oferta', 'grátis', 'cupom', 'black friday'] },
        updates: { count: 0, keywords: ['update', 'newsletter', 'digest', 'weekly', 'monthly', 'news', 'alert', 'notification', 'atualização', 'novidades', 'alerta'] },
    };

    emails.forEach(email => {
        const text = `${email.from} ${email.subject || ''} ${email.snippet || ''}`.toLowerCase();
        let categorized = false;

        for (const [category, data] of Object.entries(categories)) {
            if (data.keywords.some(keyword => text.includes(keyword))) {
                data.count++;
                categorized = true;
                break;
            }
        }

        // Se não categorizou, assume trabalho
        if (!categorized) {
            categories.work.count++;
        }
    });

    return [
        { name: 'Trabalho', value: categories.work.count, color: '#2563EB' },
        { name: 'Social', value: categories.social.count, color: '#10B981' },
        { name: 'Promoções', value: categories.promotions.count, color: '#F59E0B' },
        { name: 'Updates', value: categories.updates.count, color: '#6366F1' },
    ];
}

/**
 * Calcula métricas gerais
 * @param {Array} emails - Lista de emails
 * @returns {Object} Métricas calculadas
 */
function calculateMetrics(emails) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const last7Days = emails.filter(e => new Date(e.date) >= sevenDaysAgo).length;
    const last30Days = emails.filter(e => new Date(e.date) >= thirtyDaysAgo).length;

    // Tempo médio de leitura estimado (2 min por email)
    const avgReadingTimeMinutes = Math.round(last7Days * 2 / 7);

    return {
        totalEmails: emails.length,
        last7Days,
        last30Days,
        avgDailyEmails: Math.round(last7Days / 7),
        estimatedReadingTime: `${avgReadingTimeMinutes}m`,
    };
}

/**
 * Gera analytics completos
 * @param {Array} emails - Lista de emails
 * @returns {Object} Todos os dados de analytics
 */
function generateAnalytics(emails) {
    return {
        weeklyVolume: analyzeWeeklyVolume(emails),
        hourlyActivity: analyzeHourlyActivity(emails),
        categories: analyzeCategories(emails),
        metrics: calculateMetrics(emails),
    };
}

module.exports = {
    generateAnalytics,
    analyzeWeeklyVolume,
    analyzeHourlyActivity,
    analyzeCategories,
    calculateMetrics
};
