import { useEffect, useMemo, useRef } from "react";
import {
  upsertRoutineEvent,
  deleteRoutineEvent,
} from "../Helpers/CalendarSync";
import { mapRoutineToCalendarEvent } from "../Helpers/RoutineMapper";

function sig(r) {
  const f = (r.frequency || "").trim().toLowerCase();
  const t = (r.reminder_Time || "").trim();
  const d = (r.description || "").trim();
  const synced = r.synced_Calendar ? "1" : "0";
  return `${d}|${f}|${t}|${synced}`;
}

/**
 * Auto-sync device calendar with your routines array.
 * @param {object} props
 *  - enabled: boolean (user toggle)
 *  - routines: array of backend routines
 */
export default function useDeviceCalendarSync({ enabled, routines }) {
  const prevRef = useRef({ byId: new Map(), sigById: new Map() });

  const now = useMemo(() => {
    const byId = new Map();
    const sigById = new Map();
    for (const r of routines || []) {
      byId.set(String(r.id), r);
      sigById.set(String(r.id), sig(r));
    }
    return { byId, sigById };
  }, [routines]);

  useEffect(() => {
    if (!enabled) {
      prevRef.current = now;
      return;
    }

    const prev = prevRef.current;

    const added = [];
    const removed = [];
    const changed = [];

    for (const [id] of prev.byId.entries()) {
      if (!now.byId.has(id)) {
        removed.push(id);
      } else {
        const oldSig = prev.sigById.get(id);
        const newSig = now.sigById.get(id);
        if (oldSig !== newSig) changed.push(id);
      }
    }
    for (const [id] of now.byId.entries()) {
      if (!prev.byId.has(id)) added.push(id);
    }

    if (added.length === 0 && removed.length === 0 && changed.length === 0) {
      prevRef.current = now;
      return;
    }

    (async () => {
      try {
        for (const id of removed) {
          try {
            await deleteRoutineEvent(String(id));
          } catch (e) {
            console.warn("[calendar-sync] delete failed", id, e?.message || e);
          }
        }

        for (const id of added) {
          const r = now.byId.get(id);
          if (!r) continue;
          try {
            const ev = mapRoutineToCalendarEvent(r);
            console.log("[calendar-sync] create routine", r.id, ev);
            await upsertRoutineEvent(ev);
          } catch (e) {
            console.warn("[calendar-sync] create failed", id, e?.message || e);
          }
        }

        for (const id of changed) {
          const r = now.byId.get(id);
          if (!r) continue;
          try {
            const ev = mapRoutineToCalendarEvent(r);
            console.log("[calendar-sync] update routine", r.id, ev);
            await upsertRoutineEvent(ev);
          } catch (e) {
            console.warn("[calendar-sync] update failed", id, e?.message || e);
          }
        }
      } finally {
        prevRef.current = now;
      }
    })();
  }, [enabled, now]);
}
