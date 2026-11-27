import { restaurant, type DayKey, type HoursOverride, type Interval } from "@/config/restaurant";

export const DAY_KEYS: readonly DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export const DAY_NAMES: Record<DayKey, string> = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};

export interface LocalParts {
  /** YYYY-MM-DD in the restaurant's time zone. */
  date: string;
  day: DayKey;
  /** Minutes since local midnight. */
  minutes: number;
}

/** Wall-clock date/time at the restaurant, independent of the visitor's time zone. */
export function localParts(now: Date, timeZone: string = restaurant.timeZone): LocalParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  const day = (parts.weekday ?? "Sun").slice(0, 3).toLowerCase() as DayKey;
  const hour = Number(parts.hour) % 24;
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    day,
    minutes: hour * 60 + Number(parts.minute),
  };
}

export function toMinutes(clock: string): number {
  const [h, m] = clock.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function formatClock(clock: string): string {
  const total = toMinutes(clock);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  if (h === 12 && m === 0) return "Noon";
  if (h === 0 && m === 0) return "Midnight";
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatIntervals(intervals: readonly Interval[]): string {
  if (intervals.length === 0) return "Closed";
  return intervals.map((i) => `${formatClock(i.open)} – ${formatClock(i.close)}`).join(", ");
}

/** Add whole days to a YYYY-MM-DD string (calendar arithmetic, DST-safe). */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const t = new Date(Date.UTC(y!, (m ?? 1) - 1, d ?? 1));
  t.setUTCDate(t.getUTCDate() + days);
  return t.toISOString().slice(0, 10);
}

export function dayOfDate(date: string): DayKey {
  const [y, m, d] = date.split("-").map(Number);
  return DAY_KEYS[new Date(Date.UTC(y!, (m ?? 1) - 1, d ?? 1)).getUTCDay()]!;
}

export interface HoursConfig {
  hours: Record<DayKey, readonly Interval[]>;
  overrides: readonly HoursOverride[];
}

const defaultConfig: HoursConfig = {
  hours: restaurant.hours,
  overrides: restaurant.hoursOverrides,
};

export function intervalsFor(date: string, cfg: HoursConfig = defaultConfig): { intervals: readonly Interval[]; override?: HoursOverride } {
  const override = cfg.overrides.find((o) => o.date === date);
  if (override) return { intervals: override.intervals, override };
  return { intervals: cfg.hours[dayOfDate(date)] };
}

export type OpenStatus =
  | { state: "open"; closesAt: string; closingSoon: boolean; note?: string }
  | { state: "closed"; opensAt?: { date: string; day: DayKey; time: string; isToday: boolean; isTomorrow: boolean }; note?: string };

/**
 * Open/closed status computed in restaurant-local time.
 * Looks ahead up to 14 days for the next opening.
 */
export function getOpenStatus(now: Date, cfg: HoursConfig = defaultConfig, timeZone: string = restaurant.timeZone): OpenStatus {
  const local = localParts(now, timeZone);
  const today = intervalsFor(local.date, cfg);
  for (const i of today.intervals) {
    const open = toMinutes(i.open);
    const close = toMinutes(i.close);
    if (local.minutes >= open && local.minutes < close) {
      return { state: "open", closesAt: i.close, closingSoon: close - local.minutes <= 45, note: today.override?.label };
    }
  }
  for (let offset = 0; offset <= 14; offset++) {
    const date = addDays(local.date, offset);
    const { intervals } = intervalsFor(date, cfg);
    const next = intervals
      .map((i) => i.open)
      .filter((o) => offset > 0 || toMinutes(o) > local.minutes)
      .sort((a, b) => toMinutes(a) - toMinutes(b))[0];
    if (next) {
      return {
        state: "closed",
        opensAt: { date, day: dayOfDate(date), time: next, isToday: offset === 0, isTomorrow: offset === 1 },
        note: today.override?.label,
      };
    }
  }
  return { state: "closed", note: today.override?.label };
}

export function describeStatus(status: OpenStatus): string {
  if (status.state === "open") {
    return `Open now · until ${formatClock(status.closesAt)}`;
  }
  if (!status.opensAt) return "Closed";
  const when = status.opensAt.isToday
    ? "today"
    : status.opensAt.isTomorrow
      ? "tomorrow"
      : DAY_NAMES[status.opensAt.day];
  return `Closed · opens ${when} at ${formatClock(status.opensAt.time).toLowerCase()}`;
}

/** Weekly schedule grouped for display, e.g. "Tuesday – Saturday: Noon – 9 PM". */
export function groupedSchedule(hours: Record<DayKey, readonly Interval[]> = restaurant.hours) {
  const order: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const groups: { days: DayKey[]; text: string }[] = [];
  for (const d of order) {
    const text = formatIntervals(hours[d]);
    const last = groups[groups.length - 1];
    if (last && last.text === text) last.days.push(d);
    else groups.push({ days: [d], text });
  }
  return groups.map((g) => ({
    label: g.days.length === 1 ? DAY_NAMES[g.days[0]!] : `${DAY_NAMES[g.days[0]!]} – ${DAY_NAMES[g.days[g.days.length - 1]!]}`,
    short:
      g.days.length === 1
        ? DAY_NAMES[g.days[0]!].slice(0, 3)
        : `${DAY_NAMES[g.days[0]!].slice(0, 3)}–${DAY_NAMES[g.days[g.days.length - 1]!].slice(0, 3)}`,
    text: g.text,
    closed: g.text === "Closed",
  }));
}

/** Upcoming overrides (today onward) for display on the Visit page. */
export function upcomingOverrides(now: Date, overrides: readonly HoursOverride[] = restaurant.hoursOverrides, days = 30) {
  const today = localParts(now).date;
  const limit = addDays(today, days);
  return overrides.filter((o) => o.date >= today && o.date <= limit).sort((a, b) => a.date.localeCompare(b.date));
}
