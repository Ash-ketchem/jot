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
