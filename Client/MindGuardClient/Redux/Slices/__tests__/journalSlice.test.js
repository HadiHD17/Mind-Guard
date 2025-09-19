import journalSlice, { getJournals, saveJournal } from "../journalSlice";

describe("journalSlice", () => {
  const initialState = {
    journals: [],
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(journalSlice(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("getJournals async thunk", () => {
    it("should handle getJournals.pending", () => {
      const action = { type: getJournals.pending.type };
      const state = journalSlice(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle getJournals.fulfilled", () => {
      const journalsData = [
        { id: "1", content: "First journal entry", date: "2023-01-01" },
        { id: "2", content: "Second journal entry", date: "2023-01-02" },
      ];
      const action = {
        type: getJournals.fulfilled.type,
        payload: journalsData,
      };
      const state = journalSlice(initialState, action);
      expect(state.journals).toEqual(journalsData);
      expect(state.loading).toBe(false);
    });

    it("should handle getJournals.rejected", () => {
      const errorMessage = "Failed to fetch journals";
      const action = { type: getJournals.rejected.type, payload: errorMessage };
      const state = journalSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("saveJournal async thunk", () => {
    it("should handle saveJournal.pending", () => {
      const action = { type: saveJournal.pending.type };
      const state = journalSlice(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle saveJournal.fulfilled", () => {
      const journalEntry = {
        id: "1",
        content: "New journal entry",
        date: "2023-01-01",
      };
      const action = {
        type: saveJournal.fulfilled.type,
        payload: journalEntry,
      };
      const state = journalSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.journals).toHaveLength(1);
      expect(state.journals[0]).toEqual(journalEntry);
    });

    it("should handle saveJournal.fulfilled with existing journals", () => {
      const stateWithJournals = {
        journals: [{ id: "1", content: "First entry", date: "2023-01-01" }],
        loading: false,
        error: null,
      };

      const newJournal = {
        id: "2",
        content: "Second entry",
        date: "2023-01-02",
      };
      const action = { type: saveJournal.fulfilled.type, payload: newJournal };
      const state = journalSlice(stateWithJournals, action);

      expect(state.loading).toBe(false);
      expect(state.journals).toHaveLength(2);
      expect(state.journals[1]).toEqual(newJournal);
    });

    it("should handle saveJournal.rejected", () => {
      const errorMessage = "Failed to save journal entry";
      const action = { type: saveJournal.rejected.type, payload: errorMessage };
      const state = journalSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  it("should export async thunks", () => {
    expect(getJournals).toBeDefined();
    expect(saveJournal).toBeDefined();
  });

  it("should have correct thunk type prefixes", () => {
    expect(getJournals.typePrefix).toBe("journal/getJournals");
    expect(saveJournal.typePrefix).toBe("journal/saveJournal");
  });

  it("should handle unknown action types", () => {
    const unknownAction = { type: "unknown/action" };
    const state = journalSlice(initialState, unknownAction);
    expect(state).toEqual(initialState);
  });
});
