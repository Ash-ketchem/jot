import { create } from "react-nuance";

const currentPostStore = create((set) => ({
  postId: null,
  setPostId: (id) => {
    set(() => {
      return {
        postId: id,
      };
    });
  },

  removePostId: () => {
    set(() => {
      return {
        postId: null,
      };
    });
  },
}));

export default currentPostStore;
