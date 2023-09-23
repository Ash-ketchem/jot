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

        select: {
          id: true,
          name: true,
          username: true,
          profileImage: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      posts = await client.user.findMany({
        take: count,
        skip: 1, // Skip the cursor
        cursor: {
          id: cursor,
        },
        select: {
          id: true,
          name: true,
          username: true,
          profileImage: true,
        },
      });
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
