import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../ui/Card';
import { Mail, Trash2, Archive, Reply, Forward } from 'lucide-react';

export function ActivityPage() {
    const { t } = useLanguage();

    const mockActivity = [
        {
            action: t('activity_page.items.replied'),
            target: 'Re: Projeto Ratel',
            time: `10 ${t('activity_page.time.min_ago')}`,
            icon: Reply,
            color: 'text-blue-500'
        },
        {
            action: t('activity_page.items.archived'),
            target: 'Newsletter Folder',
            time: `30 ${t('activity_page.time.min_ago')}`,
            icon: Archive,
            color: 'text-green-500'
        },
        {
            action: t('activity_page.items.deleted_permanent'),
            target: 'Spam (5 itens)',
            time: `1 ${t('activity_page.time.hour_ago')}`,
            icon: Trash2,
            color: 'text-red-500'
        },
        {
            action: t('activity_page.items.forwarded'),
            target: 'Fwd: Relatório Mensal',
            time: `2 ${t('activity_page.time.hours_ago')}`,
            icon: Forward,
            color: 'text-purple-500'
        },
        {
            action: t('activity_page.items.new_subscription'),
            target: 'RocketSeat Newsletter',
            time: t('activity_page.time.yesterday'),
            icon: Mail,
            color: 'text-yellow-500'
        },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2 mb-6">
                <h2 className="text-3xl font-heading font-bold tracking-tight">{t('activity_page.title')}</h2>
                <p className="text-muted-foreground">{t('activity_page.subtitle')}</p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {mockActivity.map((item, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>

                        <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 hover:shadow-md transition-shadow">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{item.action}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{item.target}</div>
                            <time className="block text-xs font-medium text-slate-400 mt-2">{item.time}</time>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
