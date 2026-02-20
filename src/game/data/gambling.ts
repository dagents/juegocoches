// Gambling and lottery system

import type { GameState } from "@/game/engine/GameState";
import type { Decision } from "@/game/data/decisions";
import { getAgePhase } from "@/game/engine/GameState";

/** Get gambling-related decisions for adults 18+ */
export function getGamblingDecisions(state: GameState): Decision[] {
  if (state.currentAge < 18) return [];
  const decisions: Decision[] = [];
  const phase = getAgePhase(state.currentAge);

  // Lottery ticket — common, cheap, very low odds
  if (Math.random() < 0.12) {
    decisions.push({
      id: `lottery_${state.currentAge}_${state.currentMonth}`,
      text: "Pasas por un kiosco y ves que el bote de la lotería está en $100.000.",
      agePhase: phase,
      category: "finance",
      weight: 2,
      options: [
        {
          text: "Comprar un décimo ($10)",
          effects: { happiness: 1 },
          // 1 in 10,000 chance of jackpot. On success: +100k via money stat boost
          successChance: 0.0001,
          failEffects: { money: -1, happiness: -1 },
          narrative: "Los números no han salido. Será la próxima.",
        },
        {
          text: "Comprar 5 décimos ($50)",
          effects: { happiness: 2 },
          successChance: 0.0005,
          failEffects: { money: -3, happiness: -1 },
          narrative: "Nada de nada. $50 al viento.",
        },
        {
          text: "Pasar de largo",
          effects: {},
          narrative: "La mejor apuesta es no apostar.",
        },
      ],
    });
  }

  // Casino blackjack — moderate risk
  if (state.bankBalance >= 500 && Math.random() < 0.06) {
    decisions.push({
      id: `blackjack_${state.currentAge}_${state.currentMonth}`,
      text: "Unos amigos te invitan al casino. La mesa de blackjack te llama.",
      agePhase: phase,
      category: "finance",
      weight: 3,
      options: [
        {
          text: "Apostar $100 al blackjack",
          effects: { money: 4, happiness: 5 }, // win 2x = $200 profit
          successChance: 0.48,
          failEffects: { money: -4, happiness: -3 },
          narrative: "La casa siempre gana... o casi siempre.",
        },
        {
          text: "Apostar $500 — a lo grande",
          effects: { money: 15, happiness: 8 },
          successChance: 0.48,
          failEffects: { money: -15, happiness: -8 },
          narrative: "Adrenalina pura en la mesa.",
        },
        {
          text: "Solo mirar y tomar algo",
          effects: { happiness: 2, money: -1 },
          narrative: "A veces es mejor ser espectador.",
        },
      ],
    });
  }

  // Sports betting
  if (Math.random() < 0.08) {
    decisions.push({
      id: `sports_bet_${state.currentAge}_${state.currentMonth}`,
      text: "Hay un partido importante este fin de semana. Todo el mundo habla de apuestas.",
      agePhase: phase,
      category: "finance",
      weight: 2,
      options: [
        {
          text: "Apostar $50 al favorito (cuota baja)",
          effects: { money: 2, happiness: 3 },
          successChance: 0.55,
          failEffects: { money: -2, happiness: -2 },
          narrative: "Resultado cantado... o no.",
        },
        {
          text: "Apostar $50 al no favorito (cuota alta)",
          effects: { money: 8, happiness: 6 },
          successChance: 0.25,
          failEffects: { money: -2, happiness: -2 },
          narrative: "Las sorpresas existen en el deporte.",
        },
        {
          text: "No apostar, disfrutar el partido",
          effects: { happiness: 2 },
        },
      ],
    });
  }

  // Slot machines
  if (state.bankBalance >= 200 && Math.random() < 0.05) {
    decisions.push({
      id: `slots_${state.currentAge}_${state.currentMonth}`,
      text: "Ves una sala de tragaperras. Las luces y los sonidos te atraen.",
      agePhase: phase,
      category: "finance",
      weight: 2,
      options: [
        {
          text: "Echar unas monedas ($20)",
          effects: { money: 1, happiness: 3 },
          successChance: 0.35, // slots have terrible odds
          failEffects: { money: -1, happiness: -1 },
          narrative: "Las tragaperras son puro azar.",
        },
        {
          text: "Sentarte y gastar $100",
          effects: { money: 6, happiness: 5 },
          successChance: 0.2, // longer play, worse expected value
          failEffects: { money: -5, happiness: -3 },
          narrative: "Hipnotizado por los rodillos girando.",
        },
        {
          text: "Salir de ahí",
          effects: { happiness: 1 },
          narrative: "Tu cartera te lo agradece.",
        },
      ],
    });
  }

  return decisions;
}
