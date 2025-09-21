import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, updateAccount } from "../Redux/Slices/authSlice";
import { syncUserThemePreference } from "../Theme/themeBootstrap";

export default function useTogglePrefs() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user);

  const [pending, setPending] = useState({ dark: false, cal: false });

  const isDark = !!user?.isDark;
  const calendarSyncEnabled = !!user?.calendar_sync_enabled;

  const id = user?.id;
  const token = user?.accessToken;

  const safeUpdate = useCallback(
    async (field, nextValue) => {
      if (!user || !id || !token) return;

      const prevUser = { ...user };

      dispatch(setUser({ ...user, [field]: nextValue }));
      setPending((p) => ({
        ...p,
        [field === "isDark" ? "dark" : "cal"]: true,
      }));

      try {
        const patch =
          field === "isDark"
            ? { isDark: nextValue }
            : { calendar_sync_enabled: nextValue };

        await dispatch(
          updateAccount({
            userId: id,
            accessToken: token,
            ...patch,
          })
        ).unwrap();

        // Sync theme preference with Redux theme state
        if (field === "isDark") {
          syncUserThemePreference(nextValue);
        }
      } catch (err) {
        dispatch(setUser(prevUser));
        console.log("Update failed", String(err?.message || err));
      } finally {
        setPending((p) => ({
          ...p,
          [field === "isDark" ? "dark" : "cal"]: false,
        }));
      }
    },
    [dispatch, user, id, token]
  );

  const toggleDark = useCallback((v) => safeUpdate("isDark", v), [safeUpdate]);
  const toggleCalendar = useCallback(
    (v) => safeUpdate("calendar_sync_enabled", v),
    [safeUpdate]
  );

  return useMemo(
    () => ({
      isDark,
      calendarSyncEnabled,
      toggleDark,
      toggleCalendar,
      pendingDark: pending.dark,
      pendingCalendar: pending.cal,
    }),
    [isDark, calendarSyncEnabled, toggleDark, toggleCalendar, pending]
  );
}
