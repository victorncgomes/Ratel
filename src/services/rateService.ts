/**
 * RATE Service - AI-powered email scoring using Gemini API
 * 
 * Calculates a 0-100 score for each email based on:
 * - User behavior history
 * - Sender reputation
 * - Email characteristics
 * - AI analysis via Gemini
 */

import { getAccessToken } from '../lib/api';

interface EmailData {
    id: string;
    from: string;
    subject: string;
    snippet?: string;
    hasUnsubscribe?: boolean;
    date: string;
}

interface SenderBehavior {
    deleteRate: number;
    keepRate: number;
    openRate: number;
}

export interface RateScore {
    score: number;
    reason: string;
    category: 'keep' | 'neutral' | 'delete';
    confidence: number;
}

// Score thresholds
const THRESHOLDS = {
    DELETE: 20,      // 0-20: Strongly recommend delete
    IRRELEVANT: 40,  // 21-40: Probably irrelevant
    NEUTRAL: 60,     // 41-60: Neutral
    IMPORTANT: 80,   // 61-80: Probably important
    CRITICAL: 100    // 81-100: Highly important
};

// Cache for computed scores
const scoreCache = new Map<string, { score: RateScore; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Calculate RATE score for an email based on behavior patterns
 */
export function calculateLocalRate(
    email: EmailData,
    senderBehavior: SenderBehavior
): RateScore {
    let baseScore = 50; // Start neutral
    const reasons: string[] = [];

    // 1. Sender behavior analysis (most weight)
    if (senderBehavior.deleteRate > 0.7) {
        baseScore -= 30;
        reasons.push('Histórico: emails deste remetente são frequentemente deletados');
    } else if (senderBehavior.keepRate > 0.7) {
        baseScore += 30;
        reasons.push('Histórico: você geralmente mantém emails deste remetente');
    }

    if (senderBehavior.openRate > 0.8) {
        baseScore += 15;
        reasons.push('Alta taxa de abertura');
    } else if (senderBehavior.openRate < 0.1) {
        baseScore -= 10;
        reasons.push('Raramente aberto');
    }

    // 2. Email characteristics
    if (email.hasUnsubscribe) {
        baseScore -= 10;
        reasons.push('É uma lista de email/newsletter');
    }

    // 3. Subject line analysis
    const subject = email.subject?.toLowerCase() || '';
    const promoKeywords = ['promoção', 'oferta', 'desconto', 'grátis', 'free', 'sale', 'off'];
    const importantKeywords = ['urgente', 'importante', 'action required', 'confirmação', 'pagamento'];

    if (promoKeywords.some(k => subject.includes(k))) {
        baseScore -= 15;
        reasons.push('Conteúdo promocional detectado');
    }

    if (importantKeywords.some(k => subject.includes(k))) {
        baseScore += 20;
        reasons.push('Palavras importantes detectadas');
    }

    // 4. Recency (recent emails slightly more important)
    const emailDate = new Date(email.date);
    const daysSinceEmail = (Date.now() - emailDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceEmail > 30) {
        baseScore -= 5;
        reasons.push('Email antigo (>30 dias)');
    }

    // Clamp score
    const finalScore = Math.max(0, Math.min(100, baseScore));

    // Determine category
    let category: 'keep' | 'neutral' | 'delete';
    if (finalScore < THRESHOLDS.IRRELEVANT) {
        category = 'delete';
    } else if (finalScore > THRESHOLDS.NEUTRAL) {
        category = 'keep';
    } else {
        category = 'neutral';
    }

    // Confidence based on how much data we have
    const confidence = Math.min(100, (senderBehavior.deleteRate + senderBehavior.keepRate) * 50 + 20);

    return {
        score: Math.round(finalScore),
        reason: reasons.join('. ') || 'Análise padrão',
        category,
        confidence: Math.round(confidence)
    };
}

/**
 * Calculate RATE using Gemini AI for more sophisticated analysis
 */
export async function calculateAIRate(
    email: EmailData,
    senderBehavior: SenderBehavior
): Promise<RateScore> {
    // Check cache first
    const cached = scoreCache.get(email.id);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.score;
    }

    const token = getAccessToken();

    // If no token or demo mode, use local calculation
    if (!token) {
        const localScore = calculateLocalRate(email, senderBehavior);
        scoreCache.set(email.id, { score: localScore, timestamp: Date.now() });
        return localScore;
    }

    try {
        // Call Gemini API for enhanced scoring
        const response = await fetch('http://localhost:3109/api/rate/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email,
                senderBehavior
            })
        });

        if (response.ok) {
            const result = await response.json();
            scoreCache.set(email.id, { score: result, timestamp: Date.now() });
            return result;
        }
    } catch (e) {
        console.error('Failed to get AI rate, using local:', e);
    }

    // Fallback to local calculation
    const localScore = calculateLocalRate(email, senderBehavior);
    scoreCache.set(email.id, { score: localScore, timestamp: Date.now() });
    return localScore;
}

/**
 * Get color for RATE score
 */
export function getRateColor(score: number): string {
    if (score <= THRESHOLDS.DELETE) return 'text-red-500';
    if (score <= THRESHOLDS.IRRELEVANT) return 'text-orange-500';
    if (score <= THRESHOLDS.NEUTRAL) return 'text-yellow-500';
    if (score <= THRESHOLDS.IMPORTANT) return 'text-green-400';
    return 'text-green-600';
}

/**
 * Get emoji for RATE score
 */
export function getRateEmoji(score: number): string {
    if (score <= THRESHOLDS.DELETE) return '🗑️';
    if (score <= THRESHOLDS.IRRELEVANT) return '⚠️';
    if (score <= THRESHOLDS.NEUTRAL) return '❓';
    if (score <= THRESHOLDS.IMPORTANT) return '✓';
    return '⭐';
}

/**
 * Get background color class for RATE score
 */
export function getRateBgColor(score: number): string {
    if (score <= THRESHOLDS.DELETE) return 'bg-red-500/10';
    if (score <= THRESHOLDS.IRRELEVANT) return 'bg-orange-500/10';
    if (score <= THRESHOLDS.NEUTRAL) return 'bg-yellow-500/10';
    if (score <= THRESHOLDS.IMPORTANT) return 'bg-green-400/10';
    return 'bg-green-600/10';
}

export { THRESHOLDS };
