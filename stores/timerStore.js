import { create } from "react-nuance";

const timerStore = create((set) => ({
  timer: {
    h: 0,
    m: 0,
    timerId: null,
  },

  startTimer: (timer) => {
    set(() => {
      return {
        timer: timer,
      };
    });
  },
  stopTimer: () => {
    set(() => {
      return {
        timer: {
          h: 0,
          m: 0,
        },
      };
    });
  },
  setTimerId: (id) => {
    set((state) => {
      return {
        timer: {
          timerId: id,
          ...state?.timer,
        },
      };
    });
  },
  setTakeaBreak: (takeaBreak) => {
    console.log("called ", takeaBreak);
    set((state) => {
      return {
        timer: {
          takeaBreak: takeaBreak,
          ...state?.timer,
        },
      };
    });
  },
}));

export default timerStore;
