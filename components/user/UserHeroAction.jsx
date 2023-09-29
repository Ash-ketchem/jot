"use client";

import followStore from "@/stores/followStore";
import modalStore from "@/stores/modalStore";
import axios from "axios";
import { useCallback, useState, useEffect } from "react";

const UserHeroAction = ({
  buttonLabel,
  loggedUser,
  userId,
  isFollowing,
  followingCount,
  followersCount,
  loggedUserId,
}) => {
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
  const setLoggedUserId = followStore((state) => state.setLoggedUserId);
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

        const res = await axios.post("/api/follow", {
          id: userId,
        });

        if (res?.status !== 200) {
          throw new Error("Something went wrong");
        }
        console.log(userId, followState?.following ? false : true, loggedUser);
        setFollow(userId, followState?.following ? false : true, loggedUser);
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsLoading(false);
    }
  }, [loggedUser, followState?.following, openEditModal]);

  useEffect(() => {
    addUser(
      userId,
      followingCount || 0,
      followersCount || 0,
      followState ? followState.following : isFollowing
    );
    setLoggedUserId(loggedUserId);
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
