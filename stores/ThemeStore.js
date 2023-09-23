import { create } from "react-nuance";

const ThemeStore = create((set) => ({
  theme: "",
  setTheme: (theme) => {
    set((state) => {
      return {
        theme: theme,
      };
    });
  },
}));

export default ThemeStore;
