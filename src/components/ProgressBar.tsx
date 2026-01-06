/**
 * Progress Bar Component - Fixed in header with The Sims-style funny messages
 */

import { useProgress } from '../contexts/ProgressContext';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function ProgressBar() {
    const {
        isLoading,
        progress,
        phase,
        emailsLoaded,
        totalEmails,
        currentMessage,
        error
    } = useProgress();

    // Don't render when idle and not loading
    if (phase === 'idle' && !isLoading && !error) return null;

    const isComplete = phase === 'complete';

    return (
        <div
            className={cn(
                "fixed top-16 left-0 right-0 z-50 transition-all duration-500",
                isComplete && "opacity-0 pointer-events-none",
                error && "animate-shake"
            )}
        >
            {/* Glass container */}
            <div className="bg-background/80 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Progress bar line */}
                    <div className="h-1 bg-secondary/30 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-300 ease-out",
                                error
                                    ? "bg-red-500"
                                    : "bg-gradient-to-r from-primary via-blue-500 to-primary animate-pulse"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Info row */}
                    <div className="py-2 flex items-center justify-between gap-4">
                        {/* Left: Status and counter */}
                        <div className="flex items-center gap-3 min-w-0">
                            {error ? (
                                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            ) : isComplete ? (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : (
                                <Loader2 className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
                            )}

                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">
                                    {error
                                        ? "Erro"
                                        : isComplete
                                            ? "Concluído!"
                                            : `${progress}%`
                                    }
                                </span>

                                {!error && totalEmails > 0 && (
                                    <span className="text-muted-foreground hidden sm:inline">
                                        ({emailsLoaded.toLocaleString()}/{totalEmails.toLocaleString()} emails)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Center: Funny message */}
                        <div className="flex-1 text-center hidden md:block">
                            <p className="text-sm text-muted-foreground italic truncate animate-fade-in">
                                {error || currentMessage}
                            </p>
                        </div>

                        {/* Right: Phase indicator */}
                        <div className="text-xs text-muted-foreground hidden lg:block">
                            {phase === 'fetching' && '📥 Buscando...'}
                            {phase === 'processing' && '⚙️ Processando...'}
                            {phase === 'scoring' && '🧠 Calculando RATE...'}
                            {phase === 'complete' && '✅ Pronto!'}
                        </div>
                    </div>

                    {/* Mobile funny message */}
                    <div className="md:hidden pb-2">
                        <p className="text-xs text-muted-foreground italic truncate text-center">
                            {error || currentMessage}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
