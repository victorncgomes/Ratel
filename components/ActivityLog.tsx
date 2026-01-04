
import React from 'react';
import { Card, Badge, Button } from './DesignSystem';
import { MOCK_ACTIVITY } from '../constants';
import { CheckCircle2, RotateCcw, Filter, Trash2, Zap, Clock } from 'lucide-react';

export const ActivityLog: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl font-bold text-zinc-900">Histórico de Atividades</h1>
          <p className="text-zinc-500 text-sm">Acompanhe cada ação realizada pela plataforma ou por você.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Filter size={16} />
            Filtrar
          </Button>
          <Button variant="danger" size="sm">
            Limpar Log
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">Ação</th>
                <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">Detalhes</th>
                <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">Quando</th>
                <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">Status</th>
                <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {MOCK_ACTIVITY.map((item) => (
                <tr key={item.id} className="group hover:bg-zinc-50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <ActionIcon type={item.action} />
                      <span className="text-sm font-bold text-zinc-700">{item.action}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-sm text-zinc-600">{item.details}</span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Clock size={12} />
                      {item.timestamp}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <Badge variant="active">Concluído</Badge>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <button className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all inline-flex items-center gap-1.5 font-bold text-[10px] uppercase">
                      <RotateCcw size={14} />
                      Desfazer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" size="sm">Carregar mais atividades</Button>
        </div>
      </Card>
    </div>
  );
};

const ActionIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type.toLowerCase()) {
    case 'unsubscribe': return <div className="text-indigo-500"><Zap size={14} /></div>;
    case 'cleanup': return <div className="text-red-500"><Trash2 size={14} /></div>;
    case 'label': return <div className="text-emerald-500"><CheckCircle2 size={14} /></div>;
    default: return <div className="text-amber-500"><Clock size={14} /></div>;
  }
};
