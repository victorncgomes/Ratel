import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingScreenProps {
    onComplete: () => void;
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        'Conectando à sua conta...',
        'Analisando sua caixa de entrada...',
        'Detectando newsletters e inscrições...',
        'Calculando estatísticas...',
        'Preparando seu painel...'
    ];

    useEffect(() => {
        // Simular progresso
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 60);

        // Atualizar step baseado no progresso
        const stepInterval = setInterval(() => {
            setCurrentStep(() => {
                const newStep = Math.floor(progress / 20);
                return Math.min(newStep, steps.length - 1);
            });
        }, 100);

        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, [onComplete, progress, steps.length]);

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
                    <h2 className="text-2xl font-bold">Processando seus emails...</h2>
                    <p className="text-muted-foreground text-sm">
                        {steps[currentStep]}
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
