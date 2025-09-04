import React, { useEffect, useState } from "react";
import App from "./App";
import { store } from "./Redux/store";
import { setUser, setToken } from "./Redux/Slices/authSlice";
import { getUserData } from "./Helpers/Storage";

export default function RootNavigator() {
  const [user, setUserState] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const loadUser = async () => {
    const data = await getUserData();
    if (data) {
      store.dispatch(setUser(data));
      store.dispatch(setToken(data.accessToken));
      setUserState(data);
    }
    setLoaded(true);
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (!loaded) return null;

  return <App user={user} />;
}
