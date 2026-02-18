import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { getMadridDateToday, isGameVotingOpen } from "@/lib/dates";
import Card from "@/components/ui/Card";
import GameProposalSubmitForm from "@/components/game-proposals/GameProposalSubmitForm";
import Link from "next/link";

export default async function ProponerJuegoPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  // If winning game already selected or voting closed, redirect to home
  const winningGame = await prisma.winningGame.findFirst();
  if (winningGame || !isGameVotingOpen()) redirect("/poll");

  const todayDate = getMadridDateToday();
  const existingProposal = await prisma.gameProposal.findFirst({
    where: { userId: user.id, proposalDate: todayDate },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card glow="cyan">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              Proponer Juego
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Propón un juego o actividad para que la comunidad vote. Un
              moderador IA evaluará tu propuesta al instante.
            </p>
          </div>

          {existingProposal ? (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border ${
                  existingProposal.approved
                    ? "bg-green-900/20 border-green-700/50"
                    : existingProposal.approved === false
                    ? "bg-red-900/20 border-red-700/50"
                    : "bg-yellow-900/20 border-yellow-700/50"
                }`}
              >
                <p className="text-sm text-gray-300 mb-2">
                  Ya has propuesto un juego hoy:
                </p>
                <p className="text-foreground font-medium">
                  &quot;{existingProposal.title}&quot;
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {existingProposal.description}
                </p>
                {existingProposal.rejectionReason && (
                  <p className="text-xs text-red-400 mt-2">
                    Rechazada: {existingProposal.rejectionReason}
                  </p>
                )}
              </div>
              <Link
                href="/poll"
                className="inline-flex text-sm text-neon-cyan hover:text-cyan-300 transition-colors"
              >
                &larr; Volver al ranking
              </Link>
            </div>
          ) : (
            <GameProposalSubmitForm />
          )}
        </div>
      </Card>
    </div>
  );
}
