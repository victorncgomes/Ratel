/**
 * RATEL - Hook de Progressão
 * Gerencia progresso do usuário através dos territórios
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TERRITORIES, calculateTerritoryProgress, canAdvanceToNextTerritory } from '../lib/gamification/territories';
import { getRankByLevel } from '../lib/gamification/ranks';

export interface UserProgress {
    currentTerritoryIndex: number;
    emailsDeleted: number;
    emailsArchived: number;
    emailsRead: number;
    spamMarked: number;
    unsubscribes: number;
    currentStreak: number;
    longestStreak: number;
    inboxZeroCount: number;
    lastActiveDate: string;
    totalEmailsLoaded: number;
}

const DEFAULT_PROGRESS: UserProgress = {
    currentTerritoryIndex: 0,
    emailsDeleted: 0,
    emailsArchived: 0,
    emailsRead: 0,
    spamMarked: 0,
    unsubscribes: 0,
    currentStreak: 0,
    longestStreak: 0,
    inboxZeroCount: 0,
    lastActiveDate: new Date().toISOString(),
    totalEmailsLoaded: 0,
};

const STORAGE_KEY = 'ratel_user_progress';

export function useProgression() {
    const [userProgress, setUserProgress] = useState<UserProgress>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? { ...DEFAULT_PROGRESS, ...JSON.parse(saved) } : DEFAULT_PROGRESS;
        } catch {
            return DEFAULT_PROGRESS;
        }
    });

    // Salvar progresso no localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    }, [userProgress]);

    // Verificar e atualizar streak diário
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = new Date(userProgress.lastActiveDate).toISOString().split('T')[0];

        if (today !== lastActive) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const wasYesterday = lastActive === yesterday.toISOString().split('T')[0];

            setUserProgress(prev => ({
                ...prev,
                currentStreak: wasYesterday ? prev.currentStreak + 1 : 1,
                longestStreak: Math.max(prev.longestStreak, wasYesterday ? prev.currentStreak + 1 : 1),
                lastActiveDate: new Date().toISOString(),
            }));
        }
    }, []);

    // Incrementar estatística
    const incrementStat = useCallback((stat: keyof UserProgress, amount: number = 1) => {
        setUserProgress(prev => ({
            ...prev,
            [stat]: (prev[stat] as number) + amount,
            lastActiveDate: new Date().toISOString(),
        }));
    }, []);

    // Decrementar estatística
    const decrementStat = useCallback((stat: keyof UserProgress, amount: number = 1) => {
        setUserProgress(prev => ({
            ...prev,
            [stat]: Math.max(0, (prev[stat] as number) - amount),
        }));
    }, []);

    // Calcular progresso no território atual
    const getTerritoryProgress = useCallback(() => {
        return calculateTerritoryProgress(
            userProgress.emailsDeleted,
            userProgress.unsubscribes,
            userProgress.currentTerritoryIndex
        );
    }, [userProgress.emailsDeleted, userProgress.unsubscribes, userProgress.currentTerritoryIndex]);

    // Verificar se pode avançar
    const checkCanAdvance = useCallback(() => {
        return canAdvanceToNextTerritory(
            userProgress.emailsDeleted,
            userProgress.unsubscribes,
            userProgress.currentTerritoryIndex
        );
    }, [userProgress.emailsDeleted, userProgress.unsubscribes, userProgress.currentTerritoryIndex]);

    // Avançar para próximo território
    const advanceTerritory = useCallback(() => {
        if (checkCanAdvance()) {
            setUserProgress(prev => ({
                ...prev,
                currentTerritoryIndex: Math.min(prev.currentTerritoryIndex + 1, TERRITORIES.length - 1),
            }));
            return true;
        }
        return false;
    }, [checkCanAdvance]);

    // Obter território atual
    const getCurrentTerritory = useCallback(() => {
        return TERRITORIES[userProgress.currentTerritoryIndex];
    }, [userProgress.currentTerritoryIndex]);

    // Obter próximo território
    const getNextTerritory = useCallback(() => {
        return TERRITORIES[userProgress.currentTerritoryIndex + 1];
    }, [userProgress.currentTerritoryIndex]);

    // Registrar inbox zero
    const registerInboxZero = useCallback(() => {
        setUserProgress(prev => ({
            ...prev,
            inboxZeroCount: prev.inboxZeroCount + 1,
        }));
    }, []);

    // Resetar progresso (para debug/testing)
    const resetProgress = useCallback(() => {
        setUserProgress(DEFAULT_PROGRESS);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // Calcular Nível e Rank
    const { level, currentXP, nextLevelXP, currentRank } = useMemo(() => {
        const xp = (userProgress.emailsDeleted * 10) +
            (userProgress.unsubscribes * 50) +
            (userProgress.emailsArchived * 5) +
            (userProgress.spamMarked * 20);

        // Fórmula de nível simples: sqrt(XP / 100)
        // Ex: 100 XP = Lvl 2, 400 XP = Lvl 3, 900 XP = Lvl 4
        const calculatedLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
        const rank = getRankByLevel(calculatedLevel);

        // XP para o próximo nível
        const nextLvl = calculatedLevel + 1;
        const requiredXP = 100 * Math.pow(nextLvl - 1, 2);

        return {
            level: calculatedLevel,
            currentXP: xp,
            nextLevelXP: requiredXP,
            currentRank: rank
        };
    }, [userProgress]);

    return {
        userProgress,
        level,
        currentXP,
        nextLevelXP,
        currentRank,
        incrementStat,
        decrementStat,
        getTerritoryProgress,
        checkCanAdvance,
        advanceTerritory,
        getCurrentTerritory,
        getNextTerritory,
        registerInboxZero,
        resetProgress,
        territories: TERRITORIES,
    };
}

export default useProgression;
