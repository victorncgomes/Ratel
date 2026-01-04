
import React, { useState } from 'react';
import { Card, Badge, Button } from './DesignSystem';
import { MOCK_SUBSCRIPTIONS } from '../constants';
import { Trash2, ShieldOff, BellOff, ExternalLink, Zap, CheckCircle2 } from 'lucide-react';

export const SubscriptionCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'silenced' | 'unsubscribed'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUnsub = (id: string) => {
    setProcessingId(id);
    setTimeout(() => setProcessingId(null), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl font-bold text-zinc-900">Subscription Center</h1>
          <p className="text-zinc-500 text-sm">Controle granular de todas as suas inscrições.</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
          {['all', 'active', 'silenced', 'unsubscribed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-500'}`}
            >
              {tab === 'all' ? 'Todas' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_SUBSCRIPTIONS.map((sub) => (
          <Card key={sub.id} className="relative group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold border border-zinc-200 group-hover:bg-indigo-50 transition-colors">
                  {sub.senderName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 flex items-center gap-1.5">
                    {sub.senderName}
                    {sub.method === 'ONE_CLICK' && <Zap size={14} className="text-emerald-500 fill-emerald-500" />}
                  </h3>
                  <p className="text-xs text-zinc-500">{sub.senderEmail}</p>
                </div>
              </div>
              <Badge variant={sub.status.toLowerCase()}>{sub.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-50/80 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-0.5">Volume</p>
                <p className="text-sm font-bold text-zinc-800">{sub.totalEmails} emails</p>
              </div>
              <div className="bg-zinc-50/80 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-0.5">Espaço</p>
                <p className="text-sm font-bold text-zinc-800">{(sub.totalSize / 1000000).toFixed(1)} MB</p>
              </div>
              <div className="bg-zinc-50/80 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-0.5">Frequência</p>
                <p className="text-sm font-bold text-zinc-800 capitalize">{sub.frequency}</p>
              </div>
              <div className="bg-zinc-50/80 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-0.5">Último</p>
                <p className="text-sm font-bold text-zinc-800">{new Date(sub.lastEmailAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100">
              <Button 
                variant="primary" 
                size="sm" 
                className="flex-1"
                onClick={() => handleUnsub(sub.id)}
                isLoading={processingId === sub.id}
              >
                {processingId === sub.id ? 'Processando' : (
                  <>
                    <Zap size={14} />
                    Unsub + Del
                  </>
                )}
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="px-2" title="Silenciar">
                  <BellOff size={14} />
                </Button>
                <Button variant="secondary" size="sm" className="px-2" title="Marcar Spam">
                  <ShieldOff size={14} />
                </Button>
                <Button variant="secondary" size="sm" className="px-2" title="Excluir Histórico">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            {sub.method === 'ONE_CLICK' && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[9px] font-bold border border-emerald-100 flex items-center gap-1 shadow-sm">
                  <CheckCircle2 size={10} />
                  ONE-CLICK
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
