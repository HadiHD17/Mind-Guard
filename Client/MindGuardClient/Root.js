import React, { useEffect, useState } from "react";
import App from "./App";
import { store } from "./Redux/store";
import { setUser, setToken } from "./Redux/Slices/authSlice";
import { getUserData } from "./Helpers/Storage";
import {
  bootstrapTheme,
  syncUserThemePreference,
} from "./Theme/themeBootstrap";

export default function RootNavigator() {
  const [user, setUserState] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const loadUser = async () => {
    // Initialize theme system first
    await bootstrapTheme();

    const data = await getUserData();
    if (data) {
      store.dispatch(setUser(data));
      store.dispatch(setToken(data.accessToken));
      setUserState(data);

      // Sync user's theme preference
      syncUserThemePreference(data.isDark);
    }
    setLoaded(true);
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (!loaded) return null;

  return <App user={user} />;
}
