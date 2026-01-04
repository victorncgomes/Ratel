import { useState, useCallback } from 'react';
import { authFetch } from '../lib/api';

export interface RatelFuriosoResult {
    success: number;
    failed: number;
    errors: string[];
    totalTime: number;
}

interface RatelFuriosoState {
    loading: boolean;
    progress: number;
    error: string | null;
    result: RatelFuriosoResult | null;
}

export function useRatelFurioso() {
    const [state, setState] = useState<RatelFuriosoState>({
        loading: false,
        progress: 0,
        error: null,
        result: null
    });

    const execute = useCallback(async (subscriptionIds: number[], deleteHistory: boolean = false) => {
        setState({ loading: true, progress: 0, error: null, result: null });

        try {
            const response = await authFetch('/api/subscriptions/ratel-furioso', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subscriptionIds, deleteHistory })
            });

            if (!response.ok) {
                throw new Error('Erro ao executar Ratel Furioso');
            }

            const result: RatelFuriosoResult = await response.json();

            setState({
                loading: false,
                progress: 100,
                error: null,
                result
            });

            return result;
        } catch (error: any) {
            setState({
                loading: false,
                progress: 0,
                error: error.message,
                result: null
            });
            throw error;
        }
    }, []);

    const updateProgress = useCallback((progress: number) => {
        setState(prev => ({ ...prev, progress }));
    }, []);

    const reset = useCallback(() => {
        setState({ loading: false, progress: 0, error: null, result: null });
    }, []);

    return {
        ...state,
        execute,
        updateProgress,
        reset
    };
}
