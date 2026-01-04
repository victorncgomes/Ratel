import { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Badge } from './ui/badge';
import { AlertTriangle, Loader2, Zap } from 'lucide-react';

interface RatelFuriosoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (deleteHistory: boolean) => void;
    selectedCount: number;
    loading: boolean;
    progress: number;
}

export function RatelFuriosoModal({
    isOpen,
    onClose,
    onConfirm,
    selectedCount,
    loading,
    progress
}: RatelFuriosoModalProps) {
    const [deleteHistory, setDeleteHistory] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(deleteHistory);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md mx-4 border-red-500/50 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <img src="/ratel.svg" className="h-8 w-8" alt="Ratel" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                🦡 Ratel Furioso
                                <Badge className="bg-yellow-500 text-black">EXTREMO</Badge>
                            </CardTitle>
                            <CardDescription className="text-white/90">
                                Modo de limpeza em massa
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {!loading ? (
                        <>
                            {/* Aviso */}
                            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-red-900 dark:text-red-100">
                                        Atenção! Esta ação é irreversível.
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                        Você está prestes a cancelar <strong>{selectedCount} inscrições</strong> de uma só vez.
                                        O Ratel não negocia. O que não serve, sai.
                                    </p>
                                </div>
                            </div>

                            {/* Opção de deletar histórico */}
                            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={deleteHistory}
                                    onChange={(e) => setDeleteHistory(e.target.checked)}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-medium">Deletar histórico de emails também</p>
                                    <p className="text-sm text-muted-foreground">
                                        Remove todos os emails antigos dessas inscrições (recomendado)
                                    </p>
                                </div>
                            </label>

                            {/* Estatísticas */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Inscrições</p>
                                    <p className="text-2xl font-bold text-red-600">{selectedCount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tempo estimado</p>
                                    <p className="text-2xl font-bold">{Math.ceil(selectedCount * 0.5)}s</p>
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
                                >
                                    <Zap className="h-4 w-4" />
                                    Executar Fúria
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Progress */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <div className="relative">
                                        <Loader2 className="h-16 w-16 text-red-600 animate-spin" />
                                        <img
                                            src="/ratel.svg"
                                            className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                            alt="Ratel"
                                        />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-lg font-semibold">Ratel em ação...</p>
                                    <p className="text-sm text-muted-foreground">
                                        Cancelando inscrições indesejadas
                                    </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progresso</span>
                                        <span className="font-medium">{progress}%</span>
                                    </div>
                                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <p className="text-xs text-center text-muted-foreground">
                                    Não feche esta janela...
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
