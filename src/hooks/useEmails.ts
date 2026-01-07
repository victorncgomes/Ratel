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

        if (!token) {
            // Mode Demo
            setState({
                emails: mockEmails.slice(0, limit) as unknown as Email[],
                loading: false,
                error: null
            });
            return mockEmails.slice(0, limit);
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

    return {
        ...state,
        fetchEmails,
        archiveEmail,
        trashEmail,
        trashEmails,
        deleteEmail
    };
}
