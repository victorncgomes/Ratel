/**
 * RATEL - Sistema de Créditos
 * Economia freemium do jogo
 */

export enum AccountType {
    FREE = 'free',
    PRO = 'pro',
}

/**
 * Custos de ações (em créditos)
 */
export const CREDIT_COSTS = {
    deleteEmail: 1,
    archiveEmail: 0,     // Grátis
    markAsRead: 0,       // Grátis
    markAsSpam: 1,
    unsubscribe: 5,
    createRule: 10,
};

/**
 * Limites diários para conta FREE
 */
export const DAILY_FREE_LIMITS = {
    deleteEmail: 10,
    markAsSpam: 10,
    unsubscribe: 5,
    createRule: 1,
};

/**
 * Recompensas de créditos por ação
 */
export const CREDIT_REWARDS = {
    emailDeleted: 2,         // Ganha 2, gasta 1 = lucro 1
    emailArchived: 1,
    emailRead: 0,
    spamMarked: 2,
    unsubscribe: 5,          // Ganha 5, gasta 5 = neutro
    badgeUnlocked: 50,       // Bônus por badge
    territoryCompleted: 200, // Bônus por território
    streakDay: 10,           // Bônus diário por streak
    inboxZero: 100,          // Bônus por atingir inbox zero
};

/**
 * Interface da conta do usuário
 */
export interface UserAccount {
    type: AccountType;
    credits: number;
    dailyActionsUsed: {
        deleteEmail: number;
        markAsSpam: number;
        unsubscribe: number;
        createRule: number;
    };
    lastResetDate: string; // ISO date
}

/**
 * Benefícios da conta PRO
 */
export const PRO_BENEFITS = {
    unlimitedActions: true,
    allBadges: true,
    allTerritories: true,
    advancedStats: true,
    customThemes: true,
    prioritySupport: true,
    noAds: true,
};

/**
 * Preços PRO (em BRL)
 */
export const PRO_PRICING = {
    monthly: {
        price: 29.90,
        currency: 'BRL',
        label: { pt: 'Mensal', en: 'Monthly', es: 'Mensual' },
    },
    annual: {
        price: 299.00,
        currency: 'BRL',
        label: { pt: 'Anual', en: 'Annual', es: 'Anual' },
        discount: '2 meses grátis',
    },
    lifetime: {
        price: 599.00,
        currency: 'BRL',
        label: { pt: 'Vitalício', en: 'Lifetime', es: 'Vitalicio' },
        discount: 'Melhor custo-benefício',
    },
};

/**
 * Conta inicial padrão
 */
export const DEFAULT_ACCOUNT: UserAccount = {
    type: AccountType.FREE,
    credits: 100, // Créditos iniciais de boas-vindas
    dailyActionsUsed: {
        deleteEmail: 0,
        markAsSpam: 0,
        unsubscribe: 0,
        createRule: 0,
    },
    lastResetDate: new Date().toISOString().split('T')[0],
};

/**
 * Verifica se pode executar ação
 */
export function canPerformAction(
    account: UserAccount,
    action: keyof typeof DAILY_FREE_LIMITS
): boolean {
    if (account.type === AccountType.PRO) return true;

    const used = account.dailyActionsUsed[action];
    const limit = DAILY_FREE_LIMITS[action];

    return used < limit;
}

/**
 * Calcula créditos ganhos por ação
 */
export function getCreditsForAction(action: keyof typeof CREDIT_REWARDS): number {
    return CREDIT_REWARDS[action] || 0;
}

/**
 * Verifica se precisa resetar contadores diários
 */
export function needsDailyReset(lastResetDate: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return today !== lastResetDate;
}

/**
 * Reseta contadores diários
 */
export function resetDailyCounters(account: UserAccount): UserAccount {
    return {
        ...account,
        dailyActionsUsed: {
            deleteEmail: 0,
            markAsSpam: 0,
            unsubscribe: 0,
            createRule: 0,
        },
        lastResetDate: new Date().toISOString().split('T')[0],
    };
}

export default {
    CREDIT_COSTS,
    DAILY_FREE_LIMITS,
    CREDIT_REWARDS,
    PRO_PRICING,
    DEFAULT_ACCOUNT,
    canPerformAction,
    getCreditsForAction,
    needsDailyReset,
    resetDailyCounters,
};
