
import { UserProgress } from '../../hooks/useProgression';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    tier: AchievementTier;
    icon: string; // Pode ser um emoji ou path para asset
    condition: (progress: UserProgress) => boolean;
    progressRequired: number;
    statKey: keyof UserProgress | 'level'; // Para mostrar barra de progresso
}

const TIERS: AchievementTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

// Helper para criar série de achievements
const createSeries = (
    baseId: string,
    baseTitle: string,
    baseDesc: string,
    statKey: keyof UserProgress,
    thresholds: number[],
    icons: string[]
): Achievement[] => {
    return thresholds.map((threshold, index) => ({
        id: `${baseId}_${TIERS[index]}`,
        title: `${baseTitle} ${['I', 'II', 'III', 'IV', 'V'][index]}`,
        description: baseDesc.replace('XX', threshold.toString()),
        tier: TIERS[index],
        icon: icons[index] || '🏆',
        condition: (p) => (p[statKey] as number) >= threshold,
        progressRequired: threshold,
        statKey: statKey
    }));
};

// 1. Exterminador de Emails (Deleted)
const emailSeries = createSeries(
    'terminator',
    'Exterminador',
    'Exclua XX emails',
    'emailsDeleted',
    [100, 500, 1000, 5000, 10000],
    ['🧹', '🗑️', '🔥', '🧨', '☢️']
);

// 2. Libertador (Unsubscribes)
const unsubSeries = createSeries(
    'liberator',
    'Libertador',
    'Cancele XX inscrições',
    'unsubscribes',
    [5, 20, 50, 100, 200],
    ['⛓️', '🔓', '🕊️', '🦅', '🚀']
);

// 3. Guardião do Zero (Inbox Zero Count)
const zeroSeries = createSeries(
    'zero_hero',
    'Guardião do Zero',
    'Atinja Inbox Zero XX vezes',
    'inboxZeroCount',
    [1, 5, 10, 25, 50],
    ['📥', '✨', '🌟', '💎', '🌌']
);

// 4. Arquivista (Archived)
const archiveSeries = createSeries(
    'archivist',
    'Arquivista',
    'Arquive XX emails importantes',
    'emailsArchived',
    [50, 200, 500, 1000, 2000],
    ['📁', '📂', '🗄️', '📚', '🏛️']
);

// 5. Caçador de Spam (Spam Marked)
const spamSeries = createSeries(
    'spam_hunter',
    'Caçador de Spam',
    'Marque XX emails como spam',
    'spamMarked',
    [10, 50, 100, 200, 500],
    ['🎣', '🚫', '🛡️', '⚔️', '🐲']
);

// 6. Disciplinado (Current Streak)
const streakSeries = createSeries(
    'disciplined',
    'Disciplinado',
    'Mantenha uma ofensiva de XX dias',
    'longestStreak',
    [3, 7, 14, 30, 60],
    ['📅', '🔥', '⚡', '🚄', '👑']
);

// 7. Leitor Voraz (Emails Read - Supondo que tenhamos esse stat, senão usamos TotalLoaded/10)
const readerSeries = createSeries(
    'reader',
    'Observador',
    'Analise XX emails no total',
    'totalEmailsLoaded',
    [1000, 5000, 10000, 25000, 50000],
    ['👁️', '📝', '🧐', '🧠', '🔮']
);

// 8. Veterano (Dias Ativo - Supondo stat ou usando levels)
// Como não temos 'daysActive', vamos usar 'emailsDeleted' com valores muito altos para simular 'Lenda'
const legendSeries = createSeries(
    'legend',
    'Lenda Viva',
    'Elimine XX emails (Master)',
    'emailsDeleted',
    [15000, 20000, 30000, 40000, 50000],
    ['🎖️', '🏅', '🏆', '👑', '🗿']
);

export const ACHIEVEMENTS: Achievement[] = [
    ...emailSeries,
    ...unsubSeries,
    ...zeroSeries,
    ...archiveSeries,
    ...spamSeries,
    ...streakSeries,
    ...readerSeries,
    ...legendSeries
];

export const getAchievementsProgress = (progress: UserProgress) => {
    const unlocked = ACHIEVEMENTS.filter(a => a.condition(progress));
    const next = ACHIEVEMENTS.find(a => !a.condition(progress)); // O próximo a desbloquear (simplificado)
    return {
        unlocked,
        total: ACHIEVEMENTS.length,
        next
    };
};
