import routineSlice, {
  getRoutine,
  loadRoutines,
  addRoutine,
  handleDelete,
  handleMarkComplete,
  handleUpdateDays,
} from "../routineSlice";

describe("routineSlice", () => {
  const initialState = {
    routine: null,
    routines: [],
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(routineSlice(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("getRoutine async thunk", () => {
    it("should handle getRoutine.pending", () => {
      const action = { type: getRoutine.pending.type };
      const state = routineSlice(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle getRoutine.fulfilled", () => {
      const routineData = {
        id: "1",
        description: "Morning routine",
        reminder_Time: "08:00",
      };
      const action = { type: getRoutine.fulfilled.type, payload: routineData };
      const state = routineSlice(initialState, action);
      expect(state.routine).toEqual(routineData);
      expect(state.loading).toBe(false);
    });

    it("should handle getRoutine.rejected", () => {
      const errorMessage = "Error fetching routine data";
      const action = { type: getRoutine.rejected.type, payload: errorMessage };
      const state = routineSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("loadRoutines async thunk", () => {
    it("should handle loadRoutines.pending", () => {
      const action = { type: loadRoutines.pending.type };
      const state = routineSlice(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle loadRoutines.fulfilled", () => {
      const routinesData = [
        { id: "1", description: "Morning routine", reminder_Time: "08:00" },
        { id: "2", description: "Evening routine", reminder_Time: "20:00" },
      ];
      const action = {
        type: loadRoutines.fulfilled.type,
        payload: routinesData,
      };
      const state = routineSlice(initialState, action);
      expect(state.routines).toEqual(routinesData);
      expect(state.loading).toBe(false);
    });

    it("should handle loadRoutines.rejected", () => {
      const errorMessage = "Error fetching routines";
      const action = {
        type: loadRoutines.rejected.type,
        payload: errorMessage,
      };
      const state = routineSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("addRoutine async thunk", () => {
    it("should handle addRoutine.pending", () => {
      const action = { type: addRoutine.pending.type };
      const state = routineSlice(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle addRoutine.fulfilled", () => {
      const newRoutine = {
        id: "1",
        description: "New routine",
        reminder_Time: "09:00",
      };
      const action = { type: addRoutine.fulfilled.type, payload: newRoutine };
      const state = routineSlice(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.routines).toHaveLength(1);
      expect(state.routines[0]).toEqual(newRoutine);
    });

    it("should handle addRoutine.rejected", () => {
      const errorMessage = "Failed to create routine";
      const action = { type: addRoutine.rejected.type, payload: errorMessage };
      const state = routineSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("handleDelete async thunk", () => {
    it("should handle handleDelete.pending", () => {
      const action = { type: handleDelete.pending.type };
      const state = routineSlice(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle handleDelete.fulfilled", () => {
      const stateWithRoutines = {
        ...initialState,
        routines: [
          { id: "1", description: "Routine 1" },
          { id: "2", description: "Routine 2" },
        ],
      };

      const routineIdToDelete = "1";
      const action = {
        type: handleDelete.fulfilled.type,
        payload: routineIdToDelete,
      };
      const state = routineSlice(stateWithRoutines, action);

      expect(state.loading).toBe(false);
      expect(state.routines).toHaveLength(1);
      expect(state.routines[0].id).toBe("2");
    });

    it("should handle handleDelete.rejected", () => {
      const errorMessage = "Error deleting routine";
      const action = {
        type: handleDelete.rejected.type,
        payload: errorMessage,
      };
      const state = routineSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("handleMarkComplete async thunk", () => {
    it("should handle handleMarkComplete.pending", () => {
      const action = { type: handleMarkComplete.pending.type };
      const state = routineSlice(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle handleMarkComplete.fulfilled", () => {
      const stateWithRoutines = {
        ...initialState,
        routines: [
          { id: "1", description: "Routine 1", completed: false },
          { id: "2", description: "Routine 2", completed: false },
        ],
      };

      const updatedRoutine = {
        id: "1",
        description: "Routine 1",
        completed: true,
      };
      const action = {
        type: handleMarkComplete.fulfilled.type,
        payload: updatedRoutine,
      };
      const state = routineSlice(stateWithRoutines, action);

      expect(state.loading).toBe(false);
      expect(state.routines[0]).toEqual(updatedRoutine);
      expect(state.routines[1].completed).toBe(false);
    });

    it("should handle handleMarkComplete.rejected", () => {
      const errorMessage = "Error marking routine complete";
      const action = {
        type: handleMarkComplete.rejected.type,
        payload: errorMessage,
      };
      const state = routineSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("handleUpdateDays async thunk", () => {
    it("should handle handleUpdateDays.fulfilled", () => {
      const stateWithRoutines = {
        ...initialState,
        routines: [
          { id: "1", description: "Routine 1", days: ["Mon", "Wed"] },
          { id: "2", description: "Routine 2", days: ["Tue", "Thu"] },
        ],
      };

      const updatePayload = { routineId: "1", newDays: ["Mon", "Wed", "Fri"] };
      const action = {
        type: handleUpdateDays.fulfilled.type,
        payload: updatePayload,
      };
      const state = routineSlice(stateWithRoutines, action);

      expect(state.routines[0].days).toEqual(["Mon", "Wed", "Fri"]);
      expect(state.routines[1].days).toEqual(["Tue", "Thu"]);
    });

    it("should handle handleUpdateDays.rejected", () => {
      const errorMessage = "Error updating days";
      const action = {
        type: handleUpdateDays.rejected.type,
        payload: errorMessage,
      };
      const state = routineSlice(initialState, action);
      expect(state.error).toBe(errorMessage);
    });
  });

  it("should export all async thunks", () => {
    expect(getRoutine).toBeDefined();
    expect(loadRoutines).toBeDefined();
    expect(addRoutine).toBeDefined();
    expect(handleDelete).toBeDefined();
    expect(handleMarkComplete).toBeDefined();
    expect(handleUpdateDays).toBeDefined();
  });

  it("should have correct thunk type prefixes", () => {
    expect(getRoutine.typePrefix).toBe("routine/getRoutine");
    expect(loadRoutines.typePrefix).toBe("routine/loadRoutines");
    expect(addRoutine.typePrefix).toBe("routine/addRoutine");
    expect(handleDelete.typePrefix).toBe("routine/deleteRoutine");
    expect(handleMarkComplete.typePrefix).toBe("routine/markRoutineComplete");
    expect(handleUpdateDays.typePrefix).toBe("routine/updateDays");
  });

  it("should handle unknown action types", () => {
    const unknownAction = { type: "unknown/action" };
    const state = routineSlice(initialState, unknownAction);
    expect(state).toEqual(initialState);
  });
});
