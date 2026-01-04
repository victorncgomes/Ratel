// Dados mockados para versão demo do RATEL
// Usado quando não há usuário autenticado

export interface MockEmail {
    id: string;
    from: string;
    fromName: string;
    subject: string;
    snippet: string;
    date: string;
    isRead: boolean;
    hasAttachment: boolean;
    size: number; // em bytes
    labels: string[];
}

export interface MockSubscription {
    id: number;
    name: string;
    email: string;
    domain: string;
    freq: string;
    status: string;
    score: number;
    count: number;
    color: string;
    hasUnsubscribe: boolean;
    unsubscribeLink: string;
    lastEmail: string;
    emailIds: string[];
}

export interface MockCleanupCategory {
    id: string;
    count: number;
    size: string;
}

// 50+ emails mockados
export const mockEmails: MockEmail[] = [
    {
        id: '1',
        from: 'newsletter@medium.com',
        fromName: 'Medium Daily Digest',
        subject: 'Your daily reading list is here',
        snippet: 'Top stories picked for you today...',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        hasAttachment: false,
        size: 45000,
        labels: ['newsletter']
    },
    {
        id: '2',
        from: 'noreply@github.com',
        fromName: 'GitHub',
        subject: '[antigravity/ratel] New issue opened',
        snippet: 'Issue #42: Add bulk unsubscribe feature...',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        hasAttachment: false,
        size: 12000,
        labels: ['work']
    },
    {
        id: '3',
        from: 'deals@amazon.com',
        fromName: 'Amazon Deals',
        subject: '⚡ Lightning Deals - Up to 70% OFF',
        snippet: 'Limited time offers on electronics, home & more...',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        hasAttachment: false,
        size: 89000,
        labels: ['promotions']
    },
    {
        id: '4',
        from: 'team@figma.com',
        fromName: 'Figma',
        subject: 'You have been added to a new project',
        snippet: 'John invited you to collaborate on "RATEL Design System"...',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        hasAttachment: true,
        size: 234000,
        labels: ['work']
    },
    {
        id: '5',
        from: 'newsletter@substack.com',
        fromName: 'The Pragmatic Engineer',
        subject: 'Big Tech Layoffs: What\'s Really Happening',
        snippet: 'An inside look at the recent wave of tech layoffs...',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        hasAttachment: false,
        size: 67000,
        labels: ['newsletter']
    },
    // Adicionar mais 45 emails variados...
    ...Array.from({ length: 45 }, (_, i) => ({
        id: `${i + 6}`,
        from: `sender${i}@example.com`,
        fromName: `Sender ${i}`,
        subject: `Email Subject ${i}`,
        snippet: `This is a preview of email ${i}...`,
        date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
        isRead: Math.random() > 0.5,
        hasAttachment: Math.random() > 0.7,
        size: Math.floor(Math.random() * 500000),
        labels: ['inbox']
    }))
];

// 15+ inscrições mockadas
export const mockSubscriptions: MockSubscription[] = [
    {
        id: 1,
        name: 'Medium Daily Digest',
        email: 'newsletter@medium.com',
        domain: 'medium.com',
        freq: 'Diária',
        status: 'active',
        score: 45,
        count: 127,
        color: 'bg-green-500',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://medium.com/unsubscribe',
        lastEmail: '2 horas atrás',
        emailIds: ['1', '15', '23']
    },
    {
        id: 2,
        name: 'GitHub Notifications',
        email: 'noreply@github.com',
        domain: 'github.com',
        freq: 'Variável',
        status: 'active',
        score: 85,
        count: 234,
        color: 'bg-blue-500',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://github.com/settings/notifications',
        lastEmail: '5 horas atrás',
        emailIds: ['2', '8', '19']
    },
    {
        id: 3,
        name: 'Amazon Deals',
        email: 'deals@amazon.com',
        domain: 'amazon.com',
        freq: 'Diária',
        status: 'active',
        score: 12,
        count: 89,
        color: 'bg-orange-500',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://amazon.com/unsubscribe',
        lastEmail: '1 dia atrás',
        emailIds: ['3', '12', '25']
    },
    {
        id: 4,
        name: 'LinkedIn Updates',
        email: 'updates@linkedin.com',
        domain: 'linkedin.com',
        freq: 'Semanal',
        status: 'active',
        score: 34,
        count: 56,
        color: 'bg-blue-600',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://linkedin.com/settings',
        lastEmail: '3 dias atrás',
        emailIds: ['7', '14', '28']
    },
    {
        id: 5,
        name: 'The Pragmatic Engineer',
        email: 'newsletter@substack.com',
        domain: 'substack.com',
        freq: 'Semanal',
        status: 'active',
        score: 78,
        count: 42,
        color: 'bg-purple-500',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://substack.com/unsubscribe',
        lastEmail: '5 dias atrás',
        emailIds: ['5', '18', '31']
    },
    {
        id: 6,
        name: 'Netflix Recommendations',
        email: 'info@netflix.com',
        domain: 'netflix.com',
        freq: 'Semanal',
        status: 'active',
        score: 23,
        count: 38,
        color: 'bg-red-500',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://netflix.com/unsubscribe',
        lastEmail: '1 semana atrás',
        emailIds: ['9', '21', '33']
    },
    {
        id: 7,
        name: 'Spotify Discover Weekly',
        email: 'no-reply@spotify.com',
        domain: 'spotify.com',
        freq: 'Semanal',
        status: 'active',
        score: 67,
        count: 52,
        color: 'bg-green-600',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://spotify.com/unsubscribe',
        lastEmail: '2 dias atrás',
        emailIds: ['11', '24', '36']
    },
    {
        id: 8,
        name: 'Duolingo Reminders',
        email: 'hello@duolingo.com',
        domain: 'duolingo.com',
        freq: 'Diária',
        status: 'active',
        score: 89,
        count: 156,
        color: 'bg-green-400',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://duolingo.com/settings',
        lastEmail: '12 horas atrás',
        emailIds: ['13', '26', '39']
    },
    {
        id: 9,
        name: 'Airbnb Travel Deals',
        email: 'noreply@airbnb.com',
        domain: 'airbnb.com',
        freq: 'Mensal',
        status: 'active',
        score: 15,
        count: 23,
        color: 'bg-pink-500',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://airbnb.com/unsubscribe',
        lastEmail: '2 semanas atrás',
        emailIds: ['16', '29', '41']
    },
    {
        id: 10,
        name: 'Stack Overflow Weekly',
        email: 'newsletters@stackoverflow.email',
        domain: 'stackoverflow.com',
        freq: 'Semanal',
        status: 'active',
        score: 72,
        count: 48,
        color: 'bg-orange-600',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://stackoverflow.com/users/email/unsubscribe',
        lastEmail: '4 dias atrás',
        emailIds: ['17', '30', '43']
    },
    {
        id: 11,
        name: 'Uber Eats Promos',
        email: 'uber@uber.com',
        domain: 'uber.com',
        freq: 'Diária',
        status: 'active',
        score: 8,
        count: 134,
        color: 'bg-gray-700',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://uber.com/unsubscribe',
        lastEmail: '6 horas atrás',
        emailIds: ['20', '32', '45']
    },
    {
        id: 12,
        name: 'Coursera Course Updates',
        email: 'no-reply@coursera.org',
        domain: 'coursera.org',
        freq: 'Semanal',
        status: 'active',
        score: 81,
        count: 37,
        color: 'bg-blue-700',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://coursera.org/settings',
        lastEmail: '1 semana atrás',
        emailIds: ['22', '35', '47']
    },
    {
        id: 13,
        name: 'Canva Design Tips',
        email: 'hello@canva.com',
        domain: 'canva.com',
        freq: 'Semanal',
        status: 'active',
        score: 54,
        count: 29,
        color: 'bg-cyan-500',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://canva.com/unsubscribe',
        lastEmail: '3 dias atrás',
        emailIds: ['27', '38', '49']
    },
    {
        id: 14,
        name: 'Notion Updates',
        email: 'team@makenotion.com',
        domain: 'notion.so',
        freq: 'Mensal',
        status: 'active',
        score: 76,
        count: 18,
        color: 'bg-gray-800',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://notion.so/unsubscribe',
        lastEmail: '1 semana atrás',
        emailIds: ['34', '42', '50']
    },
    {
        id: 15,
        name: 'Product Hunt Daily',
        email: 'hello@producthunt.com',
        domain: 'producthunt.com',
        freq: 'Diária',
        status: 'active',
        score: 63,
        count: 92,
        color: 'bg-orange-500',
        hasUnsubscribe: true,
        unsubscribeLink: 'https://producthunt.com/settings',
        lastEmail: '18 horas atrás',
        emailIds: ['37', '44', '48']
    }
];

// Dados de limpeza mockados
export const mockCleanupData: Record<string, MockCleanupCategory> = {
    inbox_old: { id: 'inbox_old', count: 127, size: '234 MB' },
    unread_old: { id: 'unread_old', count: 43, size: '89 MB' },
    drafts: { id: 'drafts', count: 8, size: '12 MB' },
    large_attachments: { id: 'large_attachments', count: 15, size: '456 MB' },
    spam: { id: 'spam', count: 234, size: '178 MB' },
    trash: { id: 'trash', count: 67, size: '145 MB' }
};

// Stats mockados
export const mockStats = {
    inboxCount: 342,
    unreadCount: 87,
    spamCount: 234
};

// Analytics mockados
export const mockAnalytics = {
    weeklyVolume: [
        { name: 'Seg', emails: 45, color: '#3B82F6' },
        { name: 'Ter', emails: 67, color: '#10B981' },
        { name: 'Qua', emails: 52, color: '#F59E0B' },
        { name: 'Qui', emails: 78, color: '#8B5CF6' },
        { name: 'Sex', emails: 89, color: '#EC4899' },
        { name: 'Sab', emails: 23, color: '#06B6D4' },
        { name: 'Dom', emails: 12, color: '#EF4444' }
    ],
    hourlyActivity: [
        { name: '00-04h', value: 5 },
        { name: '04-08h', value: 12 },
        { name: '08-12h', value: 89 },
        { name: '12-16h', value: 67 },
        { name: '16-20h', value: 45 },
        { name: '20-24h', value: 23 }
    ],
    categories: [
        { name: 'Trabalho', value: 156, color: '#2563EB' },
        { name: 'Social', value: 45, color: '#10B981' },
        { name: 'Promoções', value: 89, color: '#F59E0B' },
        { name: 'Updates', value: 52, color: '#6366F1' }
    ],
    metrics: {
        totalEmails: 342,
        last7Days: 366,
        last30Days: 1456,
        avgDailyEmails: 52,
        estimatedReadingTime: '104m'
    }
};

// Atividades mockadas
export const mockActivities = [
    {
        id: '1',
        type: 'unsubscribe',
        title: 'Cancelou inscrição',
        description: 'Amazon Deals',
        timestamp: '2 horas atrás',
        icon: '📬'
    },
    {
        id: '2',
        type: 'archive',
        title: 'Arquivou 15 emails',
        description: 'Newsletters antigas',
        timestamp: '5 horas atrás',
        icon: '📦'
    },
    {
        id: '3',
        type: 'cleanup',
        title: 'Limpeza automática',
        description: 'Removeu 234 emails de spam',
        timestamp: '1 dia atrás',
        icon: '🧹'
    },
    {
        id: '4',
        type: 'label',
        title: 'Aplicou etiqueta',
        description: '23 emails marcados como "Trabalho"',
        timestamp: '2 dias atrás',
        icon: '🏷️'
    },
    {
        id: '5',
        type: 'delete',
        title: 'Excluiu emails',
        description: '45 emails antigos removidos',
        timestamp: '3 dias atrás',
        icon: '🗑️'
    }
];

// Notificações mockadas
export const mockNotifications = [
    {
        id: '1',
        title: 'Inbox Zero Alcançado! 🎉',
        message: 'Parabéns! Você limpou toda sua caixa de entrada.',
        timestamp: '1 hora atrás',
        read: false,
        type: 'success'
    },
    {
        id: '2',
        title: 'Nova inscrição detectada',
        message: 'Detectamos que você se inscreveu em "Tech Weekly"',
        timestamp: '3 horas atrás',
        read: false,
        type: 'info'
    },
    {
        id: '3',
        title: 'Limpeza sugerida',
        message: 'Você tem 127 emails antigos que podem ser arquivados',
        timestamp: '1 dia atrás',
        read: true,
        type: 'warning'
    },
    {
        id: '4',
        title: 'Relatório semanal pronto',
        message: 'Seu relatório de produtividade está disponível',
        timestamp: '2 dias atrás',
        read: true,
        type: 'info'
    }
];

// Labels mockados com emails classificados
export const mockLabels = [
    {
        id: 1,
        name: 'Trabalho',
        count: 156,
        color: 'bg-blue-500',
        emails: mockEmails.filter((_, i) => i % 3 === 0).slice(0, 10)
    },
    {
        id: 2,
        name: 'Pessoal',
        count: 89,
        color: 'bg-pink-500',
        emails: mockEmails.filter((_, i) => i % 3 === 1).slice(0, 10)
    },
    {
        id: 3,
        name: 'Finanças',
        count: 34,
        color: 'bg-green-500',
        emails: mockEmails.filter((_, i) => i % 3 === 2).slice(0, 10)
    },
    {
        id: 4,
        name: 'Viagens',
        count: 12,
        color: 'bg-yellow-500',
        emails: []
    },
    {
        id: 5,
        name: 'Importante',
        count: 23,
        color: 'bg-red-500',
        emails: []
    }
];

// Classificação stats mockados
export const mockClassificationStats = {
    totalClassified: 342,
    byCategory: {
        trabalho: 156,
        social: 45,
        promocoes: 89,
        atualizacoes: 52
    },
    byPriority: { alta: 23, media: 234, baixa: 85 },
    newsletters: 127,
    avgConfidence: 87,
    unclassified: 15
};
