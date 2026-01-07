
import { useState, useEffect, useMemo } from 'react';
import { useEmails } from '../../hooks/useEmails';
import { PageHeader } from '../ui/PageHeader';
import {
    Loader2, AlertCircle, Search, Mail, HardDrive, Calendar, Tag, Newspaper, User
} from 'lucide-react';
import { GroupsColumn, GroupedItem } from '../GroupsColumn';
import { BulkActionsToolbar } from '../BulkActionsToolbar';
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

    const getHeaderInfo = () => {
        switch (viewType) {
            case 'newsletters': return {
                title: 'Newsletters',
                description: 'Gerencie suas assinaturas e newsletters recorrentes.',
                icon: Newspaper,
                color: 'text-orange-600',
                bgColor: 'bg-orange-100'
            };
            case 'promotions': return {
                title: 'Promoções',
                description: 'Ofertas, descontos e emails promocionais.',
                icon: Tag,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100'
            };
            case 'by-sender': return {
                title: 'Por Remetente',
                description: 'Visualize seus emails agrupados por quem enviou.',
                icon: User,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100'
            };
            case 'by-size': return {
                title: 'Por Tamanho',
                description: 'Encontre os emails que mais ocupam espaço.',
                icon: HardDrive,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100'
            };
            case 'by-date': return {
                title: 'Por Data',
                description: 'Navegue pelos seus emails cronologicamente.',
                icon: Calendar,
                color: 'text-green-600',
                bgColor: 'bg-green-100'
            };
            default: return {
                title: 'Emails',
                description: 'Caixa de entrada geral.',
                icon: Mail,
                color: 'text-gray-600',
                bgColor: 'bg-gray-100'
            };
        }
    };

    const headerInfo = getHeaderInfo();

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
                    name = 'Maiores que 1 MB';
                } else {
                    key = 'small';
                    name = 'Pequenos ( < 1 MB )';
                }
            } else {
                key = 'all';
                name = 'Todos';
            }

            const existing = groups.get(key);
            if (existing) {
                existing.count++;
            } else {
                groups.set(key, { name, email: emailAddr, count: 1, isMailingList: !!email.hasUnsubscribe });
            }
        });

        // Search filtering within groups
        if (searchTerm) {
            // Implementation detail: Filter logic if needed
        }

        return Array.from(groups.entries()).map(([id, data]) => ({
            id,
            ...data
        })).sort((a, b) => b.count - a.count);

    }, [emails, viewType, searchTerm]);

    const stats = [
        {
            label: 'Grupos Encontrados',
            value: groupedItems.length,
            icon: headerInfo.icon,
            color: headerInfo.color,
            bgColor: headerInfo.bgColor
        },
        {
            label: 'Emails Filtrados',
            value: groupedItems.reduce((acc, g) => acc + g.count, 0),
            icon: Mail,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100'
        }
    ];

    if (loading && emails.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Carregando {headerInfo.title.toLowerCase()}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-lg font-medium text-destructive">Erro ao carregar emails</p>
                <button onClick={() => fetchEmails(500)} className="mt-4 underline">Tentar novamente</button>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header com PageHeader Padding wrapper */}
            <div className="pt-6 px-6">
                <PageHeader
                    title={headerInfo.title}
                    description={headerInfo.description}
                    stats={stats}
                />
            </div>

            {/* Content Area (Split View) */}
            <div className="flex-1 flex overflow-hidden border-t border-gray-200">
                {/* Left: Groups List */}
                <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-gray-50 flex flex-col ${selectedGroup ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-gray-200">
                        <div className={`flex items-center gap-2 bg-white p-2 rounded-lg border ${isNeobrutalist ? 'border-2 border-black shadow-[2px_2px_0_0_#000]' : 'border-gray-200'}`}>
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Buscar em ${headerInfo.title.toLowerCase()}...`}
                                className="bg-transparent border-none focus:outline-none flex-1 text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        <GroupsColumn
                            groups={groupedItems}
                            selectedId={selectedGroup?.id || null}
                            onSelect={setSelectedGroup}
                        />
                    </div>
                </div>

                {/* Right: Email List / Detail */}
                <div className={`w-full md:w-2/3 lg:w-3/4 flex flex-col bg-white ${!selectedGroup ? 'hidden md:flex' : 'flex'}`}>
                    {selectedGroup ? (
                        <div className="flex-1 overflow-hidden flex flex-col">
                            {/* Using Bulk Actions as Header for Group */}
                            <BulkActionsToolbar
                                selectedCount={selectedEmailIds.size}
                                totalCount={selectedGroup.count} // Mocked, needs real emails from group
                                onSelectAll={() => { }}
                                onDeselectAll={() => setSelectedEmailIds(new Set())}
                                onAction={async (action) => console.log(action)}
                                loading={actionLoading}
                            />

                            {/* Placeholder for Emails List inside group */}
                            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                                <Mail className="h-16 w-16 mb-4 opacity-20" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedGroup.name}</h3>
                                <p>{selectedGroup.count} emails neste grupo</p>
                                <p className="text-sm mt-4 text-gray-400">(Listagem detalhada de emails seria implementada aqui)</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                            <div className="p-6 rounded-full bg-gray-100 mb-6">
                                <Search className="h-12 w-12 opacity-20" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Selecione um grupo</h3>
                            <p className="max-w-md">
                                Escolha um item na lista à esquerda para visualizar e gerenciar os emails correspondentes.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
