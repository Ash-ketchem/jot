import { create } from "react-nuance";

const toastStore = create((set) => ({
  toasts: [],
  addToast: (label) => {
    set((state) => {
      return {
        toasts: [
          {
            id: crypto.randomUUID(),
            label,
          },
          ...state.toasts,
        ],
      };
    });
  },
  removeToast: () => {
    set((state) => {
      state.toasts.shift();
      return {
        toasts: [...state.toasts],
      };
    });
  },
}));

export default toastStore;
