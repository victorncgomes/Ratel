
/**
 * RATEL - MapView (Dashboard Reloaded)
 * Estilo Minimalista / Gamificado (Inspired by Duolingo)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgression } from '../../hooks/useProgression';
import { useAchievements } from '../../hooks/useAchievements';
import { useCredits } from '../../hooks/useCredits';
import { useLanguage } from '../../contexts/LanguageContext';
import TerritoryNode from './TerritoryNode';
import CreditsDisplay from './CreditsDisplay';
import AchievementsGallery from './AchievementsGallery';
import { Territory } from '../../lib/gamification/territories';
import '../../styles/neobrutalism.css';

export default function MapView() {
    const { userProgress, territories, getTerritoryProgress, checkCanAdvance, advanceTerritory } = useProgression();
    const { unlocked, total } = useAchievements();
    const { } = useCredits();
    const { language } = useLanguage();
    const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
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
            advance: 'AVANÇAR!',
            requirements: 'Requisitos',
            enemies: 'Inimigos',
            reward: 'Recompensa',
        },
        en: {
            title: 'DASHBOARD',
            stats: 'Statistics',
            deleted: 'emails deleted',
            unsubs: 'newsletters cancelled',
            streak: 'streak days',
            viewAchievements: 'Achievements',
            advance: 'ADVANCE!',
            requirements: 'Requirements',
            enemies: 'Enemies',
            reward: 'Reward',
        },
        es: {
            title: 'DASHBOARD',
            stats: 'Estadísticas',
            deleted: 'emails eliminados',
            unsubs: 'newsletters canceladas',
            streak: 'días de racha',
            viewAchievements: 'Logros',
            advance: '¡AVANZAR!',
            requirements: 'Requisitos',
            enemies: 'Enemigos',
            reward: 'Recompensa',
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

            {/* Jornada (Path) - Layout Horizontal Super Mario */}
            <div className="py-8 overflow-x-auto">
                {/* Linha de guia horizontal */}
                <div className="relative min-w-max flex items-center justify-center px-8">
                    <div className="absolute left-8 right-8 h-2 bg-gray-200 border-2 border-black top-1/2 -translate-y-1/2 -z-10" />

                    <div className="flex flex-row gap-8 items-center">
                        {territories.map((territory, index) => {
                            const isActive = index === userProgress.currentTerritoryIndex;
                            const isCompleted = index < userProgress.currentTerritoryIndex;
                            const isLocked = index > userProgress.currentTerritoryIndex;
                            const progress = isActive ? getTerritoryProgress() : isCompleted ? 100 : 0;

                            return (
                                <React.Fragment key={territory.id}>
                                    <div className="relative flex flex-col items-center">
                                        <TerritoryNode
                                            territory={territory}
                                            index={index}
                                            isActive={isActive}
                                            isCompleted={isCompleted}
                                            isLocked={isLocked}
                                            progress={progress}
                                            onClick={() => setSelectedTerritory(territory)}
                                        />

                                        {/* Botão Avançar abaixo do nó ativo */}
                                        {isActive && checkCanAdvance() && (
                                            <motion.button
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="mt-4 brutal-button brutal-button-success whitespace-nowrap z-20"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    advanceTerritory();
                                                }}
                                            >
                                                {l.advance} ➔
                                            </motion.button>
                                        )}
                                    </div>

                                    {/* Conector entre territórios */}
                                    {index < territories.length - 1 && (
                                        <div className={`w-12 h-2 ${isCompleted ? 'bg-[#228B22]' : 'bg-gray-300'} border-2 border-black`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modais */}
            <AnimatePresence>
                {selectedTerritory && (
                    <TerritoryModal
                        territory={selectedTerritory}
                        lang={lang}
                        labels={l}
                        onClose={() => setSelectedTerritory(null)}
                    />
                )}
            </AnimatePresence>
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

// Modal de Território (Mantido com ajustes visuais)
function TerritoryModal({
    territory,
    lang,
    labels,
    onClose,
}: {
    territory: Territory;
    lang: 'pt' | 'en' | 'es';
    labels: any;
    onClose: () => void;
}) {
    const enemyLabels: Record<string, { pt: string; en: string; es: string }> = {
        chacal: { pt: 'Chacal (Phishing)', en: 'Jackal (Phishing)', es: 'Chacal (Phishing)' },
        leao: { pt: 'Leão (Marketing)', en: 'Lion (Marketing)', es: 'León (Marketing)' },
        tigre: { pt: 'Tigre (Promoções)', en: 'Tiger (Promotions)', es: 'Tigre (Promociones)' },
        elefante: { pt: 'Elefante (Corporações)', en: 'Elephant (Corporations)', es: 'Elefante (Corporaciones)' },
        todos: { pt: 'Todos os Inimigos', en: 'All Enemies', es: 'Todos los Enemigos' },
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 relative overflow-hidden"
            >
                {/* Background color strip */}
                <div style={{ background: territory.color }} className="absolute top-0 left-0 right-0 h-24 -z-0 border-b-4 border-black" />

                <div className="relative z-10 pt-8 text-center">
                    <div className="bg-white border-4 border-black inline-flex p-4 rounded-full shadow-[4px_4px_0_0_#000] mb-4">
                        <span className="text-5xl">{territory.icon}</span>
                    </div>

                    <h2 className="font-heading font-black text-2xl mb-2">{territory.name[lang]}</h2>
                    <p className="text-sm font-medium text-muted-foreground mb-6">{territory.description[lang]}</p>

                    <div className="space-y-4 text-left">
                        {/* Requisitos */}
                        <div className="bg-gray-100 p-4 border-2 border-black rounded-lg">
                            <h3 className="font-bold text-sm uppercase mb-2">🎯 {labels.requirements}</h3>
                            <div className="flex justify-between text-sm">
                                <span>Emails</span>
                                <span className="font-bold">{territory.emailsRequired === Infinity ? '∞' : territory.emailsRequired}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Unsubscribes</span>
                                <span className="font-bold">{territory.unsubscribesRequired === Infinity ? '∞' : territory.unsubscribesRequired}</span>
                            </div>
                        </div>

                        {/* Inimigos */}
                        <div className="bg-gray-100 p-4 border-2 border-black rounded-lg">
                            <h3 className="font-bold text-sm uppercase mb-2">👾 {labels.enemies}</h3>
                            <div className="flex flex-wrap gap-2">
                                {territory.enemies.map(enemy => (
                                    <span key={enemy} className="text-xs bg-white px-2 py-1 border border-black rounded font-bold">
                                        {enemyLabels[enemy]?.[lang] || enemy}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-6 w-full py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
