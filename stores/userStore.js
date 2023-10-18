import { create } from "react-nuance";

const userStore = create((set) => ({
  loggedUser: null,
  loggedIn: false,

  setUser: (user) => {
    set(() => {
      return {
        loggedUser: user,
        loggedIn: true,
      };
    });
  },

  setUserData: (data) => {
    // data = { key: value };
    set((state) => {
      if (state?.loggedUser[data?.key]) {
        state.loggedUser[data?.key] = data?.value;
        return {
          loggedUser: {
            ...state?.loggedUser,
          },
        };
      }
    });
  },

  removeUser: () => {
    set(() => {
      return {
        loggedUser: null,
        loggedIn: false,
      };
    });
  },
}));

export default userStore;
