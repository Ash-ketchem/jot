import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let userExists = false;

    const { email, username } = await req.json();

    if (!username && !email) {
      throw new Error("invalid credentials");
    }

    if (username && !usernameRegex.test(username)) {
      throw new Error("invalid username format");
    }
    if (email && !EmailRegex.test(email)) {
      throw new Error("invalid email format");
    }

    let existingUser = null;

    if (username) {
      existingUser = await client.user.findUnique({
        where: {
          username: username,
        },
        select: {
          id: true,
        },
      });
    } else {
      existingUser = await client.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
        },
      });
    }

    if (existingUser?.id) {
      userExists = true;
    }

    return NextResponse.json(
      {
        userExists,
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
