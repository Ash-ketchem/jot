"use client";

import followStore from "@/stores/followStore";
import modalStore from "@/stores/modalStore";
import axios from "axios";
import { useCallback, useState, useEffect } from "react";

const UserHeroAction = ({ buttonLabel, loggedUser, userId, isFollowing }) => {
  // console.log(isFollowing, " is following");
  const [isLoading, setIsLoading] = useState(false);

  const followState = followStore(
    (state) => state.users.find((user) => user?.id === userId),
    userId
  );

  const openEditModal = modalStore((state) => state.openEditModal);

  const UpdatedbuttonLabel = loggedUser
    ? buttonLabel
    : followState
    ? followState?.following
      ? "Unfollow"
      : "follow"
    : isFollowing
    ? "Unfollow"
    : "follow";

  const addUser = followStore((state) => state.addUser);
  const setFollow = followStore((state) => state.setFollow);

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true);

      if (loggedUser) {
        // edit user profile
        openEditModal();
      } else {
        // follow

        if (!userId) {
          throw new Error("Something went wrong");
        }

        setFollow(userId, followState?.following ? false : true);

        const res = await axios.post("/api/follow", {
          id: userId,
        });

        if (res?.status !== 200) {
          throw new Error("Something went wrong");
        }
      }
    } catch (error) {
      console.log(error?.message);
      setFollow(userId, followState?.following ? true : false);
    } finally {
      setIsLoading(false);
    }
  }, [loggedUser, followState?.following, openEditModal]);

  useEffect(() => {
    addUser(userId);
    setFollow(userId, isFollowing ? true : false);
  }, [userId]);

  return (
    <button
      className="btn btn-square  btn-primary w-auto p-4 text-sm leading-relaxed h-auto lowercase tracking-wide"
      onClick={handleClick}
      disabled={isLoading}
    >
      {UpdatedbuttonLabel}
    </button>
  );
};

export default UserHeroAction;
