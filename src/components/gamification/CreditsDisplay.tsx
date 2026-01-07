/**
 * RATEL - CreditsDisplay
 * Exibe créditos e streak do usuário
 */

// React é necessário para JSX, mas no React 17+ pode ser omitido
import { motion } from 'framer-motion';
import { useCredits } from '../../hooks/useCredits';
import { useProgression } from '../../hooks/useProgression';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/neobrutalism.css';

interface CreditsDisplayProps {
    compact?: boolean;
    showUpgradeButton?: boolean;
    onUpgradeClick?: () => void;
}

export default function CreditsDisplay({
    compact = false,
    showUpgradeButton = true,
    onUpgradeClick,
}: CreditsDisplayProps) {
    const { credits, isPro, getRemainingActions } = useCredits();
    const { userProgress } = useProgression();
    const { } = useLanguage();

    if (compact) {
        return (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {/* Créditos */}
                <motion.div
                    className="brutal-credits"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span>💰</span>
                    <span>{credits.toLocaleString()}</span>
                </motion.div>

                {/* Streak */}
                {userProgress.currentStreak > 0 && (
                    <motion.div
                        className="brutal-streak"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span>🔥</span>
                        <span>{userProgress.currentStreak}</span>
                    </motion.div>
                )}

                {/* PRO Badge */}
                {isPro && (
                    <div
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            border: '3px solid black',
                            boxShadow: '4px 4px 0 black',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                        }}
                    >
                        ⭐ PRO
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="brutal-card" style={{ padding: '1.5rem' }}>
            <h3 className="brutal-title brutal-title-md" style={{ marginBottom: '1rem' }}>
                💰 Seus Créditos
            </h3>

            {/* Créditos Total */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                }}
            >
                <motion.div
                    className="brutal-credits"
                    style={{ fontSize: '1.5rem', padding: '1rem 1.5rem' }}
                    whileHover={{ scale: 1.05 }}
                >
                    <span>💰</span>
                    <span style={{ fontSize: '2rem', fontWeight: 900 }}>
                        {credits.toLocaleString()}
                    </span>
                </motion.div>

                {isPro && (
                    <div
                        style={{
                            padding: '0.75rem 1.25rem',
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            border: '3px solid black',
                            boxShadow: '4px 4px 0 black',
                            fontWeight: 700,
                        }}
                    >
                        ⭐ CONTA PRO
                    </div>
                )}
            </div>

            {/* Streak */}
            <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>🔥 Streak</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="brutal-streak">
                        <span>Atual:</span>
                        <span style={{ fontSize: '1.25rem' }}>{userProgress.currentStreak} dias</span>
                    </div>
                    <div
                        style={{
                            padding: '0.5rem 1rem',
                            border: '3px solid black',
                            boxShadow: '4px 4px 0 black',
                            fontWeight: 700,
                        }}
                    >
                        Recorde: {userProgress.longestStreak} dias
                    </div>
                </div>
            </div>

            {/* Ações Restantes (FREE only) */}
            {!isPro && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>📊 Ações Restantes Hoje</p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '0.5rem',
                        }}
                    >
                        <ActionCounter label="Exclusões" remaining={getRemainingActions('deleteEmail')} max={10} />
                        <ActionCounter label="Spam" remaining={getRemainingActions('markAsSpam')} max={10} />
                        <ActionCounter label="Unsubscribes" remaining={getRemainingActions('unsubscribe')} max={5} />
                        <ActionCounter label="Regras" remaining={getRemainingActions('createRule')} max={1} />
                    </div>
                </div>
            )}

            {/* Botão Upgrade */}
            {showUpgradeButton && !isPro && (
                <motion.button
                    className="brutal-button brutal-button-danger"
                    style={{ width: '100%' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onUpgradeClick}
                >
                    ⬆️ FAZER UPGRADE PARA PRO
                </motion.button>
            )}
        </div>
    );
}

// Componente auxiliar para contadores de ação
function ActionCounter({
    label,
    remaining,
    max,
}: {
    label: string;
    remaining: number;
    max: number;
}) {
    const percentage = (remaining / max) * 100;
    const isLow = remaining <= 2;

    return (
        <div
            style={{
                padding: '0.5rem',
                border: '2px solid black',
                boxShadow: '3px 3px 0 black',
            }}
        >
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{label}</p>
            <p
                style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: isLow ? '#E63946' : '#000',
                }}
            >
                {remaining}/{max}
            </p>
            <div
                style={{
                    height: '4px',
                    background: '#F5F5F5',
                    marginTop: '0.25rem',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: isLow ? '#E63946' : '#000',
                        transition: 'width 0.3s',
                    }}
                />
            </div>
        </div>
    );
}

export { CreditsDisplay };
