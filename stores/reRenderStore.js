import { create } from "react-nuance";

const reRenderStore = create((set) => ({
  routes: {
    notifications: "notifications",
  },

  reRenderPage: (key) => {
    set((state) => {
      return {
        routes: {
          ...state?.routes,
        },
      };
    }, key);
  },
}));

export default reRenderStore;
