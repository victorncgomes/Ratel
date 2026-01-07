/**
 * RATEL - TerritoryNode
 * Nó individual do mapa de progressão
 */

// TerritoryNode - Nó individual do mapa de progressão
import { motion } from 'framer-motion';
import { Territory } from '../../lib/gamification/territories';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/neobrutalism.css';

interface TerritoryNodeProps {
    territory: Territory;
    index: number;
    isActive: boolean;
    isCompleted: boolean;
    isLocked: boolean;
    progress: number;
    onClick?: () => void;
}

export default function TerritoryNode({
    territory,
    index,
    isActive,
    isCompleted,
    isLocked,
    progress,
    onClick,
}: TerritoryNodeProps) {
    const { language } = useLanguage();
    const lang = (language === 'pt' || language === 'en' || language === 'es') ? language : 'pt';

    return (
        <motion.div
            className={`
        brutal-territory
        ${isActive ? 'brutal-territory-active' : ''}
        ${isCompleted ? 'brutal-territory-completed' : ''}
        ${isLocked ? 'brutal-territory-locked' : ''}
      `}
            whileHover={!isLocked ? { y: -8, scale: 1.05 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
            onClick={!isLocked ? onClick : undefined}
            style={{
                position: 'relative',
                width: '160px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: isCompleted ? territory.color : '#FFFFFF',
                border: `4px solid ${isActive ? '#E63946' : '#000'}`,
                boxShadow: isActive
                    ? '0 0 0 2px #E63946, 8px 8px 0 #000'
                    : '8px 8px 0 #000',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.5 : 1,
            }}
        >
            {/* Número do Território */}
            <div
                style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '-15px',
                    width: '40px',
                    height: '40px',
                    background: isCompleted ? '#228B22' : isActive ? '#E63946' : '#000',
                    border: '3px solid #000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                }}
            >
                {index + 1}
            </div>

            {/* Ícone Principal */}
            <motion.div
                animate={isActive ? { y: [0, -5, 0] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{ fontSize: '3rem', marginBottom: '0.5rem' }}
            >
                {isCompleted ? '✅' : isLocked ? '🔒' : territory.icon}
            </motion.div>

            {/* Ratel Animado (se ativo) */}
            {isActive && (
                <motion.img
                    src="/ratel.svg"
                    alt="Ratel"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        bottom: '60px',
                        width: '50px',
                        height: '50px',
                    }}
                />
            )}

            {/* Nome */}
            <p
                style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    color: isCompleted ? '#FFF' : '#000',
                    padding: '0 0.5rem',
                }}
            >
                {territory.name[lang]}
            </p>

            {/* Barra de Progresso (se ativo) */}
            {isActive && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        right: '10px',
                    }}
                >
                    <div
                        style={{
                            height: '10px',
                            background: '#F5F5F5',
                            border: '2px solid #000',
                        }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            style={{
                                height: '100%',
                                background: '#E63946',
                            }}
                        />
                    </div>
                    <p
                        style={{
                            fontSize: '0.625rem',
                            textAlign: 'center',
                            marginTop: '2px',
                            fontWeight: 700,
                        }}
                    >
                        {Math.round(progress)}%
                    </p>
                </div>
            )}

            {/* Badge Recompensa (se completado) */}
            {isCompleted && territory.rewardsBadge && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: '35px',
                        height: '35px',
                        background: '#FFD700',
                        border: '3px solid #000',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                    }}
                >
                    🏆
                </motion.div>
            )}
        </motion.div>
    );
}

export { TerritoryNode };
