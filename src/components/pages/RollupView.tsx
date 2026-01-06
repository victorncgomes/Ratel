import { useEffect, useState } from 'react';
import { useRules } from '../../hooks/useRules';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Package, Loader2, AlertCircle, Archive, CheckCircle } from 'lucide-react';
import { showToast } from '../../lib/toast';
import { authFetch } from '../../lib/api';

export function RollupView() {
    const { rules, loading, error, fetchRules } = useRules();
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const rollupRules = rules.filter(r => r.type === 'rollup');

    // Agrupar por remetente (simulado - em produção viria do backend)
    const groupedByS sender = rollupRules.reduce((acc, rule) => {
        if (!acc[rule.sender]) {
            acc[rule.sender] = {
                sender: rule.sender,
                count: Math.floor(Math.random() * 20) + 1, // Mock count
                createdAt: rule.createdAt
            };
        }
        return acc;
    }, {} as Record<string, { sender: string; count: number; createdAt: string }>);

    const groups = Object.values(groupedBySender);

    const handleArchiveAll = async (sender: string) => {
        setActionLoading(true);
        try {
            // Em produção, isso buscaria e arquivaria todos os emails desse remetente
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast(`Emails de ${sender} arquivados`, 'success');
            fetchRules();
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkAllRead = async (sender: string) => {
        setActionLoading(true);
        try {
            // Em produção, isso marcaria todos os emails como lidos
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast(`Emails de ${sender} marcados como lidos`, 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && rules.length === 0) {
        return (
            <div className=\"flex flex-col items-center justify-center py-20\">
                < Loader2 className =\"h-12 w-12 animate-spin text-primary mb-4\" />
                    < p > Carregando rollup...</p >
            </div >
        );
    }

    return (
        <div className=\"space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500\">
    {/* Header */ }
            <div>
                <h2 className=\"text-3xl font-bold tracking-tight flex items-center gap-3\">
                    <Package className=\"h-8 w-8 text-blue-600\" />
                    Rollup - Newsletters Agrupadas
                </h2>
                <p className=\"text-muted-foreground mt-1 text-lg\">
                    Suas newsletters favoritas organizadas em um só lugar
                </p >
            </div >

        {/* Stats */ }
        < div className =\"grid grid-cols-1 md:grid-cols-3 gap-4\">
            < Card >
            <CardContent className=\"p-4\">
                < div className =\"text-sm text-muted-foreground\">Total de Remetentes</div>
                    < div className =\"text-2xl font-bold\">{groups.length}</div>
                    </CardContent >
                </Card >
                <Card>
                    <CardContent className=\"p-4\">
                        <div className=\"text-sm text-muted-foreground\">Total de Emails</div>
                        <div className=\"text-2xl font-bold\">
    { groups.reduce((sum, g) => sum + g.count, 0) }
                        </div >
                    </CardContent >
                </Card >
                <Card>
                    <CardContent className=\"p-4\">
                        <div className=\"text-sm text-muted-foreground\">Espaço Economizado</div>
                        <div className=\"text-2xl font-bold\">~{Math.floor(groups.length * 2.5)} MB</div>
                    </CardContent >
                </Card >
            </div >

        {/* Error */ }
    {
        error && (
            <div className=\"p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-600\">
                < AlertCircle className =\"h-5 w-5\" />
                    < p > { error }</p >
                </div >
            )
    }

    {/* Groups */ }
    <div className=\"space-y-4\">
    {
        groups.length === 0 ? (
            <Card className=\"border-dashed\">
                < CardContent className =\"flex flex-col items-center justify-center py-12 text-center\">
                    < div className =\"p-4 bg-secondary rounded-full mb-4\">
                        < Package className =\"h-8 w-8 text-muted-foreground\" />
                            </div >
            <h3 className=\"font-semibold text-xl\">Nenhuma newsletter no Rollup</h3>
                < p className =\"text-muted-foreground max-w-sm mx-auto mt-2\">
                                Adicione newsletters ao Rollup para organizá - las em um só lugar
                            </p >
                        </CardContent >
                    </Card >
                ) : (
            groups.map((group) => (
                <Card key={group.sender} className=\"overflow-hidden hover:shadow-md transition-all\">
            < CardHeader className =\"pb-3\">
            < div className =\"flex items-center justify-between\">
            < div className =\"flex items-center gap-3\">
            < div className =\"p-2 rounded-lg bg-blue-100 text-blue-600\">
            < Package className =\"h-5 w-5\" />
                                        </div >
                                        <div>
                                            <CardTitle className=\"text-lg\">{group.sender}</CardTitle>
                                            <p className=\"text-sm text-muted-foreground mt-1\">
                                                { group.count } email{ group.count > 1 ? 's' : '' } agrupado{ group.count > 1 ? 's' : '' }
                                            </p >
                                        </div >
                                    </div >
                <Badge variant=\"secondary\">{group.count}</Badge>
                                </div >
                            </CardHeader >
                <CardContent className=\"pt-0\">
            < div className =\"flex gap-2\">
            < Button
                                        variant =\"outline\"
                                        size =\"sm\"
                                        onClick = {() => handleMarkAllRead(group.sender)}
    disabled = { actionLoading }
    className =\"gap-2\"
        >
        <CheckCircle className=\"h-4 w-4\" />
                                        Marcar como Lidas
                                    </Button >
        <Button
            variant=\"outline\"
    size =\"sm\"
    onClick = {() => handleArchiveAll(group.sender)
}
disabled = { actionLoading }
className =\"gap-2\"
    >
    <Archive className=\"h-4 w-4\" />
                                        Arquivar Todas
                                    </Button >
                                </div >
                            </CardContent >
                        </Card >
                    ))
                )}
            </div >

    {/* Info */ }
    < Card className =\"bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800\">
        < CardContent className =\"p-4 flex items-start gap-3\">
            < AlertCircle className =\"h-5 w-5 text-blue-600 mt-0.5\" />
                < div className =\"text-sm text-blue-900 dark:text-blue-100\">
                    < p className =\"font-medium mb-1\">Como funciona o Rollup?</p>
                        < p className =\"text-blue-700 dark:text-blue-300\">
                            Newsletters marcadas para Rollup são automaticamente agrupadas e organizadas.
                            Você pode ler quando quiser, sem poluir sua caixa de entrada principal.
                        </p >
                    </div >
                </CardContent >
            </Card >
        </div >
    );
}
