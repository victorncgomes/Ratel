
import React, { useState } from 'react';
import { Card, Button, Badge } from './DesignSystem';
import { Tag, Plus, Trash2, Edit2, Search } from 'lucide-react';
import { MOCK_LABELS } from '../constants';

export const LabelManager: React.FC = () => {
  const [labels, setLabels] = useState(MOCK_LABELS);
  const [search, setSearch] = useState('');

  const filteredLabels = labels.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  const removeLabel = (id: string) => {
    setLabels(labels.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl font-bold text-zinc-900">Gerenciador de Labels</h1>
          <p className="text-zinc-500 text-sm">Organize seu inbox de forma inteligente e nativa.</p>
        </div>
        <Button variant="primary">
          <Plus size={18} />
          Nova Label
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar labels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border-none outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLabels.map((label) => (
            <div key={label.id} className="p-4 rounded-2xl border border-zinc-100 bg-white flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full shadow-inner" 
                  style={{ backgroundColor: label.color }} 
                />
                <div>
                  <h4 className="font-bold text-zinc-800 text-sm">{label.name}</h4>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{label.count} emails</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-indigo-600 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => removeLabel(label.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          
          <button className="p-4 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group">
            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-100 group-hover:text-indigo-500 transition-all">
              <Plus size={18} />
            </div>
            <span className="text-xs font-bold text-zinc-400 group-hover:text-indigo-600">Adicionar Label</span>
          </button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Sugestões da IA" showDots variant="featured">
          <div className="space-y-4">
            <p className="text-sm opacity-90 leading-relaxed">Detectamos muitos emails recorrentes de <strong>"Bancos"</strong>. Deseja criar uma regra automática para rotulá-los?</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">Personalizar</Button>
              <Button variant="primary" size="sm" className="bg-white text-indigo-600 shadow-none hover:bg-zinc-100">Criar Agora</Button>
            </div>
          </div>
        </Card>
        
        <Card title="Estatísticas de Labels" showDots>
          <div className="space-y-3">
            {[
              { label: 'Trabalho', percent: 65, color: 'bg-indigo-500' },
              { label: 'Financeiro', percent: 12, color: 'bg-emerald-500' },
              { label: 'Social', percent: 18, color: 'bg-red-500' },
              { label: 'Outros', percent: 5, color: 'bg-zinc-400' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase">
                  <span>{stat.label}</span>
                  <span>{stat.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className={`h-full ${stat.color}`} style={{ width: `${stat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
