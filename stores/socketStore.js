import { create } from "react-nuance";

const socketStore = create((set) => ({
  socket: null,

  setSocket: (socketObj) => {
    set(() => {
      return {
        socket: socketObj,
      };
    });
  },
}));

export default socketStore;
