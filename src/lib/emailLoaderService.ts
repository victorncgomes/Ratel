/**
 * Email Loader Service - Progressive loading for 10K+ emails
 */

import { getAccessToken, API_BASE } from './api';
import * as emailStore from './emailStore';

interface LoaderCallbacks {
    onProgress: (loaded: number, total: number, phase: 'fetching' | 'processing' | 'scoring') => void;
    onBatchComplete: (emails: any[]) => void;
    onComplete: () => void;
    onError: (error: string) => void;
}

interface LoaderState {
    isLoading: boolean;
    abortController: AbortController | null;
    totalEmails: number;
    loadedEmails: number;
}

let loaderState: LoaderState = {
    isLoading: false,
    abortController: null,
    totalEmails: 0,
    loadedEmails: 0
};

/**
 * Start progressive email loading
 * Loads in batches: first 500 (priority), then 500 at a time
 */
export async function startProgressiveLoading(callbacks: LoaderCallbacks): Promise<void> {
    const token = getAccessToken();

    if (!token) {
        callbacks.onError('Não autenticado');
        return;
    }

    if (loaderState.isLoading) {
        return;
    }

    loaderState = {
        isLoading: true,
        abortController: new AbortController(),
        totalEmails: 0,
        loadedEmails: 0
    };

    try {
        // Phase 1: Get total count first
        callbacks.onProgress(0, 0, 'fetching');

        const statsResponse = await fetch(`${API_BASE}/api/stats`, {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: loaderState.abortController?.signal
        });

        if (!statsResponse.ok) {
            throw new Error('Falha ao obter estatísticas');
        }

        const stats = await statsResponse.json();
        const estimatedTotal = Math.min(stats.inboxCount || 5000, 10000); // Cap at 10K
        loaderState.totalEmails = estimatedTotal;

        callbacks.onProgress(0, estimatedTotal, 'fetching');

        // Phase 2: Load in batches
        const BATCH_SIZE = 500;
        const MAX_EMAILS = 10000;
        let offset = 0;
        let allEmails: any[] = [];

        while (offset < MAX_EMAILS && loaderState.isLoading) {
            const batchEmails = await fetchEmailBatch(token, BATCH_SIZE, offset);

            if (batchEmails.length === 0) {
                break; // No more emails
            }

            allEmails = allEmails.concat(batchEmails);
            loaderState.loadedEmails = allEmails.length;

            // Update actual total if we got fewer than expected
            if (batchEmails.length < BATCH_SIZE) {
                loaderState.totalEmails = allEmails.length;
            }

            // Save to IndexedDB
            await emailStore.saveEmails(batchEmails);

            // Notify progress
            callbacks.onProgress(allEmails.length, loaderState.totalEmails, 'processing');
            callbacks.onBatchComplete(batchEmails);

            offset += BATCH_SIZE;

            // Small delay between batches to prevent overwhelming the API
            if (offset < MAX_EMAILS && batchEmails.length === BATCH_SIZE) {
                await sleep(200);
            }
        }

        // Phase 3: Calculate RATE scores in background
        callbacks.onProgress(allEmails.length, loaderState.totalEmails, 'scoring');

        // Score calculation is async - don't block completion
        calculateScoresInBackground(allEmails, callbacks);

        // Mark loading complete
        await emailStore.setLastLoadTime();
        callbacks.onComplete();

    } catch (error: any) {
        if (error.name === 'AbortError') {
            return;
        } else {
            console.error('[EmailLoader] Error:', error);
            callbacks.onError(error.message || 'Erro ao carregar emails');
        }
    } finally {
        loaderState.isLoading = false;
        loaderState.abortController = null;
    }
}

/**
 * Fetch a single batch of emails
 */
async function fetchEmailBatch(token: string, limit: number, offset: number): Promise<any[]> {
    const response = await fetch(
        `${API_BASE}/api/emails?limit=${limit}&offset=${offset}`,
        {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: loaderState.abortController?.signal
        }
    );

    if (!response.ok) {
        throw new Error(`Erro ao buscar emails (offset ${offset})`);
    }

    const data = await response.json();
    return data.emails || [];
}

/**
 * Calculate RATE scores in background
 */
async function calculateScoresInBackground(emails: any[], callbacks: LoaderCallbacks): Promise<void> {
    const SCORE_BATCH = 50; // Score 50 at a time

    try {
        const senderProfiles = await emailStore.getAllSenderProfiles();
        const profileMap = new Map(senderProfiles.map(p => [p.email, p]));

        for (let i = 0; i < emails.length; i += SCORE_BATCH) {
            const batch = emails.slice(i, i + SCORE_BATCH);
            const updates: { id: string; score: number }[] = [];

            for (const email of batch) {
                const score = calculateLocalScore(email, profileMap.get(email.from));
                updates.push({ id: email.id, score });
            }

            await emailStore.updateEmailScores(updates);

            // Don't spam progress updates for scoring
            if (i % 200 === 0) {
                callbacks.onProgress(
                    loaderState.loadedEmails,
                    loaderState.totalEmails,
                    'scoring'
                );
            }
        }
    } catch (error) {
        console.error('[EmailLoader] Score calculation error:', error);
    }
}

/**
 * Calculate local RATE score (without AI)
 */
function calculateLocalScore(email: any, senderProfile: any): number {
    let score = 50; // Start neutral

    // Sender behavior (if we have history)
    if (senderProfile) {
        const totalActions = senderProfile.deleteCount + senderProfile.keepCount;
        if (totalActions > 0) {
            const keepRate = senderProfile.keepCount / totalActions;
            score += (keepRate - 0.5) * 40; // -20 to +20
        }
    }

    // Has unsubscribe = likely promotional
    if (email.hasUnsubscribe) {
        score -= 15;
    }

    // Recent emails slightly more important
    const daysOld = (Date.now() - new Date(email.date).getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld < 7) {
        score += 10;
    } else if (daysOld > 90) {
        score -= 10;
    }

    // Subject keywords
    const subjectLower = (email.subject || '').toLowerCase();
    if (subjectLower.includes('urgente') || subjectLower.includes('urgent')) {
        score += 15;
    }
    if (subjectLower.includes('newsletter') || subjectLower.includes('unsubscribe')) {
        score -= 10;
    }
    if (subjectLower.includes('promo') || subjectLower.includes('desconto') || subjectLower.includes('off')) {
        score -= 10;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Stop loading
 */
export function stopLoading(): void {
    if (loaderState.abortController) {
        loaderState.abortController.abort();
    }
    loaderState.isLoading = false;
}

/**
 * Check if loading is in progress
 */
export function isLoading(): boolean {
    return loaderState.isLoading;
}

/**
 * Get current loading state
 */
export function getLoadingState(): LoaderState {
    return { ...loaderState };
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
