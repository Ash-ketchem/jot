import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("invalid session");
  }

  try {
    const { id: userId } = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    const { postId } = await req.json();

    if (!postId || typeof postId !== "string") {
      throw new Error("invalid post");
    }

    if (!userId || typeof userId !== "string") {
      throw new Error("invalid user");
    }

    const { likeIds, uniqueId } = await client.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likeIds: true,
        uniqueId: true,
      },
    });

    //replace this with raw mongodb queries in the  latest code
    // const updatedPost = await client.post.update({
    //   where: {
    //     id: postId,
    //   },
    //   data: {
    //     likeIds: likeIds.includes(userId)
    //       ? likeIds.filter((id) => id !== userId)
    //       : [...likeIds, userId],
    //   },
    //   select: {
    //     id: true,
    //   },
    // });

    // LATEST CODE TO BE UPDATED

    let updatedPost = null;

    if (likeIds.includes(userId)) {
      //unlike by deleting from array

      updatedPost = await client.$runCommandRaw({
        update: "Post",
        updates: [
          {
            q: { uniqueId: uniqueId }, // Query conditions (empty object matches all documents)
            u: {
              $pull: {
                likeIds: userId,
              },
            },
          },
        ],
      });
    } else {
      //like

      updatedPost = await client.post.update({
        where: {
          id: postId,
        },
        data: {
          likeIds: {
            push: userId,
          },
        },
        select: {
          id: true,
        },
      });
    }

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error?.message || error },
      { status: 400 }
    );
  }
}
