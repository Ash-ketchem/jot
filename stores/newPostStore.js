import { create } from "react-nuance";

const newPostStore = create((set) => ({
  newPosts: [],

  addPost: (post) => {
    set((state) => {
      return {
        newPosts: [post, ...state.newPosts],
      };
    });
  },

  removePost: (postId) => {
    set((state) => {
      return {
        newPosts: state.posts.filter((post) => post?.id !== postId),
      };
    });
  },

  removePosts: () => {
    set(() => {
      return {
        newPosts: [],
      };
    });
  },
}));

export default newPostStore;
