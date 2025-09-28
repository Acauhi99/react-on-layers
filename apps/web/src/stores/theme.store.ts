import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ColorTheme, colorThemes } from "@/lib/theme";

interface ThemeState {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      colorTheme: "blue",
      setColorTheme: (theme) => {
        set({ colorTheme: theme });
        get().applyTheme();
      },
      applyTheme: () => {
        const { colorTheme } = get();
        const theme = colorThemes[colorTheme];
        const root = document.documentElement;

        Object.entries(theme).forEach(([key, value]) => {
          root.style.setProperty(
            `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
            value
          );
        });
      },
    }),
    {
      name: "theme-storage",
    }
  )
);
