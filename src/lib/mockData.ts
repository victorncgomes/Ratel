// Dados mockados robustos para a versão demo do RATEL
// Simula uma caixa de entrada real com 450 emails

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
    hasUnsubscribe: boolean;
    unsubscribeLink?: string;
    category: 'work' | 'social' | 'promotions' | 'updates' | 'spam' | 'trash' | 'draft';
}

// Helpers
const ONE_DAY = 24 * 60 * 60 * 1000;

// Senders configurados para parecer real
const SENDERS = [
    { name: 'Medium Daily Digest', email: 'newsletter@medium.com', cat: 'updates', sub: true },
    { name: 'GitHub', email: 'noreply@github.com', cat: 'work', sub: true },
    { name: 'Amazon Deals', email: 'deals@amazon.com', cat: 'promotions', sub: true },
    { name: 'Figma', email: 'team@figma.com', cat: 'work', sub: false },
    { name: 'The Pragmatic Engineer', email: 'newsletter@substack.com', cat: 'updates', sub: true },
    { name: 'LinkedIn', email: 'updates@linkedin.com', cat: 'social', sub: true },
    { name: 'Netflix', email: 'info@netflix.com', cat: 'social', sub: true },
    { name: 'Spotify', email: 'no-reply@spotify.com', cat: 'social', sub: true },
    { name: 'Duolingo', email: 'hello@duolingo.com', cat: 'social', sub: true },
    { name: 'Airbnb', email: 'noreply@airbnb.com', cat: 'updates', sub: true },
    { name: 'Stack Overflow', email: 'newsletters@stackoverflow.email', cat: 'work', sub: true },
    { name: 'Uber Eats', email: 'uber@uber.com', cat: 'promotions', sub: true },
    { name: 'Coursera', email: 'no-reply@coursera.org', cat: 'updates', sub: true },
    { name: 'Canva', email: 'hello@canva.com', cat: 'updates', sub: true },
    { name: 'Notion', email: 'team@makenotion.com', cat: 'work', sub: true },
    { name: 'Product Hunt', email: 'hello@producthunt.com', cat: 'updates', sub: true },
    { name: 'Vercel', email: 'notifications@vercel.com', cat: 'work', sub: false },
    { name: 'Stripe', email: 'support@stripe.com', cat: 'work', sub: false },
    { name: 'Discord', email: 'noreply@discord.com', cat: 'social', sub: false },
    { name: 'Zoom', email: 'no-reply@zoom.us', cat: 'work', sub: false },
    { name: 'Ricardo (CEO)', email: 'ricardo@paranaue.io', cat: 'work', sub: false },
    { name: 'Beatriz (Design)', email: 'bea@paranaue.io', cat: 'work', sub: false },
    { name: 'Apple', email: 'news@insideapple.apple.com', cat: 'updates', sub: true },
    { name: 'Google Workspace', email: 'workspace-noreply@google.com', cat: 'work', sub: false },
    { name: 'Microsoft Azure', email: 'azure-noreply@microsoft.com', cat: 'work', sub: false },
    { name: 'Twitter / X', email: 'info@twitter.com', cat: 'social', sub: true },
    { name: 'Instagram', email: 'no-reply@mail.instagram.com', cat: 'social', sub: true },
    { name: 'Slack', email: 'feedback@slack.com', cat: 'work', sub: true },
    { name: 'Jira Software', email: 'jira@atlassian.net', cat: 'work', sub: true },
    { name: 'Dropbox', email: 'no-reply@dropbox.com', cat: 'work', sub: true },
    { name: 'Salesforce', email: 'info@salesforce.com', cat: 'work', sub: false },
    { name: 'PayPal', email: 'service@paypal.com.br', cat: 'updates', sub: false },
    { name: 'Nubank', email: 'to-me@nubank.com.br', cat: 'updates', sub: false },
    { name: 'Mercado Livre', email: 'ofertas@mercadolivre.com.br', cat: 'promotions', sub: true },
    { name: 'Shopee', email: 'email@shopee.com.br', cat: 'promotions', sub: true },
    { name: 'AliExpress', email: 'promotion@aliexpress.com', cat: 'promotions', sub: true },
    { name: 'Udemy', email: 'no-reply@e.udemymail.com', cat: 'updates', sub: true },
    { name: 'YouTube', email: 'noreply@youtube.com', cat: 'social', sub: true },
    { name: 'iFood', email: 'news@ifood.com.br', cat: 'promotions', sub: true },
    { name: 'Spam Center', email: 'congrats@lottery-winner.com', cat: 'spam', sub: false },
    { name: 'Casino Online', email: 'play@win-big-now.biz', cat: 'spam', sub: false },
    { name: 'Crypto Bot', email: 'trade@bitcoin-million.ai', cat: 'spam', sub: false },
];

const SUBJECTS: Record<string, string[]> = {
    work: [
        'Relatório semanal de progresso',
        'Novo issue aberto no repositório',
        'Convite de reunião: Sync Diário',
        'Feedback da última sprint',
        'Deployment concluído com sucesso',
        'Fatura mensal disponível',
        'Acesso concedido ao projeto Alpha',
        'Nova mensagem de Ricardo no Slack',
        'Solicitação de Review: PR #152',
        'Atualização do RATEL Core v2.0',
        'Alteração no cronograma do projeto',
        'Novo comentário em RATEL-102',
        'Lembrete de aprovação de despesa',
        'Relatório de vendas Mensal',
        'Convite para Webinar: Engineering Manager',
        'Alinhamento sobre Q1 2026',
        'Discussão sobre arquitetura Clean Mail',
        'Reunião de board: Resultados Dezembro'
    ],
    social: [
        'Você tem novas notificações',
        'Mateus curtiu sua publicação',
        'Alguém viu seu perfil nas últimas 24h',
        'Sua trilha sonora de 2025 está pronta',
        'Sugestão de amizade: Rafael Silva',
        'Parabéns pelo novo cargo!',
        'Lembrete: Mantenha sua ofensiva de 45 dias',
        'Alguém comentou na sua foto',
        'Playlist: Descobertas da Semana',
        'Seu resumo social de Domingo',
        'Novos seguidores no perfil',
        'Você foi mencionado em uma trend',
        'Sua retrospectiva do ano está pronta',
        'Live começando agora: Design Trends',
        'Confira quem está falando de você',
        'Evento perto de você: Tech Meetup'
    ],
    promotions: [
        'Oferta Relâmpago: Até 70% de Desconto',
        'Cupom de R$ 30 disponível hoje',
        'Frete grátis na sua próxima compra',
        'Black Friday Antecipada!',
        'Última chance de garantir seu bônus',
        'Sugestões personalizadas para você',
        'Vimos que você deixou algo no carrinho',
        'Novas ofertas em eletrônicos',
        'Ganhe cashback em todas as compras',
        'Exclusivo: Voucher VIP de Verão',
        'Desconto de aniversário desbloqueado',
        'Venda flash termina em 2h',
        'Use agora seu cupom de 50%',
        'Frete grátis liberado para você',
        'Liquidação anual: Tudo deve sair',
        'Reserve agora com 25% de desconto'
    ],
    updates: [
        'Novas histórias selecionadas para você',
        'Termos de Serviço atualizados',
        'Novidades no seu Dashboard',
        'Confirmação de alteração de senha',
        'Seu resumo diário está pronto',
        'Newsletter Semanal: O que mudou no Tech',
        'Dicas de produtividade com IA',
        'Como usar os novos recursos do app',
        'Seu curso começa em breve',
        'Recibo de pagamento: Assinatura renovada',
        'Confirmação de reserva de voo',
        'Seu pedido saiu para entrega',
        'Boleto disponível para pagamento',
        'Atualização de segurança na conta',
        'Seu login foi detectado em novo dispositivo',
        'Resumo financeiro: Janeiro/2026'
    ],
    spam: [
        'VOCÊ GANHOU! Clique aqui para resgatar seu prêmio',
        'Trabalhe de casa e ganhe 5k por semana',
        'Acesso urgente: Sua conta foi bloqueada',
        'Última chance: Invista em Bitcoin agora',
        'Garantido: Perda de peso em 3 dias',
        'Re: Suas fotos estão prontas',
        'Oportunidade única de investimento externo',
        'Melhore sua performance hoje',
        'Seu e-mail foi selecionado para sorteio',
        'Clique para ver quem está te vigiando',
        'Ganhe milhas voando grátis pelo mundo',
        'Oportunidade na Suíça para falantes de PT',
        'Herança de US$ 1.5M aguardando seu contato',
        'Empréstimo aprovado sem consulta ao CPF',
        'Sua fatura de R$ 4.567 está vencida'
    ],
    trash: [
        'Convite cancelado: Almoço de Terça',
        'Newsletter Antiga Jan/2024',
        'Rascunho descartado automaticamente',
        'E-mail de teste ignore por favor',
        'Recibo de 2023',
        'Aviso de manutenção antiga',
        'Backup concluído Março',
        'Arquivo temporário de log',
        'Link de ativação expirado',
        'Código de verificação (Válido por 10min)'
    ],
    draft: [
        'Para: Beatriz - Draft de Design',
        'Ideias para o RATEL Furioso',
        'Resumo da reunião com investidores',
        'Draft: Proposta comercial X',
        'Anotações: Bug fixes plane',
        'Rascunho: Post para o blog',
        'Lista de tarefas semanais',
        'Draft: E-mail para o suporte do Gmail',
        'Plano de marketing Q1 2026',
        'Ideia de novo recurso: Shield Smart'
    ]
};

const SNIPPETS = [
    "Olá, estou enviando o anexo que combinamos na reunião de hoje cedo. Qualquer dúvida é só chamar!",
    "Seu pedido #98234 foi processado com sucesso e está aguardando coleta da transportadora.",
    "Vimos que você tem interesse em Inteligência Artificial, por isso selecionamos estes artigos especiais.",
    "Não perca a chance de garantir seu ingresso para o maior evento de tecnologia do ano com desconto exclusivo.",
    "Detectamos um novo acesso à sua conta a partir de um dispositivo desconhecido em São Paulo, Brasil.",
    "Sua assinatura RATEL Premium será renovada automaticamente no dia 15 de fevereiro de 2026.",
    "Relatório mensal de performance: seu engajamento cresceu 15% em comparação ao mês anterior.",
    "Atenção: sua senha expira em 3 dias. Por favor, realize a troca o mais rápido possível para sua segurança.",
    "Você recebeu uma nova mensagem direta de um contato em comum. Clique abaixo para ler.",
    "O projeto Alpha acaba de receber um novo commit com melhorias na performance do banco de dados.",
    "Confirmação de Transação: Você enviou R$ 150,00 para Paranaue LTDA. Protocolo: 928374.",
    "Aproveite! Últimas horas para usar o cupom VERÃO2026 e ganhar frete grátis em todo o site.",
    "Desafio 7 dias concluído! Você está no caminho certo para dominar uma nova habilidade.",
    "Seu voo AD3412 para Florianópolis foi confirmado. Check-in disponível em 24 horas."
];

// Gerador de Emails Mockados
const generateMockEmails = (count: number): MockEmail[] => {
    const emails: MockEmail[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
        const sender = SENDERS[Math.floor(Math.random() * SENDERS.length)];
        const category = sender.cat as any;
        const subjects = SUBJECTS[category] || SUBJECTS.updates;
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const snippet = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];

        // Distribuir datas (algumas hoje, muitas recentes, muitas antigas)
        let dateValue;
        if (i < 50) {
            dateValue = now - (Math.random() * ONE_DAY); // Hoje (50 emails)
        } else if (i < 200) {
            dateValue = now - (Math.random() * 30 * ONE_DAY); // Último mês (150 emails)
        } else if (i < 350) {
            dateValue = now - (Math.random() * 90 * ONE_DAY); // Últimos 3 meses (150 emails)
        } else {
            dateValue = now - (Math.random() * 365 * ONE_DAY); // Último ano (restante)
        }

        // Tamanhos (alguns muito grandes > 5MB = 5.242.880 bytes)
        let size;
        if (i % 12 === 0) {
            size = 5000000 + Math.floor(Math.random() * 12000000); // 5MB a 17MB
        } else {
            size = 2000 + Math.floor(Math.random() * 1500000); // 2KB a 1.5MB
        }

        emails.push({
            id: `mock-${i}`,
            from: sender.email,
            fromName: sender.name,
            subject: subject,
            snippet: snippet,
            date: new Date(dateValue).toISOString(),
            isRead: i > 40 ? Math.random() > 0.4 : false, // Primeiro 40 não lidos
            hasAttachment: i % 8 === 0,
            size: size,
            labels: [category],
            hasUnsubscribe: sender.sub,
            unsubscribeLink: sender.sub ? `https://${sender.email.split('@')[1]}/unsubscribe` : undefined,
            category: category
        });
    }
    return emails;
};

// Exportar base de dados principal (450 emails agora)
export const mockEmails = generateMockEmails(450);

// Derivar Subscriptions Consistentemente
export const mockSubscriptions = (() => {
    const subsMap = new Map<string, any>();

    // Filtrar emails que são de newsletters (sender.sub === true)
    const subEmails = mockEmails.filter(e => e.hasUnsubscribe);

    subEmails.forEach(e => {
        if (!subsMap.has(e.from)) {
            const domain = e.from.split('@')[1];
            subsMap.set(e.from, {
                id: subsMap.size + 1,
                name: e.fromName,
                email: e.from,
                domain: domain,
                freq: 'Diária',
                status: 'active',
                score: Math.floor(Math.random() * 100),
                count: 0,
                color: `bg-${['blue', 'green', 'purple', 'orange', 'pink', 'gray', 'red', 'cyan'][Math.floor(Math.random() * 8)]}-500`,
                hasUnsubscribe: true,
                unsubscribeLink: e.unsubscribeLink,
                lastEmail: '',
                emailIds: []
            });
        }

        const sub = subsMap.get(e.from);
        sub.count++;
        sub.emailIds.push(e.id);

        const date = new Date(e.date);
        if (!sub.lastEmailDate || date > sub.lastEmailDate) {
            sub.lastEmailDate = date;
            sub.lastEmail = date.toLocaleDateString();
        }
    });

    return Array.from(subsMap.values());
})();

export const mockRules = [
    { sender: 'congrats@lottery-winner.com', type: 'shield', createdAt: new Date().toISOString() },
    { sender: 'play@win-big-now.biz', type: 'shield', createdAt: new Date().toISOString() },
    { sender: 'trade@bitcoin-million.ai', type: 'shield', createdAt: new Date().toISOString() },
    { sender: 'newsletter@medium.com', type: 'rollup', createdAt: new Date().toISOString() },
    { sender: 'newsletter@substack.com', type: 'rollup', createdAt: new Date().toISOString() },
];

// Derivar Stats Consistentes
export const mockStats = {
    inboxCount: mockEmails.filter(e => e.category !== 'trash' && e.category !== 'spam').length,
    unreadCount: mockEmails.filter(e => !e.isRead && e.category !== 'trash' && e.category !== 'spam').length,
    spamCount: mockEmails.filter(e => e.category === 'spam').length
};

// Derivar Dados de Limpeza Consistentes
export const mockCleanupData = (() => {
    const now = Date.now();
    const sixMonthsAgo = now - (6 * 30 * ONE_DAY);
    const thirtyDaysAgo = now - (31 * ONE_DAY);

    const oldEmails = mockEmails.filter(e => new Date(e.date).getTime() < sixMonthsAgo && e.category !== 'trash');
    const oldUnread = mockEmails.filter(e => !e.isRead && new Date(e.date).getTime() < thirtyDaysAgo && e.category !== 'trash');
    const drafts = mockEmails.filter(e => e.category === 'draft');
    const large = mockEmails.filter(e => e.size > 5 * 1024 * 1024 && e.category !== 'trash'); // > 5MB
    const spam = mockEmails.filter(e => e.category === 'spam');
    const trash = mockEmails.filter(e => e.category === 'trash');

    const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

    return {
        inbox_old: {
            id: 'inbox_old',
            count: oldEmails.length,
            size: formatSize(oldEmails.reduce((a, b) => a + b.size, 0))
        },
        unread_old: {
            id: 'unread_old',
            count: oldUnread.length,
            size: formatSize(oldUnread.reduce((a, b) => a + b.size, 0))
        },
        drafts: {
            id: 'drafts',
            count: drafts.length,
            size: formatSize(drafts.reduce((a, b) => a + b.size, 0))
        },
        large_attachments: {
            id: 'large_attachments',
            count: large.length,
            size: formatSize(large.reduce((a, b) => a + b.size, 0))
        },
        spam: {
            id: 'spam',
            count: spam.length,
            size: formatSize(spam.reduce((a, b) => a + b.size, 0))
        },
        trash: {
            id: 'trash',
            count: trash.length,
            size: formatSize(trash.reduce((a, b) => a + b.size, 0))
        }
    };
})();

// Analytics Consistentes
export const mockAnalytics = {
    weeklyVolume: [
        { name: 'Seg', emails: 85, color: '#3B82F6' },
        { name: 'Ter', emails: 124, color: '#10B981' },
        { name: 'Qua', emails: 98, color: '#F59E0B' },
        { name: 'Qui', emails: 145, color: '#8B5CF6' },
        { name: 'Sex', emails: 112, color: '#EC4899' },
        { name: 'Sab', emails: 45, color: '#06B6D4' },
        { name: 'Dom', emails: 32, color: '#EF4444' }
    ],
    hourlyActivity: [
        { name: '00-04h', value: 45 },
        { name: '04-08h', value: 78 },
        { name: '08-12h', value: 256 },
        { name: '12-16h', value: 189 },
        { name: '16-20h', value: 124 },
        { name: '20-24h', value: 56 }
    ],
    categories: [
        { name: 'Trabalho', value: mockEmails.filter(e => e.category === 'work').length, color: '#2563EB' },
        { name: 'Social', value: mockEmails.filter(e => e.category === 'social').length, color: '#10B981' },
        { name: 'Promoções', value: mockEmails.filter(e => e.category === 'promotions').length, color: '#F59E0B' },
        { name: 'Updates', value: mockEmails.filter(e => e.category === 'updates').length, color: '#6366F1' }
    ],
    metrics: {
        totalEmails: mockEmails.length,
        last7Days: 342,
        last30Days: 450,
        avgDailyEmails: 64,
        estimatedReadingTime: `${Math.floor(mockEmails.filter(e => !e.isRead).length * 1.5)}m`
    }
};

// Notificações e Atividades
export const mockActivities = [
    { id: '1', type: 'unsubscribe', title: 'Cancelou inscrição', description: 'Amazon Deals', timestamp: '2 horas atrás', icon: '📬' },
    { id: '2', type: 'archive', title: 'Arquivou 85 emails', description: 'Newsletters antigas', timestamp: '5 horas atrás', icon: '📦' },
    { id: '3', type: 'cleanup', title: 'Limpeza automática', description: 'Removeu 342 emails de spam', timestamp: '1 dia atrás', icon: '🧹' }
];

export const mockNotifications = [
    { id: '1', title: 'Novas Oportunidades! 🎉', message: 'Detectamos 45 novos emails que podem ser arquivados com segurança.', timestamp: '1 hora atrás', read: false, type: 'info' },
    { id: '2', title: 'Relatório Semanal Pronto', message: 'Sua caixa de entrada está 35% mais limpa do que na semana passada.', timestamp: '4 horas atrás', read: false, type: 'success' }
];

export const mockLabels = [
    { id: 1, name: 'Trabalho', count: mockEmails.filter(e => e.category === 'work').length, color: 'bg-blue-500', emails: mockEmails.filter(e => e.category === 'work').slice(0, 5) },
    { id: 2, name: 'Pessoal', count: mockEmails.filter(e => e.category === 'social').length, color: 'bg-pink-500', emails: mockEmails.filter(e => e.category === 'social').slice(0, 5) },
    { id: 3, name: 'Finanças', count: 42, color: 'bg-green-500', emails: [] }
];

export const mockClassificationStats = {
    totalClassified: mockEmails.length,
    byCategory: {
        trabalho: mockEmails.filter(e => e.category === 'work').length,
        social: mockEmails.filter(e => e.category === 'social').length,
        promocoes: mockEmails.filter(e => e.category === 'promotions').length,
        atualizacoes: mockEmails.filter(e => e.category === 'updates').length
    },
    byPriority: { alta: 45, media: 320, baixa: 85 },
    newsletters: mockSubscriptions.length,
    avgConfidence: 94,
    unclassified: 0
};
