/**
 * Progress Context - Global state for email loading progress
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { getRandomMessage, getNextMessage } from '../lib/funnyMessages';
import { useLanguage } from './LanguageContext';

interface ProgressState {
    isLoading: boolean;
    progress: number; // 0-100
    phase: 'idle' | 'fetching' | 'processing' | 'scoring' | 'complete';
    emailsLoaded: number;
    totalEmails: number;
    currentMessage: string;
    error: string | null;
}

interface ProgressContextType extends ProgressState {
    startLoading: (total?: number) => void;
    updateProgress: (loaded: number, total: number, phase?: ProgressState['phase']) => void;
    completeLoading: () => void;
    setError: (error: string) => void;
    reset: () => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
    const { language } = useLanguage();
    const lang = (language || 'pt') as 'pt' | 'en' | 'es';

    const [state, setState] = useState<ProgressState>({
        isLoading: false,
        progress: 0,
        phase: 'idle',
        emailsLoaded: 0,
        totalEmails: 0,
        currentMessage: getRandomMessage(lang),
        error: null
    });

    const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Rotate funny messages every 2.5 seconds while loading
    useEffect(() => {
        if (state.isLoading && !messageIntervalRef.current) {
            messageIntervalRef.current = setInterval(() => {
                setState(prev => ({
                    ...prev,
                    currentMessage: getNextMessage(prev.currentMessage, lang)
                }));
            }, 2500);
        }

        if (!state.isLoading && messageIntervalRef.current) {
            clearInterval(messageIntervalRef.current);
            messageIntervalRef.current = null;
        }

        return () => {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        };
    }, [state.isLoading, lang]);

    const startLoading = useCallback((total: number = 0) => {
        setState({
            isLoading: true,
            progress: 0,
            phase: 'fetching',
            emailsLoaded: 0,
            totalEmails: total,
            currentMessage: getRandomMessage(lang),
            error: null
        });
    }, [lang]);

    const updateProgress = useCallback((loaded: number, total: number, phase?: ProgressState['phase']) => {
        const progress = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
        setState(prev => ({
            ...prev,
            progress,
            emailsLoaded: loaded,
            totalEmails: total,
            phase: phase || prev.phase
        }));
    }, []);

    const completeLoading = useCallback(() => {
        setState(prev => ({
            ...prev,
            isLoading: false,
            progress: 100,
            phase: 'complete'
        }));

        // Reset after fade out
        setTimeout(() => {
            setState(prev => ({
                ...prev,
                phase: 'idle'
            }));
        }, 3000);
    }, []);

    const setError = useCallback((error: string) => {
        setState(prev => ({
            ...prev,
            error,
            isLoading: false,
            phase: 'idle'
        }));
    }, []);

    const reset = useCallback(() => {
        setState({
            isLoading: false,
            progress: 0,
            phase: 'idle',
            emailsLoaded: 0,
            totalEmails: 0,
            currentMessage: getRandomMessage(lang),
            error: null
        });
    }, [lang]);

    return (
        <ProgressContext.Provider value={{
            ...state,
            startLoading,
            updateProgress,
            completeLoading,
            setError,
            reset
        }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within ProgressProvider');
    }
    return context;
}
