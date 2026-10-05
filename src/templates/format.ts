// Wedding dates are calendar dates, so they are always shown in UTC; showing them in the viewer's
// zone could move the wedding to the day before for guests in the Americas.
const LONG_DATE = new Intl.DateTimeFormat("en-US", { month: "long", day: "2-digit", year: "numeric", timeZone: "UTC" });

/** "February 07, 2027" from an ISO timestamp or a YYYY-MM-DD date. */
export function formatLongDate(value: string) {
  return LONG_DATE.format(new Date(value.length === 10 ? `${value}T00:00:00Z` : value));
}

export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

export function initials(a: string, b: string) {
  return `${a.trim().charAt(0)} & ${b.trim().charAt(0)}`.toUpperCase();
}

const SHORT_DATE = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** "May 1, 2027", for dates inside a sentence. */
export function formatDeadline(value: string) {
  return SHORT_DATE.format(new Date(value.length === 10 ? `${value}T00:00:00Z` : value));
}
