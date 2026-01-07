import { useState, useEffect } from 'react';
import { useSubscriptions, Subscription } from '../../hooks/useSubscriptions';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
    Mail, RefreshCw, Loader2, AlertCircle, Search, Zap, Check, X
} from 'lucide-react';
import { getAccessToken } from '../../lib/api';
import { showToast } from '../../lib/toast';
import { useRatelFurioso } from '../../hooks/useRatelFurioso';
import { RatelFuriosoModal } from '../RatelFuriosoModal';
import { useStyleTheme } from '../../contexts/StyleThemeContext';

export function SubscriptionsPage() {
    const {
        subscriptions: allSubscriptions,
        loading,
        error,
        fetchSubscriptions,
        deleteAll,
        unsubscribe,
        removeSubscription
    } = useSubscriptions();

    const [isDemoMode, setIsDemoMode] = useState(false);
    const [showRatelFurioso, setShowRatelFurioso] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'emails'>('emails');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const itemsPerPage = 50;
    const ratelFurioso = useRatelFurioso();
    const { isNeobrutalist } = useStyleTheme();

    useEffect(() => {
        const hasToken = getAccessToken();
        setIsDemoMode(!hasToken);
        fetchSubscriptions().catch(console.error);
    }, [fetchSubscriptions]);

    // Filter and sort
    const filteredSubscriptions = allSubscriptions
        .filter(sub =>
            sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => sortBy === 'emails' ? b.count - a.count : 0);

    const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
    const subscriptions = filteredSubscriptions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleKeep = async (sub: Subscription) => {
        showToast(`${sub.name} mantida ✓`, 'success');
        removeSubscription(sub.id);
    };

    const handleUnsubscribe = async (sub: Subscription) => {
        setActionLoading(`unsub-${sub.id}`);
        try {
            await unsubscribe(sub);
            if (!isDemoMode) {
                await deleteAll(sub.emailIds);
            }
            removeSubscription(sub.id);
            showToast(`Inscrição cancelada: ${sub.name}`, 'success');
        } catch (e) {
            console.error(e);
            showToast('Erro ao cancelar inscrição', 'error');
        }
        setActionLoading(null);
    };

    const handleRatelFurioso = async (deleteHistory: boolean) => {
        const allIds = allSubscriptions.map(s => s.id);
        try {
            await ratelFurioso.execute(allIds, deleteHistory);
            // Re-fetch or clear local state
            fetchSubscriptions();
            showToast('🦡 Ratel Furioso completado! Todas as inscrições removidas.', 'success');
        } catch (e) {
            showToast('Erro ao executar Ratel Furioso', 'error');
        }
        setShowRatelFurioso(false);
    };

    // Loading
    if (loading && allSubscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Analisando seus emails...</p>
                <p className="text-sm text-muted-foreground">Identificando newsletters e inscrições</p>
            </div>
        );
    }

    // Error
    if (error && allSubscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-lg font-medium">Erro ao carregar inscrições</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => fetchSubscriptions()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar novamente
                </Button>
            </div>
        );
    }

    // Empty
    if (!loading && allSubscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <Mail className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">🎉 Inbox Zero!</p>
                <p className="text-sm text-muted-foreground mb-4">Nenhuma inscrição encontrada. Sua caixa está limpa!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search & Actions Bar */}
            <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Procurar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm transition-all ${isNeobrutalist
                            ? 'border-2 border-black shadow-[2px_2px_0_0_#000] bg-white focus:shadow-[3px_3px_0_0_#000]'
                            : 'rounded-sm border bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-background'}`}
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'emails')}
                    className={`px-4 py-2.5 text-sm ${isNeobrutalist
                        ? 'border-2 border-black shadow-[2px_2px_0_0_#000] bg-white focus:shadow-[3px_3px_0_0_#000]'
                        : 'rounded-sm border bg-background/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50'}`}
                >
                    <option value="emails">↓ Mais relevante</option>
                    <option value="recent">↑ Ordem alfabética</option>
                </select>
                <Button variant="glass" size="icon" onClick={() => fetchSubscriptions()} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
                <Button
                    onClick={() => setShowRatelFurioso(true)}
                    variant="destructive"
                    className="gap-2"
                    disabled={ratelFurioso.loading}
                >
                    {ratelFurioso.loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Zap className="h-4 w-4" />
                    )}
                    Cancelar Tudo
                </Button>
            </div>

            {/* Subscription List */}
            <div className="space-y-2">
                {subscriptions.map((sub) => (
                    <div
                        key={sub.id}
                        className={`flex items-center gap-4 p-4 transition-all ${isNeobrutalist
                            ? 'border-4 border-black shadow-[4px_4px_0_0_#000] bg-white hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1'
                            : 'glass-card rounded-sm hover:shadow-lg'}`}
                    >
                        {/* Avatar */}
                        <Avatar className={`h-12 w-12 ${sub.color} shadow-lg`}>
                            <AvatarFallback className="text-white font-bold bg-transparent text-lg">
                                {sub.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate">{sub.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{sub.email}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {sub.count} e-mails
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 border-green-500/50 text-green-600 hover:bg-green-500/10 hover:text-green-700 hover:border-green-500"
                                onClick={() => handleKeep(sub)}
                            >
                                <Check className="h-4 w-4" />
                                Manter
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 border-red-500/50 text-red-600 hover:bg-red-500/10 hover:text-red-700 hover:border-red-500"
                                onClick={() => handleUnsubscribe(sub)}
                                disabled={actionLoading === `unsub-${sub.id}`}
                            >
                                {actionLoading === `unsub-${sub.id}` ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <X className="h-4 w-4" />
                                )}
                                Cancelar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    <span className="flex items-center px-4 text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Próxima
                    </Button>
                </div>
            )}

            {/* Ratel Furioso Modal */}
            <RatelFuriosoModal
                isOpen={showRatelFurioso}
                onClose={() => setShowRatelFurioso(false)}
                onConfirm={handleRatelFurioso}
                selectedCount={allSubscriptions.length}
                loading={ratelFurioso.loading}
                progress={ratelFurioso.progress || 0}
            />
        </div>
    );
}
