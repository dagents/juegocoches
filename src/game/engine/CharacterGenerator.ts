// Character generation for new games

import type { GameState, FamilyInfo, CharacterStats } from "./GameState";
import { clampStat } from "./GameState";
import { getRandomCountry, type Country } from "../data/countries";

/** Generate a completely random new character */
export function generateNewCharacter(name: string, country?: Country, difficulty: 'normal' | 'forocochero' = 'normal'): GameState {
  const selectedCountry = country ?? getRandomCountry();
  const isForocochero = difficulty === 'forocochero';

  // Random family — forocochero: only wealth 1-2, weighted toward orphanage/single_parent
  const wealthTier = isForocochero
    ? (Math.floor(Math.random() * 2) + 1) as 1 | 2
    : (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;
  const familyStatuses: FamilyInfo["familyStatus"][] = isForocochero
    ? ["orphanage", "orphanage", "single_parent", "single_parent", "divorced", "united"]
    : ["united", "united", "united", "divorced", "single_parent", "orphanage"];
  const familyStatus = familyStatuses[Math.floor(Math.random() * familyStatuses.length)];

  const family: FamilyInfo = {
    wealthTier,
    siblings: Math.floor(Math.random() * 4),
    familyStatus,
    parentEducation: 20 + wealthTier * 12 + Math.random() * 15,
  };

  // Starting stats influenced by country and family
  const countryBonus = selectedCountry.educationIndex * 20;
  const wealthBonus = wealthTier * 5;

  // Random talents (1-3)
  const allTalents = [
    "Artístico", "Musical", "Atlético", "Científico", "Social",
    "Mecánico", "Literario", "Matemático", "Lingüístico", "Emprendedor",
  ];
  const numTalents = 1 + Math.floor(Math.random() * 3);
  const talents: string[] = [];
  const talentPool = [...allTalents];
  for (let i = 0; i < numTalents; i++) {
    const idx = Math.floor(Math.random() * talentPool.length);
    talents.push(talentPool.splice(idx, 1)[0]);
  }

  const characterName = name.trim();
  const { min, max } = selectedCountry.startingWealth;
  const startingMoney = min + Math.random() * (max - min);

  // Forocochero penalty: -15 to all starting stats
  const hardcorePenalty = isForocochero ? -15 : 0;

  const stats: CharacterStats = {
    money: clampStat(20 + wealthBonus + hardcorePenalty),
    education: clampStat(5 + countryBonus * 0.3 + hardcorePenalty),
    health: clampStat(70 + Math.random() * 30 + hardcorePenalty),
    happiness: clampStat(50 + wealthBonus + Math.random() * 20 + hardcorePenalty),
    relationships: clampStat(30 + (familyStatus === "united" ? 20 : 0) + hardcorePenalty),
    reputation: clampStat(10 + wealthBonus + hardcorePenalty),
    intelligence: clampStat(30 + Math.random() * 40 + hardcorePenalty),
    charisma: clampStat(20 + Math.random() * 40 + hardcorePenalty),
  };

  const finalStartingMoney = isForocochero ? Math.round(startingMoney / 2) : Math.round(startingMoney);

  const state: GameState = {
    characterName,
    countryCode: selectedCountry.code,
    countryName: selectedCountry.name,
    city: selectedCountry.name,
    birthYear: 2026,

    currentAge: 0,
    currentMonth: 1,

    stats,
    family,
    talents,
    difficulty,
    takuEncounters: 0,
    forococheroSurvived: false,

    career: null,
    relationships: [],
    partner: null,
    children: [],
    isMarried: false,
    lifeEvents: [
      {
        age: 0,
        month: 1,
        type: "milestone",
        title: "Nacimiento",
        description: `Naces en ${selectedCountry.name}. Familia ${
          familyStatus === "united" ? "unida" : familyStatus === "divorced" ? "divorciada" : familyStatus === "single_parent" ? "monoparental" : "en orfanato"
        }, nivel económico ${wealthTier}/5. ${
          family.siblings > 0 ? `Tienes ${family.siblings} hermano${family.siblings > 1 ? "s" : ""}.` : "Eres hijo/a único/a."
        }`,
        effects: {},
      },
    ],
    properties: [],
    achievements: [],

    isAlive: true,
    causeOfDeath: null,

    bankBalance: finalStartingMoney,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    debt: 0,
    investments: 0,
  };

  return state;
}
