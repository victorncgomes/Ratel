import React from 'react';
import { Mail, ShieldCheck, Zap, ArrowUpRight, ArrowDownRight, Sparkles, Trash2, Archive, Tag } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_CHART_DATA = [
  { name: 'Seg', emails: 120 },
  { name: 'Ter', emails: 340 },
  { name: 'Qua', emails: 280 },
  { name: 'Qui', emails: 450 },
  { name: 'Sex', emails: 390 },
  { name: 'Sab', emails: 150 },
  { name: 'Dom', emails: 90 },
];

const QUICK_ACTIONS = [
  { label: 'Limpar Newsletters', icon: <Trash2 size={18} />, color: 'bg-red-500' },
  { label: 'Arquivar Lidos', icon: <Archive size={18} />, color: 'bg-blue-500' },
  { label: 'Organizar Labels', icon: <Tag size={18} />, color: 'bg-green-500' },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Olá, Victor 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sua conta victor@outlook.com está sincronizada e segura.
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2">
          <Zap size={18} />
          Alcançar Inbox Zero
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total de Emails', value: '12.5K', change: '+12%', icon: <Mail size={20} />, positive: true },
          { label: 'Não Lidos', value: '847', change: '-5%', icon: <Zap size={20} />, positive: false },
          { label: 'Espaço Usado', value: '11.7GB', subtitle: '78% de 15GB', icon: <ShieldCheck size={20} />, progress: 78 },
          { label: 'Health Score', value: '78', subtitle: 'BOM', icon: <Sparkles size={20} fill="currentColor" />, isScore: true },
        ].map((stat, i) => (
          <div key={i} className="bg-background border border-border rounded-lg p-4 hover:border-primary transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-secondary text-primary rounded-lg">
                {stat.icon}
              </div>
              {stat.change && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              )}
              {stat.progress && (
                <div className="mt-3 w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="bg-background border border-border rounded-lg p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Volume de Emails</h2>
            <button className="text-xs text-muted-foreground hover:text-primary">
              Ver mais
            </button>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="emails"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEmails)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Atalhos Rápidos</h2>
          <div className="space-y-3">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-muted transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white ${action.color}`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}

            {/* Health Score */}
            <div className="pt-4 border-t border-border mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wider">
                Saúde do Inbox
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-4 border-primary flex items-center justify-center">
                  <span className="font-bold text-lg text-primary">78</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Seu inbox está Saudável</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    23 newsletters nunca abertas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
