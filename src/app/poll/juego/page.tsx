import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import type { GameProposalWithUser, WinningGameWithProposal } from "@/types";

export const dynamic = "force-dynamic";

async function getWinningGame(): Promise<WinningGameWithProposal | null> {
  const winner = await prisma.winningGame.findFirst({
    include: { proposal: true },
  });
  return winner as WinningGameWithProposal | null;
}

async function getAllGameProposals(): Promise<GameProposalWithUser[]> {
  const proposals = await prisma.gameProposal.findMany({
    where: { approved: true },
    orderBy: [{ votesCount: "desc" }, { createdAt: "asc" }],
  });
  return proposals as GameProposalWithUser[];
}

export default async function JuegoArchivePage() {
  const winningGame = await getWinningGame();
  const proposals = await getAllGameProposals();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">
          Selección de Juego
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          La comunidad votó y eligió el juego que construiremos juntos.
        </p>
        <Badge variant="default">Votación finalizada</Badge>
      </section>

      {/* Winning game */}
      {winningGame && (
        <section>
          <Card glow="purple">
            <div className="text-center space-y-3">
              <div className="text-4xl">🏆</div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Juego ganador
              </p>
              <h2 className="text-2xl font-bold text-foreground">
                {winningGame.proposal.title}
              </h2>
              <p className="text-gray-400">
                {winningGame.proposal.description}
              </p>
              <p className="text-sm text-neon-purple font-semibold">
                {winningGame.proposal.votesCount} votos
              </p>
            </div>
          </Card>
        </section>
      )}

      {/* All proposals */}
      <section>
        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Todas las propuestas ({proposals.length})
          </h2>
          <div className="space-y-3">
            {proposals.map((proposal, index) => {
              const isWinner = winningGame?.proposal.id === proposal.id;
              return (
                <div
                  key={proposal.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isWinner
                      ? "bg-neon-purple/10 border-neon-purple/40"
                      : "bg-surface-card border-surface-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isWinner
                          ? "bg-neon-purple/20 text-neon-purple"
                          : "bg-surface-elevated text-gray-400"
                      }`}
                    >
                      {isWinner ? "🏆" : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-100">
                        {proposal.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {proposal.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          #{proposal.userId.slice(0, 8)}
                        </span>
                        {proposal.category && (
                          <Badge variant="info">{proposal.category}</Badge>
                        )}
                        {isWinner && (
                          <Badge variant="success">Ganadora</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-lg font-bold text-neon-cyan">
                        {proposal.votesCount}
                      </span>
                      <span className="text-xs text-gray-500 block">
                        votos
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Back link */}
      <div className="text-center">
        <Link
          href="/poll"
          className="text-sm text-neon-cyan hover:text-cyan-300 transition-colors"
        >
          &larr; Volver a las mejoras diarias
        </Link>
      </div>
    </div>
  );
}
