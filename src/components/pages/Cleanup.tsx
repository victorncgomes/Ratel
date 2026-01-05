import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/badge';
import {
    Trash2, Mail, FileText, AlertTriangle, Sparkles,
    Loader2, HardDrive, Clock, Paperclip
} from 'lucide-react';
import { mockCleanupData } from '../../lib/mockData';
import { showToast } from '../../lib/toast';
import { useCleanup } from '../../hooks/useCleanup';
import { getAccessToken } from '../../lib/api';

interface CleanupCategory {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    count: number;
    size: string;
    color: string;
    action: string;
}

export function CleanupPage() {
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [demoData, setDemoData] = useState(mockCleanupData);
    const { analysis, loading, analyze, emptyTrash, emptySpam } = useCleanup();

    useEffect(() => {
        const hasToken = getAccessToken();
        setIsDemoMode(!hasToken);
    }, []);

    // Usar dados reais ou mockados
    const cleanupData = isDemoMode ? demoData : (analysis ? {
        inbox_old: { count: analysis.oldEmails.count, size: analysis.oldEmails.size },
        unread_old: { count: analysis.oldUnread.count, size: analysis.oldUnread.size },
        drafts: { count: analysis.drafts.count, size: analysis.drafts.size },
        large_attachments: { count: analysis.largeAttachments.count, size: analysis.largeAttachments.size },
        spam: { count: analysis.spam.count, size: analysis.spam.size },
        trash: { count: analysis.trash.count, size: analysis.trash.size }
    } : {
        inbox_old: { count: 0, size: '...' },
        unread_old: { count: 0, size: '...' },
        drafts: { count: 0, size: '...' },
        large_attachments: { count: 0, size: '...' },
        spam: { count: 0, size: '...' },
        trash: { count: 0, size: '...' }
    });

    const cleanupCategories: CleanupCategory[] = [
        {
            id: 'inbox_old',
            title: 'Emails Antigos',
            description: 'Emails na caixa de entrada há mais de 6 meses',
            icon: Clock,
            count: cleanupData.inbox_old.count,
            size: cleanupData.inbox_old.size,
            color: 'text-blue-500',
            action: 'Arquivar'
        },
        {
            id: 'unread_old',
            title: 'Não Lidos Esquecidos',
            description: 'Emails não lidos há mais de 30 dias',
            icon: Mail,
            count: cleanupData.unread_old.count,
            size: cleanupData.unread_old.size,
            color: 'text-orange-500',
            action: 'Revisar'
        },
        {
            id: 'drafts',
            title: 'Rascunhos Abandonados',
            description: 'Rascunhos não editados há mais de 7 dias',
            icon: FileText,
            count: cleanupData.drafts.count,
            size: cleanupData.drafts.size,
            color: 'text-yellow-500',
            action: 'Limpar'
        },
        {
            id: 'large_attachments',
            title: 'Anexos Grandes',
            description: 'Emails com anexos maiores que 5 MB',
            icon: Paperclip,
            count: cleanupData.large_attachments.count,
            size: cleanupData.large_attachments.size,
            color: 'text-purple-500',
            action: 'Revisar'
        },
        {
            id: 'spam',
            title: 'Spam',
            description: 'Mensagens identificadas como spam',
            icon: AlertTriangle,
            count: cleanupData.spam.count,
            size: cleanupData.spam.size,
            color: 'text-red-500',
            action: 'Esvaziar'
        },
        {
            id: 'trash',
            title: 'Lixeira',
            description: 'Itens na lixeira aguardando exclusão',
            icon: Trash2,
            count: cleanupData.trash.count,
            size: cleanupData.trash.size,
            color: 'text-gray-500',
            action: 'Esvaziar'
        },
    ];

    const handleAnalyze = async () => {
        if (isDemoMode) {
            showToast('Analisando sua caixa de entrada...', 'info');
            setTimeout(() => {
                showToast('Análise concluída! Encontramos oportunidades de limpeza.', 'success');
            }, 2000);
        } else {
            try {
                await analyze();
                showToast('Análise concluída!', 'success');
            } catch (error) {
                showToast('Erro ao analisar. Faça login novamente.', 'error');
            }
        }
    };

    const handleEmptyTrash = async () => {
        if (isDemoMode) {
            showToast('Esvaziando lixeira...', 'info');
            setTimeout(() => {
                setDemoData(prev => ({ ...prev, trash: { ...prev.trash, count: 0, size: '0 MB' } }));
                showToast('Lixeira esvaziada!', 'success');
            }, 1500);
        } else {
            try {
                await emptyTrash();
                showToast('Lixeira esvaziada!', 'success');
                await analyze();
            } catch (error) {
                showToast('Erro ao esvaziar lixeira', 'error');
            }
        }
    };

    const handleEmptySpam = async () => {
        if (isDemoMode) {
            showToast('Esvaziando spam...', 'info');
            setTimeout(() => {
                setDemoData(prev => ({ ...prev, spam: { ...prev.spam, count: 0, size: '0 MB' } }));
                showToast('Spam esvaziado!', 'success');
            }, 1500);
        } else {
            try {
                await emptySpam();
                showToast('Spam esvaziado!', 'success');
                await analyze();
            } catch (error) {
                showToast('Erro ao esvaziar spam', 'error');
            }
        }
    };

    const totalItems = cleanupCategories.reduce((sum, cat) => sum + cat.count, 0);
    const totalSize = cleanupCategories.reduce((sum, cat) => {
        const sizeNum = parseFloat(cat.size.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight flex items-center gap-3">
                        🧹 Limpeza
                        <Badge className="bg-green-500 text-xs">NOVO</Badge>
                    </h2>
                    <p className="text-muted-foreground">
                        O que não serve, sai. Sem negociação.
                    </p>
                </div>
                <Button onClick={handleAnalyze} disabled={loading} className="gap-2">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                    {loading ? 'Analisando...' : 'Analisar Caixa'}
                </Button>
            </div>

            {/* Score de Limpeza */}
            <Card className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border-green-500/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <HardDrive className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Resumo de Limpeza</CardTitle>
                                <CardDescription>Oportunidades identificadas</CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-muted-foreground">Espaço recuperável:</span>
                            <span className="font-medium">{totalSize.toFixed(0)} MB</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-muted-foreground">Total de itens:</span>
                            <span className="font-medium">{totalItems}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Categorias de Limpeza */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Categorias de Limpeza</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cleanupCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Card
                                key={category.id}
                                className="hover:shadow-md transition-all"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-2 rounded-lg bg-secondary ${category.color}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {category.count} itens
                                        </Badge>
                                    </div>
                                    <h4 className="font-semibold mb-1">{category.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{category.size}</span>
                                        <span className="text-xs text-muted-foreground">{category.action}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Ações Rápidas */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                    <CardDescription>Limpe sua caixa com um clique</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={handleEmptySpam}
                        disabled={loading || cleanupData.spam.count === 0}
                    >
                        <Trash2 className="h-4 w-4" />
                        Esvaziar Spam ({cleanupData.spam.count})
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={handleEmptyTrash}
                        disabled={loading || cleanupData.trash.count === 0}
                    >
                        <Trash2 className="h-4 w-4" />
                        Esvaziar Lixeira ({cleanupData.trash.count})
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
