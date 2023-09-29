import { create } from "react-nuance";

const followStore = create((set) => ({
  users: [], // [{id : string, following : int, followers : int}]
  loggedUserId: null,

  setLoggedUserId: (id) => {
    set((state) => {
      return {
        loggedUserId: id,
      };
    });
  },

  addUser: (id, followingCount, followersCount, following, priority = true) => {
    set((state) => {
      if (state.users.map((user) => user.id).includes(id)) {
        return {
          users: state?.users.map((user) =>
            user?.id === id
              ? {
                  id: id,
                  followingCount: priority ? followingCount : null,
                  followersCount: priority ? followersCount : null,
                  following: following,
                }
              : user
          ),
        };
      }
      return {
        users: [
          {
            id: id,
            followingCount: priority ? followingCount : null,
            followersCount: priority ? followersCount : null,
            following: following,
          },
          ...state.users,
        ],
      };
    });
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
      // usercard case
      return {
        users: state.users.map((user) =>
          user?.id === id
            ? {
                ...user,
                following: follow,
                followersCount: follow
                  ? user?.followersCount + 1
                  : user?.followersCount - 1,
              }
            : user
        ),
      };
    });
  },
}));

export default followStore;
