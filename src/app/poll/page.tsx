import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { getMadridDateToday } from "@/lib/dates";
import MadridCountdown from "@/components/countdown/MadridCountdown";
import IdeaListRealtime from "@/components/ideas/IdeaListRealtime";
import ProposeButton from "@/components/ideas/ProposeButton";
import GameProposalListRealtime from "@/components/game-proposals/GameProposalListRealtime";
import ProposeGameButton from "@/components/game-proposals/ProposeGameButton";
import Changelog from "@/components/ranking/Changelog";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type {
  IdeaWithUser,
  DailyWinnerWithIdea,
  GameProposalWithUser,
  WinningGameWithProposal,
} from "@/types";

export const dynamic = "force-dynamic";

// ---- Phase 2 data fetchers ----

async function getTodayIdeas(): Promise<IdeaWithUser[]> {
  const todayDate = getMadridDateToday();
  const ideas = await prisma.idea.findMany({
    where: { dayDate: todayDate },
    include: {
      user: {
        select: { displayName: true, avatarUrl: true },
      },
    },
    orderBy: [{ votesCount: "desc" }, { createdAt: "asc" }],
  });
  return ideas as IdeaWithUser[];
}

async function getRecentWinners(): Promise<DailyWinnerWithIdea[]> {
  const winners = await prisma.dailyWinner.findMany({
    include: {
      idea: {
        include: {
          user: {
            select: { displayName: true },
          },
        },
      },
    },
    orderBy: { dayDate: "desc" },
    take: 10,
  });
  return winners as DailyWinnerWithIdea[];
}

async function hasUserVotedToday(userId: string): Promise<boolean> {
  const todayDate = getMadridDateToday();
  const vote = await prisma.vote.findFirst({
    where: { userId, dayDate: todayDate },
  });
  return !!vote;
}

// ---- Phase 1 data fetchers ----

async function getWinningGame(): Promise<WinningGameWithProposal | null> {
  const winner = await prisma.winningGame.findFirst({
    include: {
      proposal: {
        include: {
          user: {
            select: { displayName: true },
          },
        },
      },
    },
  });
  return winner as WinningGameWithProposal | null;
}

async function getTodayGameProposals(): Promise<GameProposalWithUser[]> {
  const todayDate = getMadridDateToday();
  const proposals = await prisma.gameProposal.findMany({
    where: { proposalDate: todayDate },
    include: {
      user: {
        select: { displayName: true, avatarUrl: true },
      },
    },
    orderBy: [{ votesCount: "desc" }, { createdAt: "asc" }],
  });
  return proposals as GameProposalWithUser[];
}

async function hasUserVotedGameToday(userId: string): Promise<boolean> {
  const todayDate = getMadridDateToday();
  const vote = await prisma.gameVote.findFirst({
    where: { userId, proposalDate: todayDate },
  });
  return !!vote;
}

// ---- Page ----

export default async function HomePage() {
  const user = await getAuthUser();
  const winningGame = await getWinningGame();

  if (!winningGame) {
    // ===== PHASE 1: Game proposals =====
    const proposals = await getTodayGameProposals();
    const hasVotedGame = user ? await hasUserVotedGameToday(user.id) : false;

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">
            JuegoCoches
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            ¡Vota qué juego desarrollamos! La propuesta más votada será el
            juego que construiremos juntos.
          </p>
          <Badge variant="warning">Votaciones abiertas hasta mañana a las 12:00</Badge>
          <MadridCountdown target="tomorrow-noon" />
        </section>

        {/* CTA */}
        {user && <ProposeGameButton />}

        {/* Game Proposals Ranking */}
        <section>
          <Card>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Propuestas de Juego
            </h2>
            <GameProposalListRealtime
              initialProposals={proposals}
              currentUserId={user?.id ?? null}
              hasVotedToday={hasVotedGame}
            />
          </Card>
        </section>
      </div>
    );
  }

  // ===== PHASE 2: Daily improvements =====
  const [ideas, winners] = await Promise.all([
    getTodayIdeas(),
    getRecentWinners(),
  ]);
  const hasVoted = user ? await hasUserVotedToday(user.id) : false;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Winning game banner */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">
          JuegoCoches
        </h1>
        <div className="inline-block p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Juego seleccionado
          </p>
          <p className="text-lg font-bold text-foreground">
            {winningGame.proposal.title}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {winningGame.proposal.description}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Propuesto por {winningGame.proposal.user.displayName ?? "Anónimo"} · {winningGame.proposal.votesCount} votos
          </p>
        </div>
        <p className="text-gray-400 max-w-md mx-auto">
          La comunidad propone mejoras, vota y transforma. Una mejora gana cada día.
        </p>
        <MadridCountdown />
      </section>

      {/* CTA */}
      {user && <ProposeButton />}

      {/* Daily Ranking */}
      <section>
        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Ranking del Día
          </h2>
          <IdeaListRealtime
            initialIdeas={ideas}
            currentUserId={user?.id ?? null}
            hasVotedToday={hasVoted}
          />
        </Card>
      </section>

      {/* Changelog */}
      {winners.length > 0 && (
        <section>
          <Card>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Historial de Ganadores
            </h2>
            <Changelog winners={winners} />
          </Card>
        </section>
      )}
    </div>
  );
}
