import client from "@/libs/prismaClient";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username | !password) {
      throw new Error("credentials cannot be empty");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw new Error("invalid email ");
    }

    const existingUserNames = await client.user
      .findMany({
        select: {
          username: true,
        },
      })
      ?.map((user) => user?.username);

    const usernameAlreadyExists = existingUserNames.find(
      (name) => name === username
    );

    if (usernameAlreadyExists) {
      throw new Error("user name already exixts");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const res = await client.user.create({
      data: {
        username,
        email,
        hashedPassword,
      },
      select: {
        id: true,
      },
    });

    if (!res?.id) {
      throw new Error("something went wrong");
    }
    return NextResponse.json({ res }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
};
