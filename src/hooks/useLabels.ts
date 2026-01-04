import { useState, useCallback } from 'react';
import { authFetch } from '../lib/api';

interface ClassifiedEmail {
    id: string;
    from: string;
    subject: string;
    snippet: string;
    classification: {
        category: string;
        confidence: number;
        isNewsletter: boolean;
        priority: string;
        suggestedLabel: string;
    };
}

interface ClassificationStats {
    totalClassified: number;
    byCategory: Record<string, number>;
    byPriority: { alta: number; media: number; baixa: number };
    newsletters: number;
    avgConfidence: number;
    unclassified: number;
}

export interface Label {
    id: number;
    name: string;
    count: number;
    color: string;
    emails: ClassifiedEmail[];
}

interface LabelsState {
    labels: Label[];
    stats: ClassificationStats | null;
    classifiedEmails: ClassifiedEmail[];
    loading: boolean;
    error: string | null;
}

export function useLabels() {
    const [state, setState] = useState<LabelsState>({
        labels: [],
        stats: null,
        classifiedEmails: [],
        loading: false,
        error: null
    });

    const classifyWithAI = useCallback(async (limit: number = 20) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await authFetch(`/api/labels/classify?limit=${limit}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao classificar emails');
            }

            const data = await response.json();
            setState({
                labels: data.labels,
                stats: data.stats,
                classifiedEmails: data.classified,
                loading: false,
                error: null
            });
            return data;
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            throw error;
        }
    }, []);

    return {
        ...state,
        classifyWithAI
    };
}
