import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Api";

const byCreatedAtDesc = (a, b) =>
  new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at);

export const getJournals = createAsyncThunk(
  "journal/getJournals",
  async ({ userId, accessToken }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/Entry/UserEntries/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.payload;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch journals"
      );
    }
  }
);

export const saveJournal = createAsyncThunk(
  "journal/saveJournal",
  async ({ content, userId, accessToken }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/Entry",
        { userId, content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.payload;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save journal entry"
      );
    }
  }
);

const initialState = {
  journals: [],
  loading: false,
  error: null,
};

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJournals.fulfilled, (state, action) => {
        state.journals = [...(action.payload ?? [])].sort(byCreatedAtDesc);
        state.loading = false;
      })
      .addCase(getJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(saveJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveJournal.fulfilled, (state, action) => {
        if (action.payload) {
          state.journals = [action.payload, ...state.journals].sort(
            byCreatedAtDesc
          );
        }
        state.loading = false;
      })
      .addCase(saveJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default journalSlice.reducer;
