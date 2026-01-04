import { useState, useCallback } from 'react';
import { authFetch } from '../lib/api';

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

    const fetchSubscriptions = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await authFetch('/api/subscriptions');

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
            const urlMatch = subscription.unsubscribeLink.match(/<(https?:\/\/[^>]+)>/);
            if (urlMatch) {
                window.open(urlMatch[1], '_blank');
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
