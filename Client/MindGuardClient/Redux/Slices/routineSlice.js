import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Api";

// Fetch routine for a user
export const getRoutine = createAsyncThunk(
  "routine/getRoutine",
  async (userId, { rejectWithValue, getState }) => {
    const { user } = getState().user;
    const token = user?.accessToken;

    if (!token) {
      return rejectWithValue("User is not authenticated.");
    }

    try {
      const response = await api.get(`/Routine/UpcomingRoutine/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Error fetching routine data.");
    }
  }
);

const initialState = {
  routine: null,
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
  },
});

export default routineSlice.reducer;
