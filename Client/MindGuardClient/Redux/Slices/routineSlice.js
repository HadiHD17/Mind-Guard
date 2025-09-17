import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Api";

export const getRoutine = createAsyncThunk(
  "routine/getRoutine",
  async ({ userId, accessToken }, { rejectWithValue }) => {
    if (!accessToken) {
      return rejectWithValue("User is not authenticated.");
    }

    try {
      const response = await api.get(`/Routine/UpcomingRoutine/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Error fetching routine data.");
    }
  }
);

export const loadRoutines = createAsyncThunk(
  "routine/loadRoutines",
  async ({ userId, accessToken }, { rejectWithValue }) => {
    if (!accessToken) {
      return rejectWithValue("User is not authenticated.");
    }

    try {
      const response = await api.get(`/Routine/UserRoutine/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const today = new Date().toISOString().split("T")[0];

      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Error fetching routines.");
    }
  }
);

export const addRoutine = createAsyncThunk(
  "routine/addRoutine",
  async (
    { title, time, selectedDays, userId, accessToken },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/Routine",
        {
          userId,
          description: title,
          reminder_Time: time,
          frequency: selectedDays.join(","),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Failed to create routine");
    }
  }
);

export const handleDelete = createAsyncThunk(
  "routine/deleteRoutine",
  async ({ routineId, accessToken }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/Routine/${routineId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return routineId;
    } catch (error) {
      return rejectWithValue("Error deleting routine.");
    }
  }
);

export const handleMarkComplete = createAsyncThunk(
  "routine/markRoutineComplete",
  async ({ routineId, accessToken }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/Routine/${routineId}`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const updatedRoutine = response.data.payload.routine;
      const today = new Date().toISOString().split("T")[0];

      updatedRoutine.lastCompletedDate =
        updatedRoutine.lastCompletedDate || today;

      return updatedRoutine;
    } catch (error) {
      return rejectWithValue("Error marking routine complete.");
    }
  }
);

export const handleUpdateDays = createAsyncThunk(
  "routine/updateDays",
  async ({ routineId, newDays, accessToken }, { rejectWithValue }) => {
    try {
      return { routineId, newDays };
    } catch (error) {
      return rejectWithValue("Error updating days.");
    }
  }
);

const initialState = {
  routine: null,
  routines: [],
  loading: false,
  error: null,
};

const routineSlice = createSlice({
  name: "routine",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoutine.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoutine.fulfilled, (state, action) => {
        state.routine = action.payload;
        state.loading = false;
      })
      .addCase(getRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(loadRoutines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRoutines.fulfilled, (state, action) => {
        state.routines = action.payload;
        state.loading = false;
      })
      .addCase(loadRoutines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addRoutine.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRoutine.fulfilled, (state, action) => {
        state.routines.push(action.payload);
        state.loading = false;
      })
      .addCase(addRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(handleDelete.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleDelete.fulfilled, (state, action) => {
        state.routines = state.routines.filter(
          (routine) => routine.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(handleDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(handleMarkComplete.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleMarkComplete.fulfilled, (state, action) => {
        const updatedRoutine = action.payload;

        state.routines = state.routines.map((routine) =>
          routine.id === updatedRoutine.id ? updatedRoutine : routine
        );

        state.loading = false;
      })
      .addCase(handleMarkComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(handleUpdateDays.fulfilled, (state, action) => {
        state.routines = state.routines.map((r) =>
          r.id === action.payload.routineId
            ? { ...r, days: action.payload.newDays }
            : r
        );
      })
      .addCase(handleUpdateDays.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default routineSlice.reducer;
