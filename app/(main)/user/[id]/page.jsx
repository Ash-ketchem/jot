import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserFeed from "@/components/user/UserFeed";
import UserHero from "@/components/user/UserHero";
import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async ({ params }) => {
  const userId = params?.id;

  if (!userId || typeof userId !== "string") {
    return <div>No such user</div>;
  }

  const postsNum = 5;

  let latestPosts = [];
  let user = null;
  let loggedUser = null;
  let bookmarks = [];

  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      loggedUser = await client.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
          followingIds: true,
        },
      });
    }

    if (userId === loggedUser?.id) {
      throw new Error("profile page");
    }

    user = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        coverImage: true,
        profileImage: true,
        followingIds: true,
        hashNotification: true,
      },
    });

    const followersCount = await client.user.count({
      where: {
        followingIds: {
          has: userId,
        },
      },
    });

    user = {
      ...user,
      followersCount,
    };

    latestPosts = await client.post.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        body: true,
        images: true,
        likeIds: true,
        createdAt: true,
        _count: {
          select: { comments: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (loggedUser?.id) {
      bookmarks = await client.bookmark.findMany({
        where: {
          userId: loggedUser.id,
        },
        select: {
          postId: true,
        },
      });

      bookmarks = bookmarks.map((bookmark) => bookmark?.postId);

      if (bookmarks?.length) {
        latestPosts = latestPosts.map((post) =>
          bookmarks?.includes(post?.id) ? { ...post, bookmarked: true } : post
        );
      }
    }
  } catch (error) {
    console.log(error);

    if (error.message === "profile page") {
      console.log("redirect");
      redirect("/profile");
    }
  }
  return (
    <>
      <div className="p-2">
        <UserHero
          user={user}
          loggedUser={false}
          buttonLabel="Follow"
          isFollowing={loggedUser?.followingIds?.includes(user?.id)}
        />

        <div className="mt-4">
          <UserFeed
            loggedUserId={loggedUser?.id || null}
            initialPosts={latestPosts}
            userId={user?.id}
          />
        </div>
      </div>
    </>
  );
};

export default page;
