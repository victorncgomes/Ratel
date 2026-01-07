/**
 * RATEL - BadgeGallery
 * Galeria de badges com filtros e progresso
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadges, BadgeProgress } from '../../hooks/useBadges';
import { useLanguage } from '../../contexts/LanguageContext';
import { useStyleTheme } from '../../contexts/StyleThemeContext';
import { Badge, BadgeTier } from '../../lib/gamification/badges';
import { BookOpen } from 'lucide-react';
import '../../styles/neobrutalism.css';

interface BadgeGalleryProps {
    compact?: boolean;
    onViewRules?: () => void;
}

export default function BadgeGallery({ compact = false, onViewRules }: BadgeGalleryProps) {
    const { getAllBadgesWithProgress, unlockedCount, totalBadges } = useBadges();
    const { language } = useLanguage();
    const { isNeobrutalist } = useStyleTheme();
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

    // Dynamic styles based on theme
    const containerStyle = isNeobrutalist
        ? { padding: '0.5rem' }
        : { padding: '1rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '1rem' };

    const buttonBaseClass = isNeobrutalist
        ? 'brutal-button'
        : 'px-4 py-2 rounded-lg font-medium transition-all border border-gray-200 hover:bg-gray-100';

    const buttonActiveClass = isNeobrutalist
        ? 'brutal-button-danger'
        : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600';

    if (compact) {
        // Versão compacta: apenas badges desbloqueados recentes
        const unlockedBadges = allBadges.filter(bp => bp.isUnlocked).slice(0, 5);

        return (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {unlockedBadges.map(bp => (
                    <motion.div
                        key={bp.badge.id}
                        className={isNeobrutalist ? `brutal-badge brutal-badge-${bp.badge.tier}` : ''}
                        style={{
                            width: '40px',
                            height: '40px',
                            fontSize: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: isNeobrutalist ? '50%' : '0.5rem',
                            background: isNeobrutalist ? undefined : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
                            boxShadow: isNeobrutalist ? undefined : '0 2px 8px rgba(0,0,0,0.1)'
                        }}
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
        <div style={containerStyle}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 className={isNeobrutalist ? "brutal-title brutal-title-lg" : "text-2xl font-bold"}>
                    🏅 Seus Badges
                </h2>
                <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>
                    {unlockedCount} / {totalBadges} desbloqueados
                </p>
            </div>

            {/* Filtros */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {(['all', 'bronze', 'silver', 'gold'] as const).map(tier => (
                    <motion.button
                        key={tier}
                        className={`${buttonBaseClass} ${filter === tier ? buttonActiveClass : ''}`}
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
                            isNeobrutalist={isNeobrutalist}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Botão Ver Regras */}
            {onViewRules && (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <motion.button
                        className={buttonBaseClass}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onViewRules}
                    >
                        <BookOpen size={18} />
                        Ver Regras dos Badges
                    </motion.button>
                </div>
            )}

            {/* Modal de Badge Selecionado */}
            <AnimatePresence>
                {selectedBadge && (
                    <BadgeModal
                        badge={selectedBadge}
                        lang={lang}
                        onClose={() => setSelectedBadge(null)}
                        isNeobrutalist={isNeobrutalist}
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
    isNeobrutalist = true,
}: {
    badgeProgress: BadgeProgress;
    lang: 'pt' | 'en' | 'es';
    onClick: () => void;
    isNeobrutalist?: boolean;
}) {
    const { badge, isUnlocked, progress } = badgeProgress;

    // Estilos dinâmicos baseados no tema
    const cardStyle = isNeobrutalist
        ? {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            padding: '1rem',
            border: `3px solid ${isUnlocked ? '#E63946' : '#000'}`,
            boxShadow: '4px 4px 0 #000',
            cursor: 'pointer',
            opacity: badge.isSecret && !isUnlocked ? 0.4 : 1,
            background: 'white',
        }
        : {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            padding: '1rem',
            border: `2px solid ${isUnlocked ? 'rgba(59, 130, 246, 0.5)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            opacity: badge.isSecret && !isUnlocked ? 0.4 : 1,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
        };

    const iconStyle = isNeobrutalist
        ? { marginBottom: '0.5rem' }
        : {
            marginBottom: '0.5rem',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            borderRadius: '50%',
            background: isUnlocked
                ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
            boxShadow: isUnlocked ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
        };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={cardStyle}
        >
            {/* Ícone */}
            <div
                className={isNeobrutalist ? `brutal-badge brutal-badge-${badge.tier} ${!isUnlocked ? 'brutal-badge-locked' : ''}` : ''}
                style={iconStyle}
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
                            background: isNeobrutalist ? '#F5F5F5' : '#e5e7eb',
                            border: isNeobrutalist ? '1px solid #000' : 'none',
                            borderRadius: isNeobrutalist ? '0' : '3px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: isNeobrutalist ? '#E63946' : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                                borderRadius: isNeobrutalist ? '0' : '3px',
                                transition: 'width 0.3s',
                            }}
                        />
                    </div>
                    <p style={{ fontSize: '0.625rem', textAlign: 'center', marginTop: '0.25rem', color: isNeobrutalist ? '#000' : '#6b7280' }}>
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
    isNeobrutalist = true,
}: {
    badge: Badge;
    lang: 'pt' | 'en' | 'es';
    onClose: () => void;
    isNeobrutalist?: boolean;
}) {
    // Estilos do modal baseados no tema
    const modalStyle = isNeobrutalist
        ? {
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center' as const,
            padding: '2rem',
            background: 'white',
            border: '4px solid #000',
            boxShadow: '8px 8px 0 #000',
        }
        : {
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center' as const,
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
        };

    const iconContainerStyle = isNeobrutalist
        ? {
            width: '120px',
            height: '120px',
            fontSize: '3rem',
            margin: '0 auto 1rem',
        }
        : {
            width: '120px',
            height: '120px',
            fontSize: '3rem',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
        };

    const rewardBoxStyle = isNeobrutalist
        ? {
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#F5F5F5',
            border: '2px solid #000',
        }
        : {
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(34, 197, 94, 0.3)',
        };

    const buttonStyle = isNeobrutalist
        ? {
            marginTop: '1.5rem',
            width: '100%',
            padding: '0.75rem 1.5rem',
            background: 'white',
            border: '3px solid #000',
            boxShadow: '4px 4px 0 #000',
            fontWeight: 700,
            cursor: 'pointer',
        }
        : {
            marginTop: '1.5rem',
            width: '100%',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            border: 'none',
            borderRadius: '0.75rem',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        };

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
                backdropFilter: 'blur(4px)',
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
                style={modalStyle}
            >
                {/* Ícone grande */}
                <div
                    className={isNeobrutalist ? `brutal-badge brutal-badge-${badge.tier}` : ''}
                    style={iconContainerStyle}
                >
                    {badge.icon}
                </div>

                {/* Nome e Tier */}
                <h3
                    className={isNeobrutalist ? "brutal-title brutal-title-md" : ""}
                    style={isNeobrutalist ? {} : { fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}
                >
                    {badge.name[lang]}
                </h3>
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
                <p style={{ marginTop: '1rem', lineHeight: 1.5, color: isNeobrutalist ? '#000' : '#4b5563' }}>
                    {badge.description[lang]}
                </p>

                {/* Recompensa */}
                <div style={rewardBoxStyle}>
                    <p style={{ fontWeight: 700 }}>
                        Recompensa: <span style={{ color: '#228B22' }}>+{badge.rewardsCredits} créditos</span>
                    </p>
                </div>

                {/* Botão Fechar */}
                <motion.button
                    className={isNeobrutalist ? "brutal-button" : ""}
                    style={buttonStyle}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                >
                    {isNeobrutalist ? 'FECHAR' : 'Fechar'}
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

export { BadgeGallery };
