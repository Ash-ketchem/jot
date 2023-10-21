import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const count = 5;
    let users = [];

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const query = searchParams.get("query").trim().toLocaleLowerCase();

    if (!cursor) {
      users = await client.user.findMany({
        take: count,
        where: {
          OR: [
            {
              username: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
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

      // console.log(users);
    } else {
      users = await client.user.findMany({
        skip: 1,
        cursor: {
          id: cursor,
        },
        take: count,
        where: {
          OR: [
            {
              username: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
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

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
