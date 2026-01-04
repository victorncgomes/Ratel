import { useState, useCallback } from 'react';
import { authFetch } from '../lib/api';

export interface CleanupAnalysis {
    oldEmails: {
        count: number;
        size: string;
        ids: string[];
    };
    oldUnread: {
        count: number;
        size: string;
        ids: string[];
    };
    largeAttachments: {
        count: number;
        size: string;
        ids: string[];
    };
    drafts: {
        count: number;
        size: string;
        ids: string[];
    };
    totalAnalyzed: number;
    timestamp: string;
}

interface CleanupState {
    analysis: CleanupAnalysis | null;
    loading: boolean;
    error: string | null;
    progress: number;
}

export function useCleanup() {
    const [state, setState] = useState<CleanupState>({
        analysis: null,
        loading: false,
        error: null,
        progress: 0
    });

    const analyze = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null, progress: 0 }));

        try {
            const response = await authFetch('/api/cleanup/analyze');

            if (!response.ok) {
                throw new Error('Erro ao analisar caixa de entrada');
            }

            const analysis = await response.json();
            setState({ analysis, loading: false, error: null, progress: 100 });
            return analysis;
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message, progress: 0 }));
            throw error;
        }
    }, []);

    const emptyTrash = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await authFetch('/api/cleanup/empty-trash', {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Erro ao esvaziar lixeira');
            }

            const result = await response.json();
            setState(prev => ({ ...prev, loading: false }));
            return result;
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            throw error;
        }
    }, []);

    const emptySpam = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await authFetch('/api/cleanup/empty-spam', {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Erro ao esvaziar spam');
            }

            const result = await response.json();
            setState(prev => ({ ...prev, loading: false }));
            return result;
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            throw error;
        }
    }, []);

    const getDrafts = useCallback(async (days: number = 7) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await authFetch(`/api/cleanup/drafts?days=${days}`);

            if (!response.ok) {
                throw new Error('Erro ao buscar rascunhos');
            }

            const drafts = await response.json();
            setState(prev => ({ ...prev, loading: false }));
            return drafts;
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            throw error;
        }
    }, []);

    return {
        ...state,
        analyze,
        emptyTrash,
        emptySpam,
        getDrafts
    };
}
