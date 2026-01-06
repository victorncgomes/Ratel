import { useState, useEffect, useCallback } from 'react';

interface UserAction {
    type: 'delete' | 'archive' | 'keep' | 'open' | 'spam' | 'block' | 'unsubscribe' | 'rollup';
    emailId: string;
    sender: string;
    timestamp: number;
    category?: string;
}

interface SenderProfile {
    sender: string;
    totalActions: number;
    deleteCount: number;
    keepCount: number;
    openCount: number;
    avgResponseTime?: number;
    lastAction: number;
    isMailingList: boolean;
}

interface BehaviorState {
    actions: UserAction[];
    senderProfiles: Map<string, SenderProfile>;
}

const STORAGE_KEY = 'ratel_user_behavior';
const MAX_ACTIONS = 1000; // Keep last 1000 actions

export function useUserBehavior() {
    const [state, setState] = useState<BehaviorState>({
        actions: [],
        senderProfiles: new Map()
    });

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setState({
                    actions: parsed.actions || [],
                    senderProfiles: new Map(Object.entries(parsed.senderProfiles || {}))
                });
            }
        } catch (e) {
            console.error('Error loading behavior data:', e);
        }
    }, []);

    // Save to localStorage when state changes
    useEffect(() => {
        try {
            const toStore = {
                actions: state.actions.slice(-MAX_ACTIONS),
                senderProfiles: Object.fromEntries(state.senderProfiles)
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
        } catch (e) {
            console.error('Error saving behavior data:', e);
        }
    }, [state]);

    // Track an action
    const trackAction = useCallback((
        type: UserAction['type'],
        emailId: string,
        sender: string,
        category?: string
    ) => {
        const action: UserAction = {
            type,
            emailId,
            sender,
            timestamp: Date.now(),
            category
        };

        setState(prev => {
            const newActions = [...prev.actions, action].slice(-MAX_ACTIONS);

            // Update sender profile
            const profiles = new Map(prev.senderProfiles);
            const existing = profiles.get(sender) || {
                sender,
                totalActions: 0,
                deleteCount: 0,
                keepCount: 0,
                openCount: 0,
                lastAction: 0,
                isMailingList: false
            };

            existing.totalActions++;
            existing.lastAction = Date.now();

            if (type === 'delete' || type === 'spam' || type === 'block') {
                existing.deleteCount++;
            } else if (type === 'keep' || type === 'archive') {
                existing.keepCount++;
            } else if (type === 'open') {
                existing.openCount++;
            }

            if (type === 'unsubscribe') {
                existing.isMailingList = true;
            }

            profiles.set(sender, existing);

            return { actions: newActions, senderProfiles: profiles };
        });
    }, []);

    // Get sender profile
    const getSenderProfile = useCallback((sender: string): SenderProfile | undefined => {
        return state.senderProfiles.get(sender);
    }, [state.senderProfiles]);

    // Get action patterns for a sender
    const getSenderPatterns = useCallback((sender: string) => {
        const profile = state.senderProfiles.get(sender);
        if (!profile || profile.totalActions === 0) {
            return { deleteRate: 0.5, keepRate: 0.5, openRate: 0 }; // Neutral by default
        }

        return {
            deleteRate: profile.deleteCount / profile.totalActions,
            keepRate: profile.keepCount / profile.totalActions,
            openRate: profile.openCount / profile.totalActions
        };
    }, [state.senderProfiles]);

    // Clear all behavior data
    const clearBehavior = useCallback(() => {
        setState({ actions: [], senderProfiles: new Map() });
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        actions: state.actions,
        senderProfiles: state.senderProfiles,
        trackAction,
        getSenderProfile,
        getSenderPatterns,
        clearBehavior
    };
}
