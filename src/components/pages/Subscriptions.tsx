import { useState, useEffect } from 'react';
import { useSubscriptions, Subscription } from '../../hooks/useSubscriptions';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
    Mail, RefreshCw, Loader2, AlertCircle, Search, Zap, Check, X
} from 'lucide-react';
import { mockSubscriptions } from '../../lib/mockData';
import { getAccessToken } from '../../lib/api';
import { showToast } from '../../lib/toast';
import { useRatelFurioso } from '../../hooks/useRatelFurioso';
import { RatelFuriosoModal } from '../RatelFuriosoModal';

export function SubscriptionsPage() {
    const { subscriptions: realSubscriptions, loading, error, fetchSubscriptions, deleteAll, unsubscribe, removeSubscription } = useSubscriptions();

    const [isDemoMode, setIsDemoMode] = useState(false);
    const [demoSubscriptions, setDemoSubscriptions] = useState(mockSubscriptions);
    const [showRatelFurioso, setShowRatelFurioso] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'emails'>('emails');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const itemsPerPage = 50;
    const ratelFurioso = useRatelFurioso();

    useEffect(() => {
        const hasToken = getAccessToken();
        setIsDemoMode(!hasToken);
        if (hasToken) {
            fetchSubscriptions().catch(console.error);
        }
    }, [fetchSubscriptions]);

    const allSubscriptions = isDemoMode ? demoSubscriptions : realSubscriptions;

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
            if (isDemoMode) {
                await new Promise(resolve => setTimeout(resolve, 800));
                setDemoSubscriptions(prev => prev.filter(s => s.id !== sub.id));
                showToast(`Inscrição cancelada: ${sub.name}`, 'success');
            } else {
                await unsubscribe(sub);
                await deleteAll(sub.emailIds);
                removeSubscription(sub.id);
                showToast(`Inscrição cancelada e emails removidos: ${sub.name}`, 'success');
            }
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
            if (isDemoMode) {
                setDemoSubscriptions([]);
            }
            showToast('🦡 Ratel Furioso completado! Todas as inscrições removidas.', 'success');
        } catch (e) {
            showToast('Erro ao executar Ratel Furioso', 'error');
        }
        setShowRatelFurioso(false);
    };

    // Loading
    if (loading && subscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Analisando seus emails...</p>
                <p className="text-sm text-muted-foreground">Identificando newsletters e inscrições</p>
            </div>
        );
    }

    // Error
    if (error && subscriptions.length === 0) {
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Listas de e-mail</h1>
                    <p className="text-muted-foreground text-sm">
                        {allSubscriptions.length} listas encontradas
                    </p>
                </div>
                <Button
                    onClick={() => setShowRatelFurioso(true)}
                    className="bg-red-600 hover:bg-red-700 text-white gap-2"
                    disabled={ratelFurioso.loading}
                >
                    {ratelFurioso.loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Zap className="h-4 w-4" />
                    )}
                    Cancelar inscrição de TUDO
                </Button>
            </div>

            {/* Search & Sort Bar */}
            <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Procurar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'emails')}
                    className="px-3 py-2 rounded-lg border bg-background text-sm"
                >
                    <option value="emails">↓ Mais recente</option>
                    <option value="recent">↑ Mais antigo</option>
                </select>
                <Button variant="outline" size="sm" onClick={() => fetchSubscriptions()} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
            </div>

            {/* Subscription List - Clean Inbox Zapper Style */}
            <div className="space-y-2">
                {subscriptions.map((sub) => (
                    <div
                        key={sub.id}
                        className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md transition-all"
                    >
                        {/* Avatar */}
                        <Avatar className={`h-12 w-12 ${sub.color}`}>
                            <AvatarFallback className="text-white font-bold bg-transparent text-lg">
                                {sub.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{sub.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{sub.email}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {sub.count} e-mails
                            </p>
                        </div>

                        {/* Action Buttons - Prominent like Inbox Zapper */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                                onClick={() => handleKeep(sub)}
                            >
                                <Check className="h-4 w-4" />
                                Manter
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleUnsubscribe(sub)}
                                disabled={actionLoading === `unsub-${sub.id}`}
                            >
                                {actionLoading === `unsub-${sub.id}` ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <X className="h-4 w-4" />
                                )}
                                Cancelar inscrição
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
