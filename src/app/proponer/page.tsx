import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { getMadridDateToday } from "@/lib/dates";
import Card from "@/components/ui/Card";
import IdeaSubmitForm from "@/components/ideas/IdeaSubmitForm";
import Link from "next/link";

export default async function ProponerPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const todayDate = getMadridDateToday();
  const existingIdea = await prisma.idea.findFirst({
    where: { userId: user.id, dayDate: todayDate },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card glow="cyan">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              Proponer Idea
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Propón una mejora concreta para el juego. Un moderador IA
              evaluará tu idea al instante.
            </p>
          </div>

          {existingIdea ? (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border ${
                  existingIdea.approved
                    ? "bg-green-900/20 border-green-700/50"
                    : existingIdea.approved === false
                    ? "bg-red-900/20 border-red-700/50"
                    : "bg-yellow-900/20 border-yellow-700/50"
                }`}
              >
                <p className="text-sm text-gray-300 mb-2">
                  Ya has propuesto una idea hoy:
                </p>
                <p className="text-foreground font-medium">
                  &quot;{existingIdea.content}&quot;
                </p>
                {existingIdea.rejectionReason && (
                  <p className="text-xs text-red-400 mt-2">
                    Rechazada: {existingIdea.rejectionReason}
                  </p>
                )}
              </div>
              <Link
                href="/"
                className="inline-flex text-sm text-neon-cyan hover:text-cyan-300 transition-colors"
              >
                &larr; Volver al ranking
              </Link>
            </div>
          ) : (
            <IdeaSubmitForm />
          )}
        </div>
      </Card>
    </div>
  );
}
