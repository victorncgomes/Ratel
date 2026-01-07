import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ProcessingScreenProps {
    onComplete: () => void;
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
    // Agora consome o estado global do contexto!
    const { progress, phase, currentMessage } = useProgress();
    const { language } = useLanguage();

    const getPhaseMessage = () => {
        switch (phase) {
            case 'fetching': return 'Conectando ao servidor...';
            case 'processing': return 'Analisando sua caixa de entrada...';
            case 'scoring': return 'Calculando relevância dos emails...';
            case 'complete': return 'Finalizando...';
            default: return 'Preparando...';
        }
    };

    // Auto-complete quando terminar globalmente
    // Nota: A lógica de fechar está no App.tsx via (showProcessing || isGlobalLoading)
    // Mas o onComplete aqui pode ser chamado se o componente quiser forçar.
    // Deixamos o controle visual apenas.

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="glass-card rounded-2xl p-8 max-w-md w-full space-y-6 animate-in fade-in zoom-in-95 duration-500">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src="/name-ratel.svg?v=3"
                        alt="Ratel"
                        className="h-12 object-contain"
                    />
                </div>

                {/* Spinner */}
                <div className="flex justify-center">
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                </div>

                {/* Current Step */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold mb-4">{getPhaseMessage()}</h2>
                    <p className="text-slate-600 text-lg font-medium animate-pulse min-h-[60px]">
                        "{currentMessage}"
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                        {progress}%
                    </p>
                </div>

                {/* Info */}
                <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-center text-muted-foreground">
                        Isso pode levar alguns segundos. Não feche esta janela.
                    </p>
                </div>
            </div>
        </div>
    );
}
