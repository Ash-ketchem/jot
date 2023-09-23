import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import client from "@/libs/prismaClient";

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
