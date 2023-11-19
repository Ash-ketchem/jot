import { create } from "react-nuance";

const followingUpdatedStore = create((set) => ({
  isThereUpdates: false,
  setUpdates: (updateStatus) => {
    set(() => {
      return {
        isThereUpdates: updateStatus,
      };
    });
  },
}));

export default followingUpdatedStore;
