import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("Invalid session");
    }

    let selectObject = {};

    switch (type) {
      case "min":
        selectObject = {
          id: true,
          name: true,
          username: true,
          email: true,
        };
        break;
      case "med":
        selectObject = {
          id: true,
          name: true,
          username: true,
          email: true,
          bio: true,
          coverImage: true,
          profileImage: true,
          followingIds: true,
          hasNotification: true,
        };
        break;
    }

    const loggedUser = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: selectObject,
    });

    if (!loggedUser?.email) {
      throw new Error("user doesn't exist");
    }

    return NextResponse.json(loggedUser, {
      status: 200,
    });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ error }, { status: 200 });
  }
}
