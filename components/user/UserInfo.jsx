"use client";

import followStore from "@/stores/followStore";
import followingUpdatedStore from "@/stores/followingUpdatedStore";
import userStore from "@/stores/userStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const UserInfo = ({ id, followingCount, followersCount, loggedUser }) => {
  const [followingCountNew, setfollowingCountNew] = useState(0);
  const [followersCountNew, setfollowersCountNew] = useState(0);

  let followData = followStore((state) => state.users);

  const currentUser = userStore((state) => state.loggedUser);

  const isThereUpdates = followingUpdatedStore((state) => state.isThereUpdates);

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (currentUser?.followingIds) {
      setfollowingCountNew(currentUser?.followingIds?.length || 0);
    }
  }, [currentUser, setfollowingCountNew]);

  //logged user follow someone => logged user's following count increases
  //logged user follow someone => someones's followers count increases

  useEffect(() => {
    if (isThereUpdates) {
      //update followingcount for logged  user
      if (loggedUser && followData && followData?.length) {
        setfollowingCountNew(
          followData?.filter((user) => user?.id !== id && user.following)
            ?.length || 0
        );
      }
    }
  }, [followData, loggedUser, setfollowersCountNew, isThereUpdates]);

  useEffect(() => {
    //update followerscount for other  users
    if (isThereUpdates) {
      if (followData && followData?.length > 0)
        followData = followData?.find((user) => user?.id === id);
      setfollowersCountNew(followData?.followersCount || 0);
    }
  }, [loggedUser, followData, isThereUpdates]);

  return (
    <>
      <p
        onClick={() => pathname === "/profile" && router.push("/connections")}
        className="cursor-pointer"
      >
        following{" "}
        {loggedUser
          ? followingCountNew
          : followData?.followingCount ?? followingCount}
      </p>
      <p
        onClick={() => pathname === "/profile" && router.push("/connections")}
        className="cursor-pointer"
      >
        followers {followersCountNew ? followersCountNew : followersCount}
      </p>
    </>
  );
};

export default UserInfo;
