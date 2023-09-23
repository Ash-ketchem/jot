import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // id of the userr to follow
    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      throw new Error("invalid user id");
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid session");
    }

    const { id: loggedUserId, followingIds } = await client.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        id: true,
        followingIds: true,
      },
    });

    if (id === loggedUserId) {
      throw new Error("cannot follow yourself");
    }

    const updatedFollowingIds = followingIds?.includes(id)
      ? followingIds.filter((followingId) => followingId !== id)
      : [id, ...followingIds];

    const updatedUser = await client.user.update({
      where: {
        id: loggedUserId,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(updatedUser, {
      status: 200,
    });
  } catch (error) {
    console.log("error while creating a post", error);
    return NextResponse.json(
      {
        error: "error while following  a user",
      },
      {
        status: 400,
      }
    );
  }
}
