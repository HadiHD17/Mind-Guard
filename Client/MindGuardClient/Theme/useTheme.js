import { useMemo } from "react";
import { useSelector } from "react-redux";
import { lightTheme, darkTheme } from "./colors";
import { selectTheme } from "../Redux/Slices/themeSlice";

export const useTheme = () => {
  const effectiveTheme = useSelector(selectTheme); // "light" | "dark"
  const isDark = effectiveTheme === "dark";

  const theme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  return { theme, isDark };
};
