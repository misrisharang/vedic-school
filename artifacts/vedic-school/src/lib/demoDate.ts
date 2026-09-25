/**
 * ============================================================================
 * THE VEDIC SCHOOL — SUNDAY DEMO DATE UTILITIES (ASIA/KOLKATA TIMEZONE)
 * ============================================================================
 *
 * Authoritative Business Rule:
 * - Recurring Sunday Demo takes place every Sunday at 11:00 AM IST (Asia/Kolkata).
 * - Monday through Saturday registrations -> assigned to upcoming Sunday.
 * - Sunday registrations before 11:00 AM IST -> assigned to today's Sunday.
 * - Sunday registrations at or after 11:00 AM IST -> assigned to following Sunday (+7 days).
 * ============================================================================
 */

export interface AssignedSundayInfo {
  formattedDate: string; // e.g. "27 September 2026"
  isoDate: string;       // e.g. "2026-09-27" (PostgreSQL DATE format)
}

/**
 * Calculates the authoritative upcoming Sunday in the Asia/Kolkata timezone.
 * Uses Intl.DateTimeFormat to ensure calculation is strictly timezone-anchored
 * regardless of the host machine or browser's local timezone.
 */
export function getUpcomingSundayInIST(referenceDate: Date = new Date()): AssignedSundayInfo {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    weekday: "short",
  });

  const parts = formatter.formatToParts(referenceDate);
  const partMap: Record<string, string> = {};
  for (const p of parts) {
    partMap[p.type] = p.value;
  }

  const year = parseInt(partMap.year, 10);
  const month = parseInt(partMap.month, 10) - 1; // 0-indexed month
  const day = parseInt(partMap.day, 10);
  const hour = parseInt(partMap.hour, 10);
  const weekday = partMap.weekday; // "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayIndex = daysOfWeek.indexOf(weekday);

  let daysUntilSunday = 0;
  if (dayIndex === 0) {
    // Today is Sunday in Asia/Kolkata
    if (hour < 11) {
      daysUntilSunday = 0; // Today before 11:00 AM IST
    } else {
      daysUntilSunday = 7; // Following Sunday
    }
  } else {
    // Days remaining until Sunday: Monday=6, Tuesday=5, ..., Saturday=1
    daysUntilSunday = 7 - dayIndex;
  }

  const targetDate = new Date(Date.UTC(year, month, day + daysUntilSunday));

  const displayFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    formattedDate: displayFormatter.format(targetDate), // e.g. "27 September 2026"
    isoDate: targetDate.toISOString().split("T")[0],     // e.g. "2026-09-27"
  };
}

/**
 * Formats a YYYY-MM-DD ISO date string into standard display format (e.g. "27 September 2026").
 */
export function formatDemoDateFromIso(isoDate: string): string {
  if (!isoDate || !isoDate.includes("-")) return isoDate;
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const dObj = new Date(Date.UTC(y, m - 1, d));
  const displayFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return displayFormatter.format(dObj);
}
