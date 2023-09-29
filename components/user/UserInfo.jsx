"use client";

import followStore from "@/stores/followStore";

const UserInfo = ({ id, followingCount, followersCount, loggedUser }) => {
  let followData = followStore((state) => state.users);

  let followingCountNew = 0;

  if (loggedUser) {
    followingCountNew = followData?.filter((user) => user?.following)?.length;
  }

  followData = followData?.find((user) => user?.id === id);

  return (
    <>
      <p>
        following{" "}
        {loggedUser
          ? followingCountNew
          : followData?.followingCount
          ? followData?.followingCount
          : followingCount}
      </p>
      <p>
        followers{" "}
        {followData?.followersCount
          ? followData?.followersCount
          : followersCount}
      </p>
    </>
  );
};

export default UserInfo;
