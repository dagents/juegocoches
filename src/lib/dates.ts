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
 * Returns milliseconds until the next 12:00 Madrid time.
 */
export function getMillisUntilMadridNoon(): number {
  const now = new Date();
  const madridNow = new Date(
    now.toLocaleString("en-US", { timeZone: MADRID_TZ })
  );
  const madridNoon = new Date(madridNow);
  madridNoon.setHours(12, 0, 0, 0);

  if (madridNow >= madridNoon) {
    madridNoon.setDate(madridNoon.getDate() + 1);
  }

  return madridNoon.getTime() - madridNow.getTime();
}
