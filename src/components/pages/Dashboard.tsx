import { useEffect, useState } from 'react';
import { TrendingUp, Users, Clock, Mail, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Button } from '../ui/Button';

import { useLanguage } from '../../contexts/LanguageContext';
import { useStats } from '../../hooks/useStats';
import { useAnalytics } from '../../hooks/useAnalytics';
import { mockStats, mockAnalytics } from '../../lib/mockData';
import { getAccessToken } from '../../lib/api';

export function DashboardPage() {
    const { t } = useLanguage();
    const { stats, loading: statsLoading, fetchStats } = useStats();
    const { analytics, loading: analyticsLoading, fetchAnalytics } = useAnalytics();
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        // Detectar modo demo (sem token de acesso)
        const hasToken = getAccessToken();
        setIsDemoMode(!hasToken);

        if (hasToken) {
            fetchStats();
            fetchAnalytics();
        }
    }, [fetchStats, fetchAnalytics]);

    const loading = statsLoading || analyticsLoading;

    // Usar dados mockados em modo demo, senão dados reais
    const weeklyData = isDemoMode ? mockAnalytics.weeklyVolume : (analytics?.weeklyVolume || []);
    const hourlyData = isDemoMode ? mockAnalytics.hourlyActivity : (analytics?.hourlyActivity || []);
    const categoriesData = isDemoMode ? mockAnalytics.categories : (analytics?.categories || []);
    const metrics = isDemoMode ? mockAnalytics.metrics : analytics?.metrics;

    // Stats
    const inboxCount = isDemoMode ? mockStats.inboxCount : (stats?.inboxCount || 0);
    const unreadCount = isDemoMode ? mockStats.unreadCount : (stats?.unreadCount || 0);
    const spamCount = isDemoMode ? mockStats.spamCount : (stats?.spamCount || 0);

    const handleRefresh = () => {
        if (isDemoMode) {
            // Em modo demo, simular refresh
            window.location.reload();
        } else {
            fetchStats();
            fetchAnalytics();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header com Badge Demo */}
            {isDemoMode && (
                <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <div>
                            <p className="font-medium text-yellow-900 dark:text-yellow-100">Modo Demonstração</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Você está visualizando dados simulados. Faça login para ver seus dados reais.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Atualizar
                    </Button>
                </div>
            )}

            {/* Top Stats - Dados Reais ou Mockados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('dashboard.received_emails')}</CardTitle>
                        <Mail className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : inboxCount}
                        </div>
                        <p className="text-xs text-muted-foreground">Total na Caixa de Entrada</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-500">Não Lidos</CardTitle>
                        <Clock className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : unreadCount}
                        </div>
                        <p className="text-xs text-muted-foreground">Emails precisam de atenção</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('dashboard.spam_blocked')}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : spamCount}
                        </div>
                        <p className="text-xs text-muted-foreground">Identificados como Spam</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('dashboard.reading_time')}</CardTitle>
                        <AlertCircle className="h-4 w-4 text-fluent-orange" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (metrics?.estimatedReadingTime || '--')}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {metrics ? `${metrics.avgDailyEmails} emails/dia em média` : 'Tempo médio estimado'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section - DADOS REAIS */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Main Chart - Volume Semanal Colorido */}
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>{t('dashboard.weekly_volume')}</CardTitle>
                        <CardDescription>
                            {metrics ? `${metrics.last7Days} emails nos últimos 7 dias` : t('dashboard.processed_emails_7_days')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : weeklyData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyData}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="emails" radius={[4, 4, 0, 0]}>
                                            {weeklyData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    Sem dados disponíveis
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Categorias Chart */}
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t('dashboard.categories')}</CardTitle>
                        <CardDescription>{t('dashboard.distribution_received')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            {loading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            ) : categoriesData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoriesData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoriesData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground">Sem dados</div>
                            )}
                        </div>
                        <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground flex-wrap">
                            {categoriesData.map((item) => (
                                <div key={item.name} className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.name} ({item.value})
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Atividade Horária & Saúde */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.hourly_activity')}</CardTitle>
                        <CardDescription>{t('dashboard.peak_reception')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : hourlyData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={hourlyData}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={10} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={{ fill: 'hsl(var(--primary))' }}
                                        />
                                        <Tooltip />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    Sem dados
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.inbox_health')}</CardTitle>
                        <CardDescription>{t('dashboard.current_status')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${unreadCount === 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-orange-100 dark:bg-orange-900/20'}`}>
                                    {unreadCount === 0 ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                                    ) : (
                                        <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {unreadCount === 0 ? t('dashboard.inbox_zero') : `${unreadCount} não lidos`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {unreadCount === 0 ? t('dashboard.keeping_rhythm') : 'Você tem emails pendentes'}
                                    </p>
                                </div>
                            </div>
                            <span className={`font-bold ${unreadCount === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                {unreadCount === 0 ? '100%' : `${Math.round((1 - unreadCount / Math.max(inboxCount, 1)) * 100)}%`}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-medium">Emails Processados</p>
                                    <p className="text-sm text-muted-foreground">
                                        {metrics ? `${metrics.last30Days} nos últimos 30 dias` : 'Calculando...'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-blue-600 font-bold">{metrics?.totalEmails || '--'}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
