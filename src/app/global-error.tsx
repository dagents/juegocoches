"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-[#0a0a12] text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Error</h1>
          <p className="text-gray-400">Algo salió mal</p>
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
