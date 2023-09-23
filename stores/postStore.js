import { create } from "react-nuance";

const postStore = create((set) => ({
  post: null,

  addPost: (post) => {
    set(() => {
      return {
        post,
      };
    });
  },

  setLike: (postId) => {
    set((state) => {
      if (!state?.post) return state;

      return {
        post: {
          ...state.post,
          liked: !state.post?.liked,
          likeCount: state?.post?.liked
            ? state.post?.likeCount - 1
            : state.post?.likeCount + 1,
        },
      };
    }, postId);
  },

  setComment: (postId, action) => {
    set((state) => {
      if (!state?.post) return state;

      switch (action) {
        case "add":
          return {
            post: {
              ...state.post,
              commentCount: state.post.commentCount + 1,
            },
          };
        case "remove":
          return {
            post: {
              ...state.post,
              commentCount: state.post.commentCount - 1,
            },
          };

        default:
          break;
      }
    }, postId);
  },

  setBookmark: (postId) => {
    set((state) => {
      if (!state?.post) return state;

      return {
        post: {
          ...state?.post,
          bookmarked: !state?.post.bookmarked,
        },
      };
    }, postId);
  },

  deletePost: (postId) => {
    set((state) => {
      if (state.post?.id === postId) {
        return {
          post: null,
        };
      }
    });
  },

  removePost: () => {
    set(() => {
      return {
        post: null,
      };
    });
  },
}));

export default postStore;
