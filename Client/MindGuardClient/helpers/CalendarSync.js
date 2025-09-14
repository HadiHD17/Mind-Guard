import { Platform } from "react-native";
import * as Calendar from "expo-calendar";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORE_KEY = "mg_calendar";
const EVENT_MAP_KEY = "mg_calendar_event_map_v3";
const DEFAULT_DURATION_MIN = 15;
const APP_CALENDAR_NAME = "MindGuard";

const pad = (n) => String(n).padStart(2, "0");

function parseTimeToToday(timeHHmm) {
  const [hh, mm] = (timeHHmm || "09:00").split(":").map((v) => parseInt(v, 10));
  const d = new Date();
  d.setSeconds(0, 0);
  d.setHours(Number.isFinite(hh) ? hh : 9, Number.isFinite(mm) ? mm : 0, 0, 0);
  return d;
}

function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60 * 1000);
}

function nextDateMatchingDow(start, targetDow) {
  const res = new Date(start);
  for (let i = 0; i < 8; i++) {
    if (res.getDay() === targetDow) return res;
    res.setDate(res.getDate() + 1);
    res.setHours(start.getHours(), start.getMinutes(), 0, 0);
  }
  return start;
}

function toLocalISO(dt) {
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(
    dt.getDate()
  )}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
}

async function ensurePermissions() {
  const { status, granted } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== "granted") throw new Error("Calendar permission not granted");
}

async function getPreferredCalendarId() {
  const stored = await AsyncStorage.getItem(STORE_KEY);
  if (stored) {
    try {
      const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const found = cals.find((c) => c.id === stored && c.allowsModifications);
      if (found) {
        return stored;
      }
    } catch {}
  }

  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const writable = calendars.filter((c) => c.allowsModifications);

  const mindGuard = writable.find((c) => c.title === APP_CALENDAR_NAME);
  if (mindGuard) {
    await AsyncStorage.setItem(STORE_KEY, mindGuard.id);

    return mindGuard.id;
  }

  const gmail = writable.find((c) =>
    (c.source?.name || "").toLowerCase().includes("gmail")
  );
  if (gmail) {
    await AsyncStorage.setItem(STORE_KEY, gmail.id);
    return gmail.id;
  }

  const icloud = writable.find((c) =>
    (c.source?.name || "").toLowerCase().includes("icloud")
  );
  if (icloud) {
    await AsyncStorage.setItem(STORE_KEY, icloud.id);
    return icloud.id;
  }

  const anyWritable = writable[0];
  if (anyWritable) {
    await AsyncStorage.setItem(STORE_KEY, anyWritable.id);

    return anyWritable.id;
  }

  throw new Error("No writable calendar available");
}

async function getEventMap() {
  const raw = await AsyncStorage.getItem(EVENT_MAP_KEY);
  const m = raw ? JSON.parse(raw) : {};
  for (const k of Object.keys(m)) {
    const v = m[k];
    if (typeof v === "string") m[k] = { mode: "single", eventId: v };
    else if (v && typeof v === "object" && !v.mode && v.eventId)
      m[k] = { mode: "single", eventId: v.eventId };
  }
  return m;
}

async function saveEventMap(map) {
  await AsyncStorage.setItem(EVENT_MAP_KEY, JSON.stringify(map));
}

function buildRecurrenceAndroid(r) {
  const rule = {
    frequency:
      r.frequency === "daily"
        ? Calendar.Frequency.DAILY
        : r.frequency === "monthly"
        ? Calendar.Frequency.MONTHLY
        : Calendar.Frequency.WEEKLY,
    interval: Math.max(1, r.interval || 1),
  };
  if (r.endDateISO) rule.endDate = new Date(r.endDateISO);
  return rule;
}

function buildAlarms(r) {
  if (r.reminderMinutes == null) return undefined;
  return [{ relativeOffset: -Math.max(0, r.reminderMinutes) }];
}

export async function upsertRoutineEvent(routine) {
  await ensurePermissions();
  const calendarId = await getPreferredCalendarId();

  const timeZone = Localization.timeZone || undefined;
  const baseToday = parseTimeToToday(routine.time);

  const map = await getEventMap();
  const existing = map[routine.id];

  if (
    Platform.OS === "ios" &&
    routine.frequency === "weekly" &&
    Array.isArray(routine.daysOfWeek) &&
    routine.daysOfWeek.length > 0
  ) {
    const prevByDay =
      existing?.mode === "multi" ? { ...(existing.byDay || {}) } : {};

    if (existing?.mode === "single" && existing.eventId) {
      try {
        await Calendar.deleteEventAsync(existing.eventId, {
          futureEvents: true,
        });
      } catch (e) {
        console.log(
          "[calendar][iOS weekly/multi] delete legacy single failed:",
          e?.message || e
        );
      }
    }

    const nextByDay = {};
    for (const dow of routine.daysOfWeek) {
      const start = nextDateMatchingDow(baseToday, dow);
      const end = addMinutes(start, DEFAULT_DURATION_MIN);

      const eventData = {
        title: routine.title,
        notes: routine.description || undefined,
        startDate: start,
        endDate: end,
        timeZone,
        recurrenceRule: {
          frequency: Calendar.Frequency.WEEKLY,
          interval: Math.max(1, routine.interval || 1),
          ...(routine.endDateISO
            ? { endDate: new Date(routine.endDateISO) }
            : {}),
        },
        availability: Calendar.Availability.BUSY,
        alarms: buildAlarms(routine),
      };

      const existingId = prevByDay[dow];

      let eventId;
      if (existingId) {
        await Calendar.updateEventAsync(existingId, eventData, {
          futureEvents: true,
        });
        eventId = existingId;
      } else {
        eventId = await Calendar.createEventAsync(calendarId, eventData);
      }
      nextByDay[dow] = eventId;
    }

    for (const prevDow of Object.keys(prevByDay).map((x) => parseInt(x, 10))) {
      if (!routine.daysOfWeek.includes(prevDow)) {
        try {
          await Calendar.deleteEventAsync(prevByDay[prevDow], {
            futureEvents: true,
          });
        } catch (e) {
          console.log(
            "[calendar][iOS weekly/multi] remove day failed:",
            prevDow,
            e?.message || e
          );
        }
      }
    }

    const newMap = await getEventMap();
    newMap[routine.id] = { mode: "multi", byDay: nextByDay, calendarId };
    await saveEventMap(newMap);

    return nextByDay;
  }

  if (
    Platform.OS === "android" &&
    routine.frequency === "weekly" &&
    Array.isArray(routine.daysOfWeek) &&
    routine.daysOfWeek.length > 1
  ) {
    const prevByDay =
      existing?.mode === "multi" ? { ...(existing.byDay || {}) } : {};
    const nextByDay = {};

    for (const dow of routine.daysOfWeek) {
      const start = nextDateMatchingDow(baseToday, dow);
      const end = addMinutes(start, DEFAULT_DURATION_MIN);

      const recurrenceRule = buildRecurrenceAndroid(routine);
      const eventData = {
        title: routine.title,
        notes: routine.description || undefined,
        startDate: start,
        endDate: end,
        timeZone,
        recurrenceRule,
        availability: Calendar.Availability.BUSY,
        alarms: buildAlarms(routine),
      };

      const existingId = prevByDay[dow];

      let eventId;
      if (existingId) {
        await Calendar.updateEventAsync(existingId, eventData, {
          futureEvents: true,
        });
        eventId = existingId;
      } else {
        eventId = await Calendar.createEventAsync(calendarId, eventData);
      }
      nextByDay[dow] = eventId;
    }

    for (const prevDow of Object.keys(prevByDay).map((x) => parseInt(x, 10))) {
      if (!routine.daysOfWeek.includes(prevDow)) {
        try {
          await Calendar.deleteEventAsync(prevByDay[prevDow], {
            futureEvents: true,
          });
        } catch (e) {
          console.log(
            "[calendar][android weekly/multi] remove day failed:",
            prevDow,
            e?.message || e
          );
        }
      }
    }

    const newMap = await getEventMap();
    newMap[routine.id] = { mode: "multi", byDay: nextByDay, calendarId };
    await saveEventMap(newMap);

    return nextByDay;
  }

  const start =
    routine.frequency === "weekly" &&
    Array.isArray(routine.daysOfWeek) &&
    routine.daysOfWeek.length === 1
      ? nextDateMatchingDow(baseToday, routine.daysOfWeek[0])
      : (() => {
          const now = new Date();
          return baseToday < now ? addMinutes(baseToday, 24 * 60) : baseToday;
        })();

  const end = addMinutes(start, DEFAULT_DURATION_MIN);
  const recurrenceRule =
    Platform.OS === "android" && routine.frequency === "weekly"
      ? buildRecurrenceAndroid(routine)
      : routine.frequency === "daily" || routine.frequency === "monthly"
      ? buildRecurrenceAndroid(routine)
      : undefined;

  const eventData = {
    title: routine.title,
    notes: routine.description || undefined,
    startDate: start,
    endDate: end,
    timeZone,
    recurrenceRule,
    availability: Calendar.Availability.BUSY,
    alarms: buildAlarms(routine),
  };

  const existingId =
    existing?.mode === "single"
      ? existing.eventId
      : typeof existing === "string"
      ? existing
      : null;

  let eventId;
  if (existingId) {
    await Calendar.updateEventAsync(existingId, eventData, {
      futureEvents: true,
    });
    eventId = existingId;
  } else {
    eventId = await Calendar.createEventAsync(calendarId, eventData);
  }

  const newMap = await getEventMap();
  newMap[routine.id] = { mode: "single", eventId, calendarId };
  await saveEventMap(newMap);
  return eventId;
}

export async function deleteRoutineEvent(routineId) {
  await ensurePermissions();
  const map = await getEventMap();
  const entry = map[routineId];
  if (!entry) {
    return;
  }

  try {
    if (entry.mode === "multi" && entry.byDay) {
      for (const [dow, id] of Object.entries(entry.byDay)) {
        try {
          await Calendar.deleteEventAsync(id, { futureEvents: true });
        } catch (e) {
          console.log(
            "[calendar] delete failed (multi) dow:",
            dow,
            "id:",
            id,
            e?.message || e
          );
        }
      }
    } else if (entry.mode === "single" && entry.eventId) {
      await Calendar.deleteEventAsync(entry.eventId, { futureEvents: true });
    } else if (typeof entry === "string") {
      await Calendar.deleteEventAsync(entry, { futureEvents: true });
    }
  } finally {
    delete map[routineId];
    await saveEventMap(map);
  }
}

export async function disableCalendarSyncAndCleanup() {
  await ensurePermissions();
  const map = await getEventMap();
  for (const key of Object.keys(map)) {
    const entry = map[key];
    if (entry?.mode === "multi" && entry.byDay) {
      for (const id of Object.values(entry.byDay)) {
        try {
          await Calendar.deleteEventAsync(id, { futureEvents: true });
        } catch (e) {
          console.log(
            "[calendar] cleanup failed (multi):",
            id,
            e?.message || e
          );
        }
      }
    } else if (entry?.mode === "single" && entry.eventId) {
      try {
        await Calendar.deleteEventAsync(entry.eventId, { futureEvents: true });
      } catch (e) {
        console.log(
          "[calendar] cleanup failed (single):",
          entry.eventId,
          e?.message || e
        );
      }
    } else if (typeof entry === "string") {
      try {
        await Calendar.deleteEventAsync(entry, { futureEvents: true });
      } catch (e) {
        console.log(
          "[calendar] cleanup failed (legacy):",
          entry,
          e?.message || e
        );
      }
    }
  }
  await AsyncStorage.multiRemove([STORE_KEY, EVENT_MAP_KEY]);
}
