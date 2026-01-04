import { Button } from '../ui/Button';
import { Star, UserPlus } from 'lucide-react';

export function NotificationsPage() {
    const notifications = [
        {
            id: 1,
            title: 'Novo login detectado',
            description: 'Um novo login foi realizado no dispositivo "Chrome no Windows".',
            time: 'Há 2 minutos',
            icon: ShieldIcon,
            color: 'bg-yellow-100 text-yellow-600',
            read: false
        },
        {
            id: 2,
            title: 'Meta de Inbox Zero atingida!',
            description: 'Parabéns! Você limpou sua caixa de entrada 3 dias seguidos.',
            time: 'Há 1 hora',
            icon: Star,
            color: 'bg-green-100 text-green-600',
            read: false
        },
        {
            id: 3,
            title: 'Atualização do Sistema',
            description: 'O Ratel foi atualizado para a versão 2.1 com novos recursos.',
            time: 'Há 5 horas',
            icon: ZapIcon,
            color: 'bg-blue-100 text-blue-600',
            read: true
        },
        {
            id: 4,
            title: 'Novo seguidor',
            description: 'Rafael Silva começou a seguir suas listas públicas.',
            time: 'Ontem',
            icon: UserPlus,
            color: 'bg-purple-100 text-purple-600',
            read: true
        }
    ];

    function ShieldIcon(props: any) { return <div {...props}>🛡️</div> }
    function ZapIcon(props: any) { return <div {...props}>⚡</div> }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Notificações</h2>
                <Button variant="ghost" size="sm">Marcar todas como lidas</Button>
            </div>

            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex gap-4 p-4 rounded-xl border transition-colors ${notification.read ? 'bg-background' : 'bg-muted/30 border-primary/20'}`}
                    >
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notification.color}`}>
                            <notification.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className={`font-medium ${!notification.read && 'text-primary'}`}>{notification.title}</p>
                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            {!notification.read && (
                                <div className="pt-2">
                                    <Button size="sm" variant="secondary" className="h-7 text-xs">Marcar como lida</Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
