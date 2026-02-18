import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { signOut } from "@/actions/auth.actions";
import { APP_NAME } from "@/lib/constants";

export default async function Header() {
  const user = await getAuthUser();
  const winningGame = await prisma.winningGame.findFirst({
    select: { id: true },
  });
  const isPhase1 = !winningGame;

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-card">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold gradient-text">{APP_NAME}</span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              {isPhase1 ? (
                <Link
                  href="/proponer-juego"
                  className="text-sm text-neon-cyan hover:text-cyan-300 transition-colors"
                >
                  Proponer Juego
                </Link>
              ) : (
                <Link
                  href="/proponer"
                  className="text-sm text-neon-cyan hover:text-cyan-300 transition-colors"
                >
                  Proponer Mejora
                </Link>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 hidden sm:inline">
                  {user.user_metadata?.display_name ||
                    user.email?.split("@")[0]}
                </span>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Salir
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="text-sm px-3 py-1.5 bg-neon-purple hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Registro
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
