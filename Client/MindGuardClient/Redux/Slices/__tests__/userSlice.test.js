import userSlice, {
  setUser,
  setLoading,
  setError,
  logout,
  fetchUserData,
} from "../userSlice";

describe("userSlice", () => {
  const initialState = {
    user: null,
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(userSlice(undefined, { type: undefined })).toEqual(initialState);
  });

  it("should handle setUser", () => {
    const user = { id: "1", name: "Test User" };
    const actual = userSlice(initialState, setUser(user));
    expect(actual.user).toEqual(user);
  });

  it("should handle setLoading", () => {
    const actual = userSlice(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });

  it("should handle setError", () => {
    const error = "Test error";
    const actual = userSlice(initialState, setError(error));
    expect(actual.error).toBe(error);
  });

  it("should handle logout", () => {
    const stateWithUser = {
      user: { id: "1", name: "Test User" },
      loading: false,
      error: "Some error",
    };
    const actual = userSlice(stateWithUser, logout());
    expect(actual.user).toBeNull();
    expect(actual.error).toBeNull();
  });

  describe("fetchUserData async thunk", () => {
    it("should handle fetchUserData.pending", () => {
      const action = { type: fetchUserData.pending.type };
      const state = userSlice(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fetchUserData.fulfilled", () => {
      const userData = { id: "1", name: "Test User" };
      const action = { type: fetchUserData.fulfilled.type, payload: userData };
      const state = userSlice(initialState, action);
      expect(state.user).toEqual(userData);
      expect(state.loading).toBe(false);
    });

    it("should handle fetchUserData.rejected", () => {
      const errorMessage = "Failed to fetch user";
      const action = {
        type: fetchUserData.rejected.type,
        payload: errorMessage,
      };
      const state = userSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  it("should export action creators", () => {
    expect(setUser).toBeDefined();
    expect(setLoading).toBeDefined();
    expect(setError).toBeDefined();
    expect(logout).toBeDefined();
    expect(fetchUserData).toBeDefined();
  });

  it("should have correct action types", () => {
    expect(setUser.type).toBe("user/setUser");
    expect(setLoading.type).toBe("user/setLoading");
    expect(setError.type).toBe("user/setError");
    expect(logout.type).toBe("user/logout");
    expect(fetchUserData.typePrefix).toBe("user/fetchUserData");
  });
});
