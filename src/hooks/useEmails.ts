import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:3109';

interface Email {
    id: string;
    from: string;
    subject: string;
    date: string;
    snippet: string;
    hasUnsubscribe: boolean;
    unsubscribeLink?: string;
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
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await fetch(`${API_BASE}/api/emails?limit=${limit}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao buscar emails');
            }

            const data = await response.json();
            setState({ emails: data.emails, loading: false, error: null });
            return data.emails;
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            throw error;
        }
    }, []);

    const archiveEmail = useCallback(async (emailId: string) => {
        try {
            const response = await fetch(`${API_BASE}/api/emails/${emailId}/archive`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao arquivar email');
            }

            // Remover da lista local
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
        try {
            const response = await fetch(`${API_BASE}/api/emails/${emailId}/trash`, {
                method: 'POST',
                credentials: 'include'
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
        try {
            const response = await fetch(`${API_BASE}/api/emails/${emailId}`, {
                method: 'DELETE',
                credentials: 'include'
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

    return {
        ...state,
        fetchEmails,
        archiveEmail,
        trashEmail,
        deleteEmail
    };
}
