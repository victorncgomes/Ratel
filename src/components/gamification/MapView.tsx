
/**
 * RATEL - MapView (Dashboard Reloaded)
 * Estilo Minimalista / Gamificado (Inspired by Duolingo)
 * Agora focado apenas em Stats e Achievements (Sem Mapa)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgression } from '../../hooks/useProgression';
import { useAchievements } from '../../hooks/useAchievements';
import { useCredits } from '../../hooks/useCredits';
import { useLanguage } from '../../contexts/LanguageContext';
import CreditsDisplay from './CreditsDisplay';
import AchievementsGallery from './AchievementsGallery';
import '../../styles/neobrutalism.css';

export default function MapView() {
    const { userProgress } = useProgression();
    const { unlocked, total } = useAchievements();
    const { } = useCredits();
    const { language } = useLanguage();
    // Mapa removido
    // Badges recolhidos por padrao
    const [showAchievements, setShowAchievements] = useState(false);

    const lang = (language === 'pt' || language === 'en' || language === 'es') ? language : 'pt';

    const labels = {
        pt: {
            title: 'DASHBOARD',
            stats: 'Estatísticas',
            deleted: 'emails eliminados',
            unsubs: 'newsletters canceladas',
            streak: 'dias de streak',
            viewAchievements: 'Conquistas',
        },
        en: {
            title: 'DASHBOARD',
            stats: 'Statistics',
            deleted: 'emails deleted',
            unsubs: 'newsletters cancelled',
            streak: 'streak days',
            viewAchievements: 'Achievements',
        },
        es: {
            title: 'DASHBOARD',
            stats: 'Estadísticas',
            deleted: 'emails eliminados',
            unsubs: 'newsletters canceladas',
            streak: 'días de racha',
            viewAchievements: 'Logros',
        },
    };

    const l = labels[lang];

    return (
        <div style={{ minHeight: '100vh', padding: '1.5rem', background: '#FFFFFF' }}>
            {/* Header Simplificado */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="font-heading font-black text-3xl uppercase tracking-wider" style={{ color: '#E63946' }}>
                    {l.title}
                </h1>
                <CreditsDisplay compact />
            </div>

            {/* Stats Bar (Minimalista) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatBox icon="📧" value={userProgress.emailsDeleted} label={l.deleted} />
                <StatBox icon="📰" value={userProgress.unsubscribes} label={l.unsubs} />
                <StatBox icon="🔥" value={userProgress.currentStreak} label={l.streak} />
                <StatBox
                    icon="🏆"
                    value={`${unlocked.length}/${total}`}
                    label={l.viewAchievements}
                    onClick={() => setShowAchievements(!showAchievements)}
                    highlight
                />
            </div>

            {/* Achievements Gallery (Collapsible) */}
            <AnimatePresence>
                {showAchievements && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', marginBottom: '2rem' }}
                    >
                        <AchievementsGallery />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Placeholder para conteúdo futuro ou apenas espaco em branco */}
            <div className="py-8 text-center text-gray-400 text-sm">
                Stats Overview
            </div>
        </div>
    );
}

// Componente StatBox Refinado
function StatBox({ icon, value, label, onClick, highlight }: { icon: string; value: number | string; label: string; onClick?: () => void; highlight?: boolean }) {
    return (
        <div
            onClick={onClick}
            className={`
                p-4 border-2 border-black bg-white shadow-[4px_4px_0_0_#000]
                flex flex-col items-center justify-center text-center
                transition-all duration-200
                ${onClick ? 'cursor-pointer hover:translate-y-1 active:translate-y-2 active:shadow-none' : ''}
                ${highlight ? 'bg-yellow-100' : ''}
            `}
        >
            <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{icon}</span>
                <span className="text-xl font-black">{value}</span>
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{label}</p>
        </div>
    );
}
