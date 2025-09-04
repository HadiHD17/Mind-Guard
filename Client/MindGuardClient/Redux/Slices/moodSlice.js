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
      });
  },
});

export default moodSlice.reducer;
