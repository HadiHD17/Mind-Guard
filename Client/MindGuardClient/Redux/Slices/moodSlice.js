import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Api";

export const getMoods = createAsyncThunk(
  "mood/getMoods",
  async (userId, { rejectWithValue, getState }) => {
    const { user } = getState().user;
    const token = user?.accessToken;

    if (!token) {
      return rejectWithValue("User is not authenticated.");
    }

    try {
      const response = await api.get(`/Mood/All/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Error fetching mood data.");
    }
  }
);

export const logMood = createAsyncThunk(
  "mood/logMood",
  async ({ userId, mood }, { rejectWithValue, getState }) => {
    const { user } = getState().user;
    const token = user?.accessToken;

    if (!token) {
      return rejectWithValue("User is not authenticated.");
    }

    try {
      const res = await api.post(
        "/Mood",
        { userId, mood_Label: mood },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status !== "success") {
        return rejectWithValue("Failed to log mood.");
      }
      return { mood, date: new Date().toISOString() };
    } catch (err) {
      return rejectWithValue("Mood logging error.");
    }
  }
);

const initialState = {
  moods: [],
  loading: false,
  error: null,
};

const moodSlice = createSlice({
  name: "mood",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMoods.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMoods.fulfilled, (state, action) => {
        state.moods = action.payload;
        state.loading = false;
      })
      .addCase(getMoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logMood.pending, (state) => {
        state.loading = true;
      })
      .addCase(logMood.fulfilled, (state, action) => {
        state.moods.push({
          mood_Label: action.payload.mood,
          date: action.payload.date,
          source: "Checkin",
        });
        state.loading = false;
      })

      .addCase(logMood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default moodSlice.reducer;
