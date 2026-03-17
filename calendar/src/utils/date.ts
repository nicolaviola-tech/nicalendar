export const HOURS_IN_DAY = 24;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toDate(value: Date | string): Date {
  return value instanceof Date ? new Date(value.getTime()) : new Date(value);
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function startOfWeek(date: Date, weekStartsOn: 0 | 1): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  return addDays(d, -diff);
}

export function endOfWeek(date: Date, weekStartsOn: 0 | 1): Date {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}

export function eachDayOfInterval(start: Date, end: Date): Date[] {
  const result: Date[] = [];
  let cursor = startOfDay(start);
  const endDay = startOfDay(end);
  while (cursor <= endDay) {
    result.push(new Date(cursor));
    cursor = addDays(cursor, 1);
  }
  return result;
}

export function formatDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function rangeLabel(viewDate: Date, view: "month" | "week" | "day" | "agenda", locale: string, weekStartsOn: 0 | 1): string {
  if (view === "month") {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(viewDate);
  }
  if (view === "day") {
    return new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(viewDate);
  }
  if (view === "week") {
    const start = startOfWeek(viewDate, weekStartsOn);
    const end = endOfWeek(viewDate, weekStartsOn);
    const short = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
    return `${short.format(start)} - ${short.format(end)}`;
  }
  return "Agenda";
}

export function differenceInDays(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / MS_PER_DAY);
}
