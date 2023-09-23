"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import userStore from "@/stores/userStore";
import { useEffect } from "react";

const SyncClient = () => {
  // synchronizing client stores

  const { data: loggedUser } = useCurrentUser("med");

  const setUser = userStore((state) => state.setUser);

  useEffect(() => {
    if (loggedUser?.email) {
      setUser(loggedUser);
    }
  }, [loggedUser?.email]);

  return null;
};

export default SyncClient;
