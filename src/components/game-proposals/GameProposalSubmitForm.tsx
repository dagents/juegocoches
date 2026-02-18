"use client";

import { useState, useTransition } from "react";
import { submitGameProposal } from "@/actions/game-proposals.actions";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { GAME_TITLE_MAX_LENGTH, GAME_DESCRIPTION_MAX_LENGTH } from "@/lib/constants";

export default function GameProposalSubmitForm() {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    approved: boolean | null;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await submitGameProposal(formData);
      if (res.success && res.data) {
        setResult({ approved: res.data.approved });
      } else if (res.error) {
        setError(res.error);
      }
    });
  }

  if (result) {
    return (
      <div className="space-y-4">
        <div
          className={`p-4 rounded-xl border ${
            result.approved
              ? "bg-green-900/20 border-green-700/50"
              : "bg-red-900/20 border-red-700/50"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {result.approved ? (
              <Badge variant="success">Propuesta Aprobada</Badge>
            ) : (
              <Badge variant="danger">Propuesta Rechazada</Badge>
            )}
          </div>
          <p
            className={`text-sm ${
              result.approved ? "text-green-300" : "text-red-300"
            }`}
          >
            {result.approved
              ? "Tu propuesta de juego ha sido aprobada y ya es visible en el ranking."
              : "Tu propuesta fue rechazada por el moderador. Puedes intentar de nuevo mañana."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Nombre del juego
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={GAME_TITLE_MAX_LENGTH}
          placeholder="Ej: Juego de cosecha, juego de naves, juego estilo Stardew Valley, etc"
          required
          minLength={3}
          className="w-full px-3 py-2 bg-surface-elevated border border-surface-card rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200"
        />
        <p className="text-xs text-gray-500 mt-1">
          Mínimo 3 caracteres, máximo {GAME_TITLE_MAX_LENGTH}.
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Descripción del juego
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={GAME_DESCRIPTION_MAX_LENGTH}
          placeholder="Describe el juego: mecánicas, objetivo, qué lo hace divertido..."
          required
          minLength={10}
          className="w-full px-3 py-2 bg-surface-elevated border border-surface-card rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent resize-none transition-all duration-200"
        />
        <p className="text-xs text-gray-500 mt-1">
          Mínimo 10 caracteres, máximo {GAME_DESCRIPTION_MAX_LENGTH}. Sé concreto para que
          el moderador IA apruebe tu propuesta.
        </p>
      </div>

      <Button type="submit" loading={isPending} className="w-full" size="lg">
        {isPending ? "Moderando con IA..." : "Enviar Propuesta"}
      </Button>
    </form>
  );
}
