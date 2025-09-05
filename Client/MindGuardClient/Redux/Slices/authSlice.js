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
    { fullName, email, phone, userId, accessToken },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/User/UpdateAccount/${userId}`,
        { fullName, email, phoneNumber: phone },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updatedUser = {
        ...response.data.payload,
        accessToken,
        userId,
      };

      await AsyncStorage.setItem("@user_data", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update account"
      );
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

    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.accessToken;
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
