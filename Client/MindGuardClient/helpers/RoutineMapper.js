const DOW_MAP = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  weds: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

function parseFrequencyString(freqStr) {
  if (!freqStr) return [];
  return freqStr
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .map((token) => DOW_MAP[token])
    .filter((n) => Number.isInteger(n));
}

function toHHmmFromTimeSpan(timespan) {
  if (!timespan) return "09:00";
  const parts = String(timespan).split(":");
  const hh = (parts[0] || "09").padStart(2, "0");
  const mm = (parts[1] || "00").padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Converts your backend routine into the shape CalendarSync expects.
 *
 * @param {object} backendRoutine
 * @param {object} opts
 *  - defaultFrequency: "weekly" | "daily" | "monthly" (default "weekly")
 *  - interval: number (default 1)
 *  - reminderMinutes: number | null
 *  - endDateISO: string | null (YYYY-MM-DD)
 */
export function mapRoutineToCalendarEvent(backendRoutine, opts = {}) {
  const {
    defaultFrequency = "weekly",
    interval = 1,
    reminderMinutes = null,
    endDateISO = null,
  } = opts;

  const days = parseFrequencyString(backendRoutine?.frequency);
  const hhmm = toHHmmFromTimeSpan(backendRoutine?.reminder_Time);

  return {
    id: String(backendRoutine.id),
    title: backendRoutine?.description || "Routine",
    description: backendRoutine?.description || undefined,
    time: hhmm,
    frequency: defaultFrequency,
    daysOfWeek: days,
    interval,
    endDateISO,
    reminderMinutes,
  };
}
