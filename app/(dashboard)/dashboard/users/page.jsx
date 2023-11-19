import HeaderLogin from "@/components/common/HeaderLogin";
import UserCard from "@/components/dashbaord/users/UserCard";
import client from "@/libs/prismaClient";
import React from "react";

const page = async () => {
  let users = await client.user.findMany({
    select: {
      id: true,
      username: true,
      followingIds: true,
      email: true,
      emailVerified: true,
      profileImage: true,
      _count: {
        select: {
          posts: true,
          comments: true,
          bookmarks: true,
        },
      },
    },
  });

  const followingIds = users.flatMap((user) => user?.followingIds);

  users = users.reduce((accumulator, user) => {
    if (!accumulator[user?.id]) {
      accumulator[user?.id] = {
        username: user?.username,
        following: user?.followingIds?.length || 0,
        email: user?.email,
        emailVerified: user?.emailVerified,
        posts: user?._count?.posts,
        comments: user?._count?.comments,
        bookmarks: user?._count?.bookmarks,
        followers: followingIds?.filter((id) => id === user?.id)?.length || 0,
        profileImage: user?.profileImage,
      };
    }
    return accumulator;
  }, {});

  return (
    <div className="w-full min-h-[80vh]">
      <HeaderLogin showBackArrow={true} />
      <div className="h-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 p-4 gap-4 w-full">
        {Object.entries(users)?.map((user) => (
          <div key={user[0]}>
            <UserCard user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
