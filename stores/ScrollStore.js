import { create } from "react-nuance";

const scrollStore = create((set) => ({
  paths: new Map(),
  setScroll: (pathname, scrollPosition) => {
    set((state) => {
      state.paths.set(pathname, scrollPosition);
      return {
        paths: new Map(state.paths),
      };
    });
  },
}));

export default scrollStore;
