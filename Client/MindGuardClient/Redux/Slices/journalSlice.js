import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../Api";
import { getUserData } from "../../Helpers/Storage"; // Import your helper

// Thunk to get journals
export const getJournals = createAsyncThunk(
  "journal/getJournals",
  async (userId, { rejectWithValue }) => {
    try {
      // Fetch user data from AsyncStorage to get the token
      const userData = await getUserData();
      const token = userData ? userData.accessToken : null;

      if (!token) {
        return rejectWithValue("No access token found");
      }

      const response = await api.get(`/Entry/UserEntries/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });

      return response.data.payload; // Assuming journals are in payload
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch journals"
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
        state.error = null; // Reset error when loading starts
      })
      .addCase(getJournals.fulfilled, (state, action) => {
        state.journals = action.payload;
        state.loading = false;
      })
      .addCase(getJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message from the rejected action
      });
  },
});

export default journalSlice.reducer;
