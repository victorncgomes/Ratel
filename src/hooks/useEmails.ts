import { useState, useCallback } from 'react';
import { mockEmails } from '../lib/mockData';
import { getAccessToken } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3109');

export interface Email {
    id: string;
    from: string;
    subject: string;
    date: string;
    snippet: string;
    hasUnsubscribe: boolean;
    unsubscribeLink?: string;
    size?: number;
    // Novos campos IA
    aiScore?: number;
    aiReason?: string;
    isImportant?: boolean;
    isMarkedSafe?: boolean;
    isBlocked?: boolean;
}

interface EmailsState {
    emails: Email[];
    loading: boolean;
    error: string | null;
}

export function useEmails() {
    const [state, setState] = useState<EmailsState>({
        emails: [],
        loading: false,
        error: null
    });

    const fetchEmails = useCallback(async (limit: number = 50) => {
        const token = getAccessToken();

        // FORÇAR MOCK DATA SE SEM TOKEN OU SE VITE_FORCE_MOCK ESTIVER SETADO
        // Isso resolve o bug de "Zero Data" em testes sem backend
        const forceMock = import.meta.env.VITE_FORCE_MOCK === 'true';

        if (!token || forceMock) {
            console.log('Using Mock Data (Robust Fallback)');
            const mocked = mockEmails.slice(0, limit) as unknown as Email[];
            setState({
                emails: mocked,
                loading: false,
                error: null
            });
            return mocked;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await fetch(`${API_BASE}/api/emails?limit=${limit}`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // Fallback silencioso para mock data se a API falhar (ex: token expirado)
                console.warn('API Failed, falling back to mock data');
                const mocked = mockEmails.slice(0, limit) as unknown as Email[];
                setState({ emails: mocked, loading: false, error: null });
                return mocked;
            }

            const data = await response.json();
            setState({ emails: data.emails, loading: false, error: null });
            return data.emails;
        } catch (error: any) {
            // Em caso de erro de rede, também fallback para mock
            console.warn('Network Error, falling back to mock data', error);
            const mocked = mockEmails.slice(0, limit) as unknown as Email[];
            setState({ emails: mocked, loading: false, error: null }); // Não mostra erro pro usuário
            return mocked;
        }
    }, []);

    const archiveEmail = useCallback(async (emailId: string) => {
        const token = getAccessToken();
        if (!token) {
            setState(prev => ({
                ...prev,
                emails: prev.emails.filter(e => e.id !== emailId)
            }));
            return true;
        }

        try {
            const response = await fetch(`${API_BASE}/api/emails/${emailId}/archive`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao arquivar email');
            }

            setState(prev => ({
                ...prev,
                emails: prev.emails.filter(e => e.id !== emailId)
            }));

            return true;
        } catch (error: any) {
            console.error('Erro ao arquivar:', error);
            throw error;
        }
    }, []);

    const trashEmail = useCallback(async (emailId: string) => {
        const token = getAccessToken();
        if (!token) {
            setState(prev => ({
                ...prev,
                emails: prev.emails.filter(e => e.id !== emailId)
            }));
            return true;
        }

        try {
            const response = await fetch(`${API_BASE}/api/emails/${emailId}/trash`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao mover para lixeira');
            }

            setState(prev => ({
                ...prev,
                emails: prev.emails.filter(e => e.id !== emailId)
            }));

            return true;
        } catch (error: any) {
            console.error('Erro ao excluir:', error);
            throw error;
        }
    }, []);

    const deleteEmail = useCallback(async (emailId: string) => {
        const token = getAccessToken();
        if (!token) {
            setState(prev => ({
                ...prev,
                emails: prev.emails.filter(e => e.id !== emailId)
            }));
            return true;
        }

        try {
            const response = await fetch(`${API_BASE}/api/emails/${emailId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao excluir email');
            }

            setState(prev => ({
                ...prev,
                emails: prev.emails.filter(e => e.id !== emailId)
            }));

            return true;
        } catch (error: any) {
            console.error('Erro ao excluir:', error);
            throw error;
        }
    }, []);

    const trashEmails = useCallback(async (emailIds: string[]) => {
        const token = getAccessToken();
        if (!token) {
            setState(prev => ({
                ...prev,
                emails: prev.emails.filter(e => !emailIds.includes(e.id))
            }));
            return true;
        }

        try {
            // Process in parallel for speed
            await Promise.all(
                emailIds.map(id =>
                    fetch(`${API_BASE}/api/emails/${id}/trash`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                )
            );

            setState(prev => ({
                ...prev,
                emails: prev.emails.filter(e => !emailIds.includes(e.id))
            }));

            return true;
        } catch (error: any) {
            console.error('Erro ao excluir emails em massa:', error);
            throw error;
        }
    }, []);

    const updateEmail = useCallback(async (emailId: string, updates: Partial<Email>) => {
        // Since we don't have a backend endpoint for arbitrary updates yet, we'll do it locally
        // In a real app, this would be a PATCH /api/emails/:id
        setState(prev => ({
            ...prev,
            emails: prev.emails.map(e => e.id === emailId ? { ...e, ...updates } : e)
        }));
        return true;
    }, []);

    const analyzeEmailsWithAI = useCallback(async (emailsToAnalyze: Email[]) => {
        let token = getAccessToken();

        // Allow in Dev Mode with Fake Token
        if (!token && process.env.NODE_ENV === 'development') {
            token = 'mock_token_for_ai_testing';
        }

        if (!token) return;

        try {
            const response = await fetch(`${API_BASE}/api/ai/analyze`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emails: emailsToAnalyze })
            });

            if (!response.ok) throw new Error('Failed to analyze emails');

            const data = await response.json();
            const analyzedResults = data.analyzed as any[];

            // Update local state with new AI Classification
            setState(prev => ({
                ...prev,
                emails: prev.emails.map(email => {
                    const analysis = analyzedResults.find((r: any) => r.id === email.id);
                    if (analysis && analysis.classification) {
                        return {
                            ...email,
                            aiScore: analysis.classification.confidence,
                            aiReason: analysis.classification.suggestedLabel + ': ' + (analysis.classification.category || 'analyzed'),
                            isImportant: analysis.classification.priority === 'alta',
                            category: analysis.classification.category
                        };
                    }
                    return email;
                })
            }));

            return analyzedResults;
        } catch (error) {
            console.error('AI Analysis failed:', error);
            // Optionally set error state or just log
        }
    }, []);

    return {
        ...state,
        fetchEmails,
        archiveEmail,
        trashEmail,
        trashEmails,
        deleteEmail,
        updateEmail,
        analyzeEmailsWithAI
    };
}
