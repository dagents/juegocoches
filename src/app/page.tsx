import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="text-center space-y-8 max-w-lg">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            {APP_NAME}
          </h1>
          <p className="text-gray-400 text-lg">
            La comunidad decide. Juega, propone y vota.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Juego — próximamente */}
          <div className="relative">
            <span className="inline-flex items-center px-8 py-3.5 bg-surface-elevated text-gray-500 rounded-xl font-semibold text-lg cursor-not-allowed border border-surface-card">
              Juego
            </span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-neon-pink/20 text-neon-pink border border-neon-pink/30 rounded-full">
              Pronto
            </span>
          </div>

          {/* Encuesta */}
          <Link
            href="/poll"
            className="inline-flex items-center px-8 py-3.5 bg-neon-purple hover:bg-purple-600 text-white rounded-xl font-semibold text-lg transition-colors neon-glow-purple"
          >
            Encuesta
          </Link>
        </div>
      </div>
    </div>
  );
}
