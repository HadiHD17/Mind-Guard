import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Api";
import { normalizeEntries, lastNDays } from "../../Helpers/normalizeEntries";
import { loadSeqModel, predictSeqRisk } from "../../ml/riskSeq";

const THRESHOLD = 0.55;

export const loadEntriesAndPredict = createAsyncThunk(
  "insights/loadEntriesAndPredict",
  async ({ userId, accessToken }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/Entry/UserEntries/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const raw = res.data?.payload ?? [];
      const entries = normalizeEntries(raw);

      await loadSeqModel();
      const last7 = lastNDays(entries, 7);

      let risk = { prob: 0, label: "OK" };
      if (last7.length >= 3) {
        risk = predictSeqRisk(last7, THRESHOLD);
      }

      return { entries, risk };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const predictNow = createAsyncThunk(
  "insights/predictNow",
  async ({ entries }, { rejectWithValue }) => {
    try {
      await loadSeqModel();
      const last7 = lastNDays(entries, 7);
      const risk =
        last7.length >= 3
          ? predictSeqRisk(last7, THRESHOLD)
          : { prob: 0, label: "OK" };
      return { risk };
    } catch (err) {
      return rejectWithValue(err?.message || "Prediction failed");
    }
  }
);

const insightsSlice = createSlice({
  name: "insights",
  initialState: {
    entries: [],
    risk: { label: "OK", prob: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearInsights: (state) => {
      state.entries = [];
      state.risk = { label: "OK", prob: 0 };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEntriesAndPredict.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loadEntriesAndPredict.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.entries = payload.entries;
        s.risk = payload.risk;
      })
      .addCase(loadEntriesAndPredict.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload || "Failed to load insights";
      })
      .addCase(predictNow.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(predictNow.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.risk = payload.risk;
      })
      .addCase(predictNow.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload || "Prediction failed";
      });
  },
});

export const { clearInsights } = insightsSlice.actions;
export default insightsSlice.reducer;
