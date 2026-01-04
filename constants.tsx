
import React from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  Trash2, 
  Tag, 
  Search, 
  Activity, 
  Settings, 
  ShieldCheck, 
  Zap, 
  Archive, 
  Bell, 
  Sparkles,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { SubscriptionStatus, UnsubscribeMethod, MailProvider } from './types';

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
  { label: 'Inscrições', icon: <Mail size={20} />, id: 'subscriptions' },
  { label: 'Labels', icon: <Tag size={20} />, id: 'labels' },
  { label: 'Consultas', icon: <Search size={20} />, id: 'queries' },
  { label: 'Atividade', icon: <Activity size={20} />, id: 'activity' },
];

export const FOOTER_ITEMS = [
  { label: 'Configurações', icon: <Settings size={20} />, id: 'settings' },
];

export const QUICK_ACTIONS = [
  { label: 'Limpar Newsletters', icon: <Zap size={18} />, color: 'bg-indigo-500' },
  { label: 'Limpar Promoções', icon: <Trash2 size={18} />, color: 'bg-red-500' },
  { label: 'Arquivar Updates', icon: <Archive size={18} />, color: 'bg-amber-500' },
];

export const MOCK_LABELS = [
  { id: 'l1', name: 'Financeiro', color: '#10b981', count: 124 },
  { id: 'l2', name: 'Trabalho', color: '#6366f1', count: 450 },
  { id: 'l3', name: 'Viagens', color: '#f59e0b', count: 32 },
  { id: 'l4', name: 'Importante', color: '#ef4444', count: 15 },
  { id: 'l5', name: 'Newsletters', color: '#8b5cf6', count: 847 },
];

export const MOCK_ACTIVITY = [
  { id: 'a1', action: 'Unsubscribe', details: 'Cancelou inscrição de Amazon.com.br', timestamp: '2 minutos atrás', status: 'success' },
  { id: 'a2', action: 'Cleanup', details: 'Limpou 156 emails de marketing antigos', timestamp: '15 minutos atrás', status: 'success' },
  { id: 'a3', action: 'Label', details: 'Criou nova label "Notas Fiscais"', timestamp: '1 hora atrás', status: 'success' },
  { id: 'a4', action: 'Archive', details: 'Arquivou 45 notificações do LinkedIn', timestamp: '3 horas atrás', status: 'success' },
  { id: 'a5', action: 'AI Scan', details: 'IA classificou 250 novos emails', timestamp: '5 horas atrás', status: 'success' },
  { id: 'a6', action: 'Cleanup', details: 'Limpou 1.2GB de anexos pesados', timestamp: 'Ontem', status: 'success' },
  { id: 'a7', action: 'Unsubscribe', details: 'Cancelou inscrição de Spotify Updates', timestamp: 'Ontem', status: 'success' },
  { id: 'a8', action: 'Security', details: 'Verificação de segurança concluída', timestamp: '2 dias atrás', status: 'success' },
  { id: 'a9', action: 'Sync', details: 'Sincronização com Hotmail finalizada', timestamp: '2 dias atrás', status: 'success' },
  { id: 'a10', action: 'Filter', details: 'Criou filtro automático para "Boletos"', timestamp: '3 dias atrás', status: 'success' },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Limpeza Concluída', message: '847 emails foram movidos para a lixeira.', time: '5m', icon: <CheckCircle2 size={16} className="text-emerald-500" /> },
  { id: 'n2', title: 'Nova Inscrição Detectada', message: 'Detectamos uma nova newsletter de "Hacker News".', time: '1h', icon: <Zap size={16} className="text-indigo-500" /> },
  { id: 'n3', title: 'Espaço Crítico', message: 'Seu armazenamento atingiu 92% da capacidade.', time: '3h', icon: <AlertCircle size={16} className="text-red-500" /> },
];

export const MOCK_SUBSCRIPTIONS = [
  {
    id: '1',
    senderName: 'Amazon.com.br',
    senderEmail: 'news@amazon.com.br',
    senderDomain: 'amazon.com.br',
    totalEmails: 847,
    totalSize: 127000000,
    lastEmailAt: '2025-01-02T10:00:00Z',
    frequency: 'daily',
    status: SubscriptionStatus.ACTIVE,
    method: UnsubscribeMethod.ONE_CLICK,
    category: 'Promotions',
    impactScore: 92
  },
  {
    id: '2',
    senderName: 'LinkedIn Weekly',
    senderEmail: 'newsletters@linkedin.com',
    senderDomain: 'linkedin.com',
    totalEmails: 432,
    totalSize: 52000000,
    lastEmailAt: '2024-12-28T14:30:00Z',
    frequency: 'weekly',
    status: SubscriptionStatus.ACTIVE,
    method: UnsubscribeMethod.MAILTO,
    category: 'Social',
    impactScore: 65
  },
  {
    id: '3',
    senderName: 'Spotify Updates',
    senderEmail: 'no-reply@spotify.com',
    senderDomain: 'spotify.com',
    totalEmails: 156,
    totalSize: 12000000,
    lastEmailAt: '2024-12-30T09:15:00Z',
    frequency: 'irregular',
    status: SubscriptionStatus.SILENCED,
    method: UnsubscribeMethod.URL,
    category: 'Updates',
    impactScore: 40
  },
  {
    id: '4',
    senderName: 'Vercel Blog',
    senderEmail: 'blog@vercel.com',
    senderDomain: 'vercel.com',
    totalEmails: 12,
    totalSize: 800000,
    lastEmailAt: '2024-12-01T08:00:00Z',
    frequency: 'monthly',
    status: SubscriptionStatus.ACTIVE,
    method: UnsubscribeMethod.ONE_CLICK,
    category: 'Work',
    impactScore: 10
  }
];
