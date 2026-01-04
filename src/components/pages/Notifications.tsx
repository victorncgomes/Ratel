import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/Button';
import { Star, UserPlus, Shield, Zap } from 'lucide-react';

export function NotificationsPage() {
    const { t } = useLanguage();

    const notifications = [
        {
            id: 1,
            title: t('notifications_page.items.login.title'),
            description: t('notifications_page.items.login.description'),
            time: 'Há 2 minutos',
            icon: Shield,
            color: 'bg-yellow-100 text-yellow-600',
            read: false
        },
        {
            id: 2,
            title: t('notifications_page.items.inbox_zero.title'),
            description: t('notifications_page.items.inbox_zero.description'),
            time: 'Há 1 hora',
            icon: Star,
            color: 'bg-green-100 text-green-600',
            read: false
        },
        {
            id: 3,
            title: t('notifications_page.items.update.title'),
            description: t('notifications_page.items.update.description'),
            time: 'Há 5 horas',
            icon: Zap,
            color: 'bg-blue-100 text-blue-600',
            read: true
        },
        {
            id: 4,
            title: t('notifications_page.items.follower.title'),
            description: t('notifications_page.items.follower.description'),
            time: 'Ontem',
            icon: UserPlus,
            color: 'bg-purple-100 text-purple-600',
            read: true
        }
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">{t('notifications_page.title')}</h2>
                <Button variant="ghost" size="sm">{t('notifications_page.mark_all_read')}</Button>
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
                                    <Button size="sm" variant="secondary" className="h-7 text-xs">{t('notifications_page.mark_read')}</Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
