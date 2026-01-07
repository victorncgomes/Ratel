
import { useState, useMemo } from 'react';
import { useProgression } from './useProgression';
import { ACHIEVEMENTS, getAchievementsProgress } from '../lib/gamification/achievements';

export function useAchievements() {
    const { userProgress } = useProgression();

    const { unlocked, total, next } = useMemo(() => {
        return getAchievementsProgress(userProgress);
    }, [userProgress]);

    const unlockedIds = useMemo(() => new Set(unlocked.map(a => a.id)), [unlocked]);

    const getAchievementStatus = (id: string) => {
        return unlockedIds.has(id) ? 'unlocked' : 'locked';
    };

    return {
        achievements: ACHIEVEMENTS,
        unlocked,
        total,
        nextToUnlock: next,
        getAchievementStatus,
        progress: (unlocked.length / total) * 100
    };
}
