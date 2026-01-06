import { useState } from 'react';
import { Button } from './ui/Button';
import { AlertCircle, Loader2, Zap } from 'lucide-react';

interface RatelFuriosoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (deleteHistory: boolean) => void;
    selectedCount: number;
    loading?: boolean;
    progress?: number;
}

export function RatelFuriosoModal({
    isOpen,
    onClose,
    onConfirm,
    selectedCount,
    loading = false,
    progress = 0
}: RatelFuriosoModalProps) {
    const [deleteHistory, setDeleteHistory] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass-card rounded-sm p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-sm bg-destructive/10">
                        <Zap className="h-6 w-6 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold">Ratel Furioso 🦡</h2>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-sm flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                                Atenção: Ação irreversível
                            </p>
                            <p className="text-amber-800 dark:text-amber-200">
                                Você está prestes a cancelar <strong>{selectedCount} inscrições</strong> de uma só vez.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-sm">
                        <input
                            type="checkbox"
                            id="deleteHistory"
                            checked={deleteHistory}
                            onChange={(e) => setDeleteHistory(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                            disabled={loading}
                        />
                        <label htmlFor="deleteHistory" className="text-sm cursor-pointer">
                            Também deletar todos os emails históricos dessas listas
                        </label>
                    </div>

                    {loading && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Processando...</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => onConfirm(deleteHistory)}
                            disabled={loading}
                            className="flex-1 gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                <>
                                    <Zap className="h-4 w-4" />
                                    Confirmar
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
