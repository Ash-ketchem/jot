"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import followStore from "@/stores/followStore";
import userStore from "@/stores/userStore";
import { useEffect } from "react";

const SyncClient = () => {
  // synchronizing client stores

  const type = "med";

  const { data: loggedUser } = useCurrentUser(type);

  const setUser = userStore((state) => state.setUser);

  const setFollow = followStore((state) => state.setFollow);

  useEffect(() => {
    if (loggedUser?.email) {
      setUser(loggedUser);

      // following user ids of logged user
      for (const id of loggedUser?.followingIds) {
        setFollow(id, true, loggedUser?.id === id);
      }
    }
  }, [loggedUser?.email]);

  return null;
};

export default SyncClient;
