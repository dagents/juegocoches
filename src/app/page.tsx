import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { getMadridDateToday } from "@/lib/dates";
import MadridCountdown from "@/components/countdown/MadridCountdown";
import IdeaListRealtime from "@/components/ideas/IdeaListRealtime";
import Changelog from "@/components/ranking/Changelog";
import Card from "@/components/ui/Card";
import type { IdeaWithUser, DailyWinnerWithIdea } from "@/types";

export const dynamic = "force-dynamic";

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

export default async function HomePage() {
  const user = await getAuthUser();
  const [ideas, winners] = await Promise.all([
    getTodayIdeas(),
    getRecentWinners(),
  ]);
  const hasVoted = user ? await hasUserVotedToday(user.id) : false;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hero + Countdown */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">
          JuegoCoches
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          La comunidad propone, vota y transforma. Una idea gana cada día.
        </p>
        <MadridCountdown />
      </section>

      {/* CTA */}
      {user && (
        <div className="text-center">
          <Link
            href="/proponer"
            className="inline-flex items-center px-6 py-2.5 bg-neon-purple hover:bg-purple-600 text-white rounded-lg font-medium transition-colors neon-glow-purple"
          >
            Proponer Idea del Día
          </Link>
        </div>
      )}

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
