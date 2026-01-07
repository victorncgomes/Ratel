import { useState, useEffect } from 'react';
import { useSubscriptions, Subscription } from '../../hooks/useSubscriptions';
import { useEmails } from '../../hooks/useEmails';
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
import { ConfirmUnsubscribeDialog } from '../dialogs/ConfirmUnsubscribeDialog';

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

    const { emails } = useEmails();
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [showRatelFurioso, setShowRatelFurioso] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'count' | 'name' | 'recent'>('count');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const ratelFurioso = useRatelFurioso();
    const { isNeobrutalist } = useStyleTheme();

    const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
    const [subToUnsubscribe, setSubToUnsubscribe] = useState<Subscription | null>(null);

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
        .sort((a, b) => {
            if (sortBy === 'count') return b.count - a.count;
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'recent') return new Date(b.lastEmail || 0).getTime() - new Date(a.lastEmail || 0).getTime();
            return 0;
        });

    const handleKeep = async (sub: Subscription) => {
        showToast(`${sub.name} mantida ✓`, 'success');
        removeSubscription(sub.id);
        if (selectedSub?.id === sub.id) setSelectedSub(null);
    };

    const handleUnsubscribeClick = (sub: Subscription) => {
        setSubToUnsubscribe(sub);
    };

    const confirmUnsubscribe = async () => {
        if (!subToUnsubscribe) return;

        setActionLoading(`unsub-${subToUnsubscribe.id}`);
        try {
            await unsubscribe(subToUnsubscribe);
            if (!isDemoMode) {
                await deleteAll(subToUnsubscribe.emailIds);
            }
            removeSubscription(subToUnsubscribe.id);
            showToast(`Inscrição cancelada: ${subToUnsubscribe.name}`, 'success');
            if (selectedSub?.id === subToUnsubscribe.id) setSelectedSub(null);
        } catch (e) {
            console.error(e);
            showToast('Erro ao cancelar inscrição', 'error');
        }
        setActionLoading(null);
        setSubToUnsubscribe(null);
    };

    const handleRatelFurioso = async (deleteHistory: boolean) => {
        const allIds = allSubscriptions.map(s => String(s.id));
        try {
            await ratelFurioso.execute(allIds, deleteHistory);
            fetchSubscriptions();
            showToast('Limpeza completa! Todas as inscrições removidas.', 'success');
        } catch (e) {
            showToast('Erro ao executar limpeza', 'error');
        }
        setShowRatelFurioso(false);
    };

    // Calculate Stats for PageHeader
    const totalEmails = allSubscriptions.reduce((acc, sub) => acc + sub.count, 0);
    const avgConfidence = allSubscriptions.length > 0
        ? Math.round(allSubscriptions.reduce((acc, sub) => acc + (sub.confidence || 0), 0) / allSubscriptions.length)
        : 0;

    const stats = [
        { label: 'Total de Listas', value: allSubscriptions.length, icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { label: 'Emails Afetados', value: totalEmails, icon: Trash2, color: 'text-red-600', bgColor: 'bg-red-100' },
        { label: 'Precisão Média', value: `${avgConfidence}%`, icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] flex flex-col">
            <PageHeader
                title="Listas de Email"
                description="Gerencie suas inscrições e assinaturas."
                stats={stats}
                action={
                    <Button
                        onClick={() => setShowRatelFurioso(true)}
                        className={`gap-2 ${isNeobrutalist
                            ? 'bg-[#E63946] text-white border-4 border-black shadow-[4px_4px_0_0_#000] font-black uppercase hover:shadow-none hover:translate-y-1'
                            : 'bg-destructive hover:bg-destructive/90 text-white'}`}
                    >
                        <Trash2 className="h-4 w-4" />
                        APAGAR TUDO
                    </Button>
                }
            />

            {/* Content (Search & Grid) */}
            <div className={`flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-4 rounded-lg border ${isNeobrutalist ? 'border-2 border-black shadow-[4px_4px_0_0_#000] rounded-none' : 'border-gray-200'}`}>
                <div className="flex-1 flex items-center gap-2 w-full">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        className="bg-transparent border-none focus:outline-none flex-1 font-medium min-w-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-2 bg-white rounded-md p-1 border border-gray-200">
                    <button
                        onClick={() => setSortBy('count')}
                        title="Maior Volume"
                        className={`p-1.5 rounded-md transition-all ${sortBy === 'count' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setSortBy('recent')}
                        title="Mais Recentes"
                        className={`p-1.5 rounded-md transition-all ${sortBy === 'recent' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Zap className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setSortBy('name')}
                        title="Ordem Alfabética"
                        className={`p-1.5 rounded-md transition-all ${sortBy === 'name' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <span className="text-xs font-serif">Az</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left Column: List */}
                <div className={`flex flex-col bg-gray-50 rounded-lg border overflow-hidden ${isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none bg-white' : 'border-gray-200'}`}>
                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y">
                            {filteredSubscriptions.map(sub => (
                                <div
                                    key={sub.id}
                                    onClick={() => setSelectedSub(sub)}
                                    className={`p-4 cursor-pointer transition-colors hover:bg-accent/50 flex items-center gap-3
                                        ${selectedSub?.id === sub.id ? 'bg-accent border-l-4 border-primary' : 'border-l-4 border-transparent'}
                                    `}
                                >
                                    <Avatar className={`h-8 w-8 ${isNeobrutalist ? 'border-2 border-black rounded-none' : ''}`}>
                                        <AvatarImage src={sub.logo} />
                                        <AvatarFallback>{sub.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm truncate">{sub.name}</h4>
                                        <p className="text-xs text-muted-foreground truncate">{sub.email}</p>
                                    </div>
                                    <div className={`text-xs font-bold px-2 py-0.5 rounded ${isNeobrutalist ? 'bg-black text-white' : 'bg-gray-200'}`}>
                                        {sub.count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 flex flex-col min-h-0">
                    {selectedSub ? (
                        <div className={`flex flex-col h-full bg-white rounded-lg border overflow-hidden ${isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none' : 'border-gray-200 shadow-sm'}`}>
                            {/* Header */}
                            <div className="p-6 border-b flex justify-between items-start bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <Avatar className={`h-16 w-16 ${isNeobrutalist ? 'border-4 border-black rounded-none' : ''}`}>
                                        <AvatarImage src={selectedSub.logo} />
                                        <AvatarFallback className="text-xl">{selectedSub.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedSub.name}</h2>
                                        <p className="text-muted-foreground">{selectedSub.email}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">Freq: {selectedSub.freq || 'Variable'}</span>
                                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">Score: {selectedSub.score || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => handleKeep(selectedSub)} className={isNeobrutalist ? 'border-2 border-black font-bold shadow-[2px_2px_0_0_#000] rounded-none' : ''}>
                                        <Check className="h-4 w-4 mr-2" />
                                        Manter
                                    </Button>
                                    <Button
                                        onClick={() => handleUnsubscribeClick(selectedSub)}
                                        disabled={!!actionLoading}
                                        className={isNeobrutalist ? 'bg-[#E63946] text-white border-2 border-black font-bold shadow-[2px_2px_0_0_#000] rounded-none' : 'bg-destructive text-white hover:bg-destructive/90'}
                                    >
                                        {actionLoading === `unsub-${selectedSub.id}` ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
                                        Cancelar Inscrição
                                    </Button>
                                </div>
                            </div>

                            {/* Email List */}
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
                                <h3 className="font-bold text-sm text-muted-foreground mb-4 uppercase tracking-wider">Emails recentes desta lista</h3>
                                <div className="space-y-2">
                                    {/* Mocking retrieval of emails by matching from addresses or IDs */}
                                    {/* In real app, we would use selectedSub.emailIds to filter from global store or fetch */}
                                    {emails.filter(e => e.from.includes(selectedSub.name) || e.from.includes(selectedSub.email) || selectedSub.id.toString() === e.id).slice(0, 10).map((email, idx) => (
                                        <div key={`${email.id}-${idx}`} className="bg-white p-3 rounded border border-gray-100 shadow-sm flex gap-3 hover:border-blue-300 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm truncate">{email.subject}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{email.snippet}</p>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(email.date).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                    {emails.filter(e => e.from.includes(selectedSub.name) || e.from.includes(selectedSub.email)).length === 0 && (
                                        <p className="text-center text-muted-foreground py-8">Nenhum email recente encontrado no cache local.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`flex flex-col h-full bg-gray-50/50 rounded-lg border border-dashed items-center justify-center text-muted-foreground ${isNeobrutalist ? 'border-4 border-black rounded-none opacity-50' : 'border-gray-200'}`}>
                            <Search className="h-12 w-12 mb-4 opacity-20" />
                            <p className="font-medium">Selecione uma lista para ver detalhes</p>
                        </div>
                    )}
                </div>
            </div>

            <RatelFuriosoModal
                isOpen={showRatelFurioso}
                onClose={() => setShowRatelFurioso(false)}
                onConfirm={handleRatelFurioso}
                selectedCount={allSubscriptions.length}
            />

            {subToUnsubscribe && (
                <ConfirmUnsubscribeDialog
                    isOpen={!!subToUnsubscribe}
                    onClose={() => setSubToUnsubscribe(null)}
                    onConfirm={confirmUnsubscribe}
                    senderName={subToUnsubscribe.name}
                    senderEmail={subToUnsubscribe.email}
                />
            )}
        </div>
    );
}
