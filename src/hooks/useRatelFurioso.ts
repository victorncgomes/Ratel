import { useState } from 'react';
import { showToast } from '../lib/toast';

export function useRatelFurioso() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const execute = async (subscriptionIds: string[], deleteHistory: boolean) => {
        setLoading(true);
        setProgress(0);

        try {
            // Simulate batch unsubscribe process
            const total = subscriptionIds.length;
            for (let i = 0; i < total; i++) {
                // Simulate processing
                await new Promise(resolve => setTimeout(resolve, 100));
                setProgress(((i + 1) / total) * 100);
            }

            showToast('Todas as inscrições foram canceladas', 'success');
        } catch (error) {
            console.error('Erro no Ratel Furioso:', error);
            throw error;
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    return {
        loading,
        progress,
        execute
    };
}
