// __mocks__/routine-mapper.js
// Provide a stable mapping from your routine object to a calendar event.

const mapRoutineToCalendarEvent = jest.fn((routine = {}) => {
  const id = routine?.id ?? "routine_1";
  const title = routine?.description ?? "Routine";
  const startDate = routine?.startDate ?? "1970-01-01T09:00:00.000Z";
  const durationMin = routine?.durationMin ?? 30;

  const start = new Date(startDate);
  const end = new Date(start.getTime() + durationMin * 60 * 1000);

  return {
    id: `evt_${id}`,
    title,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    notes: routine?.notes ?? "",
    allDay: false,
    // keep anything your production mapper might set, but mocked
    alarms: [],
    recurrenceRule: null,
  };
});

module.exports = { mapRoutineToCalendarEvent };
