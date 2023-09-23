import { create } from "react-nuance";

const followStore = create((set) => ({
  users: [], // [{id : string, following : bool}]

  addUser: (id) => {
    set((state) => {
      if (state.users.map((user) => user.id).includes(id)) return;
      return {
        users: [
          {
            id: id,
            following: false,
          },
          ...state.users,
        ],
      };
    }, id);
  },

  removeUser: (id) => {
    set(() => {
      return {
        users: state.users.filter((user) => user?.id !== id),
      };
    }, id);
  },

  removeUsers: () => {
    set(() => {
      return {
        users: [],
      };
    });
  },

  setFollow: (id, follow) => {
    set((state) => {
      return {
        users: state.users.map((user) =>
          user?.id === id ? { ...user, following: follow } : user
        ),
      };
    });
  },
}));

export default followStore;
