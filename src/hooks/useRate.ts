import { useState, useEffect, useMemo, useCallback } from 'react';
import { useEmails, Email } from './useEmails';
import { useUserBehavior } from './useUserBehavior';
import { calculateLocalRate, RateScore } from '../services/rateService';

interface EmailWithRate extends Email {
    rate?: RateScore;
}

export function useRate() {
    const { emails } = useEmails();
    const { getSenderPatterns } = useUserBehavior();
    const [ratedEmails, setRatedEmails] = useState<EmailWithRate[]>([]);
    const [loading, setLoading] = useState(false);

    // Calculate rates for all emails
    const calculateRates = useCallback(async () => {
        if (emails.length === 0) return;

        setLoading(true);

        const rated: EmailWithRate[] = await Promise.all(
            emails.map(async (email) => {
                const patterns = getSenderPatterns(email.from);
                const rate = calculateLocalRate(
                    {
                        id: email.id,
                        from: email.from,
                        subject: email.subject,
                        snippet: email.snippet,
                        hasUnsubscribe: email.hasUnsubscribe,
                        date: email.date
                    },
                    patterns
                );
                return { ...email, rate };
            })
        );

        setRatedEmails(rated);
        setLoading(false);
    }, [emails, getSenderPatterns]);

    // Recalculate when emails change
    useEffect(() => {
        calculateRates();
    }, [calculateRates]);

    // Filter by rate category
    const filterByRate = useCallback((category: 'keep' | 'neutral' | 'delete' | 'all') => {
        if (category === 'all') return ratedEmails;
        return ratedEmails.filter(e => e.rate?.category === category);
    }, [ratedEmails]);

    // Sort by rate score
    const sortByRate = useCallback((ascending = true) => {
        return [...ratedEmails].sort((a, b) => {
            const scoreA = a.rate?.score || 50;
            const scoreB = b.rate?.score || 50;
            return ascending ? scoreA - scoreB : scoreB - scoreA;
        });
    }, [ratedEmails]);

    // Get candidates for deletion (score < 30)
    const deletionCandidates = useMemo(() => {
        return ratedEmails.filter(e => (e.rate?.score || 50) < 30);
    }, [ratedEmails]);

    // Get high priority emails (score > 70)
    const highPriority = useMemo(() => {
        return ratedEmails.filter(e => (e.rate?.score || 50) > 70);
    }, [ratedEmails]);

    // Get undecided emails (score 40-60)
    const undecided = useMemo(() => {
        const score = (e: EmailWithRate) => e.rate?.score || 50;
        return ratedEmails.filter(e => score(e) >= 40 && score(e) <= 60);
    }, [ratedEmails]);

    return {
        ratedEmails,
        loading,
        filterByRate,
        sortByRate,
        deletionCandidates,
        highPriority,
        undecided,
        refreshRates: calculateRates
    };
}
