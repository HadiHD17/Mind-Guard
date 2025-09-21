import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../Redux/store";
import {
  hydrate,
  setMode,
  setEffectiveFromDevice,
} from "../Redux/Slices/themeSlice";

export async function bootstrapTheme() {
  const savedMode = await AsyncStorage.getItem("@theme.mode"); // "system"|"light"|"dark" or null
  store.dispatch(hydrate({ mode: savedMode || "system" }));

  // Recompute when device scheme changes (only affects "system" mode)
  Appearance.addChangeListener(() => {
    store.dispatch(setEffectiveFromDevice());
  });
}

// Call when user changes theme from UI (a settings toggle)
export async function updateThemeMode(mode) {
  await AsyncStorage.setItem("@theme.mode", mode); // "system"|"light"|"dark"
  store.dispatch(setMode(mode));
}

// Call when user logs in to sync their preference
export function syncUserThemePreference(userIsDark) {
  if (typeof userIsDark === "boolean") {
    store.dispatch(hydrate({ userIsDark }));
  }
}
