import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const count = 5;
    let posts = [];

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    if (!cursor) {
      posts = await client.user.findMany({
        take: count,
        where: {
          role: "user",
          emailVerified: true,
        },

        select: {
          id: true,
          name: true,
          username: true,
          profileImage: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      });
    } else {
      posts = await client.user.findMany({
        take: count,
        skip: 1, // Skip the cursor
        cursor: {
          id: cursor,
        },
        where: {
          role: "user",
          emailVerified: true,
        },
        select: {
          id: true,
          name: true,
          username: true,
          profileImage: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
