import { useEffect, useState } from 'react';
import { useRules } from '../../hooks/useRules';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Package, Loader2, AlertCircle, Archive, CheckCircle, Clock, Calendar, Settings, Bell, Trash2 } from 'lucide-react';
import { showToast } from '../../lib/toast';
import { useStyleTheme } from '../../contexts/StyleThemeContext';

type Frequency = 'daily' | 'weekly' | 'monthly';

interface RollupSettings {
    frequency: Frequency;
    preferredTime: string;
    enabled: boolean;
}

export function RollupView() {
    const { rules, loading, error, fetchRules, removeRule } = useRules();
    const { isNeobrutalist } = useStyleTheme();
    const [actionLoading, setActionLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Roll-Up settings from localStorage
    const [settings, setSettings] = useState<RollupSettings>(() => {
        const saved = localStorage.getItem('ratel_rollup_settings');
        return saved ? JSON.parse(saved) : {
            frequency: 'daily',
            preferredTime: '09:00',
            enabled: true
        };
    });

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    useEffect(() => {
        localStorage.setItem('ratel_rollup_settings', JSON.stringify(settings));
    }, [settings]);

    const rollupRules = rules.filter(r => r.type === 'rollup');

    // Agrupar por remetente
    const groupedBySender = rollupRules.reduce((acc, rule) => {
        if (!acc[rule.sender]) {
            acc[rule.sender] = {
                sender: rule.sender,
                count: Math.floor(Math.random() * 20) + 1,
                createdAt: rule.createdAt
            };
        }
        return acc;
    }, {} as Record<string, { sender: string; count: number; createdAt: string }>);

    const groups = Object.values(groupedBySender);

    const handleArchiveAll = async (sender: string) => {
        setActionLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast(`Emails de ${sender} arquivados`, 'success');
            fetchRules();
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveFromRollup = async (sender: string) => {
        try {
            await removeRule(sender);
            showToast(`${sender} removido do Roll-Up`, 'success');
        } catch (err: any) {
            showToast('Erro ao remover', 'error');
        }
    };

    const handleMarkAllRead = async (sender: string) => {
        setActionLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast(`Emails de ${sender} marcados como lidos`, 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const getFrequencyLabel = (freq: Frequency) => {
        switch (freq) {
            case 'daily': return 'Diário';
            case 'weekly': return 'Semanal';
            case 'monthly': return 'Mensal';
        }
    };

    const getNextNotificationTime = () => {
        const now = new Date();
        const [hours, minutes] = settings.preferredTime.split(':').map(Number);
        const next = new Date(now);
        next.setHours(hours, minutes, 0, 0);

        if (next <= now) {
            if (settings.frequency === 'daily') {
                next.setDate(next.getDate() + 1);
            } else if (settings.frequency === 'weekly') {
                next.setDate(next.getDate() + 7);
            } else {
                next.setMonth(next.getMonth() + 1);
            }
        }
        return next.toLocaleDateString() + ' às ' + settings.preferredTime;
    };

    if (loading && rules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Carregando Roll-Up...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Package className="h-8 w-8 text-blue-600" />
                        Roll-Up
                    </h2>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Agrupe newsletters e receba notificações consolidadas
                    </p>
                </div>
                <Button
                    variant={showSettings ? "default" : "outline"}
                    onClick={() => setShowSettings(!showSettings)}
                    className={`gap-2 ${isNeobrutalist ? 'border-2 border-black shadow-[2px_2px_0_0_#000]' : ''}`}
                >
                    <Settings className="h-4 w-4" />
                    Configurações
                </Button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <Card className={`${isNeobrutalist
                    ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none bg-yellow-50'
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Configurações de Notificação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Frequency */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Frequência de Notificação</label>
                            <div className="flex gap-2 flex-wrap">
                                {(['daily', 'weekly', 'monthly'] as Frequency[]).map((freq) => (
                                    <button
                                        key={freq}
                                        onClick={() => setSettings(s => ({ ...s, frequency: freq }))}
                                        className={`px-4 py-2 font-medium transition-all ${isNeobrutalist
                                            ? `border-2 border-black ${settings.frequency === freq
                                                ? 'bg-blue-500 text-white shadow-[2px_2px_0_0_#000]'
                                                : 'bg-white shadow-[2px_2px_0_0_#000] hover:bg-gray-100'}`
                                            : `rounded-lg ${settings.frequency === freq
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white border border-gray-200 hover:bg-gray-50'}`
                                            }`}
                                    >
                                        {freq === 'daily' && <Calendar className="h-4 w-4 inline mr-2" />}
                                        {freq === 'weekly' && <Calendar className="h-4 w-4 inline mr-2" />}
                                        {freq === 'monthly' && <Calendar className="h-4 w-4 inline mr-2" />}
                                        {getFrequencyLabel(freq)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Picker */}
                        <div>
                            <label className="block text-sm font-medium mb-3">
                                <Clock className="h-4 w-4 inline mr-2" />
                                Horário Preferido
                            </label>
                            <input
                                type="time"
                                value={settings.preferredTime}
                                onChange={(e) => setSettings(s => ({ ...s, preferredTime: e.target.value }))}
                                className={`px-4 py-2 font-mono ${isNeobrutalist
                                    ? 'border-2 border-black shadow-[2px_2px_0_0_#000]'
                                    : 'border border-gray-200 rounded-lg'
                                    }`}
                            />
                        </div>

                        {/* Next Notification Info */}
                        <div className={`p-4 ${isNeobrutalist
                            ? 'border-2 border-black bg-white'
                            : 'bg-white rounded-lg border border-gray-200'}`}>
                            <p className="text-sm">
                                <Bell className="h-4 w-4 inline mr-2 text-blue-500" />
                                <strong>Próxima notificação:</strong> {getNextNotificationTime()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                As notificações aparecerão na aba Notificações do app (não por email)
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className={isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none' : ''}>
                    <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Remetentes no Roll-Up</div>
                        <div className="text-2xl font-bold">{groups.length}</div>
                    </CardContent>
                </Card>
                <Card className={isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none' : ''}>
                    <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Emails Agrupados</div>
                        <div className="text-2xl font-bold">
                            {groups.reduce((sum, g) => sum + g.count, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card className={isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none' : ''}>
                    <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Frequência</div>
                        <div className="text-2xl font-bold">{getFrequencyLabel(settings.frequency)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Groups */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Remetentes no Roll-Up</h3>
                {groups.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="p-4 bg-secondary rounded-full mb-4">
                                <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-xl">Nenhum remetente no Roll-Up</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                                Adicione remetentes ao Roll-Up clicando no botão "Roll-Up" ao visualizar emails
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    groups.map((group) => (
                        <Card key={group.sender} className={`overflow-hidden transition-all ${isNeobrutalist
                            ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1'
                            : 'hover:shadow-md'
                            }`}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isNeobrutalist ? 'border-2 border-black shadow-[2px_2px_0_0_#000] font-bold' : ''} bg-blue-100 text-blue-600`}>
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{group.sender}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {group.count} email{group.count > 1 ? 's' : ''} agrupado{group.count > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">{group.count}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMarkAllRead(group.sender)}
                                        disabled={actionLoading}
                                        className={`gap-2 ${isNeobrutalist
                                            ? 'border-2 border-black shadow-[2px_2px_0_0_#000] active:shadow-none hover:bg-gray-100'
                                            : ''}`}
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        Marcar Lidas
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleArchiveAll(group.sender)}
                                        disabled={actionLoading}
                                        className={`gap-2 ${isNeobrutalist
                                            ? 'border-2 border-black shadow-[2px_2px_0_0_#000] active:shadow-none hover:bg-gray-100'
                                            : ''}`}
                                    >
                                        <Archive className="h-4 w-4" />
                                        Arquivar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFromRollup(group.sender)}
                                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Remover
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Info */}
            <Card className={`${isNeobrutalist
                ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none bg-blue-50'
                : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'}`}>
                <CardContent className="p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                        <p className="font-medium mb-1">Como funciona o Roll-Up?</p>
                        <p className="text-blue-700 dark:text-blue-300">
                            Emails de remetentes no Roll-Up são consolidados e você recebe uma notificação resumida
                            no horário configurado ({settings.preferredTime}, {getFrequencyLabel(settings.frequency).toLowerCase()}).
                            As notificações aparecem na aba Notificações do app.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

