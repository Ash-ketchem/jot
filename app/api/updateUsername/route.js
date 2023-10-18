import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    let usernameAvailable = false;
    let updatedUser = null;

    const { username } = await req.json();

    const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;

    if (!username || typeof username !== "string") {
      throw new Error("invalid user name");
    }

    if (!usernameRegex.test(username)) {
      throw new Error("invalid user name");
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("invalid session");
    }

    // check if username already exists

    const user = await client.user.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
      },
    });

    if (!user) {
      usernameAvailable = true;
    }

    if (usernameAvailable) {
      updatedUser = await client.user.update({
        where: {
          email: session?.user?.email,
        },
        data: {
          username: username,
        },
        select: {
          id: true,
        },
      });
    } else {
      throw new Error("username already exists");
    }

    return NextResponse.json(
      {
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: error?.message || "something went wrong",
      },
      { status: 400 }
    );
  }
}
