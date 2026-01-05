import { useState, useEffect } from 'react';

import { useSubscriptions, Subscription } from '../../hooks/useSubscriptions';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
    CheckCircle2, Mail, Trash2, Archive, Ban,
    Search, MoreHorizontal, Filter, Eye, RefreshCw, Loader2, AlertCircle
} from 'lucide-react';
import { mockSubscriptions } from '../../lib/mockData';
import { getAccessToken } from '../../lib/api';
import { showToast } from '../../lib/toast';
import { useRatelFurioso } from '../../hooks/useRatelFurioso';
import { RatelFuriosoModal } from '../RatelFuriosoModal';

export function SubscriptionsPage() {

    const { subscriptions: realSubscriptions, loading, error, fetchSubscriptions, archiveAll, deleteAll, unsubscribe, removeSubscription } = useSubscriptions();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [demoSubscriptions, setDemoSubscriptions] = useState(mockSubscriptions);
    const [showRatelFurioso, setShowRatelFurioso] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;
    const ratelFurioso = useRatelFurioso();

    // Detectar modo demo e carregar dados
    useEffect(() => {
        const hasToken = getAccessToken();
        setIsDemoMode(!hasToken);

        if (hasToken) {
            fetchSubscriptions().catch(console.error);
        }
    }, [fetchSubscriptions]);

    // Usar dados mockados ou reais
    const allSubscriptions = isDemoMode ? demoSubscriptions : realSubscriptions;

    // Pagination logic
    const totalPages = Math.ceil(allSubscriptions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const subscriptions = allSubscriptions.slice(startIndex, endIndex);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    // Reset page when switching modes or searching (if search was added)
    useEffect(() => {
        setCurrentPage(1);
    }, [isDemoMode, realSubscriptions.length]);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedIds.length === subscriptions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(subscriptions.map(s => s.id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ativo': return 'bg-fluent-green text-white';
            case 'Risco': return 'bg-fluent-orange text-white';
            case 'Inativo': return 'bg-fluent-magenta text-white';
            case 'Spam': return 'bg-fluent-red text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const handleArchive = async (sub: Subscription) => {
        setActionLoading(`archive-${sub.id}`);
        try {
            if (isDemoMode) {
                // Modo demo: simular ação
                await new Promise(resolve => setTimeout(resolve, 800));
                setDemoSubscriptions(prev => prev.filter(s => s.id !== sub.id));
                showToast(`${sub.name} arquivada com sucesso!`, 'success');
            } else {
                await archiveAll(sub.emailIds);
                removeSubscription(sub.id);
            }
        } catch (e) {
            console.error(e);
            showToast('Erro ao arquivar inscrição', 'error');
        }
        setActionLoading(null);
    };

    const handleDelete = async (sub: Subscription) => {
        setActionLoading(`delete-${sub.id}`);
        try {
            if (isDemoMode) {
                // Modo demo: simular ação
                await new Promise(resolve => setTimeout(resolve, 800));
                setDemoSubscriptions(prev => prev.filter(s => s.id !== sub.id));
                showToast(`${sub.name} excluída com sucesso!`, 'success');
            } else {
                await deleteAll(sub.emailIds);
                removeSubscription(sub.id);
            }
        } catch (e) {
            console.error(e);
            showToast('Erro ao excluir inscrição', 'error');
        }
        setActionLoading(null);
    };

    const handleUnsubscribe = async (sub: Subscription) => {
        setActionLoading(`unsub-${sub.id}`);
        try {
            if (isDemoMode) {
                // Modo demo: simular cancelamento
                await new Promise(resolve => setTimeout(resolve, 1000));
                setDemoSubscriptions(prev => prev.filter(s => s.id !== sub.id));
                showToast(`Cancelou inscrição de ${sub.name}!`, 'success');
            } else {
                await unsubscribe(sub);
            }
        } catch (e) {
            console.error(e);
            showToast('Erro ao cancelar inscrição', 'error');
        }
        setActionLoading(null);
    };

    const handleRatelFurioso = async (deleteHistory: boolean) => {
        if (selectedIds.length === 0) return;

        try {
            // Tocar som de rugido
            try {
                const audio = new Audio('/sounds/roar.mp3');
                audio.volume = 0.7;
                audio.play().catch(() => console.warn('Som não disponível'));
            } catch (e) {
                console.warn('Erro ao tocar som:', e);
            }

            if (isDemoMode) {
                // Modo demo: simular
                await new Promise(resolve => setTimeout(resolve, 2000));
                setDemoSubscriptions(prev =>
                    prev.filter(s => !selectedIds.includes(s.id))
                );
                showToast(`🦡 Ratel Furioso! ${selectedIds.length} inscrições canceladas!`, 'success');
            } else {
                // Modo real
                const result = await ratelFurioso.execute(selectedIds, deleteHistory);
                showToast(
                    `🦡 Ratel Furioso executado! ${result.success} canceladas, ${result.failed} falharam`,
                    result.failed > 0 ? 'error' : 'success'
                );

                // Remover da lista
                selectedIds.forEach(id => removeSubscription(id));
            }

            setSelectedIds([]);
            setShowRatelFurioso(false);
        } catch (error: any) {
            showToast(`Erro: ${error.message}`, 'error');
        }
    };

    const handleBulkArchive = async () => {
        const selected = subscriptions.filter(s => selectedIds.includes(s.id));
        const allEmailIds = selected.flatMap(s => s.emailIds);

        setActionLoading('bulk-archive');
        try {
            await archiveAll(allEmailIds);
            selected.forEach(s => removeSubscription(s.id));
            setSelectedIds([]);
        } catch (e) {
            console.error(e);
        }
        setActionLoading(null);
    };

    const handleBulkDelete = async () => {
        const selected = subscriptions.filter(s => selectedIds.includes(s.id));
        const allEmailIds = selected.flatMap(s => s.emailIds);

        setActionLoading('bulk-delete');
        try {
            await deleteAll(allEmailIds);
            selected.forEach(s => removeSubscription(s.id));
            setSelectedIds([]);
        } catch (e) {
            console.error(e);
        }
        setActionLoading(null);
    };

    // Loading state
    if (loading && subscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Analisando seus emails...</p>
                <p className="text-sm text-muted-foreground">Identificando newsletters e inscrições</p>
            </div>
        );
    }

    // Error state
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

    // Empty state
    if (!loading && subscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <Mail className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Nenhuma inscrição encontrada</p>
                <p className="text-sm text-muted-foreground mb-4">Não encontramos newsletters ou inscrições na sua caixa de entrada.</p>
                <Button variant="outline" onClick={() => fetchSubscriptions()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Actions Bar */}
            {selectedIds.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-3 flex items-center justify-between">
                        <span className="text-sm font-medium">
                            {selectedIds.length} item(ns) selecionado(s)
                        </span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-1 text-fluent-green border-fluent-green/30 hover:bg-fluent-green/10">
                                <CheckCircle2 className="h-4 w-4" />
                                Manter
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-fluent-orange border-fluent-orange/30 hover:bg-fluent-orange/10"
                                onClick={handleBulkArchive}
                                disabled={actionLoading === 'bulk-archive'}
                            >
                                {actionLoading === 'bulk-archive' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                                Arquivar
                            </Button>
                            <Button
                                size="sm"
                                className="gap-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => setShowRatelFurioso(true)}
                                disabled={ratelFurioso.loading}
                            >
                                {ratelFurioso.loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <span className="text-lg">🦡</span>
                                )}
                                Ratel Furioso
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Select All Header with Actions */}
            <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={subscriptions.length > 0 && subscriptions.every(s => selectedIds.includes(s.id))}
                        onChange={selectAll}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                        Selecionar todos ({subscriptions.length})
                    </span>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 h-8 text-muted-foreground hover:text-fluent-blue"
                        onClick={() => fetchSubscriptions()}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                        <span className="hidden sm:inline">Atualizar</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 h-8 text-muted-foreground hover:text-fluent-purple">
                        <Filter className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Filtrar</span>
                    </Button>
                </div>
            </div>

            {/* Subscriptions List */}
            <div className="grid gap-3">
                {subscriptions.map((sub) => (
                    <Card
                        key={sub.id}
                        className={`group transition-all duration-200 ${selectedIds.includes(sub.id) ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'}`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(sub.id)}
                                    onChange={() => toggleSelect(sub.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                />

                                {/* Avatar com cor Fluent */}
                                <Avatar className={`h-10 w-10 ${sub.color}`}>
                                    <AvatarFallback className="text-white font-semibold bg-transparent">
                                        {sub.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                                        {sub.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground truncate">{sub.email}</p>
                                </div>

                                {/* Stats */}
                                <div className="hidden md:flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground uppercase font-bold">Frequência</p>
                                        <p className="text-sm font-medium">{sub.freq}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground uppercase font-bold">Emails</p>
                                        <p className="text-sm font-medium">{sub.count}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground uppercase font-bold">Score</p>
                                        <p className={`text-sm font-bold ${sub.score > 70 ? 'text-fluent-green' : sub.score > 40 ? 'text-fluent-yellow' : 'text-fluent-red'}`}>
                                            {sub.score}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <Badge className={getStatusColor(sub.status)}>
                                    {sub.status}
                                </Badge>

                                {/* Action Buttons */}
                                <div className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-fluent-blue hover:bg-fluent-blue/10"
                                        onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-fluent-teal hover:bg-fluent-teal/10">
                                        <Search className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-secondary">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Expanded Actions */}
                            {expandedId === sub.id && (
                                <div className="mt-4 pt-4 border-t flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <Button size="sm" variant="outline" className="gap-1.5 text-fluent-blue">
                                        <Mail className="h-3.5 w-3.5" />
                                        Ver Emails ({sub.count})
                                    </Button>
                                    <Button size="sm" variant="outline" className="gap-1.5 text-fluent-purple">
                                        <Search className="h-3.5 w-3.5" />
                                        Mesmo Remetente
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-1.5 text-fluent-orange"
                                        onClick={() => handleArchive(sub)}
                                        disabled={actionLoading === `archive-${sub.id}`}
                                    >
                                        {actionLoading === `archive-${sub.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Archive className="h-3.5 w-3.5" />}
                                        Arquivar Todos
                                    </Button>
                                    {sub.hasUnsubscribe && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-1.5 text-fluent-red"
                                            onClick={() => handleUnsubscribe(sub)}
                                            disabled={actionLoading === `unsub-${sub.id}`}
                                        >
                                            {actionLoading === `unsub-${sub.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
                                            Cancelar Inscrição
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="gap-1.5"
                                        onClick={() => handleDelete(sub)}
                                        disabled={actionLoading === `delete-${sub.id}`}
                                    >
                                        {actionLoading === `delete-${sub.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                        Excluir Histórico
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>


            {/* Pagination Controls */}
            {
                allSubscriptions.length > itemsPerPage && (
                    <div className="flex items-center justify-between py-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {startIndex + 1} a {Math.min(endIndex, allSubscriptions.length)} de {allSubscriptions.length} inscrições
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={prevPage}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <div className="flex items-center px-4 font-medium">
                                Página {currentPage} de {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                            >
                                Próxima
                            </Button>
                        </div>
                    </div>
                )
            }

            {/* Modal Ratel Furioso */}
            <RatelFuriosoModal
                isOpen={showRatelFurioso}
                onClose={() => setShowRatelFurioso(false)}
                onConfirm={handleRatelFurioso}
                selectedCount={selectedIds.length}
                loading={ratelFurioso.loading}
                progress={ratelFurioso.progress}
            />
        </div >
    );
}
