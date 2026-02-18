"use client";

import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          Algo salió mal
        </h2>
        <p className="text-gray-400 text-sm max-w-md">
          Ha ocurrido un error inesperado. Inténtalo de nuevo.
        </p>
        <Button onClick={reset} variant="secondary">
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
