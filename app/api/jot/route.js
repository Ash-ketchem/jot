import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { body, images } = await req.json();

    if (images && typeof images !== typeof []) {
      throw new Error("images must b an array");
    }

    if (typeof body !== "string") {
      throw new Error("invalid post body");
    }

    if (!body && !images?.length) {
      throw new Error("post can't be empty");
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("invalid session");
    }

    const { id: userId } = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    const post = await client.post.create({
      data: {
        body,
        userId: userId,
        images: images ? images : [],
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
    });

    return NextResponse.json(post, {
      status: 200,
    });
  } catch (error) {
    console.log("error while creating a post", error);
    return NextResponse.json(
      {
        error: "error while creating a post",
      },
      {
        status: 400,
      }
    );
  }
}
