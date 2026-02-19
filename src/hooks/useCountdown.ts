"use client";

import { useState, useEffect } from "react";

const MADRID_TZ = "Europe/Madrid";

function getSecondsUntilMadridTarget(target: "midnight" | "next-noon"): number {
  const now = new Date();
  const madridNow = new Date(
    now.toLocaleString("en-US", { timeZone: MADRID_TZ })
  );
  const madridTarget = new Date(madridNow);

  if (target === "midnight") {
    madridTarget.setDate(madridTarget.getDate() + 1);
    madridTarget.setHours(0, 0, 0, 0);
  } else {
    // next-noon: today at 12:00 if before noon, otherwise tomorrow at 12:00
    madridTarget.setHours(12, 0, 0, 0);
    if (madridNow >= madridTarget) {
      madridTarget.setDate(madridTarget.getDate() + 1);
    }
  }

  return Math.max(0, Math.floor((madridTarget.getTime() - madridNow.getTime()) / 1000));
}

export function useCountdown(target: "midnight" | "next-noon" = "midnight") {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    setSecondsLeft(getSecondsUntilMadridTarget(target));
    const interval = setInterval(() => {
      setSecondsLeft(getSecondsUntilMadridTarget(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  const resolved = secondsLeft ?? 0;
  const hours = Math.floor(resolved / 3600);
  const minutes = Math.floor((resolved % 3600) / 60);
  const seconds = resolved % 60;

  return { hours, minutes, seconds, isExpired: secondsLeft === 0, isLoading: secondsLeft === null };
}
