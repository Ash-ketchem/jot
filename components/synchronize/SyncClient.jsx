"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import userStore from "@/stores/userStore";
import { useEffect } from "react";

const SyncClient = () => {
  // synchronizing client stores

  const type = "med";

  const { data: loggedUser } = useCurrentUser(type);

  const setUser = userStore((state) => state.setUser);

  useEffect(() => {
    if (loggedUser?.email) {
      setUser(loggedUser);
    }
  }, [loggedUser?.email]);

  return null;
};

export default SyncClient;
