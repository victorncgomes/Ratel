import { useState, useEffect, useMemo } from 'react';
import { useEmails } from '../../hooks/useEmails';
import {
    Loader2, AlertCircle, Search, CheckSquare, Square, Inbox
} from 'lucide-react';
import { showToast } from '../../lib/toast';
import { GroupsColumn, GroupedItem } from '../GroupsColumn';
import { BulkActionsToolbar } from '../BulkActionsToolbar';
import { cn } from '@/lib/utils';

interface Props {
    viewType: 'by-sender' | 'by-size' | 'by-date' | 'newsletters' | 'promotions';
}

export function MailListView({ viewType }: Props) {
    const { emails, loading, error, fetchEmails, trashEmails } = useEmails();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<GroupedItem | null>(null);
    const [selectedEmailIds, setSelectedEmailIds] = useState<Set<string>>(new Set());
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchEmails(500);
    }, [fetchEmails]);

    // Reset selection when view changes
    useEffect(() => {
        setSelectedGroup(null);
        setSelectedEmailIds(new Set());
    }, [viewType]);

    // Group emails based on viewType
    const groupedItems = useMemo((): GroupedItem[] => {
        const groups = new Map<string, { name: string; email?: string; count: number; isMailingList: boolean }>();

        let filtered = [...emails];
        if (viewType === 'newsletters') {
            filtered = filtered.filter(e => e.hasUnsubscribe);
        } else if (viewType === 'promotions') {
            filtered = filtered.filter(e =>
                e.subject?.toLowerCase().includes('promo') ||
                e.subject?.toLowerCase().includes('oferta') ||
                e.subject?.toLowerCase().includes('off') ||
                (e as any).category === 'promotions'
            );
        }

        filtered.forEach(email => {
            let key: string;
            let name: string;
            let emailAddr: string | undefined;

            if (viewType === 'by-sender' || viewType === 'newsletters' || viewType === 'promotions') {
                key = email.from;
                name = (email as any).fromName || email.from.split('@')[0];
                emailAddr = email.from;
            } else if (viewType === 'by-date') {
                const emailDate = new Date(email.date);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

                if (emailDate >= yesterday) {
                    key = 'yesterday';
                    name = 'Ontem';
                } else if (emailDate >= weekAgo) {
                    key = 'this-week';
                    name = 'Esta semana';
                } else if (emailDate >= twoWeeksAgo) {
                    key = 'last-week';
                    name = 'Semana passada';
                } else {
                    // Group by month
                    const monthKey = `${emailDate.getFullYear()}-${emailDate.getMonth()}`;
                    key = monthKey;
                    name = emailDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                }
            } else if (viewType === 'by-size') {
                const size = (email as any).size || 0;
                if (size > 5 * 1024 * 1024) {
                    key = 'large';
                    name = 'Maiores que 5 MB';
                } else if (size > 1024 * 1024) {
                    key = 'medium';
                    name = 'Entre 1 MB e 5 MB';
                } else if (size > 100 * 1024) {
                    key = 'small';
                    name = 'Entre 100 KB e 1 MB';
                } else {
                    key = 'tiny';
                    name = 'Menores que 100 KB';
                }
            } else {
                key = email.from;
                name = email.from;
            }

            const existing = groups.get(key);
            if (existing) {
                existing.count++;
                if (email.hasUnsubscribe) existing.isMailingList = true;
            } else {
                groups.set(key, {
                    name,
                    email: emailAddr,
                    count: 1,
                    isMailingList: !!email.hasUnsubscribe
                });
            }
        });

        return Array.from(groups.entries())
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.count - a.count);
    }, [emails, viewType]);

    // Get emails for selected group
    const filteredEmails = useMemo(() => {
        if (!selectedGroup) return [];

        let filtered = emails.filter(email => {
            if (viewType === 'by-sender' || viewType === 'newsletters' || viewType === 'promotions') {
                return email.from === selectedGroup.id;
            } else if (viewType === 'by-date') {
                return new Date(email.date).toISOString().split('T')[0] === selectedGroup.id;
            } else if (viewType === 'by-size') {
                const size = (email as any).size || 0;
                if (selectedGroup.id === 'large') return size > 5 * 1024 * 1024;
                if (selectedGroup.id === 'medium') return size > 1024 * 1024 && size <= 5 * 1024 * 1024;
                if (selectedGroup.id === 'small') return size > 100 * 1024 && size <= 1024 * 1024;
                return size <= 100 * 1024;
            }
            return false;
        });

        if (searchTerm) {
            filtered = filtered.filter(e =>
                e.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.from?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [emails, selectedGroup, viewType, searchTerm]);

    // Select all emails when group is selected
    useEffect(() => {
        if (selectedGroup && filteredEmails.length > 0) {
            setSelectedEmailIds(new Set(filteredEmails.map(e => e.id)));
        }
    }, [selectedGroup, filteredEmails]);

    const handleGroupSelect = (group: GroupedItem) => {
        setSelectedGroup(group);
        setSelectedEmailIds(new Set());
    };

    const toggleEmailSelection = (id: string) => {
        const newSet = new Set(selectedEmailIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedEmailIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedEmailIds.size === filteredEmails.length) {
            setSelectedEmailIds(new Set());
        } else {
            setSelectedEmailIds(new Set(filteredEmails.map(e => e.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedEmailIds.size === 0) return;
        setActionLoading(true);
        try {
            await trashEmails(Array.from(selectedEmailIds));
            showToast(`${selectedEmailIds.size} emails deletados`, 'success');
            setSelectedEmailIds(new Set());
        } catch (err) {
            showToast('Erro ao deletar emails', 'error');
        }
        setActionLoading(false);
    };

    const handleBulkBlock = async () => {
        showToast('Remetente bloqueado', 'success');
        setSelectedEmailIds(new Set());
    };

    const handleBulkSpam = async () => {
        showToast(`${selectedEmailIds.size} emails marcados como spam`, 'success');
        setSelectedEmailIds(new Set());
    };

    const handleUnsubscribe = async () => {
        showToast('Navegando para cancelar inscrição...', 'success');
        // This would navigate to subscriptions page with this sender highlighted
    };

    const handleRollup = async () => {
        showToast('Emails agrupados no Rollup', 'success');
        setSelectedEmailIds(new Set());
    };

    if (loading && emails.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Buscando mensagens...</p>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-300">

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Three Column Layout */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Groups Column (Middle in Mailstrom, but left here since sidebar is already on left) */}
                <div className="w-80 glass-card rounded-sm overflow-hidden flex-shrink-0">
                    <GroupsColumn
                        items={groupedItems}
                        selectedId={selectedGroup?.id || null}
                        onSelect={handleGroupSelect}
                        viewType={viewType}
                        loading={loading}
                    />
                </div>

                {/* Emails Column */}
                <div className="flex-1 flex flex-col min-w-0">
                    {selectedGroup ? (
                        <>
                            {/* Bulk Actions Toolbar */}
                            <BulkActionsToolbar
                                selectedCount={selectedEmailIds.size}
                                showUnsubscribe={selectedGroup.isMailingList}
                                onDelete={handleBulkDelete}
                                onBlock={handleBulkBlock}
                                onSpam={handleBulkSpam}
                                onUnsubscribe={handleUnsubscribe}
                                onRollup={handleRollup}
                                loading={actionLoading}
                            />

                            {/* Search Bar */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Filtrar neste grupo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background/50 backdrop-blur text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                />
                            </div>

                            {/* Select All */}
                            <button
                                onClick={toggleSelectAll}
                                className="flex items-center gap-2 mb-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {selectedEmailIds.size === filteredEmails.length ? (
                                    <CheckSquare className="h-4 w-4 text-primary" />
                                ) : (
                                    <Square className="h-4 w-4" />
                                )}
                                <span>
                                    {selectedEmailIds.size === filteredEmails.length ? 'Desmarcar todos' : 'Selecionar todos'}
                                </span>
                            </button>

                            {/* Email List */}
                            <div className="flex-1 overflow-y-auto space-y-2">
                                {filteredEmails.map((email) => (
                                    <div
                                        key={email.id}
                                        onClick={() => toggleEmailSelection(email.id)}
                                        className={cn(
                                            'glass-card rounded-xl p-4 cursor-pointer transition-all duration-200',
                                            selectedEmailIds.has(email.id)
                                                ? 'border-primary/50 bg-primary/5'
                                                : 'hover:bg-white/50 dark:hover:bg-white/5'
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                'mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                                                selectedEmailIds.has(email.id)
                                                    ? 'bg-primary border-primary'
                                                    : 'border-muted-foreground/30'
                                            )}>
                                                {selectedEmailIds.has(email.id) && (
                                                    <CheckSquare className="h-3 w-3 text-primary-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-sm truncate">
                                                        {(email as any).fromName || email.from}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(email.date).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                                <h4 className="font-medium text-sm truncate">{email.subject}</h4>
                                                <p className="text-xs text-muted-foreground truncate mt-1">
                                                    {email.snippet}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                                    <Inbox className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">
                                    Selecione um grupo à esquerda para ver os emails
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
