"use client";

import followStore from "@/stores/followStore";
import followingUpdatedStore from "@/stores/followingUpdatedStore";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";

const UserCard = ({ user, isFollowing, loggedUser, showActions = true }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [UpdatedbuttonLabel, setUpdateButtonLabel] = useState(
    isFollowing ? "Unfollow" : "follow"
  );

  const followState = followStore(
    (state) => state.users.find((u) => u?.id === user?.id),
    user?.id
  );

  const router = useRouter();

  const addUser = followStore((state) => state.addUser);
  const setLoggedUserId = followStore((state) => state.setLoggedUserId);
  const setFollow = followStore((state) => state.setFollow);
  const setUpdates = followingUpdatedStore((state) => state.setUpdates);

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true);

      // follow

      if (!user?.id) {
        throw new Error("Something went wrong");
      }

      const res = await axios.post("/api/follow", {
        id: user?.id,
      });

      if (res?.status !== 200) {
        throw new Error("Something went wrong");
      }

      setFollow(
        user?.id,
        followState?.following ? false : true,
        loggedUser?.id === user?.id
      );

      setUpdates(true);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, followState?.following]);

  useEffect(() => {
    addUser(
      user?.id,
      user?.follwingIds?.length || 0,
      user?.followersCount || 0,
      followState ? followState.following : isFollowing
    );
    setFollow(
      user?.id,
      followState ? followState.following : isFollowing,
      loggedUser?.id === user?.id
    );

    setLoggedUserId(loggedUser?.id);
  }, [user?.id, setUpdates]);

  useEffect(() => {
    setUpdateButtonLabel(
      followState
        ? followState.following
          ? "Unfollow"
          : "follow"
        : isFollowing
        ? "Unfollow"
        : "follow"
    );
  }, [followState, isFollowing]);

  return (
    <div className="w-[97%] px-2 flex gap-4 justify-between items-center flex-wrap py-4">
      <div className="flex gap-5 items-center justify-evenly  flex-0 ">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full  relative">
            <Image
              src={user?.profileImage || "/images/userProfile.jpg"}
              alt="profile image"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1  border-0 ">
          <p className="text-sm">{user?.name}</p>
          <p
            className="cursor-pointer font-semibold text-xs hover:underline"
            onClick={() => router.push(`/user/${user.id}`)}
          >
            @{user?.username}
          </p>
        </div>
      </div>
      {showActions && (
        <div className="flex justify-center items-center  ">
          <button
            className="btn btn-primary btn-xs w-fit p-2 h-fit rounded-md lowercase tracking-widest"
            disabled={isLoading}
            onClick={handleClick}
          >
            {UpdatedbuttonLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
