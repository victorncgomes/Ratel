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
    | 'special'
    | 'credits_earned'
    | 'emails_size_deleted';

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
 * 40 Badges Totais
 */
export const BADGES: Badge[] = [
    // ========== BRONZE (Iniciante) - 10-50 Créditos ==========
    {
        id: "first_blood",
        name: { pt: "First Blood", en: "First Blood", es: "Primera Sangre" },
        description: { pt: "Delete seu primeiro email.", en: "Delete your first email.", es: "Elimina tu primer email." },
        tier: "bronze", icon: "🩸", requirement: { type: "emails_deleted", value: 1 }, rewardsCredits: 10, isSecret: false,
    },
    {
        id: "honey_badger_dont_care",
        name: { pt: "Honey Badger Don't Care", en: "Honey Badger Don't Care", es: "Al Ratel No Le Importa" },
        description: { pt: "Delete 10 emails sem hesitação.", en: "Delete 10 emails without hesitation.", es: "Elimina 10 emails sin dudar." },
        tier: "bronze", icon: "🦡", requirement: { type: "emails_deleted", value: 10 }, rewardsCredits: 50, isSecret: false,
    },
    {
        id: "unsubscribe_newbie",
        name: { pt: "Cancelador Novato", en: "Unsubscribe Newbie", es: "Novato en Cancelar" },
        description: { pt: "Cancele sua primeira inscrição.", en: "Cancel your first subscription.", es: "Cancela tu primera suscripción." },
        tier: "bronze", icon: "✉️", requirement: { type: "unsubscribes", value: 1 }, rewardsCredits: 25, isSecret: false,
    },
    {
        id: "spam_hunter",
        name: { pt: "Caçador de Spam", en: "Spam Hunter", es: "Cazador de Spam" },
        description: { pt: "Marque 10 emails como spam.", en: "Mark 10 emails as spam.", es: "Marca 10 emails como spam." },
        tier: "bronze", icon: "🎯", requirement: { type: "spam_marked", value: 10 }, rewardsCredits: 30, isSecret: false,
    },
    {
        id: "reader",
        name: { pt: "Leitor Dedicado", en: "Dedicated Reader", es: "Lector Dedicado" },
        description: { pt: "Leia 50 emails.", en: "Read 50 emails.", es: "Lee 50 emails." },
        tier: "bronze", icon: "📖", requirement: { type: "emails_read", value: 50 }, rewardsCredits: 40, isSecret: false,
    },
    {
        id: "cleaner",
        name: { pt: "Faxineiro", en: "Cleaner", es: "Limpiador" },
        description: { pt: "Delete 100 emails.", en: "Delete 100 emails.", es: "Elimina 100 emails." },
        tier: "bronze", icon: "🧹", requirement: { type: "emails_deleted", value: 100 }, rewardsCredits: 50, isSecret: false,
    },
    {
        id: "student",
        name: { pt: "Estudante", en: "Student", es: "Estudiante" },
        description: { pt: "Leia 100 emails.", en: "Read 100 emails.", es: "Lee 100 emails." },
        tier: "bronze", icon: "🎒", requirement: { type: "emails_read", value: 100 }, rewardsCredits: 50, isSecret: false,
    },
    {
        id: "peacekeeper",
        name: { pt: "Pacificador", en: "Peacekeeper", es: "Pacificador" },
        description: { pt: "Cancele 5 inscrições.", en: "Unsubscribe from 5 lists.", es: "Cancela 5 suscripciones." },
        tier: "bronze", icon: "🏳️", requirement: { type: "unsubscribes", value: 5 }, rewardsCredits: 40, isSecret: false,
    },
    {
        id: "weekend_warrior",
        name: { pt: "Guerreiro de Fim de Semana", en: "Weekend Warrior", es: "Guerrero de Fin de Semana" },
        description: { pt: "Use o app no Sábado ou Domingo.", en: "Use the app on Saturday or Sunday.", es: "Usa la app el sábado o domingo." },
        tier: "bronze", icon: "🏖️", requirement: { type: "special", value: 1 }, rewardsCredits: 30, isSecret: false,
    },
    {
        id: "early_bird",
        name: { pt: "Madrugador", en: "Early Bird", es: "Madrugador" },
        description: { pt: "Organize emails antes das 07:00.", en: "Organize emails before 7 AM.", es: "Organiza emails antes de las 7 AM." },
        tier: "bronze", icon: "🌅", requirement: { type: "special", value: 1 }, rewardsCredits: 50, isSecret: true,
    },

    // ========== SILVER (Intermediário) - 100-300 Créditos ==========
    {
        id: "spam_slayer",
        name: { pt: "Exterminador de Spam", en: "Spam Slayer", es: "Exterminador de Spam" },
        description: { pt: "Marque 50 emails como spam.", en: "Mark 50 emails as spam.", es: "Marca 50 emails como spam." },
        tier: "silver", icon: "⚔️", requirement: { type: "spam_marked", value: 50 }, rewardsCredits: 100, isSecret: false,
    },
    {
        id: "newsletter_destroyer",
        name: { pt: "Destruidor de Newsletters", en: "Newsletter Destroyer", es: "Destructor de Newsletters" },
        description: { pt: "Cancele 50 newsletters.", en: "Cancel 50 newsletters.", es: "Cancela 50 newsletters." },
        tier: "silver", icon: "💣", requirement: { type: "unsubscribes", value: 50 }, rewardsCredits: 200, isSecret: false,
    },
    {
        id: "week_warrior",
        name: { pt: "Guerreiro da Semana", en: "Week Warrior", es: "Guerrero de la Semana" },
        description: { pt: "Mantenha um streak de 7 dias.", en: "Maintain a 7-day streak.", es: "Mantén una racha de 7 días." },
        tier: "silver", icon: "🔥", requirement: { type: "streak", value: 7 }, rewardsCredits: 150, isSecret: false,
    },
    {
        id: "centurion",
        name: { pt: "Centurião", en: "Centurion", es: "Centurión" },
        description: { pt: "Delete 500 emails.", en: "Delete 500 emails.", es: "Elimina 500 emails." },
        tier: "silver", icon: "🏛️", requirement: { type: "emails_deleted", value: 500 }, rewardsCredits: 150, isSecret: false,
    },
    {
        id: "month_master",
        name: { pt: "Mestre do Mês", en: "Month Master", es: "Maestro del Mes" },
        description: { pt: "Mantenha um streak de 30 dias.", en: "Maintain a 30-day streak.", es: "Mantén una racha de 30 días." },
        tier: "silver", icon: "📅", requirement: { type: "streak", value: 30 }, rewardsCredits: 300, isSecret: false,
    },
    {
        id: "sweeper",
        name: { pt: "Varredor", en: "Sweeper", es: "Barrendero" },
        description: { pt: "Delete 2000 emails.", en: "Delete 2000 emails.", es: "Elimina 2000 emails." },
        tier: "silver", icon: "🌪️", requirement: { type: "emails_deleted", value: 2000 }, rewardsCredits: 250, isSecret: false,
    },
    {
        id: "intel_officer",
        name: { pt: "Oficial de Inteligência", en: "Intel Officer", es: "Oficial de Inteligencia" },
        description: { pt: "Leia 500 emails.", en: "Read 500 emails.", es: "Lee 500 emails." },
        tier: "silver", icon: "🕵️", requirement: { type: "emails_read", value: 500 }, rewardsCredits: 200, isSecret: false,
    },
    {
        id: "freedom_fighter",
        name: { pt: "Lutador da Liberdade", en: "Freedom Fighter", es: "Luchador de la Libertad" },
        description: { pt: "Cancele 20 inscrições.", en: "Unsubscribe from 20 lists.", es: "Cancela 20 suscripciones." },
        tier: "silver", icon: "🗽", requirement: { type: "unsubscribes", value: 20 }, rewardsCredits: 150, isSecret: false,
    },
    {
        id: "titan_slayer",
        name: { pt: "Caçador de Titãs", en: "Titan Slayer", es: "Cazador de Titanes" },
        description: { pt: "Delete um email maior que 10MB.", en: "Delete an email larger than 10MB.", es: "Elimina un email mayor a 10MB." },
        tier: "silver", icon: "🦖", requirement: { type: "emails_size_deleted", value: 10 }, rewardsCredits: 200, isSecret: false,
    },
    {
        id: "night_owl",
        name: { pt: "Coruja Noturna", en: "Night Owl", es: "Búho Nocturno" },
        description: { pt: "Use o app entre 23:00 e 04:00.", en: "Use app between 11PM and 4AM.", es: "Usa la app entre 23:00 y 04:00." },
        tier: "silver", icon: "🦉", requirement: { type: "special", value: 1 }, rewardsCredits: 100, isSecret: true,
    },

    // ========== GOLD (Avançado) - 500-1000 Créditos ==========
    {
        id: "inbox_zero_hero",
        name: { pt: "Herói do Inbox Zero", en: "Inbox Zero Hero", es: "Héroe del Inbox Zero" },
        description: { pt: "Alcance o lendário Inbox Zero.", en: "Achieve the legendary Inbox Zero.", es: "Alcanza el legendario Inbox Zero." },
        tier: "gold", icon: "🏆", requirement: { type: "inbox_zero", value: 1 }, rewardsCredits: 500, isSecret: false,
    },
    {
        id: "email_annihilator",
        name: { pt: "Aniquilador de Emails", en: "Email Annihilator", es: "Aniquilador de Emails" },
        description: { pt: "Delete 5000 emails.", en: "Delete 5000 emails.", es: "Elimina 5000 emails." },
        tier: "gold", icon: "💀", requirement: { type: "emails_deleted", value: 5000 }, rewardsCredits: 1000, isSecret: false,
    },
    {
        id: "corporate_destroyer",
        name: { pt: "Destruidor Corporativo", en: "Corporate Destroyer", es: "Destructor Corporativo" },
        description: { pt: "Cancele 100 newsletters.", en: "Cancel 100 newsletters.", es: "Cancela 100 newsletters." },
        tier: "gold", icon: "🏢", requirement: { type: "unsubscribes", value: 100 }, rewardsCredits: 750, isSecret: false,
    },
    {
        id: "black_hole",
        name: { pt: "Buraco Negro", en: "Black Hole", es: "Agujero Negro" },
        description: { pt: "Delete 10.000 emails.", en: "Delete 10,000 emails.", es: "Elimina 10,000 emails." },
        tier: "gold", icon: "🌌", requirement: { type: "emails_deleted", value: 10000 }, rewardsCredits: 1500, isSecret: false,
    },
    {
        id: "know_it_all",
        name: { pt: "Sabe Tudo", en: "Know It All", es: "Sabelotodo" },
        description: { pt: "Leia 1000 emails.", en: "Read 1000 emails.", es: "Lee 1000 emails." },
        tier: "gold", icon: "🧠", requirement: { type: "emails_read", value: 1000 }, rewardsCredits: 500, isSecret: false,
    },
    {
        id: "liberator",
        name: { pt: "Libertador", en: "Liberator", es: "Libertador" },
        description: { pt: "Cancele 200 inscrições.", en: "Unsubscribe from 200 lists.", es: "Cancela 200 suscripciones." },
        tier: "gold", icon: "🕊️", requirement: { type: "unsubscribes", value: 200 }, rewardsCredits: 800, isSecret: false,
    },
    {
        id: "colossus_slayer",
        name: { pt: "Matador de Colossos", en: "Colossus Slayer", es: "Matador de Colosos" },
        description: { pt: "Delete 1GB em emails.", en: "Delete 1GB worth of emails.", es: "Elimina 1GB de emails." },
        tier: "gold", icon: "🏔️", requirement: { type: "emails_size_deleted", value: 1024 }, rewardsCredits: 1000, isSecret: false,
    },
    {
        id: "marathon_runner",
        name: { pt: "Maratonista", en: "Marathon Runner", es: "Maratonista" },
        description: { pt: "Streak de 60 dias.", en: "60-day streak.", es: "Racha de 60 días." },
        tier: "gold", icon: "🏃", requirement: { type: "streak", value: 60 }, rewardsCredits: 600, isSecret: false,
    },
    {
        id: "immortal",
        name: { pt: "Imortal", en: "Immortal", es: "Inmortal" },
        description: { pt: "Streak de 100 dias.", en: "100-day streak.", es: "Racha de 100 días." },
        tier: "gold", icon: "🧛", requirement: { type: "streak", value: 100 }, rewardsCredits: 2000, isSecret: false,
    },
    {
        id: "tycoon",
        name: { pt: "Magnata", en: "Tycoon", es: "Magnate" },
        description: { pt: "Acumule 5000 créditos.", en: "Earn 5000 credits.", es: "Gana 5000 créditos." },
        tier: "gold", icon: "🤑", requirement: { type: "credits_earned", value: 5000 }, rewardsCredits: 500, isSecret: false,
    },

    // ========== SECRET GOD TIER ==========
    {
        id: "speed_demon",
        name: { pt: "Demônio da Velocidade", en: "Speed Demon", es: "Demonio de la Velocidad" },
        description: { pt: "Delete 100 emails em < 1 min.", en: "Delete 100 emails in < 1 min.", es: "Elimina 100 emails en < 1 min." },
        tier: "gold", icon: "⚡", requirement: { type: "special", value: 1 }, rewardsCredits: 500, isSecret: true,
    },
    {
        id: "glitch_in_the_matrix",
        name: { pt: "Falha na Matrix", en: "Glitch", es: "Fallo" },
        description: { pt: "Encontre um bug (ou quase).", en: "Find a bug (almost).", es: "Encuentra un bug." },
        tier: "gold", icon: "👾", requirement: { type: "special", value: 1 }, rewardsCredits: 1337, isSecret: true,
    }
];

export function getBadgeById(id: string): Badge | undefined {
    return BADGES.find(badge => badge.id === id);
}

export function getBadgesByTier(tier: BadgeTier): Badge[] {
    return BADGES.filter(badge => badge.tier === tier);
}

export function getPublicBadges(): Badge[] {
    return BADGES.filter(badge => !badge.isSecret);
}

export const TOTAL_BADGES = BADGES.length;
export default BADGES;
