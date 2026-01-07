import { Button } from './ui/Button';
import { Trash2, Ban, AlertTriangle, MailMinus, Layers } from 'lucide-react';

interface BulkActionsToolbarProps {
    selectedCount: number;
    showUnsubscribe?: boolean;
    onDelete: () => void;
    onBlock: () => void;
    onSpam: () => void;
    onUnsubscribe?: () => void;
    onRollup?: () => void;
    loading?: boolean;
}

export function BulkActionsToolbar({
    selectedCount,
    showUnsubscribe = false,
    onDelete,
    onBlock,
    onSpam,
    onUnsubscribe,
    onRollup,
    loading = false
}: BulkActionsToolbarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="glass-card rounded-sm p-3 mb-4 flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                    <span className="text-primary font-bold">{selectedCount}</span>
                    {' '}email{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    disabled={loading}
                    className="gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/10 hover:border-red-500"
                >
                    <Trash2 className="h-4 w-4" />
                    Deletar
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onBlock}
                    disabled={loading}
                    className="gap-1.5 border-orange-500/30 text-orange-600 hover:bg-orange-500/10 hover:border-orange-500"
                >
                    <Ban className="h-4 w-4" />
                    Bloquear
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onSpam}
                    disabled={loading}
                    className="gap-1.5 border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10 hover:border-yellow-500"
                >
                    <AlertTriangle className="h-4 w-4" />
                    Spam
                </Button>

                {onRollup && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRollup}
                        disabled={loading}
                        className="gap-1.5 border-blue-500/30 text-blue-600 hover:bg-blue-500/10 hover:border-blue-500"
                    >
                        <Layers className="h-4 w-4" />
                        Rollup
                    </Button>
                )}

                {showUnsubscribe && onUnsubscribe && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onUnsubscribe}
                        disabled={loading}
                        className="gap-1.5 border-purple-500/30 text-purple-600 hover:bg-purple-500/10 hover:border-purple-500"
                    >
                        <MailMinus className="h-4 w-4" />
                        Cancelar Inscrição
                    </Button>
                )}
            </div>
        </div>
    );
}
