import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../Api";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/Auth/Login", { email, password });
      const data = response.data;

      await AsyncStorage.setItem("@user_data", JSON.stringify(data));

      return data;
    } catch (error) {
      return rejectWithValue("Login failed. Please try again.");
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      AsyncStorage.removeItem("@user_data");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, setToken, logout, setLoading, setError } =
  authSlice.actions;

export default authSlice.reducer;
