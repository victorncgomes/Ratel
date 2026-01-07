import { useState, useCallback } from 'react';
import { authFetch, getAccessToken } from '../lib/api';
import { mockSubscriptions } from '../lib/mockData';

export interface Subscription {
    id: number;
    name: string;
    email: string;
    domain: string;
    freq: string;
    status: string;
    score: number;
    count: number;
    color: string;
    hasUnsubscribe: boolean;
    unsubscribeLink: string;
    lastEmail: string;
    logo?: string;
    confidence?: number;
    emailIds: string[];
}

interface SubscriptionsState {
    subscriptions: Subscription[];
    loading: boolean;
    error: string | null;
}

export function useSubscriptions() {
    const [state, setState] = useState<SubscriptionsState>({
        subscriptions: [],
        loading: false,
        error: null
    });

    const fetchSubscriptions = useCallback(async (limit: number = 10000) => {
        const token = getAccessToken();

        if (!token) {
            // No demo mode, return the dynamic mocks from mockData.ts
            setState({
                subscriptions: mockSubscriptions as unknown as Subscription[],
                loading: false,
                error: null
            });
            return mockSubscriptions;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await authFetch(`/api/subscriptions?limit=${limit}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao buscar inscrições');
            }

            const data = await response.json();
            setState({ subscriptions: data.subscriptions, loading: false, error: null });
            return data.subscriptions;
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            throw error;
        }
    }, []);

    const archiveAll = useCallback(async (emailIds: string[]) => {
        const token = getAccessToken();
        if (!token) {
            return { success: true, count: emailIds.length };
        }

        try {
            const response = await authFetch('/api/subscriptions/archive-all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailIds })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao arquivar');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Erro ao arquivar inscrição:', error);
            throw error;
        }
    }, []);

    const deleteAll = useCallback(async (emailIds: string[]) => {
        const token = getAccessToken();
        if (!token) {
            return { success: true, count: emailIds.length };
        }

        try {
            const response = await authFetch('/api/subscriptions/delete-all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailIds })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao excluir');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Erro ao excluir inscrição:', error);
            throw error;
        }
    }, []);

    const unsubscribe = useCallback(async (subscription: Subscription) => {
        if (subscription.unsubscribeLink) {
            // Limpar formato especial do Gmail <url>
            const urlMatch = subscription.unsubscribeLink.match(/<(https?:\/\/[^>]+)>/);
            const actualUrl = urlMatch ? urlMatch[1] : subscription.unsubscribeLink;

            if (actualUrl.startsWith('http')) {
                window.open(actualUrl, '_blank');
                return { success: true, method: 'link' };
            }
        }
        return archiveAll(subscription.emailIds);
    }, [archiveAll]);

    const removeSubscription = useCallback((subscriptionId: number) => {
        setState(prev => ({
            ...prev,
            subscriptions: prev.subscriptions.filter(s => s.id !== subscriptionId)
        }));
    }, []);

    return {
        ...state,
        fetchSubscriptions,
        archiveAll,
        deleteAll,
        unsubscribe,
        removeSubscription
    };
}
