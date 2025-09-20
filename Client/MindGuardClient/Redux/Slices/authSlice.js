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

export const register = createAsyncThunk(
  "auth/register",
  async ({ fullName, email, password, phoneNumber }, { rejectWithValue }) => {
    try {
      const response = await api.post("/Auth/Register", {
        fullName,
        email,
        password,
        phoneNumber,
      });
      const data = response.data;

      await AsyncStorage.setItem("@user_data", JSON.stringify(data));

      return data;
    } catch (error) {
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

export const updateAccount = createAsyncThunk(
  "auth/updateAccount",
  async (
    {
      userId,
      accessToken,
      fullName,
      email,
      phone,
      isDark,
      calendar_sync_enabled,
    },
    { rejectWithValue }
  ) => {
    try {
      const payload = {};
      if (typeof fullName !== "undefined") payload.fullName = fullName;
      if (typeof email !== "undefined") payload.email = email;
      if (typeof phone !== "undefined") payload.phoneNumber = phone;
      if (typeof isDark !== "undefined") payload.isDark = isDark;
      if (typeof calendar_sync_enabled !== "undefined")
        payload.calendar_sync_enabled = calendar_sync_enabled;

      const res = await api.put(`/User/UpdateAccount/${userId}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const serverUser = res.data?.payload;

      const updatedUser = { ...serverUser, accessToken, id: userId };

      await AsyncStorage.setItem("@user_data", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update account";
      return rejectWithValue(msg);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { currentPassword, newPassword, userId, accessToken },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/User/UpdatePassword/${userId}`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data.payload;
    } catch (error) {
      console.log(error.response);

      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
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
      delete api.defaults.headers.common.Authorization;
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
        api.defaults.headers.common.Authorization = `Bearer ${action.payload.accessToken}`;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.accessToken;
        api.defaults.headers.common.Authorization = `Bearer ${action.payload.accessToken}`;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.accessToken;
        state.loading = false;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { setUser, setToken, logout, setLoading, setError } =
  authSlice.actions;

export default authSlice.reducer;
