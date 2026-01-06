/**
 * Hook to manage progressive email loading from Dashboard
 */

import { useEffect, useCallback, useRef } from 'react';
import { useProgress } from '../contexts/ProgressContext';
import * as emailLoader from '../lib/emailLoaderService';
import * as emailStore from '../lib/emailStore';
import { getAccessToken } from '../lib/api';

interface UseEmailLoaderReturn {
    startLoading: () => void;
    isLoading: boolean;
    progress: number;
}

export function useEmailLoader(): UseEmailLoaderReturn {
    const {
        isLoading,
        progress,
        startLoading: startProgress,
        updateProgress,
        completeLoading,
        setError
    } = useProgress();

    const loadingRef = useRef(false);

    const startLoading = useCallback(() => {
        const token = getAccessToken();

        if (!token) {
            console.log('[useEmailLoader] No token, skipping');
            return;
        }

        if (loadingRef.current) {
            console.log('[useEmailLoader] Already loading');
            return;
        }

        loadingRef.current = true;
        startProgress();

        emailLoader.startProgressiveLoading({
            onProgress: (loaded, total, phase) => {
                updateProgress(loaded, total, phase);
            },
            onBatchComplete: (emails) => {
                console.log(`[useEmailLoader] Batch complete: ${emails.length} emails`);
            },
            onComplete: () => {
                loadingRef.current = false;
                completeLoading();
            },
            onError: (error) => {
                loadingRef.current = false;
                setError(error);
            }
        });
    }, [startProgress, updateProgress, completeLoading, setError]);

    // Auto-start loading when hook mounts (if authenticated)
    useEffect(() => {
        const token = getAccessToken();
        if (token && !loadingRef.current) {
            // Check if we have recent data
            emailStore.getLastLoadTime().then(lastLoad => {
                const oneHour = 60 * 60 * 1000;
                if (!lastLoad || Date.now() - lastLoad > oneHour) {
                    console.log('[useEmailLoader] Starting fresh load');
                    startLoading();
                } else {
                    console.log('[useEmailLoader] Using cached data');
                    emailStore.getEmailCount().then(count => {
                        if (count > 0) {
                            updateProgress(count, count, 'complete');
                            completeLoading();
                        } else {
                            startLoading();
                        }
                    });
                }
            });
        }
    }, [startLoading, updateProgress, completeLoading]);

    return {
        startLoading,
        isLoading,
        progress
    };
}
