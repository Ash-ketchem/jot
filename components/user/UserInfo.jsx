"use client";

import followStore from "@/stores/followStore";

const UserInfo = ({ followingCount, followersCount }) => {
  let followersCountFromStore = followStore((state) => state.users);

  followersCountFromStore =
    followersCountFromStore.filter((user) => user?.following)?.length || null;

  return (
    <>
      <p>following {followersCountFromStore ?? followingCount}</p>
      <p>followers {followersCount}</p>
    </>
  );
};

export default UserInfo;
