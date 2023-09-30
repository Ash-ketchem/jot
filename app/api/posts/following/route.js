import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid session");
    }
    //paginated posts

    const postsNum = 5;
    let posts = [];

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    console.log(cursor, typeof cursor);

    const currentUser = await client.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        id: true,
        followingIds: true,
      },
    });

    // console.log(currentUser);

    const selectObject = {
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
    };

    if (!cursor) {
      posts = await client.post.findMany({
        where: {
          userId: {
            in: currentUser?.followingIds || [],
          },
        },
        select: selectObject,
        orderBy: {
          createdAt: "desc",
        },
        take: postsNum,
      });
    } else {
      posts = await client.post.findMany({
        where: {
          userId: {
            in: currentUser?.followingIds || [],
          },
        },
        select: selectObject,
        orderBy: {
          createdAt: "desc",
        },
        skip: 1, // Skip the cursor
        cursor: {
          id: cursor,
        },
        take: postsNum,
      });
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: " failed to fetch posts" },
      { status: 400 }
    );
  }
}
