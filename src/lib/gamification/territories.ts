/**
 * RATEL - Sistema de Territórios
 * Progressão estilo Super Mario Bros SNES
 */

export interface Territory {
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
    emailsRequired: number;
    unsubscribesRequired: number;
    rewardsCredits: number;
    rewardsBadge?: string;
    backgroundImage: string;
    enemies: string[];
    color: string;
    icon: string;
}

/**
 * TERRITÓRIOS DO MAPA
 * Estilo Super Mario Bros SNES + Anime Noir
 */
export const TERRITORIES: Territory[] = [
    {
        id: "territory_1",
        name: {
            pt: "Floresta do Spam",
            en: "Spam Forest",
            es: "Bosque del Spam"
        },
        description: {
            pt: "Seus primeiros passos na batalha contra o email desnecessário.",
            en: "Your first steps in the battle against unnecessary email.",
            es: "Tus primeros pasos en la batalla contra el email innecesario."
        },
        emailsRequired: 100,
        unsubscribesRequired: 10,
        rewardsCredits: 50,
        rewardsBadge: "first_blood",
        backgroundImage: "/assets/territories/background_forest.svg",
        enemies: ["chacal"],
        color: "#228B22",
        icon: "🌲",
    },
    {
        id: "territory_2",
        name: {
            pt: "Montanha das Newsletters",
            en: "Newsletter Mountain",
            es: "Montaña de las Newsletters"
        },
        description: {
            pt: "Enfrente a avalanche de newsletters que você nunca pediu.",
            en: "Face the avalanche of newsletters you never asked for.",
            es: "Enfrenta la avalancha de newsletters que nunca pediste."
        },
        emailsRequired: 500,
        unsubscribesRequired: 50,
        rewardsCredits: 200,
        rewardsBadge: "newsletter_destroyer",
        backgroundImage: "/assets/territories/background_mountain.svg",
        enemies: ["leao", "tigre"],
        color: "#8B4513",
        icon: "⛰️",
    },
    {
        id: "territory_3",
        name: {
            pt: "Deserto Corporativo",
            en: "Corporate Desert",
            es: "Desierto Corporativo"
        },
        description: {
            pt: "Emails em massa de empresas gigantes. Prepare-se.",
            en: "Mass emails from giant corporations. Prepare yourself.",
            es: "Emails masivos de empresas gigantes. Prepárate."
        },
        emailsRequired: 1000,
        unsubscribesRequired: 100,
        rewardsCredits: 500,
        rewardsBadge: "corporate_destroyer",
        backgroundImage: "/assets/territories/background_desert.svg",
        enemies: ["elefante"],
        color: "#F4A460",
        icon: "🏜️",
    },
    {
        id: "territory_infinity",
        name: {
            pt: "Infinito e Além",
            en: "Infinity and Beyond",
            es: "Infinito y Más Allá"
        },
        description: {
            pt: "A batalha nunca acaba. Continue limpando, continue evoluindo.",
            en: "The battle never ends. Keep cleaning, keep evolving.",
            es: "La batalla nunca termina. Sigue limpiando, sigue evolucionando."
        },
        emailsRequired: Infinity,
        unsubscribesRequired: Infinity,
        rewardsCredits: 0,
        rewardsBadge: undefined,
        backgroundImage: "/assets/territories/background_infinity.svg",
        enemies: ["todos"],
        color: "#4B0082",
        icon: "🚀",
    },
];

/**
 * Obtém território por ID
 */
export function getTerritoryById(id: string): Territory | undefined {
    return TERRITORIES.find(territory => territory.id === id);
}

/**
 * Obtém território por índice
 */
export function getTerritoryByIndex(index: number): Territory | undefined {
    return TERRITORIES[index];
}

/**
 * Calcula progresso no território atual
 */
export function calculateTerritoryProgress(
    userEmailsDeleted: number,
    userUnsubscribes: number,
    territoryIndex: number
): number {
    const territory = TERRITORIES[territoryIndex];
    if (!territory || territory.emailsRequired === Infinity) {
        return 100; // Território infinito sempre "100%"
    }

    const emailProgress = Math.min((userEmailsDeleted / territory.emailsRequired) * 100, 100);
    const unsubProgress = Math.min((userUnsubscribes / territory.unsubscribesRequired) * 100, 100);

    // Média ponderada: emails têm mais peso
    return Math.round((emailProgress * 0.7) + (unsubProgress * 0.3));
}

/**
 * Verifica se pode avançar para próximo território
 */
export function canAdvanceToNextTerritory(
    userEmailsDeleted: number,
    userUnsubscribes: number,
    currentTerritoryIndex: number
): boolean {
    const territory = TERRITORIES[currentTerritoryIndex];
    if (!territory) return false;

    return (
        userEmailsDeleted >= territory.emailsRequired &&
        userUnsubscribes >= territory.unsubscribesRequired
    );
}

/**
 * Total de territórios
 */
export const TOTAL_TERRITORIES = TERRITORIES.length;

export default TERRITORIES;
