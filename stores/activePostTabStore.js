import { create } from "react-nuance";

const PostTabStore = create((set) => ({
  activeTab: 0,
  setActiveTab: (tab) => {
    set(() => {
      return {
        activeTab: tab,
      };
    });
  },
}));

export default PostTabStore;
