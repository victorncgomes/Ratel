import { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

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
    const [deleteHistory, setDeleteHistory] = useState(true);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(deleteHistory);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <Card variant="glass" className="w-full max-w-md mx-4 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Cancelar Todas as Inscrições
                    </CardTitle>
                    <CardDescription>
                        Confirme para remover {selectedCount} inscrições da sua caixa
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    {!loading ? (
                        <>
                            {/* Warning */}
                            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-destructive">
                                        Esta ação não pode ser desfeita.
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Você será removido de <strong>{selectedCount} listas</strong> de email.
                                    </p>
                                </div>
                            </div>

                            {/* Delete history option */}
                            <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-secondary/30 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={deleteHistory}
                                    onChange={(e) => setDeleteHistory(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div>
                                    <p className="font-medium">Deletar emails antigos também</p>
                                    <p className="text-sm text-muted-foreground">
                                        Remove todos os emails dessas inscrições (recomendado)
                                    </p>
                                </div>
                            </label>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Voltar
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    variant="destructive"
                                    className="flex-1 gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Confirmar
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Progress */}
                            <div className="space-y-4 py-4">
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                </div>

                                <div className="text-center">
                                    <p className="text-lg font-semibold">Processando...</p>
                                    <p className="text-sm text-muted-foreground">
                                        Cancelando inscrições selecionadas
                                    </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progresso</span>
                                        <span className="font-medium">{progress}%</span>
                                    </div>
                                    <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-300 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <p className="text-xs text-center text-muted-foreground">
                                    Por favor, aguarde...
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
