import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import client from "@/libs/prismaClient";
import axios from "axios";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid sessioon");
    }

    const { postId, body } = await req.json();

    if (!postId || typeof postId !== "string") {
      throw new Error("invalid postid");
    }

    if (!body || typeof body !== "string") {
      throw new Error("invalid post body");
    }

    const { id: userId } = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!userId) {
      throw new Error("missing fields");
    }

    const { userId: postOwnerId } = await client.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!postOwnerId) {
      throw new Error("Post doesn't exists");
    }

    const comment = await client.comment.create({
      data: {
        body,
        postId,
        userId,
      },
      include: {
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

    if (!comment) {
      throw new Error("failed to create a comment");
    }

    //comment notification

    try {
      const notification = await client.notification.create({
        data: {
          userId: postOwnerId,
          body: "commented on your post",
          triggeringUserId: userId,
        },
        select: {
          id: true,
        },
      });

      const res = await axios.post("http://localhost:3001/emit", {
        eventType: "notification",
        userId: postOwnerId,
      });
    } catch (error) {
      console.log(error);
    }

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid sessioon");
    }

    const { id } = await req.json(); //comment id

    const { id: userId } = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!id || !userId || typeof userId !== "string") {
      throw new Error("missing fields");
    }

    const commentToBeDeletd = await client.comment.findUnique({
      where: {
        id: id,
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
        post: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (
      !(
        commentToBeDeletd?.user?.id === userId ||
        commentToBeDeletd?.post?.userId === userId
      )
    ) {
      throw new Error("User not authorized");
    }

    const comment = await client.comment.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });

    if (!comment) {
      throw new Error("failed to delete a comment");
    }

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
