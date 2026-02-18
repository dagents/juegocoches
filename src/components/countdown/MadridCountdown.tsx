"use client";

import { useCountdown } from "@/hooks/useCountdown";

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-surface-elevated border border-neon-purple/30 rounded-lg px-3 py-2 min-w-[60px] text-center">
        <span className="text-2xl md:text-3xl font-mono font-bold text-neon-purple">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

interface MadridCountdownProps {
  target?: "midnight" | "tomorrow-noon";
}

export default function MadridCountdown({ target = "midnight" }: MadridCountdownProps) {
  const { hours, minutes, seconds, isExpired, isLoading } = useCountdown(target);

  if (isLoading) {
    return (
      <div className="text-center space-y-3">
        <p className="text-sm text-gray-400">Votación cierra en</p>
        <div className="flex items-center justify-center gap-2">
          <TimeUnit value={0} label="horas" />
          <span className="text-2xl text-gray-500 font-mono pb-5">:</span>
          <TimeUnit value={0} label="min" />
          <span className="text-2xl text-gray-500 font-mono pb-5">:</span>
          <TimeUnit value={0} label="seg" />
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-neon-cyan text-lg font-semibold animate-pulse">
          Seleccionando ganador del día...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-3">
      <p className="text-sm text-gray-400">Votación cierra en</p>
      <div className="flex items-center justify-center gap-2">
        <TimeUnit value={hours} label="horas" />
        <span className="text-2xl text-gray-500 font-mono pb-5">:</span>
        <TimeUnit value={minutes} label="min" />
        <span className="text-2xl text-gray-500 font-mono pb-5">:</span>
        <TimeUnit value={seconds} label="seg" />
      </div>
    </div>
  );
}
