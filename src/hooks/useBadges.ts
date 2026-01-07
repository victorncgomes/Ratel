/**
 * RATEL - Hook de Badges
 * Gerencia desbloqueio e progresso de badges
 */

import { useState, useEffect, useCallback } from 'react';
import { BADGES, Badge, getBadgeById } from '../lib/gamification/badges';
import { useProgression } from './useProgression';

const STORAGE_KEY = 'ratel_unlocked_badges';

export interface BadgeProgress {
    badge: Badge;
    isUnlocked: boolean;
    progress: number; // 0-100
}

export function useBadges() {
    const { userProgress } = useProgression();
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [newlyUnlocked, setNewlyUnlocked] = useState<Badge[]>([]);

    // Salvar badges no localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedBadges));
    }, [unlockedBadges]);

    // Verificar requisito de badge
    const checkBadgeRequirement = useCallback((badge: Badge): boolean => {
        switch (badge.requirement.type) {
            case 'emails_deleted':
                return userProgress.emailsDeleted >= badge.requirement.value;
            case 'unsubscribes':
                return userProgress.unsubscribes >= badge.requirement.value;
            case 'emails_read':
                return userProgress.emailsRead >= badge.requirement.value;
            case 'spam_marked':
                return userProgress.spamMarked >= badge.requirement.value;
            case 'streak':
                return userProgress.currentStreak >= badge.requirement.value;
            case 'inbox_zero':
                return userProgress.inboxZeroCount >= badge.requirement.value;
            case 'special':
                return checkSpecialBadge(badge.id);
            default:
                return false;
        }
    }, [userProgress]);

    // Verificar badges especiais
    const checkSpecialBadge = (badgeId: string): boolean => {
        const hour = new Date().getHours();

        switch (badgeId) {
            case 'night_owl':
                // Ativo entre 23h e 5h
                return hour >= 23 || hour <= 5;
            case 'speed_demon':
                // Implementar lógica de velocidade separadamente
                return false;
            default:
                return false;
        }
    };

    // Calcular progresso do badge
    const calculateBadgeProgress = useCallback((badge: Badge): number => {
        if (badge.requirement.type === 'special') return 0;

        let current = 0;
        switch (badge.requirement.type) {
            case 'emails_deleted':
                current = userProgress.emailsDeleted;
                break;
            case 'unsubscribes':
                current = userProgress.unsubscribes;
                break;
            case 'emails_read':
                current = userProgress.emailsRead;
                break;
            case 'spam_marked':
                current = userProgress.spamMarked;
                break;
            case 'streak':
                current = userProgress.currentStreak;
                break;
            case 'inbox_zero':
                current = userProgress.inboxZeroCount;
                break;
        }

        return Math.min((current / badge.requirement.value) * 100, 100);
    }, [userProgress]);

    // Verificar e desbloquear novos badges
    useEffect(() => {
        const newBadges: Badge[] = [];

        BADGES.forEach(badge => {
            if (unlockedBadges.includes(badge.id)) return;

            if (checkBadgeRequirement(badge)) {
                newBadges.push(badge);
            }
        });

        if (newBadges.length > 0) {
            setUnlockedBadges(prev => [...prev, ...newBadges.map(b => b.id)]);
            setNewlyUnlocked(newBadges);
        }
    }, [userProgress, checkBadgeRequirement, unlockedBadges]);

    // Limpar badges recém-desbloqueados
    const clearNewlyUnlocked = useCallback(() => {
        setNewlyUnlocked([]);
    }, []);

    // Obter todos os badges com progresso
    const getAllBadgesWithProgress = useCallback((): BadgeProgress[] => {
        return BADGES.map(badge => ({
            badge,
            isUnlocked: unlockedBadges.includes(badge.id),
            progress: calculateBadgeProgress(badge),
        }));
    }, [unlockedBadges, calculateBadgeProgress]);

    // Obter badges por tier
    const getBadgesByTier = useCallback((tier: 'bronze' | 'silver' | 'gold'): BadgeProgress[] => {
        return getAllBadgesWithProgress().filter(bp => bp.badge.tier === tier);
    }, [getAllBadgesWithProgress]);

    // Obter badges desbloqueados
    const getUnlockedBadges = useCallback((): Badge[] => {
        return unlockedBadges
            .map(id => getBadgeById(id))
            .filter((b): b is Badge => b !== undefined);
    }, [unlockedBadges]);

    // Total de créditos de badges
    const getTotalBadgeCredits = useCallback((): number => {
        return getUnlockedBadges().reduce((sum, badge) => sum + badge.rewardsCredits, 0);
    }, [getUnlockedBadges]);

    // Resetar badges (para debug)
    const resetBadges = useCallback(() => {
        setUnlockedBadges([]);
        setNewlyUnlocked([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        unlockedBadges,
        newlyUnlocked,
        clearNewlyUnlocked,
        getAllBadgesWithProgress,
        getBadgesByTier,
        getUnlockedBadges,
        getTotalBadgeCredits,
        calculateBadgeProgress,
        resetBadges,
        totalBadges: BADGES.length,
        unlockedCount: unlockedBadges.length,
    };
}

export default useBadges;
