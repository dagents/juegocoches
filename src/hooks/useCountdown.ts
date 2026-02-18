"use client";

import { useState, useEffect } from "react";

const MADRID_TZ = "Europe/Madrid";

function getSecondsUntilMadridNoon(): number {
  const now = new Date();
  const madridNow = new Date(
    now.toLocaleString("en-US", { timeZone: MADRID_TZ })
  );
  const madridNoon = new Date(madridNow);
  madridNoon.setHours(12, 0, 0, 0);

  if (madridNow >= madridNoon) {
    madridNoon.setDate(madridNoon.getDate() + 1);
  }

  return Math.max(0, Math.floor((madridNoon.getTime() - madridNow.getTime()) / 1000));
}

export function useCountdown() {
  const [secondsLeft, setSecondsLeft] = useState<number>(getSecondsUntilMadridNoon);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(getSecondsUntilMadridNoon());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return { hours, minutes, seconds, isExpired: secondsLeft === 0 };
}
