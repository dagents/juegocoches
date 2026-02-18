"use server";

import { z } from "zod/v4";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const ModerationResultSchema = z.object({
  aprobada: z.boolean(),
  motivo: z.string(),
  categoria: z.string(),
});

export type ModerationResult = {
  approved: boolean;
  reason: string;
  category: string;
};

export async function moderateIdea(content: string): Promise<ModerationResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { approved: false, reason: "Moderación no disponible.", category: "otro" };
  }

  const model = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free";

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "JuegoCoches",
      },
      body: JSON.stringify({
        model,
        max_tokens: 256,
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: `Eres un moderador de ideas para una plataforma comunitaria. Responde ÚNICAMENTE con un JSON válido, sin texto adicional, sin markdown, sin backticks. El formato exacto es: {"aprobada":true/false,"motivo":"razón breve","categoria":"categoría"}. Aprueba si la idea es concreta, constructiva y no es spam ni ofensiva. Rechaza si es vaga, ofensiva, spam o no tiene sentido. Categorías: transporte, urbanismo, medioambiente, comunidad, otro.`,
          },
          {
            role: "user",
            content: `Evalúa esta idea: "${content}"`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("OpenRouter API error:", res.status, await res.text().catch(() => ""));
      return { approved: false, reason: "Error de moderación.", category: "otro" };
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== "string") {
      return { approved: false, reason: "Respuesta de moderación inválida.", category: "otro" };
    }

    const jsonStr = text
      .replace(/```json?\n?/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(jsonStr);
    const result = ModerationResultSchema.parse(parsed);

    return {
      approved: result.aprobada,
      reason: result.motivo,
      category: result.categoria,
    };
  } catch {
    return {
      approved: false,
      reason: "Error al procesar la moderación. Idea rechazada por precaución.",
      category: "otro",
    };
  }
}
