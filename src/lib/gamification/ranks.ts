
export interface Rank {
    id: number;
    name: {
        pt: string;
        en: string;
        es: string;
    };
    minLevel: number;
    icon: string;
}

const BASE_PATH = '/envato/game-rank-icons-2023-11-27-05-26-24-utc/png';

const getIconPath = (index: number) => `${BASE_PATH}/ri_1_${index.toString().padStart(2, '0')}.png`;

export const RANKS: Rank[] = [
    // 1. Recruta (Recruit) - Icons 01-03
    { id: 1, name: { pt: 'Recruta', en: 'Recruit', es: 'Recluta' }, minLevel: 1, icon: getIconPath(1) },
    { id: 2, name: { pt: 'Recruta II', en: 'Recruit II', es: 'Recluta II' }, minLevel: 2, icon: getIconPath(2) },
    { id: 3, name: { pt: 'Recruta de Elite', en: 'Elite Recruit', es: 'Recluta de Élite' }, minLevel: 3, icon: getIconPath(3) },

    // 2. Soldado (Private) - Icons 04-06
    { id: 4, name: { pt: 'Soldado', en: 'Private', es: 'Soldado' }, minLevel: 4, icon: getIconPath(4) },
    { id: 5, name: { pt: 'Soldado 1ª Classe', en: 'Private 1st Class', es: 'Soldado de 1ª Clase' }, minLevel: 6, icon: getIconPath(5) },
    { id: 6, name: { pt: 'Soldado Veterano', en: 'Veteran Private', es: 'Soldado Veterano' }, minLevel: 8, icon: getIconPath(6) },

    // 3. Cabo (Corporal) - Icons 07-09
    { id: 7, name: { pt: 'Cabo', en: 'Corporal', es: 'Cabo' }, minLevel: 10, icon: getIconPath(7) },
    { id: 8, name: { pt: 'Cabo Especialista', en: 'Specialist Corporal', es: 'Cabo Especialista' }, minLevel: 12, icon: getIconPath(8) },
    { id: 9, name: { pt: 'Cabo de Comando', en: 'Command Corporal', es: 'Cabo de Comando' }, minLevel: 14, icon: getIconPath(9) },

    // 4. Sargento (Sergeant) - Icons 10-12
    { id: 10, name: { pt: 'Sargento', en: 'Sergeant', es: 'Sargento' }, minLevel: 16, icon: getIconPath(10) },
    { id: 11, name: { pt: 'Sargento Mestre', en: 'Master Sergeant', es: 'Sargento Maestro' }, minLevel: 19, icon: getIconPath(11) },
    { id: 12, name: { pt: 'Primeiro Sargento', en: 'First Sergeant', es: 'Primer Sargento' }, minLevel: 22, icon: getIconPath(12) },

    // 5. Subtenente (Warrant Officer) - Icons 13-15
    { id: 13, name: { pt: 'Subtenente', en: 'Warrant Officer', es: 'Suboficial' }, minLevel: 25, icon: getIconPath(13) },
    { id: 14, name: { pt: 'Subtenente Chefe', en: 'Chief Warrant Officer', es: 'Suboficial Jefe' }, minLevel: 28, icon: getIconPath(14) },
    { id: 15, name: { pt: 'Subtenente Mestre', en: 'Master Warrant Officer', es: 'Suboficial Maestro' }, minLevel: 31, icon: getIconPath(15) },

    // 6. Aspirante (Cadet) - Icons 16-18
    { id: 16, name: { pt: 'Aspirante', en: 'Cadet', es: 'Cadete' }, minLevel: 35, icon: getIconPath(16) },
    { id: 17, name: { pt: 'Aspirante Oficial', en: 'Officer Cadet', es: 'Cadete Oficial' }, minLevel: 38, icon: getIconPath(17) },
    { id: 18, name: { pt: 'Aspirante Sênior', en: 'Senior Cadet', es: 'Cadete Senior' }, minLevel: 41, icon: getIconPath(18) },

    // 7. Tenente (Lieutenant) - Icons 19-21
    { id: 19, name: { pt: 'Segundo Tenente', en: 'Second Lieutenant', es: 'Segundo Teniente' }, minLevel: 45, icon: getIconPath(19) },
    { id: 20, name: { pt: 'Primeiro Tenente', en: 'First Lieutenant', es: 'Primer Teniente' }, minLevel: 48, icon: getIconPath(20) },
    { id: 21, name: { pt: 'Tenente Comandante', en: 'Lieutenant Commander', es: 'Teniente Comandante' }, minLevel: 51, icon: getIconPath(21) },

    // 8. Capitão (Captain) - Icons 22-24
    { id: 22, name: { pt: 'Capitão', en: 'Captain', es: 'Capitán' }, minLevel: 55, icon: getIconPath(22) },
    { id: 23, name: { pt: 'Capitão de Elite', en: 'Elite Captain', es: 'Capitán de Élite' }, minLevel: 59, icon: getIconPath(23) },
    { id: 24, name: { pt: 'Capitão de Força', en: 'Force Captain', es: 'Capitán de Fuerza' }, minLevel: 63, icon: getIconPath(24) },

    // 9. Major (Major) - Icons 25-27
    { id: 25, name: { pt: 'Major', en: 'Major', es: 'Mayor' }, minLevel: 67, icon: getIconPath(25) },
    { id: 26, name: { pt: 'Major de Campo', en: 'Field Major', es: 'Mayor de Campo' }, minLevel: 71, icon: getIconPath(26) },
    { id: 27, name: { pt: 'Major General', en: 'Major General', es: 'Mayor General' }, minLevel: 75, icon: getIconPath(27) },

    // 10. Tenente-Coronel (Lieutenant Colonel) - Icons 28-30
    { id: 28, name: { pt: 'Tenente-Coronel', en: 'Lieutenant Colonel', es: 'Teniente Coronel' }, minLevel: 80, icon: getIconPath(28) },
    { id: 29, name: { pt: 'Tenente-Coronel II', en: 'Lieutenant Colonel II', es: 'Teniente Coronel II' }, minLevel: 84, icon: getIconPath(29) },
    { id: 30, name: { pt: 'Comandante de Batalhão', en: 'Battalion Commander', es: 'Comandante de Batallón' }, minLevel: 88, icon: getIconPath(30) },

    // 11. Coronel (Colonel) - Icons 31-33
    { id: 31, name: { pt: 'Coronel', en: 'Colonel', es: 'Coronel' }, minLevel: 92, icon: getIconPath(31) },
    { id: 32, name: { pt: 'Coronel de Regimento', en: 'Regiment Colonel', es: 'Coronel de Regimiento' }, minLevel: 96, icon: getIconPath(32) },
    { id: 33, name: { pt: 'Coronel Estrategista', en: 'Strategist Colonel', es: 'Coronel Estratega' }, minLevel: 100, icon: getIconPath(33) },

    // 12. General (General) - Icons 34-36
    { id: 34, name: { pt: 'General de Brigada', en: 'Brigadier General', es: 'General de Brigada' }, minLevel: 110, icon: getIconPath(34) },
    { id: 35, name: { pt: 'General de Divisão', en: 'Major General', es: 'General de División' }, minLevel: 120, icon: getIconPath(35) },
    { id: 36, name: { pt: 'General de Exército', en: 'Army General', es: 'General de Ejército' }, minLevel: 130, icon: getIconPath(36) },

    // 13. Marechal (Marshal) - Icons 37-40
    { id: 37, name: { pt: 'Marechal', en: 'Marshal', es: 'Mariscal' }, minLevel: 150, icon: getIconPath(37) },
    { id: 38, name: { pt: 'Marechal do Ar', en: 'Air Marshal', es: 'Mariscal del Aire' }, minLevel: 170, icon: getIconPath(38) },
    { id: 39, name: { pt: 'Grande Marechal', en: 'Grand Marshal', es: 'Gran Mariscal' }, minLevel: 190, icon: getIconPath(39) },
    { id: 40, name: { pt: 'Comandante Supremo', en: 'Supreme Commander', es: 'Comandante Supremo' }, minLevel: 200, icon: getIconPath(40) },
];

export const getRankByLevel = (level: number): Rank => {
    // Encontrar o rank mais alto que satisfaz level >= minLevel
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (level >= RANKS[i].minLevel) {
            return RANKS[i];
        }
    }
    return RANKS[0]; // Fallback
};
