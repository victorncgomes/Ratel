/**
 * RATEL - BadgeGallery
 * Galeria de badges com filtros e progresso
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadges, BadgeProgress } from '../../hooks/useBadges';
import { useLanguage } from '../../contexts/LanguageContext';
import { Badge, BadgeTier } from '../../lib/gamification/badges';
import '../../styles/neobrutalism.css';

interface BadgeGalleryProps {
    compact?: boolean;
}

export default function BadgeGallery({ compact = false }: BadgeGalleryProps) {
    const { getAllBadgesWithProgress, unlockedCount, totalBadges } = useBadges();
    const { language } = useLanguage();
    const [filter, setFilter] = useState<'all' | BadgeTier>('all');
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    const lang = (language === 'pt' || language === 'en' || language === 'es') ? language : 'pt';

    const allBadges = getAllBadgesWithProgress();
    const filteredBadges = filter === 'all'
        ? allBadges
        : allBadges.filter(bp => bp.badge.tier === filter);

    const tierLabels = {
        bronze: { pt: 'Bronze', en: 'Bronze', es: 'Bronce' },
        silver: { pt: 'Prata', en: 'Silver', es: 'Plata' },
        gold: { pt: 'Ouro', en: 'Gold', es: 'Oro' },
    };

    if (compact) {
        // Versão compacta: apenas badges desbloqueados recentes
        const unlockedBadges = allBadges.filter(bp => bp.isUnlocked).slice(0, 5);

        return (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {unlockedBadges.map(bp => (
                    <motion.div
                        key={bp.badge.id}
                        className={`brutal-badge brutal-badge-${bp.badge.tier}`}
                        style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}
                        whileHover={{ scale: 1.1 }}
                        title={bp.badge.name[lang]}
                    >
                        {bp.badge.icon}
                    </motion.div>
                ))}
                {unlockedCount > 5 && (
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                        +{unlockedCount - 5}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="brutal-card" style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 className="brutal-title brutal-title-lg">🏅 Seus Badges</h2>
                <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>
                    {unlockedCount} / {totalBadges} desbloqueados
                </p>
            </div>

            {/* Filtros */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {(['all', 'bronze', 'silver', 'gold'] as const).map(tier => (
                    <motion.button
                        key={tier}
                        className={`brutal-button ${filter === tier ? 'brutal-button-danger' : ''}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFilter(tier)}
                    >
                        {tier === 'all' ? 'Todos' : tierLabels[tier][lang]}
                    </motion.button>
                ))}
            </div>

            {/* Grid de Badges */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '1rem',
                }}
            >
                <AnimatePresence>
                    {filteredBadges.map(bp => (
                        <BadgeCard
                            key={bp.badge.id}
                            badgeProgress={bp}
                            lang={lang}
                            onClick={() => setSelectedBadge(bp.badge)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal de Badge Selecionado */}
            <AnimatePresence>
                {selectedBadge && (
                    <BadgeModal
                        badge={selectedBadge}
                        lang={lang}
                        onClose={() => setSelectedBadge(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Card individual de badge
function BadgeCard({
    badgeProgress,
    lang,
    onClick,
}: {
    badgeProgress: BadgeProgress;
    lang: 'pt' | 'en' | 'es';
    onClick: () => void;
}) {
    const { badge, isUnlocked, progress } = badgeProgress;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                border: `3px solid ${isUnlocked ? '#E63946' : '#000'}`,
                boxShadow: '4px 4px 0 #000',
                cursor: 'pointer',
                opacity: badge.isSecret && !isUnlocked ? 0.4 : 1,
            }}
        >
            {/* Ícone */}
            <div
                className={`brutal-badge brutal-badge-${badge.tier} ${!isUnlocked ? 'brutal-badge-locked' : ''}`}
                style={{ marginBottom: '0.5rem' }}
            >
                {badge.icon}
            </div>

            {/* Nome */}
            <p
                style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    marginBottom: '0.25rem',
                }}
            >
                {badge.isSecret && !isUnlocked ? '???' : badge.name[lang]}
            </p>

            {/* Progresso (se não desbloqueado) */}
            {!isUnlocked && !badge.isSecret && (
                <div style={{ width: '100%', marginTop: '0.5rem' }}>
                    <div
                        style={{
                            height: '6px',
                            background: '#F5F5F5',
                            border: '1px solid #000',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: '#E63946',
                                transition: 'width 0.3s',
                            }}
                        />
                    </div>
                    <p style={{ fontSize: '0.625rem', textAlign: 'center', marginTop: '0.25rem' }}>
                        {Math.round(progress)}%
                    </p>
                </div>
            )}

            {/* Créditos */}
            {isUnlocked && (
                <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#228B22' }}>
                    +{badge.rewardsCredits} 💰
                </p>
            )}
        </motion.div>
    );
}

// Modal de detalhes do badge
function BadgeModal({
    badge,
    lang,
    onClose,
}: {
    badge: Badge;
    lang: 'pt' | 'en' | 'es';
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
            }}
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="brutal-card"
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                {/* Ícone grande */}
                <div
                    className={`brutal-badge brutal-badge-${badge.tier}`}
                    style={{
                        width: '120px',
                        height: '120px',
                        fontSize: '3rem',
                        margin: '0 auto 1rem',
                    }}
                >
                    {badge.icon}
                </div>

                {/* Nome e Tier */}
                <h3 className="brutal-title brutal-title-md">{badge.name[lang]}</h3>
                <p
                    style={{
                        marginTop: '0.25rem',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: badge.tier === 'gold' ? '#FFD700' : badge.tier === 'silver' ? '#C0C0C0' : '#CD7F32',
                    }}
                >
                    {badge.tier}
                </p>

                {/* Descrição */}
                <p style={{ marginTop: '1rem', lineHeight: 1.5 }}>
                    {badge.description[lang]}
                </p>

                {/* Recompensa */}
                <div
                    style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: '#F5F5F5',
                        border: '2px solid #000',
                    }}
                >
                    <p style={{ fontWeight: 700 }}>
                        Recompensa: <span style={{ color: '#228B22' }}>+{badge.rewardsCredits} créditos</span>
                    </p>
                </div>

                {/* Botão Fechar */}
                <motion.button
                    className="brutal-button"
                    style={{ marginTop: '1.5rem', width: '100%' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                >
                    FECHAR
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

export { BadgeGallery };
