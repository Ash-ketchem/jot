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

    const comments = await client.comment.findMany({
      where: {
        postId: postid,
      },
      take: commentNum,
      skip: 1, // Skip the cursor

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
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}
