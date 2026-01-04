
import { Card } from '../ui/Card';
import { Mail, Trash2, Archive, Reply, Forward } from 'lucide-react';

const mockActivity = [
    { action: 'Respondeu email', target: 'Re: Projeto Ratel', time: '10 min atrás', icon: Reply, color: 'text-blue-500' },
    { action: 'Arquivou 15 emails', target: 'Newsletter Folder', time: '30 min atrás', icon: Archive, color: 'text-green-500' },
    { action: 'Excluiu permanentemente', target: 'Spam (5 itens)', time: '1 hora atrás', icon: Trash2, color: 'text-red-500' },
    { action: 'Encaminhou anexo', target: 'Fwd: Relatório Mensal', time: '2 horas atrás', icon: Forward, color: 'text-purple-500' },
    { action: 'Nova Inscrição', target: 'RocketSeat Newsletter', time: 'ontem', icon: Mail, color: 'text-yellow-500' },
];

export function ActivityPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Atividade Recente</h2>
                <p className="text-muted-foreground">Registro das suas últimas ações no sistema.</p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {mockActivity.map((item, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>

                        <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
                            <div className="font-bold text-slate-900">{item.action}</div>
                            <div className="text-sm text-slate-500">{item.target}</div>
                            <time className="block text-xs font-medium text-slate-400 mt-2">{item.time}</time>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
