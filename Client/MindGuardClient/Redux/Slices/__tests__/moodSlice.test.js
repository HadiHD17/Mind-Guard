import moodSlice, { getMoods, logMood } from "../moodSlice";

describe("moodSlice", () => {
  const initialState = {
    moods: [],
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(moodSlice(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("getMoods async thunk", () => {
    it("should handle getMoods.pending", () => {
      const action = { type: getMoods.pending.type };
      const state = moodSlice(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle getMoods.fulfilled", () => {
      const moodsData = [
        { id: "1", mood_Label: "happy", date: "2023-01-01" },
        { id: "2", mood_Label: "sad", date: "2023-01-02" },
      ];
      const action = { type: getMoods.fulfilled.type, payload: moodsData };
      const state = moodSlice(initialState, action);
      expect(state.moods).toEqual(moodsData);
      expect(state.loading).toBe(false);
    });

    it("should handle getMoods.rejected", () => {
      const errorMessage = "Error fetching mood data";
      const action = { type: getMoods.rejected.type, payload: errorMessage };
      const state = moodSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("logMood async thunk", () => {
    it("should handle logMood.pending", () => {
      const action = { type: logMood.pending.type };
      const state = moodSlice(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle logMood.fulfilled", () => {
      const moodPayload = { mood: "happy", date: "2023-01-01T10:00:00Z" };
      const action = { type: logMood.fulfilled.type, payload: moodPayload };
      const state = moodSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.moods).toHaveLength(1);
      expect(state.moods[0]).toEqual({
        mood_Label: moodPayload.mood,
        date: moodPayload.date,
        source: "Checkin",
      });
    });

    it("should handle logMood.fulfilled with existing moods", () => {
      const stateWithMoods = {
        moods: [
          { mood_Label: "neutral", date: "2023-01-01", source: "Checkin" },
        ],
        loading: false,
        error: null,
      };

      const moodPayload = { mood: "happy", date: "2023-01-02T10:00:00Z" };
      const action = { type: logMood.fulfilled.type, payload: moodPayload };
      const state = moodSlice(stateWithMoods, action);

      expect(state.loading).toBe(false);
      expect(state.moods).toHaveLength(2);
      expect(state.moods[1]).toEqual({
        mood_Label: moodPayload.mood,
        date: moodPayload.date,
        source: "Checkin",
      });
    });

    it("should handle logMood.rejected", () => {
      const errorMessage = "Mood logging error";
      const action = { type: logMood.rejected.type, payload: errorMessage };
      const state = moodSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  it("should export async thunks", () => {
    expect(getMoods).toBeDefined();
    expect(logMood).toBeDefined();
  });

  it("should have correct thunk type prefixes", () => {
    expect(getMoods.typePrefix).toBe("mood/getMoods");
    expect(logMood.typePrefix).toBe("mood/logMood");
  });

  it("should handle unknown action types", () => {
    const unknownAction = { type: "unknown/action" };
    const state = moodSlice(initialState, unknownAction);
    expect(state).toEqual(initialState);
  });
});
