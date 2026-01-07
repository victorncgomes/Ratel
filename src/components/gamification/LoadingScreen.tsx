/**
 * RATEL - LoadingScreen
 * Tela de carregamento com frases engraçadas e barra de progresso
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { getRandomFunnyMessage, TOTAL_FUNNY_MESSAGES } from '../../lib/gamification/funnyMessages';
import '../../styles/neobrutalism.css';

interface LoadingScreenProps {
    progress: number; // 0-100
    emailsLoaded: number;
    totalEmails: number;
    isVisible: boolean;
    onComplete?: () => void;
}

export default function LoadingScreen({
    progress,
    emailsLoaded,
    totalEmails,
    isVisible,
    onComplete,
}: LoadingScreenProps) {
    const { language } = useLanguage();
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageKey, setMessageKey] = useState(0);

    // Idioma para frases
    const lang = (language === 'pt' || language === 'en' || language === 'es') ? language : 'pt';

    // Rotacionar mensagens a cada 3 segundos
    useEffect(() => {
        if (!isVisible) return;

        const updateMessage = () => {
            setCurrentMessage(getRandomFunnyMessage(lang));
            setMessageKey(prev => prev + 1);
        };

        // Mensagem inicial
        updateMessage();

        // Intervalo de rotação
        const interval = setInterval(updateMessage, 3000);

        return () => clearInterval(interval);
    }, [isVisible, lang]);

    // Callback quando completo
    useEffect(() => {
        if (progress >= 100 && onComplete) {
            const timeout = setTimeout(onComplete, 500);
            return () => clearTimeout(timeout);
        }
    }, [progress, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="brutal-loading"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '2rem',
                    }}
                >
                    {/* Mascote Animado */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <img
                            src="/ratel.svg"
                            alt="Ratel"
                            style={{ width: '120px', height: '120px' }}
                        />
                    </motion.div>

                    {/* Título */}
                    <h1
                        className="brutal-title brutal-title-lg"
                        style={{
                            marginBottom: '1.5rem',
                            textAlign: 'center',
                        }}
                    >
                        🦡 RATEL
                    </h1>

                    {/* Container da Barra de Progresso */}
                    <div
                        className="brutal-card"
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            padding: '1.5rem',
                            marginBottom: '1rem',
                        }}
                    >
                        {/* Barra de Progresso */}
                        <div
                            className="brutal-progress"
                            style={{ marginBottom: '1rem' }}
                        >
                            <motion.div
                                className="brutal-progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            >
                                {progress > 10 && `${Math.round(progress)}%`}
                            </motion.div>
                        </div>

                        {/* Contador de Emails */}
                        <p
                            style={{
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize: '1.125rem',
                            }}
                        >
                            {emailsLoaded.toLocaleString()} / {totalEmails.toLocaleString()} emails
                        </p>
                    </div>

                    {/* Mensagem Engraçada */}
                    <div
                        className="brutal-card"
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            minHeight: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={messageKey}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    lineHeight: 1.4,
                                }}
                            >
                                {currentMessage}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Rodapé */}
                    <p
                        style={{
                            marginTop: '1.5rem',
                            fontSize: '0.875rem',
                            opacity: 0.6,
                        }}
                    >
                        {TOTAL_FUNNY_MESSAGES} frases • Carregando até 10.000 emails
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export { LoadingScreen };
