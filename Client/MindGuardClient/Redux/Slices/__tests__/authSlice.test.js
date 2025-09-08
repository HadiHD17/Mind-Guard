import authSlice, {
  setUser,
  setToken,
  logout,
  setLoading,
  setError,
  login,
  register,
  updateAccount,
  changePassword,
} from "../authSlice";

describe("authSlice", () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(authSlice(undefined, { type: undefined })).toEqual(initialState);
  });

  it("should handle setUser", () => {
    const user = { id: "1", name: "Test User" };
    const actual = authSlice(initialState, setUser(user));
    expect(actual.user).toEqual(user);
  });

  it("should handle setToken", () => {
    const token = "test-token";
    const actual = authSlice(initialState, setToken(token));
    expect(actual.token).toBe(token);
  });

  it("should handle setLoading", () => {
    const actual = authSlice(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });

  it("should handle setError", () => {
    const error = "Test error";
    const actual = authSlice(initialState, setError(error));
    expect(actual.error).toBe(error);
  });

  it("should handle logout", () => {
    const stateWithData = {
      user: { id: "1", name: "Test User" },
      token: "test-token",
      loading: true,
      error: "Some error",
    };
    const actual = authSlice(stateWithData, logout());
    expect(actual.user).toBeNull();
    expect(actual.token).toBeNull();
    expect(actual.loading).toBe(false);
    expect(actual.error).toBeNull();
  });

  describe("login async thunk", () => {
    it("should handle login.pending", () => {
      const action = { type: login.pending.type };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle login.fulfilled", () => {
      const userData = { id: "1", name: "Test User", accessToken: "token123" };
      const action = { type: login.fulfilled.type, payload: userData };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(userData);
      expect(state.token).toBe(userData.accessToken);
    });

    it("should handle login.rejected", () => {
      const errorMessage = "Login failed";
      const action = { type: login.rejected.type, payload: errorMessage };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("register async thunk", () => {
    it("should handle register.pending", () => {
      const action = { type: register.pending.type };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle register.fulfilled", () => {
      const userData = { id: "1", name: "Test User", accessToken: "token123" };
      const action = { type: register.fulfilled.type, payload: userData };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(userData);
      expect(state.token).toBe(userData.accessToken);
    });

    it("should handle register.rejected", () => {
      const errorMessage = "Registration failed";
      const action = { type: register.rejected.type, payload: errorMessage };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("updateAccount async thunk", () => {
    it("should handle updateAccount.pending", () => {
      const action = { type: updateAccount.pending.type };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle updateAccount.fulfilled", () => {
      const userData = {
        id: "1",
        name: "Updated User",
        accessToken: "token123",
      };
      const action = { type: updateAccount.fulfilled.type, payload: userData };
      const state = authSlice(initialState, action);
      expect(state.user).toEqual(userData);
      expect(state.token).toBe(userData.accessToken);
      expect(state.loading).toBe(false);
    });

    it("should handle updateAccount.rejected", () => {
      const errorMessage = "Update failed";
      const action = {
        type: updateAccount.rejected.type,
        payload: errorMessage,
      };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe("changePassword async thunk", () => {
    it("should handle changePassword.pending", () => {
      const action = { type: changePassword.pending.type };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.success).toBe(false);
    });

    it("should handle changePassword.fulfilled", () => {
      const action = { type: changePassword.fulfilled.type };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.success).toBe(true);
    });

    it("should handle changePassword.rejected", () => {
      const errorMessage = "Password change failed";
      const action = {
        type: changePassword.rejected.type,
        payload: errorMessage,
      };
      const state = authSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.success).toBe(false);
    });
  });

  it("should export action creators", () => {
    expect(setUser).toBeDefined();
    expect(setToken).toBeDefined();
    expect(logout).toBeDefined();
    expect(setLoading).toBeDefined();
    expect(setError).toBeDefined();
    expect(login).toBeDefined();
    expect(register).toBeDefined();
    expect(updateAccount).toBeDefined();
    expect(changePassword).toBeDefined();
  });

  it("should have correct action types", () => {
    expect(setUser.type).toBe("auth/setUser");
    expect(setToken.type).toBe("auth/setToken");
    expect(logout.type).toBe("auth/logout");
    expect(setLoading.type).toBe("auth/setLoading");
    expect(setError.type).toBe("auth/setError");
    expect(login.typePrefix).toBe("auth/login");
    expect(register.typePrefix).toBe("auth/register");
    expect(updateAccount.typePrefix).toBe("auth/updateAccount");
    expect(changePassword.typePrefix).toBe("auth/changePassword");
  });
});
