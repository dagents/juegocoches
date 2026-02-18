import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-surface-card mt-16">
      <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>
          {APP_NAME} &mdash; La comunidad decide, el juego evoluciona.
        </p>
      </div>
    </footer>
  );
}
