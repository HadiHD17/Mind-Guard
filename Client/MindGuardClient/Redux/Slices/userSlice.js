import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserData } from "../../Helpers/Storage";

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getUserData();
      if (!userData) {
        return rejectWithValue("No user data found");
      }
      return userData;
    } catch (error) {
      return rejectWithValue("Failed to load user data");
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, setLoading, setError, logout, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
