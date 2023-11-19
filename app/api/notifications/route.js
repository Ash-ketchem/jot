import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const count = 5;
    let posts = [];

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid session");
    }

    const loggedUser = await client.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        id: true,
      },
    });

    if (!loggedUser?.id) {
      throw new Error("invalid user");
    }

    if (!cursor) {
      posts = await client.notification.findMany({
        take: count,

        where: {
          userId: loggedUser?.id,
        },

        select: {
          id: true,
          body: true,
          createdAt: true,
          triggeringUser: {
            select: {
              id: true,
              username: true,
              profileImage: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      posts = await client.notification.findMany({
        take: count,
        skip: 1, // Skip the cursor
        cursor: {
          id: cursor,
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          triggeringUser: {
            select: {
              id: true,
              username: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
