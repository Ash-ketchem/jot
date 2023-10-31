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
      for (const key of Object.keys(data)) {
        if (state?.loggedUser[key]) {
          state.loggedUser[key] = data[key];
        }

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
