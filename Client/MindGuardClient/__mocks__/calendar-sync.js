// __mocks__/calendar-sync.js

const upsertRoutineEvent = jest.fn(async () => ({ ok: true, id: "evt_1" }));
const deleteRoutineEvent = jest.fn(async () => ({ ok: true }));

module.exports = { upsertRoutineEvent, deleteRoutineEvent };
