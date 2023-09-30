import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid session");
    }

    const user = await client.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        followingIds: true,
      },
    });

    return NextResponse.json(user, {
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
