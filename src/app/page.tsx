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
          <p className="text-gray-500 text-sm">
            🎮 El destino en tus manos — v1.0
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Juego */}
          <Link
            href="/game"
            className="inline-flex items-center px-8 py-3.5 bg-neon-cyan hover:bg-cyan-600 text-black rounded-xl font-semibold text-lg transition-colors"
          >
            🎮 Jugar
          </Link>

          {/* Encuesta */}
          <Link
            href="/poll"
            className="inline-flex items-center px-8 py-3.5 bg-neon-purple hover:bg-purple-600 text-white rounded-xl font-semibold text-lg transition-colors neon-glow-purple"
          >
            📊 Encuesta
          </Link>
        </div>
      </div>
    </div>
  );
}
