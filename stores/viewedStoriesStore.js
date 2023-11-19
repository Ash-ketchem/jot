import { add } from "date-fns";
import { create } from "react-nuance";

const viewdStoryStore = create((set) => ({
  StoryIds: new Set(),

  viewStory: (storyIds) => {
    set((state) => {
      return {
        StoryIds: new Set([...storyIds, ...state.StoryIds]),
      };
    });
  },

  removeStories: () => {
    set(() => {
      return {
        StoryIds: new Set(),
      };
    });
  },
}));

export default viewdStoryStore;
