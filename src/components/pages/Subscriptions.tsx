
import { useState, useEffect } from 'react';
import { useSubscriptions, Subscription } from '../../hooks/useSubscriptions';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PageHeader } from '../ui/PageHeader';
import {
    Mail, Loader2, AlertCircle, Search, Zap, Check, X,
    Trash2
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

    // Calculate Stats for PageHeader
    const totalEmails = allSubscriptions.reduce((acc, sub) => acc + sub.count, 0);
    const avgConfidence = allSubscriptions.length > 0
        ? Math.round(allSubscriptions.reduce((acc, sub) => acc + (sub.confidence || 0), 0) / allSubscriptions.length)
        : 0;

    const stats = [
        {
            label: 'Total de Listas',
            value: allSubscriptions.length,
            icon: Mail,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            label: 'Emails Afetados',
            value: totalEmails,
            icon: Trash2,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        },
        {
            label: 'Precisão Média',
            value: `${avgConfidence}%`,
            icon: Zap,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        }
    ];

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
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-lg font-medium text-destructive">Erro ao carregar listas</p>
                <Button onClick={() => fetchSubscriptions()} variant="outline" className="mt-4">
                    Tentar Novamente
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="Listas & Newsletters"
                description="Gerencie suas inscrições e cancele o que não te interessa."
                stats={stats}
                action={
                    <Button
                        onClick={() => setShowRatelFurioso(true)}
                        className={`gap-2 ${isNeobrutalist
                            ? 'bg-[#E63946] text-white border-4 border-black shadow-[4px_4px_0_0_#000] font-black uppercase hover:shadow-none hover:translate-y-1'
                            : 'bg-destructive hover:bg-destructive/90 text-white'}`}
                    >
                        <Zap className="h-4 w-4" />
                        RATEL FURIOSO
                    </Button>
                }
            />

            {/* Content (Search & Grid) */}
            <div className={`flex items-center gap-4 bg-gray-50 p-4 rounded-lg border ${isNeobrutalist ? 'border-2 border-black shadow-[4px_4px_0_0_#000] rounded-none' : 'border-gray-200'}`}>
                <Search className="h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    className="bg-transparent border-none focus:outline-none flex-1 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Subscription Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriptions.map(sub => (
                    <div
                        key={sub.id}
                        className={`
                            relative group flex flex-col p-6 transition-all duration-300
                            ${actionLoading === `unsub-${sub.id}` ? 'opacity-50 pointer-events-none' : ''}
                            ${isNeobrutalist
                                ? 'bg-white border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 rounded-none'
                                : 'bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100'}
                        `}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Avatar className={`h-10 w-10 ${isNeobrutalist ? 'border-2 border-black rounded-none' : ''}`}>
                                    <AvatarImage src={sub.logo} />
                                    <AvatarFallback className={isNeobrutalist ? 'rounded-none font-bold bg-yellow-300' : ''}>
                                        {sub.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-base leading-tight line-clamp-1">{sub.name}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{sub.email}</p>
                                </div>
                            </div>
                            <div className={`px-2 py-1 text-xs font-bold rounded ${isNeobrutalist ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                                {sub.count}
                            </div>
                        </div>

                        <div className="mt-auto flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className={`flex-1 gap-1 ${isNeobrutalist ? 'border-2 border-black shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-y-[2px] rounded-none font-bold' : ''}`}
                                onClick={() => handleKeep(sub)}
                            >
                                <Check className="h-3 w-3" />
                                Manter
                            </Button>
                            <Button
                                size="sm"
                                className={`flex-1 gap-1 ${isNeobrutalist ? 'bg-[#E63946] text-white border-2 border-black shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-y-[2px] rounded-none font-bold' : 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-white'}`}
                                onClick={() => handleUnsubscribe(sub)}
                                disabled={!!actionLoading}
                            >
                                {actionLoading === `unsub-${sub.id}` ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <X className="h-3 w-3" />
                                )}
                                Cancelar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination if needed */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className={isNeobrutalist ? 'border-2 border-black rounded-none font-bold' : ''}
                    >
                        Anterior
                    </Button>
                    <span className="flex items-center px-4 font-bold">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className={isNeobrutalist ? 'border-2 border-black rounded-none font-bold' : ''}
                    >
                        Próxima
                    </Button>
                </div>
            )}

            {/* Modal Ratel Furioso */}
            <RatelFuriosoModal
                isOpen={showRatelFurioso}
                onClose={() => setShowRatelFurioso(false)}
                onWait={handleRatelFurioso}
                subscriptionCount={allSubscriptions.length}
            />
        </div>
    );
}
