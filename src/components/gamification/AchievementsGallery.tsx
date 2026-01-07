

import { useAchievements } from '../../hooks/useAchievements';
import { Achievement, AchievementTier } from '../../lib/gamification/achievements';
import { useProgression } from '../../hooks/useProgression';

const TIER_COLORS: Record<AchievementTier, string> = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',
};

const TIER_LABELS: Record<AchievementTier, string> = {
    bronze: 'Bronze',
    silver: 'Prata',
    gold: 'Ouro',
    platinum: 'Platina',
    diamond: 'Diamante',
};

export default function AchievementsGallery() {
    const { achievements, getAchievementStatus } = useAchievements();
    const { userProgress } = useProgression();

    return (
        <div className="brutal-card" style={{ background: '#FFF', padding: '1.5rem', marginTop: '1rem' }}>
            <h3 className="brutal-title brutal-title-sm" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                🏆 CONQUISTAS
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {['bronze', 'silver', 'gold', 'platinum', 'diamond'].map((tier) => (
                    <TierSection
                        key={tier}
                        tier={tier as AchievementTier}
                        achievements={achievements.filter(a => a.tier === tier)}
                        getStatus={getAchievementStatus}
                        userProgress={userProgress}
                    />
                ))}
            </div>
        </div>
    );
}

function TierSection({
    tier,
    achievements,
    getStatus,
    userProgress
}: {
    tier: AchievementTier;
    achievements: Achievement[];
    getStatus: (id: string) => 'unlocked' | 'locked';
    userProgress: any;
}) {
    if (achievements.length === 0) return null;

    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: `4px solid ${TIER_COLORS[tier]}`,
                paddingBottom: '0.5rem'
            }}>
                <h4 className="font-heading font-black text-xl uppercase" style={{ color: '#000' }}>
                    Nível {TIER_LABELS[tier]}
                </h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {achievements.map(achievement => {
                    const status = getStatus(achievement.id);
                    const isUnlocked = status === 'unlocked';
                    const progress = userProgress && typeof userProgress[achievement.statKey] === 'number'
                        ? Math.min(100, (userProgress[achievement.statKey] / achievement.progressRequired) * 100)
                        : 0;

                    return (
                        <div
                            key={achievement.id}
                            className={`
                                relative p-4 border-2 transition-all duration-300
                                ${isUnlocked
                                    ? 'border-black bg-white shadow-[4px_4px_0_0_#000]'
                                    : 'border-gray-200 bg-gray-50 opacity-60 grayscale'
                                }
                            `}
                            style={{
                                borderColor: isUnlocked ? '#000' : '#ccc',
                                minHeight: '140px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}
                            title={!isUnlocked ? `Progresso: ${Math.round(progress)}%` : 'Conquistado!'}
                        >
                            {/* Icon */}
                            <div
                                className="text-4xl mb-2"
                                style={{
                                    textShadow: isUnlocked ? `0 0 10px ${TIER_COLORS[tier]}` : 'none',
                                    filter: isUnlocked ? 'none' : 'grayscale(100%) blur(0.5px)'
                                }}
                            >
                                {achievement.icon}
                            </div>

                            {/* Title */}
                            <p className="font-bold text-xs leading-tight mb-1">
                                {achievement.title}
                            </p>

                            {/* Description (Hover/Small) */}
                            <p className="text-[10px] text-muted-foreground leading-tight">
                                {achievement.description}
                            </p>

                            {/* Unlock Badge */}
                            {isUnlocked && (
                                <div
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-black"
                                    style={{ background: TIER_COLORS[tier] }}
                                >
                                    ✓
                                </div>
                            )}

                            {/* Progress Bar (Locked only) */}
                            {!isUnlocked && (
                                <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-gray-200 rounded-full overflow-hidden border border-black/10">
                                    <div
                                        className="h-full bg-black/50"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
