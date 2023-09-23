import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    //paginated posts

    const postsNum = 5;

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    if (!cursor || typeof cursor !== "string") {
      throw new Error("invaid cursor value");
    }

    const posts = await client.post.findMany({
      take: -postsNum,
      skip: 1, // Skip the cursor
      cursor: {
        id: cursor,
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
        createdAt: "asc",
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: " failed to fetch posts" },
      { status: 400 }
    );
  }
}
