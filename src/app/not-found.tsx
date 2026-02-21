import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="text-6xl font-bold gradient-text">404</h1>
      <p className="text-gray-400 text-lg">Página no encontrada</p>
      <Link
        href="/"
        className="inline-block mt-4 px-6 py-2 bg-neon-purple hover:bg-purple-600 text-white rounded-lg transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
