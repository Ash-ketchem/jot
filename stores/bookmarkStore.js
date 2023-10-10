import { create } from "react-nuance";

const bookmarkStore = create((set) => ({
  bookmarkIds: [], // we store the post ids
  bookmarks: [],

  addBookmarks: (bookmarks) => {
    set((state) => {
      const currentBookmarks = state.bookmarks.map((bookmark) => bookmark?.id);
      return {
        bookmarks: [
          ...state.bookmarks,
          ...bookmarks.filter(
            (bookmark) => !currentBookmarks?.includes(bookmark?.id)
          ),
        ],
      };
    });
  },

  addBookmarkIds: (bookmarks) => {
    set((state) => {
      return {
        bookmarkIds: [
          ...state.bookmarkIds,
          ...bookmarks.filter(
            (bookmark) => !state.bookmarkIds.includes(bookmark)
          ),
        ],
      };
    });
  },

  addBookmark: (bookmark) => {
    set((state) => {
      if (state.bookmarkIds.includes(bookmark?.id)) {
        return;
      }

      return {
        bookmarks: [bookmark, ...state.bookmarks],
      };
    });
  },
  addBookmarkId: (bookmark) => {
    set((state) => {
      if (state.bookmarkIds.includes(bookmark?.id)) {
        return;
      }

      return {
        bookmarkIds: [bookmark, ...state.bookmarkIds],
      };
    });
  },

  removeBookmark: (postId) => {
    set((state) => {
      return {
        bookmarks: state.bookmarks.filter(
          (bookmark) => bookmark?.post?.id !== postId
        ),
      };
    });
  },
  removeBookmarkId: (postId) => {
    set((state) => {
      return {
        bookmarkIds: state.bookmarkIds.filter(
          (bookmark) => bookmark !== postId
        ),
      };
    });
  },

  removeBookmarks: () => {
    set(() => {
      return {
        bookmarks: [],
      };
    });
  },
  removeBookmarkIds: () => {
    set(() => {
      return {
        bookmarkIds: [],
      };
    });
  },
}));

export default bookmarkStore;
