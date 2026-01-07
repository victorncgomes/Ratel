import { useState, useEffect } from 'react';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/badge';
import {
    Trash2, Mail, FileText, AlertTriangle, Sparkles,
    Loader2, HardDrive, Clock, Paperclip
} from 'lucide-react';
import { showToast } from '../../lib/toast';
import { useCleanup } from '../../hooks/useCleanup';
import { getAccessToken } from '../../lib/api';
import { useStyleTheme } from '../../contexts/StyleThemeContext';

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
    const { isNeobrutalist } = useStyleTheme();
    const { analysis, loading, analyze, emptyTrash, emptySpam } = useCleanup();

    useEffect(() => {
        const hasToken = getAccessToken();
        setIsDemoMode(!hasToken);
        // Em modo demo ou real, vamos disparar a análise inicial se não houver
        if (!analysis) {
            analyze().catch(console.error);
        }
    }, [analyze, analysis]);

    // Usar dados da análise do hook (que já lida com demo mode)
    const cleanupData = analysis ? {
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
    };

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
        try {
            await analyze();
            showToast('Análise concluída!', 'success');
        } catch (error) {
            showToast('Erro ao analisar.', 'error');
        }
    };

    const handleEmptyTrash = async () => {
        try {
            await emptyTrash();
            showToast('Lixeira esvaziada!', 'success');
            if (!isDemoMode) await analyze();
        } catch (error) {
            showToast('Erro ao esvaziar lixeira', 'error');
        }
    };

    const handleEmptySpam = async () => {
        try {
            await emptySpam();
            showToast('Spam esvaziado!', 'success');
            if (!isDemoMode) await analyze();
        } catch (error) {
            showToast('Erro ao esvaziar spam', 'error');
        }
    };

    const totalItems = cleanupCategories.reduce((sum, cat) => sum + cat.count, 0);
    const totalSizeStr = cleanupCategories.reduce((sum, cat) => {
        const sizeNum = parseFloat(cat.size.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0).toFixed(1);

    const stats = [
        {
            label: 'Espaço Recuperável',
            value: `${totalSizeStr} MB`,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            icon: HardDrive
        },
        {
            label: 'Total de Itens',
            value: totalItems,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            icon: Mail
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="Limpeza"
                description="O que não serve, sai. Sem negociação."
                stats={stats}
                loading={loading}
                action={
                    <Button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className={`gap-2 ${isNeobrutalist
                            ? 'font-black uppercase tracking-wide border-4 border-black shadow-[4px_4px_0_0_#000] bg-[#E63946] text-white hover:translate-y-1 hover:shadow-none transition-all'
                            : ''}`}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}
                        {loading ? 'ANALISANDO...' : 'ANALISAR CAIXA'}
                    </Button>
                }
            />

            {/* Categorias de Limpeza */}
            <div>
                <h3 className={`text-lg font-bold mb-4 ${isNeobrutalist ? 'uppercase font-black' : ''}`}>Categorias de Limpeza</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cleanupCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Card
                                key={category.id}
                                variant="clay"
                                hover="lift"
                                className={`group cursor-pointer transition-all duration-300 ${isNeobrutalist
                                    ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 bg-white'
                                    : ''}`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${category.color === 'text-blue-500' ? 'from-blue-400 to-blue-600' : category.color === 'text-orange-500' ? 'from-orange-400 to-orange-600' : category.color === 'text-yellow-500' ? 'from-yellow-400 to-yellow-600' : category.color === 'text-purple-500' ? 'from-purple-400 to-purple-600' : category.color === 'text-red-500' ? 'from-red-400 to-red-600' : 'from-gray-400 to-gray-600'} shadow-lg border-2 border-black`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs font-black border-2 border-black">
                                            {category.count} ITENS
                                        </Badge>
                                    </div>
                                    <h4 className="font-black text-lg mb-1 uppercase">{category.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-4 font-medium">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-4 padding-top-2 border-t-2 border-dashed border-gray-200">
                                        <span className="text-sm font-black text-black">{category.size}</span>
                                        <span className="text-xs text-primary font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-300 px-2 py-1 border border-black shadow-[2px_2px_0_0_#000]">
                                            {category.action} ➔
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Ações Rápidas */}
            <Card variant="glass" className={`${isNeobrutalist ? 'border-4 border-black shadow-[6px_6px_0_0_#000] rounded-none' : ''}`}>
                <CardHeader>
                    <CardTitle className={`text-lg ${isNeobrutalist ? 'font-black uppercase' : ''}`}>Ações Rápidas</CardTitle>
                    <CardDescription>Limpe sua caixa com um clique</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        className={`gap-2 ${isNeobrutalist ? 'border-2 border-black shadow-[3px_3px_0_0_#000] font-black uppercase tracking-wide bg-[#E63946] text-white hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1' : ''}`}
                        onClick={handleEmptySpam}
                        disabled={loading || cleanupData.spam.count === 0}
                    >
                        <Trash2 className="h-4 w-4" />
                        ESVAZIAR SPAM ({cleanupData.spam.count})
                    </Button>
                    <Button
                        variant="outline"
                        className={`gap-2 ${isNeobrutalist ? 'border-2 border-black shadow-[3px_3px_0_0_#000] font-black uppercase tracking-wide hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1' : ''}`}
                        onClick={handleEmptyTrash}
                        disabled={loading || cleanupData.trash.count === 0}
                    >
                        <Trash2 className="h-4 w-4" />
                        ESVAZIAR LIXEIRA ({cleanupData.trash.count})
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
