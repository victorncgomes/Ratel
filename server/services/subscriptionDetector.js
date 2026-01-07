/**
 * Detecta newsletters/inscrições a partir de uma lista de emails
 * Agrupa por remetente e identifica padrões de newsletter
 */

/**
 * Extrai o domínio de um endereço de email
 */
function extractDomain(email) {
    const match = email.match(/@([^>]+)/);
    return match ? match[1].toLowerCase() : '';
}

/**
 * Extrai o endereço de email limpo
 */
function extractEmail(fromField) {
    const match = fromField.match(/<([^>]+)>/) || fromField.match(/([^\s<]+@[^\s>]+)/);
    return match ? match[1].toLowerCase() : fromField.toLowerCase();
}

/**
 * Extrai o nome do remetente
 */
function extractName(fromField) {
    const match = fromField.match(/^([^<]+)</);
    if (match) {
        return match[1].trim().replace(/"/g, '');
    }
    return fromField.split('@')[0];
}

/**
 * Verifica se o email parece ser uma newsletter
 */
function isLikelyNewsletter(email) {
    const emailLower = email.from.toLowerCase();
    const newsletterPatterns = [
        'newsletter', 'updates', 'noreply', 'no-reply', 'news@',
        'digest', 'weekly', 'daily', 'marketing', 'promo',
        'notification', 'alert', 'info@', 'hello@', 'team@'
    ];

    // Verifica padrões no remetente
    const hasNewsletterPattern = newsletterPatterns.some(pattern =>
        emailLower.includes(pattern)
    );

    // Verifica header List-Unsubscribe
    const hasUnsubscribe = email.hasUnsubscribe;

    return hasNewsletterPattern || hasUnsubscribe;
}

/**
 * Calcula a frequência estimada de envio
 */
function calculateFrequency(dates) {
    if (dates.length < 2) return 'Único';

    // Ordenar datas
    const sortedDates = dates.map(d => new Date(d)).sort((a, b) => b - a);

    // Calcular intervalo médio em dias
    let totalInterval = 0;
    for (let i = 0; i < sortedDates.length - 1; i++) {
        totalInterval += (sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24);
    }
    const avgInterval = totalInterval / (sortedDates.length - 1);

    if (avgInterval < 1.5) return 'Diário';
    if (avgInterval < 4) return 'Dia Sim, Dia Não';
    if (avgInterval < 10) return 'Semanal';
    if (avgInterval < 20) return 'Quinzenal';
    if (avgInterval < 45) return 'Mensal';
    return 'Esporádico';
}

/**
 * Calcula um score de engajamento (0-100)
 * Baseado em frequência e se o usuário costuma abrir/ler
 */
function calculateScore(emails, frequency) {
    let score = 50; // Base

    // Bonus por ter opção de unsubscribe (é uma newsletter legítima)
    const hasUnsubscribe = emails.some(e => e.hasUnsubscribe);
    if (hasUnsubscribe) score += 10;

    // Penalidade por alta frequência
    if (frequency === 'Diário') score -= 20;
    if (frequency === 'Dia Sim, Dia Não') score -= 10;

    // Bonus por volume moderado
    if (emails.length > 5 && emails.length < 50) score += 15;
    if (emails.length >= 50) score -= 15;

    // Garantir range 0-100
    return Math.max(0, Math.min(100, score));
}

/**
 * Gera uma cor Fluent UI baseada no índice
 */
function getFluentColor(index) {
    const colors = [
        'bg-fluent-blue', 'bg-fluent-teal', 'bg-fluent-green',
        'bg-fluent-purple', 'bg-fluent-magenta', 'bg-fluent-orange',
        'bg-fluent-yellow', 'bg-fluent-red'
    ];
    return colors[index % colors.length];
}

/**
 * Determina o status baseado no score
 */
function determineStatus(score, hasUnsubscribe) {
    if (score >= 70) return 'Ativo';
    if (score >= 40) return 'Risco';
    if (!hasUnsubscribe) return 'Spam';
    return 'Inativo';
}

/**
 * Detecta e agrupa inscrições/newsletters
 * @param {Array} emails - Lista de emails do fetchEmails
 * @param {boolean} debug - Se true, retorna todos os grupos sem filtrar
 * @returns {Array} Lista de inscrições agrupadas
 */
function detectSubscriptions(emails, debug = false) {
    // Agrupar emails por remetente
    const groupedByEmail = {};

    emails.forEach(email => {
        const senderEmail = extractEmail(email.from);
        const domain = extractDomain(senderEmail);

        // Usar domínio como chave para agrupar variações do mesmo remetente
        if (!groupedByEmail[domain]) {
            groupedByEmail[domain] = {
                emails: [],
                senderEmail: senderEmail,
                senderName: extractName(email.from),
                domain: domain
            };
        }
        groupedByEmail[domain].emails.push(email);
    });

    // Filtrar apenas os que parecem newsletters e criar resultado
    const subscriptions = Object.entries(groupedByEmail)
        .filter(([_, data]) => {
            if (debug) return true; // Retorna tudo no modo debug

            // Incluir se: tem mais de 1 email OU parece newsletter
            return data.emails.length > 1 || data.emails.some(e => isLikelyNewsletter(e));
        })
        .map(([domain, data], index) => {
            const dates = data.emails.map(e => e.date);
            const frequency = calculateFrequency(dates);
            const hasUnsubscribe = data.emails.some(e => e.hasUnsubscribe);
            const score = calculateScore(data.emails, frequency);

            return {
                id: index + 1,
                name: data.senderName || domain,
                email: data.senderEmail,
                domain: domain,
                freq: frequency,
                status: determineStatus(score, hasUnsubscribe),
                score: score,
                count: data.emails.length,
                color: getFluentColor(index),
                hasUnsubscribe: hasUnsubscribe,
                unsubscribeLink: data.emails.find(e => e.unsubscribeLink)?.unsubscribeLink || '',
                lastEmail: dates.sort((a, b) => new Date(b) - new Date(a))[0],
                emailIds: data.emails.map(e => e.id)
            };
        })
        .sort((a, b) => b.count - a.count); // Ordenar por quantidade de emails

    return subscriptions;
}

module.exports = {
    detectSubscriptions,
    extractEmail,
    extractName,
    extractDomain,
    isLikelyNewsletter
};
