import { create } from "react-nuance";

const commentStore = create((set) => ({
  comments: [],

  addComment: (comment) => {
    set((state) => {
      if (state.comments.map((comment) => comment.id).includes(comment.id)) {
        return {
          comments: state.comments,
        };
      }
      return {
        comments: [comment, ...state.comments],
      };
    });
  },

  addComments: (comments) => {
    set((state) => {
      const oldIds = state.comments.map((comment) => comment?.id);
      return {
        comments: [
          ...state.comments,
          ...comments.filter((comment) => !oldIds.includes(comment?.id)),
        ],
      };
    });
  },

  //   setLike: (commentId) => {
  //     set((state) => {
  //       if (!state?.post) return state;

  //       return {

  //       };
  //     }, commentId);
  //   },

  removeComment: (commentId) => {
    set((state) => {
      return {
        comments: state.comments.filter((comment) => comment?.id !== commentId),
      };
    });
  },

  removeCommentsByPost: (postId) => {
    set((state) => {
      return {
        comments: state.comments.filter(
          (comment) => comment?.postId !== postId
        ),
      };
    });
  },

  removeComments: () => {
    set(() => {
      return {
        comments: [],
      };
    });
  },
}));

export default commentStore;
