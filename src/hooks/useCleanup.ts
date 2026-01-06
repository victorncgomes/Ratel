import { useState, useCallback } from 'react';
import { authFetch, getAccessToken } from '../lib/api';
import { mockCleanupData } from '../lib/mockData';

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
    spam: {
        count: number;
        size: string;
    };
    trash: {
        count: number;
        size: string;
    };
    totalAnalyzed: number;
    timestamp?: string;
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
        const token = getAccessToken();

        if (!token) {
            // Mode Demo
            const demoAnalysis: CleanupAnalysis = {
                oldEmails: { count: mockCleanupData.inbox_old.count, size: mockCleanupData.inbox_old.size, ids: [] },
                oldUnread: { count: mockCleanupData.unread_old.count, size: mockCleanupData.unread_old.size, ids: [] },
                largeAttachments: { count: mockCleanupData.large_attachments.count, size: mockCleanupData.large_attachments.size, ids: [] },
                drafts: { count: mockCleanupData.drafts.count, size: mockCleanupData.drafts.size, ids: [] },
                spam: { count: mockCleanupData.spam.count, size: mockCleanupData.spam.size },
                trash: { count: mockCleanupData.trash.count, size: mockCleanupData.trash.size },
                totalAnalyzed: 200,
                timestamp: new Date().toISOString()
            };
            setState({ analysis: demoAnalysis, loading: false, error: null, progress: 100 });
            return demoAnalysis;
        }

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
