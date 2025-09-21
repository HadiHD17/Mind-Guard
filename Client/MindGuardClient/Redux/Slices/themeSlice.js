import { createSlice } from "@reduxjs/toolkit";
import { Appearance } from "react-native";

const deviceScheme = Appearance.getColorScheme() === "dark" ? "dark" : "light";

// mode: "system" | "light" | "dark"
// effective: "light" | "dark"
const initialState = {
  mode: "system",
  effective: deviceScheme,
};

const computeEffective = (mode) => {
  if (mode === "system") {
    return Appearance.getColorScheme() === "dark" ? "dark" : "light";
  }
  return mode;
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setMode(state, action) {
      state.mode = action.payload; // "system" | "light" | "dark"
      state.effective = computeEffective(state.mode);
    },
    setEffectiveFromDevice(state) {
      state.effective = computeEffective(state.mode);
    },
    hydrate(state, action) {
      // action.payload: { mode?: "system"|"light"|"dark", userIsDark?: boolean|null }
      const { mode, userIsDark } = action.payload || {};
      if (typeof userIsDark === "boolean") {
        state.effective = userIsDark ? "dark" : "light";
        if (mode) state.mode = mode;
        return;
      }
      if (mode) state.mode = mode;
      state.effective = computeEffective(state.mode);
    },
  },
});

export const { setMode, setEffectiveFromDevice, hydrate } = themeSlice.actions;
export default themeSlice.reducer;

// Selectors
export const selectTheme = (state) => state.theme.effective; // "light" | "dark"
export const selectThemeMode = (state) => state.theme.mode; // "system" | "light" | "dark"
