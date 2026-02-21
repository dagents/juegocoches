import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-surface-card mt-16">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col items-center gap-2 text-sm text-gray-500">
        <p>
          {APP_NAME} &mdash; La comunidad decide, el juego evoluciona.
        </p>
        <Link
          href="/poll/juego"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          📜 Archivo de votaciones del juego
        </Link>
      </div>
    </footer>
  );
}
