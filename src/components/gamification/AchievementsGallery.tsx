
import { useState } from 'react';
import { useAchievements } from '../../hooks/useAchievements';
import { Achievement, AchievementTier } from '../../lib/gamification/achievements';
import { useProgression } from '../../hooks/useProgression';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [filter, setFilter] = useState<AchievementTier | 'all'>('all');

    const filteredAchievements = filter === 'all'
        ? achievements
        : achievements.filter(a => a.tier === filter);

    return (
        <div className="brutal-card" style={{ background: '#FFF', padding: '1.5rem', marginTop: '1rem' }}>
            <h3 className="brutal-title brutal-title-sm" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                🏆 CONQUISTAS
            </h3>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
                <FilterButton
                    label="Todas"
                    isActive={filter === 'all'}
                    onClick={() => setFilter('all')}
                    color="#000"
                />
                {(Object.keys(TIER_LABELS) as AchievementTier[]).map(tier => (
                    <FilterButton
                        key={tier}
                        label={TIER_LABELS[tier]}
                        isActive={filter === tier}
                        onClick={() => setFilter(tier)}
                        color={TIER_COLORS[tier]}
                    />
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence mode='popLayout'>
                    {filteredAchievements.map(achievement => (
                        <AchievementCard
                            key={achievement.id}
                            achievement={achievement}
                            status={getAchievementStatus(achievement.id)}
                            userProgress={userProgress}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {filteredAchievements.length === 0 && (
                <p className="text-center text-gray-500 py-8">Nenhuma conquista encontrada neste nível.</p>
            )}
        </div>
    );
}

function FilterButton({ label, isActive, onClick, color }: { label: string; isActive: boolean; onClick: () => void; color: string }) {
    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-black transition-all
                ${isActive ? 'shadow-[4px_4px_0_0_#000] -translate-y-1' : 'hover:bg-gray-100'}
            `}
            style={{
                backgroundColor: isActive ? color : '#FFF',
                color: '#000' // Sempre preto para contraste neobrutalista
            }}
        >
            {label}
        </button>
    );
}

function AchievementCard({
    achievement,
    status,
    userProgress
}: {
    achievement: Achievement;
    status: 'unlocked' | 'locked';
    userProgress: any;
}) {
    const isUnlocked = status === 'unlocked';
    const progress = userProgress && typeof userProgress[achievement.statKey] === 'number'
        ? Math.min(100, (userProgress[achievement.statKey] / achievement.progressRequired) * 100)
        : 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
                relative p-4 border-2 transition-all duration-300 flex flex-col items-center text-center
                ${isUnlocked
                    ? 'border-black bg-white shadow-[4px_4px_0_0_#000]'
                    : 'border-gray-300 bg-gray-50 opacity-100 grayscale'
                }
            `}
            style={{
                minHeight: '140px',
                // Se bloqueado, deixa grayscale mas visível para ver o progresso
            }}
            title={!isUnlocked ? `Progresso: ${Math.round(progress)}%` : 'Conquistado!'}
        >
            {/* Tier Badge (Top Right) IF Unlocked */}
            {isUnlocked && (
                <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-black text-xs"
                    style={{ background: TIER_COLORS[achievement.tier] }}
                >
                    ✓
                </div>
            )}

            {/* Icon */}
            <div
                className="text-4xl mb-3 mt-1"
                style={{
                    textShadow: isUnlocked ? `0 0 15px ${TIER_COLORS[achievement.tier]}` : 'none',
                    filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(0.5)'
                }}
            >
                {achievement.icon}
            </div>

            {/* Title */}
            <p className="font-bold text-xs leading-tight mb-2">
                {achievement.title}
            </p>

            {/* Progress Bar (Locked only) */}
            {!isUnlocked && (
                <div className="w-full mt-auto pt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden border border-black/10">
                        <div
                            className="h-full bg-black/60"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-[10px] mt-1 font-bold text-gray-500">{Math.round(progress)}%</p>
                </div>
            )}
        </motion.div>
    );
}
