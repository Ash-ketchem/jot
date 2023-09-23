import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    //paginated comments

    const commentNum = 5;

    const { postid } = params;

    if (!postid || typeof postid !== "string") {
      throw new Error("invalid postid");
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    const comments = await client.comment.findMany({
      where: {
        postId: postid,
      },
      take: -commentNum,
      skip: 1, // Skip the cursor
      cursor: {
        id: cursor,
      },
      select: {
        id: true,
        body: true,
        createdAt: true,
        postId: true,
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

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
