export default function GameLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-sm w-full">
        {/* Animated icon */}
        <div className="text-5xl animate-bounce">🎲</div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold gradient-text">
            El Destino en tus Manos
          </h2>
          <p className="text-sm text-gray-400">Preparando tu mundo...</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-neon-purple rounded-full animate-loading-bar"
            style={{
              animation: "loading-bar 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Tips */}
        <p className="text-xs text-gray-500 italic">
          Cada decisión cuenta. Elige con cabeza... o no 😏
        </p>
      </div>
    </div>
  );
}
