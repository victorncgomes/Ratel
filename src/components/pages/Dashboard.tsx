import { useEffect, useState } from 'react';
import { Mail, Trash2, Shield, Zap, ArrowRight, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useStats } from '../../hooks/useStats';
import { mockStats } from '../../lib/mockData';
import { getAccessToken } from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { showToast } from '../../lib/toast';
import { useEmailLoader } from '../../hooks/useEmailLoader';

interface DashboardProps {
    onNavigate?: (tab: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardProps) {
    const { t } = useLanguage();
    const { stats, loading, fetchStats } = useStats();
    const [isDemoMode, setIsDemoMode] = useState(false);

    // Start progressive email loading in background
    useEmailLoader();

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
            title: t('dashboard.quick_actions.email_lists.title'),
            description: t('dashboard.quick_actions.email_lists.desc'),
            icon: Mail,
            color: 'bg-blue-500',
            count: 12,
            action: 'subscriptions'
        },
        {
            title: t('dashboard.quick_actions.quick_cleanup.title'),
            description: t('dashboard.quick_actions.quick_cleanup.desc'),
            icon: Trash2,
            color: 'bg-green-500',
            count: unreadCount,
            action: 'cleanup'
        },
        {
            title: t('dashboard.quick_actions.ratel_furious.title'),
            description: t('dashboard.quick_actions.ratel_furious.desc'),
            icon: Zap,
            color: 'bg-red-500',
            count: null,
            action: 'ratel'
        },
        {
            title: t('dashboard.quick_actions.shield.title'),
            description: t('dashboard.quick_actions.shield.desc'),
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

            {/* Main Stats - Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="glass" hover="lift" className="border-blue-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Na Caixa de Entrada</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : inboxCount}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl shadow-lg">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass" hover="lift" className="border-orange-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Não Lidos</p>
                                <p className="text-3xl font-bold text-orange-500">
                                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : unreadCount}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg">
                                <AlertCircle className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass" hover="lift" className="border-red-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Spam</p>
                                <p className="text-3xl font-bold text-red-500">
                                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : spamCount}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg">
                                <Trash2 className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions - Claymorphism Style */}
            <div>
                <h2 className="text-xl font-bold mb-4">{t('dashboard.quick_actions_title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        const handleClick = () => {
                            if (action.action === 'ratel') {
                                // Navigate to subscriptions for Ratel Furioso
                                if (onNavigate) onNavigate('subscriptions');
                                showToast('Ratel Furioso ativado! Navegando para inscrições...', 'success');
                            } else if (action.action === 'shield') {
                                if (onNavigate) onNavigate('rules');
                                showToast('Abrindo Shield...', 'success');
                            } else if (onNavigate) {
                                onNavigate(action.action);
                            }
                        };

                        return (
                            <Card
                                key={action.action}
                                variant="clay"
                                hover="lift"
                                className="group cursor-pointer"
                                onClick={handleClick}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-4">
                                        <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                {action.title}
                                                {action.count !== null && (
                                                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">{action.count}</span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Inbox Health - Glassmorphism Progress */}
            <Card variant="glass">
                <CardHeader>
                    <CardTitle className="gradient-text">Saúde da Caixa de Entrada</CardTitle>
                    <CardDescription>Quanto mais limpa, melhor sua produtividade</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span>Progresso para Inbox Zero</span>
                            <span className="font-bold text-green-500">
                                {Math.round((1 - unreadCount / Math.max(inboxCount, 1)) * 100)}%
                            </span>
                        </div>
                        <div className="h-4 bg-secondary/50 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 transition-all duration-500 rounded-full"
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
