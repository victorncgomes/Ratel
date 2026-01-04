const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializa o cliente Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Classifica um email usando Gemini AI
 * @param {Object} email - Objeto do email com from, subject, snippet
 * @returns {Promise<Object>} Classificação sugerida
 */
async function classifyEmail(email) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
Você é um assistente de organização de emails. Analise o email abaixo e classifique-o.

Remetente: ${email.from}
Assunto: ${email.subject || 'Sem assunto'}
Preview: ${email.snippet || ''}

Responda APENAS com um JSON válido no seguinte formato (sem markdown, sem blocos de código):
{
    "category": "uma destas: trabalho, pessoal, financas, viagens, projetos, importante, social, promocoes, atualizacoes",
    "confidence": número de 0 a 100 indicando sua confiança,
    "isNewsletter": true ou false,
    "priority": "alta, media ou baixa",
    "suggestedLabel": "nome sugerido para label em português"
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Limpar resposta e parsear JSON
        const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('Erro ao classificar email com Gemini:', error);
        // Fallback: classificação básica
        return {
            category: 'outros',
            confidence: 50,
            isNewsletter: false,
            priority: 'media',
            suggestedLabel: 'Geral'
        };
    }
}

/**
 * Classifica múltiplos emails em batch
 * @param {Array} emails - Lista de emails para classificar
 * @returns {Promise<Array>} Emails com classificações
 */
async function classifyEmails(emails) {
    const results = [];

    // Processar em lotes de 5 para não sobrecarregar a API
    for (let i = 0; i < emails.length; i += 5) {
        const batch = emails.slice(i, i + 5);
        const classifications = await Promise.all(
            batch.map(async (email) => {
                const classification = await classifyEmail(email);
                return {
                    ...email,
                    classification
                };
            })
        );
        results.push(...classifications);

        // Pequeno delay entre batches
        if (i + 5 < emails.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    return results;
}

/**
 * Gera estatísticas de classificação
 * @param {Array} classifiedEmails - Emails já classificados
 * @returns {Object} Estatísticas
 */
function generateClassificationStats(classifiedEmails) {
    const stats = {
        totalClassified: classifiedEmails.length,
        byCategory: {},
        byPriority: { alta: 0, media: 0, baixa: 0 },
        newsletters: 0,
        avgConfidence: 0,
        unclassified: 0
    };

    let totalConfidence = 0;

    classifiedEmails.forEach(email => {
        const cat = email.classification?.category || 'outros';
        stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;

        const priority = email.classification?.priority || 'media';
        if (stats.byPriority[priority] !== undefined) {
            stats.byPriority[priority]++;
        }

        if (email.classification?.isNewsletter) {
            stats.newsletters++;
        }

        totalConfidence += email.classification?.confidence || 50;

        if (!email.classification || email.classification.category === 'outros') {
            stats.unclassified++;
        }
    });

    stats.avgConfidence = Math.round(totalConfidence / classifiedEmails.length);

    return stats;
}

/**
 * Agrupa emails por label sugerida
 * @param {Array} classifiedEmails - Emails classificados
 * @returns {Object} Agrupamento por label
 */
function groupByLabel(classifiedEmails) {
    const groups = {};

    const labelColors = {
        'Importante': 'bg-red-500',
        'Trabalho': 'bg-blue-500',
        'Finanças': 'bg-green-500',
        'Viagens': 'bg-yellow-500',
        'Projetos': 'bg-purple-500',
        'Pessoal': 'bg-pink-500',
        'Social': 'bg-indigo-500',
        'Promoções': 'bg-orange-500',
        'Atualizações': 'bg-teal-500',
        'Geral': 'bg-gray-500'
    };

    classifiedEmails.forEach(email => {
        const label = email.classification?.suggestedLabel || 'Geral';
        if (!groups[label]) {
            groups[label] = {
                name: label,
                emails: [],
                color: labelColors[label] || 'bg-gray-500'
            };
        }
        groups[label].emails.push(email);
    });

    return Object.values(groups).map((group, index) => ({
        id: index + 1,
        name: group.name,
        count: group.emails.length,
        color: group.color,
        emails: group.emails
    }));
}

module.exports = {
    classifyEmail,
    classifyEmails,
    generateClassificationStats,
    groupByLabel
};
