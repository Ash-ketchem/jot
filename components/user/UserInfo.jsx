"use client";

import followStore from "@/stores/followStore";
import { useEffect, useRef, useState } from "react";

const UserInfo = ({ id, followingCount, followersCount, loggedUser }) => {
  const [followingCountNew, setfollowingCountNew] = useState(0);
  const [followersCountNew, setfollowersCountNew] = useState(0);

  let followData = followStore((state) => state.users);

  useEffect(() => {
    //logged user follow someone => logged user's following count increases
    //logged user follow someone => someones's followers count increases

    //update followingcount for logged  user
    if (loggedUser && followData) {
      setfollowingCountNew(
        followData?.filter((user) => user?.id !== id && user.following)
          ?.length || 0
      );
    }

    //update followerscount for other  users
    if (followData && followData?.length > 0)
      followData = followData?.find((user) => user?.id === id);
    setfollowersCountNew(followData?.followersCount || 0);
  }, [loggedUser, followData]);

  return (
    <>
      <p>
        following{" "}
        {loggedUser
          ? followingCountNew
          : followData?.followingCount ?? followingCount}
      </p>
      <p>followers {followersCountNew ? followersCountNew : followersCount}</p>
    </>
  );
};

export default UserInfo;
