import { useState, useCallback } from 'react';
import { authFetch, getAccessToken } from '../lib/api';
import { mockRules } from '../lib/mockData';

export interface Rule {
    sender: string;
    type: 'shield' | 'rollup';
    createdAt: string;
}

export function useRules() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRules = useCallback(async () => {
        const token = getAccessToken();

        if (!token) {
            setRules(mockRules as Rule[]);
            return mockRules;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await authFetch('/api/rules');
            if (!response.ok) throw new Error('Erro ao buscar regras');
            const data = await response.json();

            // Transform object rules to array
            const rulesArray: Rule[] = [];
            if (data.shield) {
                data.shield.forEach((sender: string) => {
                    rulesArray.push({ sender, type: 'shield', createdAt: new Date().toISOString() });
                });
            }
            if (data.rollup) {
                data.rollup.forEach((sender: string) => {
                    rulesArray.push({ sender, type: 'rollup', createdAt: new Date().toISOString() });
                });
            }

            setRules(rulesArray);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addToShield = useCallback(async (sender: string) => {
        const token = getAccessToken();
        if (!token) {
            setRules(prev => [...prev, { sender, type: 'shield', createdAt: new Date().toISOString() }]);
            return;
        }

        try {
            const response = await authFetch('/api/rules/shield', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender })
            });
            if (!response.ok) throw new Error('Erro ao adicionar ao Shield');
            await fetchRules();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, [fetchRules]);

    const addToRollup = useCallback(async (sender: string) => {
        const token = getAccessToken();
        if (!token) {
            setRules(prev => [...prev, { sender, type: 'rollup', createdAt: new Date().toISOString() }]);
            return;
        }

        try {
            const response = await authFetch('/api/rules/rollup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender })
            });
            if (!response.ok) throw new Error('Erro ao adicionar ao Rollup');
            await fetchRules();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, [fetchRules]);

    const removeRule = useCallback(async (sender: string) => {
        const token = getAccessToken();
        if (!token) {
            setRules(prev => prev.filter(r => r.sender !== sender));
            return;
        }

        try {
            const response = await authFetch(`/api/rules?sender=${encodeURIComponent(sender)}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao remover regra');
            await fetchRules();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, [fetchRules]);

    return {
        rules,
        loading,
        error,
        fetchRules,
        addToShield,
        addToRollup,
        removeRule
    };
}
