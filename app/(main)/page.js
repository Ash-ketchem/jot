import Feed from "@/components/Feed/global/Feed";
import Stories from "@/components/story/Stories";
import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import getUserId from "@/libs/getUserId";
import Scroller from "@/components/Feed/common/Scroller";

export default async function Home() {
  const postsNum = 10;

  const session = await getServerSession(authOptions);

  let loggedUserId = null;

  // let bookmarks = null;

  let latestPosts = [];
  let bookmarks = [];

  if (session?.user?.email) {
    loggedUserId = await getUserId(session.user.email);
  }

  try {
    latestPosts = await client.post.findMany({
      take: postsNum,

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

    if (loggedUserId) {
      bookmarks = await client.bookmark.findMany({
        where: {
          userId: loggedUserId,
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
  }
  return (
    <>
      <Scroller>
        <div className="relative h-full">
          {/* main */}
          <Stories />

          {/* global feed */}
          <Feed initialPosts={latestPosts} loggedUserId={loggedUserId} />
        </div>
      </Scroller>
    </>
  );
}
