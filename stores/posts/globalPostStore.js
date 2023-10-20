import { create } from "react-nuance";

const globalPostStore = create((set) => ({
  posts: [],

  addPosts: (posts) => {
    set((state) => {
      const oldPosts = state.posts.map((post) => post.id);
      return {
        posts: [
          ...state.posts,
          ...posts.filter((post) => !oldPosts.includes(post.id)),
        ],
      };
    });
  },

  addPost: (post) => {
    set((state) => {
      return {
        posts: [post, ...state.posts],
      };
    });
  },

  setLike: (postId) => {
    set((state) => {
      const oldpostIds = state.posts.map((post) => post.id);
      if (oldpostIds.includes(postId)) {
        return {
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  liked: !post.liked,
                  likeCount: post.liked
                    ? post.likeCount - 1
                    : post.likeCount + 1,
                }
              : post
          ),
        };
      }
    }, postId);
  },

  setComment: (postId, action) => {
    set((state) => {
      const oldpostIds = state.posts.map((post) => post.id);
      if (oldpostIds.includes(postId)) {
        switch (action) {
          case "add":
            return {
              posts: state.posts.map((post) =>
                post.id === postId
                  ? {
                      ...post,
                      commentCount: post.commentCount + 1,
                    }
                  : post
              ),
            };
          case "remove":
            return {
              posts: state.posts.map((post) =>
                post.id === postId
                  ? {
                      ...post,
                      commentCount: post.commentCount - 1,
                    }
                  : post
              ),
            };

          default:
            break;
        }
      }
    }, postId);
  },

  setBookmark: (postId) => {
    set((state) => {
      const oldpostIds = state.posts.map((post) => post.id);
      if (oldpostIds.includes(postId)) {
        return {
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  bookmarked: !post.bookmarked,
                }
              : post
          ),
        };
      }
    }, postId);
  },

  deletePost: (postId) => {
    set((state) => {
      return {
        posts: state?.posts.filter((post) => post?.id !== postId),
      };
    });
  },
}));

export default globalPostStore;
