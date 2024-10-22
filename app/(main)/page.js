import Stories from "@/components/story/Stories";
import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import getUserId from "@/libs/getUserId";
import Scroller from "@/components/common/Scroller";
import FeedTab from "@/components/Feed/common/FeedTab";
import { redirect } from "next/navigation";

export default async function Home() {
  const postsNum = 10;

  const session = await getServerSession(authOptions);

  if (session?.user?.email && !session?.user?.emailVerified) {
    redirect("/verification");
  }

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
          <Stories loggedUserId={loggedUserId} />

          {/* global feed */}
          <FeedTab initialPosts={latestPosts} loggedUserId={loggedUserId} />
        </div>
      </Scroller>
    </>
  );
}
