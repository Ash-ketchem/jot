import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { postId } = await req.json();

    if (!postId || typeof postId !== "string") {
      throw new Error("invalid postId");
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("no session found");
    }

    const { id } = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    const bookmarkExists = await client.bookmark.findFirst({
      where: {
        userId: id,
        postId: postId,
      },
      select: {
        id: true,
      },
    });

    if (bookmarkExists?.id) {
      throw new Error("bookmark already exist");
    }

    const bookmark = await client.bookmark.create({
      data: {
        userId: id,
        postId,
      },
      select: {
        id: true,
        post: {
          select: {
            id: true,
            body: true,
            images: [],
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(bookmark, {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "error on bookmarking post",
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(req) {
  let bookmarks = [];
  const count = 5;
  try {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    if (!session?.user?.email) {
      throw new Error("no session found");
    }

    const { id } = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!cursor) {
      bookmarks = await client.bookmark.findMany({
        where: {
          userId: id,
        },

        select: {
          postId: true,
        },
      });

      return NextResponse.json(
        bookmarks.map((bookmark) => bookmark?.postId),
        {
          status: 200,
        }
      );
    }

    if (cursor === "latest") {
      bookmarks = await client.bookmark.findMany({
        where: {
          userId: id,
        },
        take: -count,

        select: {
          id: true,
          post: {
            select: {
              id: true,
              body: true,
              images: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      });
    } else if (cursor) {
      bookmarks = await client.bookmark.findMany({
        take: -count,
        skip: 1,
        cursor: {
          id: cursor,
        },

        where: {
          userId: id,
        },

        select: {
          id: true,
          post: {
            select: {
              id: true,
              body: true,
              images: [],
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json(bookmarks, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("no session found");
    }

    const { id } = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    const { postId } = await req.json();

    if (!postId || typeof postId !== "string") {
      throw new Error("invalid postid");
    }

    const res = await client.bookmark.deleteMany({
      where: {
        userId: id,
        postId: postId,
      },
    });

    if (!res?.count) {
      throw new Error("something went wrong");
    }

    return NextResponse.json(res, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}
