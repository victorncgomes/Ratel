/**
 * RATE Calculation Service
 * AI-powered email scoring using Gemini API
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Calculate RATE score for emails using Gemini AI
 */
async function calculateRateWithGemini(emails, senderBehavior) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Você é um assistente de análise de emails. Analise os seguintes emails e atribua uma pontuação de 0 a 100 para cada um, onde:
- 0-20: Spam/Lixo - deletar imediatamente
- 21-40: Provavelmente irrelevante
- 41-60: Neutro - pode manter ou deletar
- 61-80: Provavelmente importante
- 81-100: Muito importante - manter

Considere:
- Remetentes conhecidos vs desconhecidos
- Palavras no assunto (urgente, promoção, etc)
- Se é newsletter/lista de emails

Dados do comportamento do usuário:
- Taxa de deleção: ${senderBehavior?.deleteRate || 0.5}
- Taxa de manutenção: ${senderBehavior?.keepRate || 0.5}

Emails para analisar (em formato JSON):
${JSON.stringify(emails.slice(0, 10).map(e => ({
            from: e.from,
            subject: e.subject,
            hasUnsubscribe: e.hasUnsubscribe
        })))}

Responda APENAS em JSON válido com este formato:
[{"emailId": "id", "score": 75, "reason": "motivo breve", "category": "keep|neutral|delete"}]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Parse JSON response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return null;
    } catch (error) {
        console.error('Erro ao calcular RATE com Gemini:', error);
        return null;
    }
}

/**
 * Calculate RATE locally (fallback when Gemini unavailable)
 */
function calculateRateLocal(email, senderBehavior) {
    let score = 50; // Start neutral
    const reasons = [];

    // Sender behavior analysis
    if (senderBehavior?.deleteRate > 0.7) {
        score -= 30;
        reasons.push('Remetente frequentemente deletado');
    } else if (senderBehavior?.keepRate > 0.7) {
        score += 30;
        reasons.push('Remetente geralmente mantido');
    }

    // Email characteristics
    if (email.hasUnsubscribe) {
        score -= 10;
        reasons.push('Newsletter/lista');
    }

    // Subject analysis
    const subject = (email.subject || '').toLowerCase();
    const promoKeywords = ['promoção', 'oferta', 'desconto', 'grátis', 'free', 'sale', 'off'];
    const importantKeywords = ['urgente', 'importante', 'confirmação', 'pagamento', 'fatura'];

    if (promoKeywords.some(k => subject.includes(k))) {
        score -= 15;
        reasons.push('Conteúdo promocional');
    }

    if (importantKeywords.some(k => subject.includes(k))) {
        score += 20;
        reasons.push('Palavras importantes');
    }

    // Clamp
    score = Math.max(0, Math.min(100, score));

    // Category
    let category;
    if (score < 40) category = 'delete';
    else if (score > 60) category = 'keep';
    else category = 'neutral';

    return {
        emailId: email.id,
        score: Math.round(score),
        reason: reasons.join('. ') || 'Análise padrão',
        category,
        confidence: 50
    };
}

/**
 * Calculate rates for multiple emails
 */
async function calculateRates(emails, senderBehavior) {
    // Try Gemini first
    const aiRates = await calculateRateWithGemini(emails, senderBehavior);

    if (aiRates && Array.isArray(aiRates)) {
        // Merge AI results with local fallback for missing
        const aiMap = new Map(aiRates.map(r => [r.emailId, r]));

        return emails.map(email => {
            const aiRate = aiMap.get(email.id);
            if (aiRate) return aiRate;
            return calculateRateLocal(email, senderBehavior);
        });
    }

    // Fallback to local calculation
    return emails.map(email => calculateRateLocal(email, senderBehavior));
}

module.exports = {
    calculateRates,
    calculateRateLocal,
    calculateRateWithGemini
};
