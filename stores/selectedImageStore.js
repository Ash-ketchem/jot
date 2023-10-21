import { create } from "react-nuance";

const selectedImageStore = create((set) => ({
  image: null,

  setImage: (img) => {
    set(() => {
      return {
        image: img,
      };
    });
  },
}));

export default selectedImageStore;
