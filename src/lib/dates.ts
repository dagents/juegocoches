const MADRID_TZ = "Europe/Madrid";

/**
 * Returns today's date in Madrid timezone as a Date object at UTC midnight.
 * Used for dayDate fields in Prisma queries.
 */
export function getMadridDateToday(): Date {
  const now = new Date();
  const madridStr = now.toLocaleDateString("en-CA", { timeZone: MADRID_TZ });
  return new Date(madridStr + "T00:00:00.000Z");
}

/**
 * Returns today's date in Madrid timezone as YYYY-MM-DD string.
 * Used for Supabase Realtime filters.
 */
export function getMadridDateString(): string {
  const now = new Date();
  return now.toLocaleDateString("en-CA", { timeZone: MADRID_TZ });
}

/**
 * Returns true if current Madrid time is before noon (12:00).
 */
export function isBeforeMadridNoon(): boolean {
  const now = new Date();
  const madridNow = new Date(
    now.toLocaleString("en-US", { timeZone: MADRID_TZ })
  );
  return madridNow.getHours() < 12;
}

/**
 * Returns true if the game proposal/voting window is still open.
 * Deadline: 19 Feb 2025 at 12:00 Madrid time.
 * After that, no proposals or votes are accepted server-side.
 */
export function isGameVotingOpen(): boolean {
  const now = new Date();
  const madridNow = new Date(
    now.toLocaleString("en-US", { timeZone: MADRID_TZ })
  );
  // Fixed deadline: tomorrow (19 Feb) at noon Madrid
  const deadline = new Date("2026-02-19T12:00:00");
  return madridNow < deadline;
}

/**
 * Returns milliseconds until the next midnight Madrid time.
 */
export function getMillisUntilMadridMidnight(): number {
  const now = new Date();
  const madridNow = new Date(
    now.toLocaleString("en-US", { timeZone: MADRID_TZ })
  );
  const madridMidnight = new Date(madridNow);
  madridMidnight.setDate(madridMidnight.getDate() + 1);
  madridMidnight.setHours(0, 0, 0, 0);

  return madridMidnight.getTime() - madridNow.getTime();
}
