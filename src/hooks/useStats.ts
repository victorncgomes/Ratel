import { useState, useCallback } from 'react';
import { authFetch } from '../lib/api';

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
