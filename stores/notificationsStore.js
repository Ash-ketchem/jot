import { create } from "react-nuance";

const notificationStore = create((set) => ({
  notificationsAvailable: false,

  setNotificationsAvailable: (status) => {
    set(() => {
      return {
        notificationsAvailable: status,
      };
    });
  },
}));

export default notificationStore;
