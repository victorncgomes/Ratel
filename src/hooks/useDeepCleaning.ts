import { useState, useCallback } from 'react';
import { authFetch, getAccessToken } from '../lib/api';

export interface DeepCleaningEmail {
    id: string;
    from: string;
    subject: string;
    date: string;
    size: number;
    sizeFormatted: string;
    hasAttachment?: boolean;
}

export interface DeepCleaningResult {
    emails: DeepCleaningEmail[];
    totalSize: string;
    count: number;
}

export function useDeepCleaning() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBySize = useCallback(async (minSizeMB: number): Promise<DeepCleaningResult> => {
        const token = getAccessToken();
        if (!token) {
            // Mock data para demo
            return {
                emails: [],
                totalSize: '0 MB',
                count: 0
            };
        }

        setLoading(true);
        setError(null);
        try {
            const response = await authFetch(`/api/cleanup/by-size?minSize=${minSizeMB}`);
            if (!response.ok) throw new Error('Erro ao buscar emails por tamanho');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchByDate = useCallback(async (beforeDate: string): Promise<DeepCleaningResult> => {
        const token = getAccessToken();
        if (!token) {
            // Mock data para demo
            return {
                emails: [],
                totalSize: '0 MB',
                count: 0
            };
        }

        setLoading(true);
        setError(null);
        try {
            const response = await authFetch(`/api/cleanup/by-date?before=${encodeURIComponent(beforeDate)}`);
            if (!response.ok) throw new Error('Erro ao buscar emails por data');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        fetchBySize,
        fetchByDate
    };
}
