import { useEffect, useState } from 'react';
import { Mail, Trash2, Shield, Zap, ArrowRight, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useStats } from '../../hooks/useStats';
import { mockStats } from '../../lib/mockData';
import { getAccessToken } from '../../lib/api';

export function DashboardPage() {
    const { stats, loading, fetchStats } = useStats();
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        const hasToken = getAccessToken();
        setIsDemoMode(!hasToken);
        if (hasToken) {
            fetchStats();
        }
    }, [fetchStats]);

    const inboxCount = isDemoMode ? mockStats.inboxCount : (stats?.inboxCount || 0);
    const unreadCount = isDemoMode ? mockStats.unreadCount : (stats?.unreadCount || 0);
    const spamCount = isDemoMode ? mockStats.spamCount : (stats?.spamCount || 0);

    const quickActions = [
        {
            title: 'Listas de Email',
            description: 'Gerencie suas inscrições',
            icon: Mail,
            color: 'bg-blue-500',
            count: 12,
            action: 'subscriptions'
        },
        {
            title: 'Limpeza Rápida',
            description: 'Libere espaço na caixa',
            icon: Trash2,
            color: 'bg-green-500',
            count: unreadCount,
            action: 'cleanup'
        },
        {
            title: 'Ratel Furioso',
            description: 'Cancelar tudo de uma vez',
            icon: Zap,
            color: 'bg-red-500',
            count: null,
            action: 'ratel'
        },
        {
            title: 'Shield',
            description: 'Remetentes bloqueados',
            icon: Shield,
            color: 'bg-purple-500',
            count: 3,
            action: 'shield'
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Demo Mode Banner */}
            {isDemoMode && (
                <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <div>
                            <p className="font-medium text-yellow-900 dark:text-yellow-100">Modo Demonstração</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Dados simulados. Faça login para ver seus dados reais.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Atualizar
                    </Button>
                </div>
            )}

            {/* Main Stats - Clean and Simple */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Na Caixa de Entrada</p>
                                <p className="text-3xl font-bold">
                                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : inboxCount}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Não Lidos</p>
                                <p className="text-3xl font-bold text-orange-600">
                                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : unreadCount}
                                </p>
                            </div>
                            <div className="p-3 bg-orange-500/20 rounded-xl">
                                <AlertCircle className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Spam</p>
                                <p className="text-3xl font-bold text-red-600">
                                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : spamCount}
                                </p>
                            </div>
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions - Inbox Zapper Style */}
            <div>
                <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Card
                                key={action.action}
                                className="group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                            >
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-4">
                                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold flex items-center gap-2">
                                                {action.title}
                                                {action.count !== null && (
                                                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{action.count}</span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">{action.description}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Inbox Health - Simple Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Saúde da Caixa de Entrada</CardTitle>
                    <CardDescription>Quanto mais limpa, melhor sua produtividade</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span>Progresso para Inbox Zero</span>
                            <span className="font-bold text-green-600">
                                {Math.round((1 - unreadCount / Math.max(inboxCount, 1)) * 100)}%
                            </span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500"
                                style={{ width: `${Math.round((1 - unreadCount / Math.max(inboxCount, 1)) * 100)}%` }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {unreadCount === 0
                                ? '🎉 Parabéns! Você atingiu o Inbox Zero!'
                                : `Você tem ${unreadCount} emails não lidos para processar.`
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
