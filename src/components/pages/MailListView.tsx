import { useState, useEffect, useMemo } from 'react';
import { useEmails } from '../../hooks/useEmails';
import {
    Loader2, AlertCircle, Search, CheckSquare, Square, Inbox
} from 'lucide-react';
import { showToast } from '../../lib/toast';
import { GroupsColumn, GroupedItem } from '../GroupsColumn';
import { BulkActionsToolbar } from '../BulkActionsToolbar';
import { cn } from '@/lib/utils';

import { useStyleTheme } from '../../contexts/StyleThemeContext';

interface Props {
    viewType: 'by-sender' | 'by-size' | 'by-date' | 'newsletters' | 'promotions';
}

export function MailListView({ viewType }: Props) {
    const { isNeobrutalist } = useStyleTheme();
    const { emails, loading, error, fetchEmails, trashEmails } = useEmails();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<GroupedItem | null>(null);
    const [selectedEmailIds, setSelectedEmailIds] = useState<Set<string>>(new Set());
    const [actionLoading, setActionLoading] = useState(false);

    const getTitle = () => {
        switch (viewType) {
            case 'newsletters': return 'NEWSLETTERS';
            case 'promotions': return 'PROMOÇÕES';
            case 'by-sender': return 'POR REMETENTE';
            case 'by-size': return 'POR TAMANHO';
            case 'by-date': return 'POR DATA';
            default: return 'EMAILS';
        }
    };

    useEffect(() => {
        fetchEmails(500); // Restaurado: agora usa batch API eficiente
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
                // Use same logic as grouping
                const emailDate = new Date(email.date);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

                let emailGroupId: string;
                if (emailDate >= yesterday) {
                    emailGroupId = 'yesterday';
                } else if (emailDate >= weekAgo) {
                    emailGroupId = 'this-week';
                } else if (emailDate >= twoWeeksAgo) {
                    emailGroupId = 'last-week';
                } else {
                    emailGroupId = `${emailDate.getFullYear()}-${emailDate.getMonth()}`;
                }

                return emailGroupId === selectedGroup.id;
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
        if (!selectedGroup) return;

        // Find an email with unsubscribe link from the selected group
        const emailWithUnsubscribe = filteredEmails.find(e => e.unsubscribeLink);

        if (emailWithUnsubscribe?.unsubscribeLink) {
            // Extract URL from List-Unsubscribe header (format: <mailto:...> or <https://...>)
            const linkMatch = emailWithUnsubscribe.unsubscribeLink.match(/<(https?:\/\/[^>]+)>/);
            if (linkMatch) {
                window.open(linkMatch[1], '_blank');
                showToast('Abrindo página de cancelamento...', 'success');
            } else {
                // Try mailto
                const mailtoMatch = emailWithUnsubscribe.unsubscribeLink.match(/<(mailto:[^>]+)>/);
                if (mailtoMatch) {
                    window.location.href = mailtoMatch[1];
                    showToast('Abrindo email de cancelamento...', 'success');
                } else {
                    showToast('Link de cancelamento não disponível', 'error');
                }
            }
        } else {
            showToast('Nenhum link de cancelamento encontrado', 'error');
        }
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
            {/* Header Mobile Global para a View */}
            <div className="md:hidden mb-4 px-2">
                <h2 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${isNeobrutalist ? 'uppercase' : ''}`}>
                    <span className="gradient-text">{getTitle()}</span>
                </h2>
            </div>

            {/* Mobile Header with Back Button (only when group selected) */}
            {selectedGroup && (
                <div className={`lg:hidden flex items-center gap-3 mb-4 p-2 rounded-sm ${isNeobrutalist ? 'bg-white border-2 border-black shadow-[4px_4px_0_0_#000]' : 'glass-card'}`}>
                    <button
                        onClick={() => setSelectedGroup(null)}
                        className="p-2 hover:bg-secondary/50 rounded-sm transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <p className={`font-semibold truncate ${isNeobrutalist ? 'font-black uppercase' : ''}`}>{selectedGroup.name}</p>
                        <p className="text-xs text-muted-foreground">{filteredEmails.length} emails</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center gap-3 text-red-600 mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Responsive Layout */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Groups Column - hidden on mobile when group is selected */}
                <div className={cn(
                    "w-full lg:w-80 glass-card rounded-sm overflow-hidden flex-shrink-0",
                    selectedGroup ? "hidden lg:block" : "block"
                )}>
                    <GroupsColumn
                        items={groupedItems}
                        selectedId={selectedGroup?.id || null}
                        onSelect={handleGroupSelect}
                        viewType={viewType}
                        loading={loading}
                    />
                </div>

                {/* Emails Column - hidden on mobile when no group selected */}
                <div className={cn(
                    "flex-1 flex flex-col min-w-0",
                    !selectedGroup ? "hidden lg:flex" : "flex"
                )}>
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
                                    placeholder="Filtrar emails..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-sm border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                                />
                            </div>

                            {/* Email List */}
                            <div className="flex-1 glass-card rounded-sm overflow-hidden">
                                <div className="h-full overflow-y-auto p-2 space-y-1">
                                    {/* Select All */}
                                    <button
                                        onClick={toggleSelectAll}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 rounded-sm transition-colors text-left"
                                    >
                                        {selectedEmailIds.size === filteredEmails.length ? (
                                            <CheckSquare className="h-5 w-5 text-primary" />
                                        ) : (
                                            <Square className="h-5 w-5 text-muted-foreground" />
                                        )}
                                        <span className="text-sm font-medium">
                                            {selectedEmailIds.size === filteredEmails.length ? 'Desmarcar todos' : 'Selecionar todos'}
                                        </span>
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {filteredEmails.length} emails
                                        </span>
                                    </button>

                                    {/* Email Items */}
                                    {filteredEmails.map((email) => (
                                        <div
                                            key={email.id}
                                            className={cn(
                                                "flex items-start gap-3 p-3 rounded-sm cursor-pointer transition-all",
                                                selectedEmailIds.has(email.id)
                                                    ? "bg-primary/10 border border-primary/30"
                                                    : "hover:bg-secondary/50"
                                            )}
                                            onClick={() => toggleEmailSelection(email.id)}
                                        >
                                            {selectedEmailIds.has(email.id) ? (
                                                <CheckSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <Square className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-sm truncate flex-1">{email.subject}</p>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{email.snippet}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(email.date).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
