/**
 * RATEL - Sistema de Badges
 * Badger badges para gamificação
 */

export type BadgeTier = 'bronze' | 'silver' | 'gold';
export type BadgeRequirementType =
    | 'emails_deleted'
    | 'unsubscribes'
    | 'emails_read'
    | 'spam_marked'
    | 'streak'
    | 'inbox_zero'
    | 'special';

export interface Badge {
    id: string;
    name: {
        pt: string;
        en: string;
        es: string;
    };
    description: {
        pt: string;
        en: string;
        es: string;
    };
    tier: BadgeTier;
    icon: string;
    requirement: {
        type: BadgeRequirementType;
        value: number;
    };
    rewardsCredits: number;
    isSecret: boolean;
}

/**
 * TABELA DE BADGES
 * 15+ badges iniciais, expandir iterativamente
 */
export const BADGES: Badge[] = [
    // ========== BRONZE (Iniciante) ==========
    {
        id: "first_blood",
        name: { pt: "First Blood", en: "First Blood", es: "Primera Sangre" },
        description: {
            pt: "Delete seu primeiro email. A jornada começa aqui.",
            en: "Delete your first email. The journey begins here.",
            es: "Elimina tu primer email. El viaje comienza aquí."
        },
        tier: "bronze",
        icon: "🩸",
        requirement: { type: "emails_deleted", value: 1 },
        rewardsCredits: 10,
        isSecret: false,
    },
    {
        id: "honey_badger_dont_care",
        name: { pt: "Honey Badger Don't Care", en: "Honey Badger Don't Care", es: "Al Ratel No Le Importa" },
        description: {
            pt: "Delete 10 emails sem hesitação.",
            en: "Delete 10 emails without hesitation.",
            es: "Elimina 10 emails sin dudar."
        },
        tier: "bronze",
        icon: "🦡",
        requirement: { type: "emails_deleted", value: 10 },
        rewardsCredits: 50,
        isSecret: false,
    },
    {
        id: "unsubscribe_newbie",
        name: { pt: "Cancelador Novato", en: "Unsubscribe Newbie", es: "Novato en Cancelar" },
        description: {
            pt: "Cancele sua primeira inscrição. Liberdade!",
            en: "Cancel your first subscription. Freedom!",
            es: "Cancela tu primera suscripción. ¡Libertad!"
        },
        tier: "bronze",
        icon: "✉️",
        requirement: { type: "unsubscribes", value: 1 },
        rewardsCredits: 25,
        isSecret: false,
    },
    {
        id: "spam_hunter",
        name: { pt: "Caçador de Spam", en: "Spam Hunter", es: "Cazador de Spam" },
        description: {
            pt: "Marque 10 emails como spam.",
            en: "Mark 10 emails as spam.",
            es: "Marca 10 emails como spam."
        },
        tier: "bronze",
        icon: "🎯",
        requirement: { type: "spam_marked", value: 10 },
        rewardsCredits: 30,
        isSecret: false,
    },
    {
        id: "reader",
        name: { pt: "Leitor Dedicado", en: "Dedicated Reader", es: "Lector Dedicado" },
        description: {
            pt: "Leia 50 emails.",
            en: "Read 50 emails.",
            es: "Lee 50 emails."
        },
        tier: "bronze",
        icon: "📖",
        requirement: { type: "emails_read", value: 50 },
        rewardsCredits: 40,
        isSecret: false,
    },

    // ========== SILVER (Intermediário) ==========
    {
        id: "spam_slayer",
        name: { pt: "Exterminador de Spam", en: "Spam Slayer", es: "Exterminador de Spam" },
        description: {
            pt: "Marque 50 emails como spam. Você é implacável.",
            en: "Mark 50 emails as spam. You're relentless.",
            es: "Marca 50 emails como spam. Eres implacable."
        },
        tier: "silver",
        icon: "⚔️",
        requirement: { type: "spam_marked", value: 50 },
        rewardsCredits: 100,
        isSecret: false,
    },
    {
        id: "newsletter_destroyer",
        name: { pt: "Destruidor de Newsletters", en: "Newsletter Destroyer", es: "Destructor de Newsletters" },
        description: {
            pt: "Cancele 50 newsletters. Sua caixa respira.",
            en: "Cancel 50 newsletters. Your inbox breathes.",
            es: "Cancela 50 newsletters. Tu bandeja respira."
        },
        tier: "silver",
        icon: "💣",
        requirement: { type: "unsubscribes", value: 50 },
        rewardsCredits: 200,
        isSecret: false,
    },
    {
        id: "week_warrior",
        name: { pt: "Guerreiro da Semana", en: "Week Warrior", es: "Guerrero de la Semana" },
        description: {
            pt: "Mantenha um streak de 7 dias.",
            en: "Maintain a 7-day streak.",
            es: "Mantén una racha de 7 días."
        },
        tier: "silver",
        icon: "🔥",
        requirement: { type: "streak", value: 7 },
        rewardsCredits: 150,
        isSecret: false,
    },
    {
        id: "centurion",
        name: { pt: "Centurião", en: "Centurion", es: "Centurión" },
        description: {
            pt: "Delete 100 emails.",
            en: "Delete 100 emails.",
            es: "Elimina 100 emails."
        },
        tier: "silver",
        icon: "🏛️",
        requirement: { type: "emails_deleted", value: 100 },
        rewardsCredits: 150,
        isSecret: false,
    },
    {
        id: "month_master",
        name: { pt: "Mestre do Mês", en: "Month Master", es: "Maestro del Mes" },
        description: {
            pt: "Mantenha um streak de 30 dias.",
            en: "Maintain a 30-day streak.",
            es: "Mantén una racha de 30 días."
        },
        tier: "silver",
        icon: "📅",
        requirement: { type: "streak", value: 30 },
        rewardsCredits: 300,
        isSecret: false,
    },

    // ========== GOLD (Avançado) ==========
    {
        id: "inbox_zero_hero",
        name: { pt: "Herói do Inbox Zero", en: "Inbox Zero Hero", es: "Héroe del Inbox Zero" },
        description: {
            pt: "Alcance o lendário Inbox Zero. Você é um mito.",
            en: "Achieve the legendary Inbox Zero. You're a myth.",
            es: "Alcanza el legendario Inbox Zero. Eres un mito."
        },
        tier: "gold",
        icon: "🏆",
        requirement: { type: "inbox_zero", value: 1 },
        rewardsCredits: 500,
        isSecret: false,
    },
    {
        id: "email_annihilator",
        name: { pt: "Aniquilador de Emails", en: "Email Annihilator", es: "Aniquilador de Emails" },
        description: {
            pt: "Delete 1000 emails. Você é uma máquina de destruição.",
            en: "Delete 1000 emails. You're a destruction machine.",
            es: "Elimina 1000 emails. Eres una máquina de destrucción."
        },
        tier: "gold",
        icon: "💀",
        requirement: { type: "emails_deleted", value: 1000 },
        rewardsCredits: 1000,
        isSecret: false,
    },
    {
        id: "corporate_destroyer",
        name: { pt: "Destruidor Corporativo", en: "Corporate Destroyer", es: "Destructor Corporativo" },
        description: {
            pt: "Cancele 100 newsletters corporativas. Liberdade total.",
            en: "Cancel 100 corporate newsletters. Total freedom.",
            es: "Cancela 100 newsletters corporativas. Libertad total."
        },
        tier: "gold",
        icon: "🏢",
        requirement: { type: "unsubscribes", value: 100 },
        rewardsCredits: 750,
        isSecret: false,
    },

    // ========== SECRET BADGES ==========
    {
        id: "night_owl",
        name: { pt: "Coruja Noturna", en: "Night Owl", es: "Búho Nocturno" },
        description: {
            pt: "Limpe sua caixa depois das 23h. Você não dorme?",
            en: "Clean your inbox after 11pm. Don't you sleep?",
            es: "Limpia tu bandeja después de las 23h. ¿No duermes?"
        },
        tier: "silver",
        icon: "🦉",
        requirement: { type: "special", value: 1 },
        rewardsCredits: 200,
        isSecret: true,
    },
    {
        id: "speed_demon",
        name: { pt: "Demônio da Velocidade", en: "Speed Demon", es: "Demonio de la Velocidad" },
        description: {
            pt: "Delete 100 emails em menos de 5 minutos. RÁPIDO!",
            en: "Delete 100 emails in less than 5 minutes. FAST!",
            es: "Elimina 100 emails en menos de 5 minutos. ¡RÁPIDO!"
        },
        tier: "gold",
        icon: "⚡",
        requirement: { type: "special", value: 1 },
        rewardsCredits: 500,
        isSecret: true,
    },
];

/**
 * Obtém badge por ID
 */
export function getBadgeById(id: string): Badge | undefined {
    return BADGES.find(badge => badge.id === id);
}

/**
 * Obtém badges por tier
 */
export function getBadgesByTier(tier: BadgeTier): Badge[] {
    return BADGES.filter(badge => badge.tier === tier);
}

/**
 * Obtém badges não secretos
 */
export function getPublicBadges(): Badge[] {
    return BADGES.filter(badge => !badge.isSecret);
}

/**
 * Total de badges
 */
export const TOTAL_BADGES = BADGES.length;

export default BADGES;
