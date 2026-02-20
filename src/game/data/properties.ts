// Properties system — Real estate, vehicles, businesses and land

import type { CharacterStats } from "@/game/engine/GameState";
import type { Decision } from "@/game/data/decisions";

export interface Property {
  id: string;
  name: string;
  type: "house" | "apartment" | "car" | "business" | "land";
  basePrice: number;
  monthlyMaintenance: number;
  monthlyIncome: number;
  appreciationRate: number; // yearly multiplier (e.g. 1.03 = 3% appreciation)
  description: string;
  minAge: number;
  requiredMoney: number; // minimum bankBalance to purchase
  emoji: string;
}

export const ALL_PROPERTIES: Property[] = [
  // ──────────── APARTMENTS ────────────
  {
    id: "piso_estudio",
    name: "Estudio en las afueras",
    type: "apartment",
    basePrice: 45000,
    monthlyMaintenance: 150,
    monthlyIncome: 0,
    appreciationRate: 1.02,
    description: "30 metros cuadrados de libertad. Pequeño pero tuyo.",
    minAge: 18,
    requiredMoney: 10000,
    emoji: "🏢",
  },
  {
    id: "piso_centro",
    name: "Piso en el centro",
    type: "apartment",
    basePrice: 120000,
    monthlyMaintenance: 300,
    monthlyIncome: 0,
    appreciationRate: 1.035,
    description: "Céntrico, luminoso, y con el bar de tapas al lado. Vida de barrio.",
    minAge: 22,
    requiredMoney: 30000,
    emoji: "🏙️",
  },
  {
    id: "piso_lujo",
    name: "Ático de lujo",
    type: "apartment",
    basePrice: 350000,
    monthlyMaintenance: 800,
    monthlyIncome: 0,
    appreciationRate: 1.04,
    description: "Terraza con vistas, piscina comunitaria y portero 24h. La buena vida.",
    minAge: 28,
    requiredMoney: 80000,
    emoji: "🌆",
  },
  {
    id: "piso_alquiler",
    name: "Piso para alquilar",
    type: "apartment",
    basePrice: 95000,
    monthlyMaintenance: 200,
    monthlyIncome: 650,
    appreciationRate: 1.025,
    description: "Inversión clásica: comprar para alquilar. Inquilinos incluidos (para bien o para mal).",
    minAge: 25,
    requiredMoney: 25000,
    emoji: "🔑",
  },

  // ──────────── HOUSES ────────────
  {
    id: "casa_pueblo",
    name: "Casa de pueblo",
    type: "house",
    basePrice: 60000,
    monthlyMaintenance: 180,
    monthlyIncome: 0,
    appreciationRate: 1.015,
    description: "Paredes de piedra, huerto trasero y vecinos que te conocen de toda la vida.",
    minAge: 20,
    requiredMoney: 15000,
    emoji: "🏡",
  },
  {
    id: "chalet_adosado",
    name: "Chalet adosado",
    type: "house",
    basePrice: 180000,
    monthlyMaintenance: 400,
    monthlyIncome: 0,
    appreciationRate: 1.03,
    description: "Jardín pequeño, garaje y barbacoa los domingos. El sueño suburbano.",
    minAge: 28,
    requiredMoney: 45000,
    emoji: "🏠",
  },
  {
    id: "chalet_independiente",
    name: "Chalet independiente",
    type: "house",
    basePrice: 300000,
    monthlyMaintenance: 700,
    monthlyIncome: 0,
    appreciationRate: 1.03,
    description: "Sin vecinos pegados, piscina propia y espacio de sobra.",
    minAge: 30,
    requiredMoney: 75000,
    emoji: "🏘️",
  },
  {
    id: "mansion",
    name: "Mansión",
    type: "house",
    basePrice: 900000,
    monthlyMaintenance: 3000,
    monthlyIncome: 0,
    appreciationRate: 1.025,
    description: "10 habitaciones, sala de cine, bodega y servicio. Vivir como un rey.",
    minAge: 35,
    requiredMoney: 250000,
    emoji: "🏰",
  },

  // ──────────── CARS ────────────
  {
    id: "coche_usado",
    name: "Coche de segunda mano",
    type: "car",
    basePrice: 5000,
    monthlyMaintenance: 150,
    monthlyIncome: 0,
    appreciationRate: 0.95,
    description: "Tiene sus años y algún arañazo, pero arranca (casi siempre).",
    minAge: 18,
    requiredMoney: 3000,
    emoji: "🚗",
  },
  {
    id: "coche_nuevo",
    name: "Coche nuevo",
    type: "car",
    basePrice: 25000,
    monthlyMaintenance: 250,
    monthlyIncome: 0,
    appreciationRate: 0.92,
    description: "Ese olor a nuevo. Climatizador, pantalla táctil y cero kilómetros.",
    minAge: 20,
    requiredMoney: 10000,
    emoji: "🚙",
  },
  {
    id: "coche_deportivo",
    name: "Deportivo",
    type: "car",
    basePrice: 80000,
    monthlyMaintenance: 500,
    monthlyIncome: 0,
    appreciationRate: 0.94,
    description: "De 0 a 100 en 4 segundos. La crisis de los 40 sobre ruedas.",
    minAge: 25,
    requiredMoney: 40000,
    emoji: "🏎️",
  },
  {
    id: "coche_clasico",
    name: "Coche clásico",
    type: "car",
    basePrice: 35000,
    monthlyMaintenance: 400,
    monthlyIncome: 0,
    appreciationRate: 1.05,
    description: "Un clásico restaurado. Se revaloriza con el tiempo y gira cabezas.",
    minAge: 30,
    requiredMoney: 20000,
    emoji: "🚘",
  },
  {
    id: "superdeportivo",
    name: "Superdeportivo",
    type: "car",
    basePrice: 250000,
    monthlyMaintenance: 1500,
    monthlyIncome: 0,
    appreciationRate: 0.96,
    description: "Ferrari, Lamborghini... Sí, esa liga. La gente saca fotos cuando pasas.",
    minAge: 30,
    requiredMoney: 150000,
    emoji: "🏁",
  },

  // ──────────── BUSINESSES ────────────
  {
    id: "bar",
    name: "Bar de barrio",
    type: "business",
    basePrice: 40000,
    monthlyMaintenance: 800,
    monthlyIncome: 1500,
    appreciationRate: 1.01,
    description: "Tapas, cañas y tertulias. El corazón del barrio.",
    minAge: 22,
    requiredMoney: 15000,
    emoji: "🍺",
  },
  {
    id: "restaurante",
    name: "Restaurante",
    type: "business",
    basePrice: 120000,
    monthlyMaintenance: 2500,
    monthlyIncome: 4000,
    appreciationRate: 1.02,
    description: "Cocina de autor, reservas llenas y reseñas en Google. Estrés y orgullo a partes iguales.",
    minAge: 28,
    requiredMoney: 40000,
    emoji: "🍽️",
  },
  {
    id: "tienda_online",
    name: "Tienda online",
    type: "business",
    basePrice: 15000,
    monthlyMaintenance: 300,
    monthlyIncome: 800,
    appreciationRate: 1.03,
    description: "Dropshipping, marca propia o lo que sea. El futuro es digital.",
    minAge: 18,
    requiredMoney: 8000,
    emoji: "💻",
  },
  {
    id: "franquicia",
    name: "Franquicia",
    type: "business",
    basePrice: 200000,
    monthlyMaintenance: 3000,
    monthlyIncome: 5500,
    appreciationRate: 1.02,
    description: "Marca conocida, sistema probado. Menos riesgo, menos libertad, pero pasta segura.",
    minAge: 30,
    requiredMoney: 60000,
    emoji: "🏪",
  },
  {
    id: "startup_tech",
    name: "Startup tecnológica",
    type: "business",
    basePrice: 50000,
    monthlyMaintenance: 2000,
    monthlyIncome: 1000,
    appreciationRate: 1.08,
    description: "Puede ser el próximo unicornio... o morir en 6 meses. Adrenalina pura.",
    minAge: 20,
    requiredMoney: 20000,
    emoji: "🚀",
  },

  // ──────────── LAND ────────────
  {
    id: "terreno_rustico",
    name: "Terreno rústico",
    type: "land",
    basePrice: 20000,
    monthlyMaintenance: 50,
    monthlyIncome: 0,
    appreciationRate: 1.02,
    description: "Hectáreas de campo. Ideal para huerto, ganado, o simplemente desconectar.",
    minAge: 20,
    requiredMoney: 8000,
    emoji: "🌾",
  },
  {
    id: "terreno_urbano",
    name: "Solar urbano",
    type: "land",
    basePrice: 80000,
    monthlyMaintenance: 100,
    monthlyIncome: 0,
    appreciationRate: 1.04,
    description: "Parcela en zona urbanizable. Hoy es tierra, mañana puede ser oro.",
    minAge: 25,
    requiredMoney: 25000,
    emoji: "🏗️",
  },
  {
    id: "terreno_playa",
    name: "Parcela junto a la playa",
    type: "land",
    basePrice: 150000,
    monthlyMaintenance: 200,
    monthlyIncome: 0,
    appreciationRate: 1.05,
    description: "A 200 metros del mar. El sitio perfecto para construir tu casa soñada.",
    minAge: 28,
    requiredMoney: 50000,
    emoji: "🏖️",
  },
];

/** Get properties the player can afford and is old enough for */
export function getAffordableProperties(
  bankBalance: number,
  age: number,
  stats: CharacterStats
): Property[] {
  return ALL_PROPERTIES.filter((p) => {
    if (age < p.minAge) return false;
    if (bankBalance < p.requiredMoney) return false;
    // Businesses require some intelligence
    if (p.type === "business" && stats.intelligence < 30) return false;
    return true;
  });
}

/** Generate purchase/sell decisions based on owned properties and financial state */
export function getPropertyDecisions(
  ownedIds: string[],
  bankBalance: number,
  age: number,
  stats: CharacterStats
): Decision[] {
  const decisions: Decision[] = [];

  // Purchase decisions — offer 1-2 affordable properties not yet owned
  const affordable = getAffordableProperties(bankBalance, age, stats).filter(
    (p) => !ownedIds.includes(p.id)
  );

  if (affordable.length > 0) {
    // Pick a random affordable property to offer
    const shuffled = [...affordable].sort(() => Math.random() - 0.5);
    const offer = shuffled[0];

    const buyEffects: Partial<CharacterStats> = {
      money: -Math.round(offer.basePrice / 500),
      happiness: 8,
      reputation: offer.type === "house" || offer.type === "apartment" ? 5 : 3,
    };

    decisions.push({
      id: `buy_${offer.id}`,
      text: `${offer.emoji} Oportunidad: ${offer.name} por ${offer.basePrice.toLocaleString("es-ES")}€`,
      agePhase: age <= 12 ? "childhood" : age <= 17 ? "teen" : age <= 30 ? "young_adult" : age <= 55 ? "adult" : "elderly",
      category: "finance",
      weight: 3,
      options: [
        {
          text: `Comprar (${offer.basePrice.toLocaleString("es-ES")}€)`,
          effects: buyEffects,
          narrative: offer.description,
        },
        {
          text: "No me interesa ahora",
          effects: {},
        },
      ],
    });
  }

  // Sell decisions — offer to sell owned properties
  if (ownedIds.length > 0) {
    const sellId = ownedIds[Math.floor(Math.random() * ownedIds.length)];
    const prop = ALL_PROPERTIES.find((p) => p.id === sellId);
    if (prop) {
      decisions.push({
        id: `sell_${prop.id}`,
        text: `${prop.emoji} ¿Vender tu ${prop.name}?`,
        agePhase: age <= 12 ? "childhood" : age <= 17 ? "teen" : age <= 30 ? "young_adult" : age <= 55 ? "adult" : "elderly",
        category: "finance",
        weight: 2,
        options: [
          {
            text: `Vender`,
            effects: { money: Math.round(prop.basePrice / 500), happiness: -3 },
            narrative: "El mercado inmobiliario no espera.",
          },
          {
            text: "Conservar la propiedad",
            effects: {},
          },
        ],
      });
    }
  }

  return decisions;
}
