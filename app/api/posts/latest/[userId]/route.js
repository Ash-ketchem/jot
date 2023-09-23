import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    //paginated posts

    const postsNum = 5;

    const { userId } = params;

    if (!userId || typeof userId !== "string") {
      throw new Error("invaid userId");
    }

    const posts = await client.post.findMany({
      where: {
        userId: userId,
      },
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

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
