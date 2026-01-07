import { useState, useCallback } from 'react';
import { authFetch, getAccessToken } from '../lib/api';
import { mockAnalytics } from '../lib/mockData';

interface WeeklyData {
    name: string;
    emails: number;
    color: string;
}

interface HourlyData {
    name: string;
    value: number;
}

interface CategoryData {
    name: string;
    value: number;
    color: string;
}

interface Metrics {
    totalEmails: number;
    last7Days: number;
    last30Days: number;
    avgDailyEmails: number;
    estimatedReadingTime: string;
}

export interface Analytics {
    weeklyVolume: WeeklyData[];
    hourlyActivity: HourlyData[];
    categories: CategoryData[];
    metrics: Metrics;
}

interface AnalyticsState {
    analytics: Analytics | null;
    loading: boolean;
    error: string | null;
}

export function useAnalytics() {
    const [state, setState] = useState<AnalyticsState>({
        analytics: null,
        loading: false,
        error: null
    });

    const fetchAnalytics = useCallback(async (limit: number = 10000) => {
        const token = getAccessToken();

        if (!token) {
            // Mode Demo
            setState({ analytics: mockAnalytics as unknown as Analytics, loading: false, error: null });
            return mockAnalytics;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await authFetch(`/api/analytics?limit=${limit}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao buscar analytics');
            }

            const analytics = await response.json();
            setState({ analytics, loading: false, error: null });
            return analytics;
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            console.warn('Analytics não disponível:', error.message);
            return null;
        }
    }, []);

    return {
        ...state,
        fetchAnalytics
    };
}
