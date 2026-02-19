// Character generation for new games

import type { GameState, FamilyInfo, CharacterStats } from "./GameState";
import { clampStat } from "./GameState";
import { getRandomCountry, type Country } from "../data/countries";

/** Generate a completely random new character */
export function generateNewCharacter(name: string, country?: Country): GameState {
  const selectedCountry = country ?? getRandomCountry();

  // Random family
  const wealthTier = (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;
  const familyStatuses: FamilyInfo["familyStatus"][] = [
    "united", "united", "united", "divorced", "single_parent", "orphanage",
  ];
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

  const stats: CharacterStats = {
    money: clampStat(20 + wealthBonus),
    education: clampStat(5 + countryBonus * 0.3),
    health: clampStat(70 + Math.random() * 30),
    happiness: clampStat(50 + wealthBonus + Math.random() * 20),
    relationships: clampStat(30 + (familyStatus === "united" ? 20 : 0)),
    reputation: clampStat(10 + wealthBonus),
    intelligence: clampStat(30 + Math.random() * 40),
    charisma: clampStat(20 + Math.random() * 40),
  };

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

    career: null,
    relationships: [],
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

    bankBalance: Math.round(startingMoney),
    monthlyIncome: 0,
    monthlyExpenses: 0,
    debt: 0,
    investments: 0,
  };

  return state;
}
