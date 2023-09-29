import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import UserHero from "@/components/user/UserHero";
import UserFeed from "@/components/user/UserFeed";
import Scroller from "@/components/Feed/common/Scroller";

const page = async () => {
  const postsNum = 5;

  let latestPosts = [];
  let loggedUser = null;
  let bookmarks = [];
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("user not authenticated");

      // return diffrent ui
    }

    if (session?.user?.email) {
      loggedUser = await client.user.findUnique({
        where: {
          email: session.user.email,
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
    }

    const followersCount = await client.user.count({
      where: {
        followingIds: {
          has: loggedUser?.id,
        },
      },
    });

    loggedUser = {
      ...loggedUser,
      followersCount,
    };

    if (loggedUser.id) {
      latestPosts = await client.post.findMany({
        take: postsNum,

        where: {
          userId: loggedUser.id,
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
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

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
    // console.log(error);
    if (error.message === "user not authenticated") {
      redirect("/login");
    }
  }

  return (
    <>
      <Scroller>
        <div className="p-2">
          <UserHero
            user={loggedUser}
            buttonLabel="Edit"
            loggedUser={true}
            loggedUserId={loggedUser?.id}
          />

          <div className="mt-4">
            <UserFeed
              loggedUserId={loggedUser?.id}
              initialPosts={latestPosts}
              userId={loggedUser?.id}
            />
          </div>
        </div>
      </Scroller>
    </>
  );
};

export default page;
