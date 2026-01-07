/**
 * RATEL - Hook de Créditos
 * Gerencia economia de créditos e limites diários
 */

import { useState, useEffect, useCallback } from 'react';
import {
    AccountType,
    UserAccount,
    DEFAULT_ACCOUNT,
    CREDIT_REWARDS,
    DAILY_FREE_LIMITS,
    canPerformAction,
    needsDailyReset,
    resetDailyCounters,
} from '../lib/gamification/credits';

const STORAGE_KEY = 'ratel_user_account';

export function useCredits() {
    const [account, setAccount] = useState<UserAccount>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? { ...DEFAULT_ACCOUNT, ...JSON.parse(saved) } : DEFAULT_ACCOUNT;
        } catch {
            return DEFAULT_ACCOUNT;
        }
    });

    // Salvar conta no localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    }, [account]);

    // Verificar e resetar contadores diários
    useEffect(() => {
        if (needsDailyReset(account.lastResetDate)) {
            setAccount(prev => resetDailyCounters(prev));
        }
    }, [account.lastResetDate]);

    // Adicionar créditos
    const addCredits = useCallback((amount: number) => {
        setAccount(prev => ({
            ...prev,
            credits: prev.credits + amount,
        }));
    }, []);

    // Gastar créditos
    const spendCredits = useCallback((amount: number): boolean => {
        if (account.credits < amount) return false;

        setAccount(prev => ({
            ...prev,
            credits: prev.credits - amount,
        }));
        return true;
    }, [account.credits]);

    // Verificar se pode executar ação
    const checkCanPerformAction = useCallback((action: keyof typeof DAILY_FREE_LIMITS): boolean => {
        return canPerformAction(account, action);
    }, [account]);

    // Executar ação (incrementa contador e adiciona créditos de recompensa)
    const performAction = useCallback((action: keyof typeof DAILY_FREE_LIMITS): boolean => {
        if (!checkCanPerformAction(action)) {
            return false;
        }

        setAccount(prev => ({
            ...prev,
            dailyActionsUsed: {
                ...prev.dailyActionsUsed,
                [action]: prev.dailyActionsUsed[action] + 1,
            },
        }));

        // Adicionar créditos de recompensa
        const rewardKey = action === 'deleteEmail' ? 'emailDeleted' :
            action === 'markAsSpam' ? 'spamMarked' :
                action === 'unsubscribe' ? 'unsubscribe' : null;

        if (rewardKey) {
            addCredits(CREDIT_REWARDS[rewardKey as keyof typeof CREDIT_REWARDS] || 0);
        }

        return true;
    }, [checkCanPerformAction, addCredits]);

    // Obter ações restantes do dia
    const getRemainingActions = useCallback((action: keyof typeof DAILY_FREE_LIMITS): number => {
        if (account.type === AccountType.PRO) return Infinity;
        return Math.max(0, DAILY_FREE_LIMITS[action] - account.dailyActionsUsed[action]);
    }, [account]);

    // Upgrade para PRO
    const upgradeToPro = useCallback(() => {
        setAccount(prev => ({
            ...prev,
            type: AccountType.PRO,
        }));
    }, []);

    // Verificar se é PRO
    const isPro = account.type === AccountType.PRO;

    // Resetar conta (para debug)
    const resetAccount = useCallback(() => {
        setAccount(DEFAULT_ACCOUNT);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        account,
        credits: account.credits,
        isPro,
        addCredits,
        spendCredits,
        checkCanPerformAction,
        performAction,
        getRemainingActions,
        upgradeToPro,
        resetAccount,
    };
}

export default useCredits;
