"use client";

import followStore from "@/stores/followStore";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";

const UserCard = ({ user, isFollowing }) => {
  const [isLoading, setIsLoading] = useState(false);

  const followState = followStore(
    (state) => state.users.find((u) => u?.id === user?.id),
    user?.id
  );

  const addUser = followStore((state) => state.addUser);
  const setFollow = followStore((state) => state.setFollow);

  const UpdatedbuttonLabel = followState
    ? followState.following
      ? "Unfollow"
      : "follow"
    : isFollowing
    ? "Unfollow"
    : "follow";

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true);

      // follow

      if (!user?.id) {
        throw new Error("Something went wrong");
      }

      setFollow(user?.id, followState?.following ? false : true);

      const res = await axios.post("/api/follow", {
        id: user?.id,
      });

      if (res?.status !== 200) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error?.message);
      setFollow(user?.id, followState?.following ? true : false);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, followState?.following]);

  useEffect(() => {
    addUser(user?.id);
    setFollow(user?.id, isFollowing ? true : false);
  }, [user?.id]);

  return (
    <div className="w-full p-0 flex gap-4 border-0 justify-evenly items-center flex-wrap py-4  ">
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
        <div className="flex flex-col gap-1  border-0">
          <p className="text-sm">{user?.name}</p>
          <Link href={`/user/${user.id}`}>
            <p className="cursor-pointer font-semibold text-xs hover:underline">
              @{user?.username}
            </p>
          </Link>
        </div>
      </div>
      <div className="flex justify-center items-center  ">
        <button
          className="btn btn-primary btn-xs w-fit p-2 h-fit rounded-md lowercase tracking-widest"
          disabled={isLoading}
          onClick={handleClick}
        >
          {UpdatedbuttonLabel}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
