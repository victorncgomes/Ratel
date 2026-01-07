import { useState, useCallback } from 'react';
import { authFetch, getAccessToken } from '../lib/api';
import { mockStats } from '../lib/mockData';

export interface Stats {
    unreadCount: number;
    inboxCount: number;
    spamCount: number;
}

interface StatsState {
    stats: Stats | null;
    loading: boolean;
    error: string | null;
}

export function useStats() {
    const [state, setState] = useState<StatsState>({
        stats: null,
        loading: false,
        error: null
    });

    const fetchStats = useCallback(async () => {
        const token = getAccessToken();

        if (!token) {
            // Mode Demo
            setState({ stats: mockStats, loading: false, error: null });
            return mockStats;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await authFetch('/api/stats');

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao buscar estatísticas');
            }

            const stats = await response.json();
            setState({ stats, loading: false, error: null });
            return stats;
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            console.warn('Estatísticas não disponíveis:', error.message);
            return null;
        }
    }, []);

    return {
        ...state,
        fetchStats
    };
}
