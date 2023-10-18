import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;

    let usernameAvailable = false;

    const { username } = await req.json();

    if (!username || typeof username !== "string") {
      throw new Error("invalid user name");
    }

    if (!usernameRegex.test(username)) {
      throw new Error("invalid username format");
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("invalid session");
    }

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

    return NextResponse.json(
      {
        usernameAvailable,
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
