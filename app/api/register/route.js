import client from "@/libs/prismaClient";
import sendMail from "@/libs/sendMail";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username | !password) {
      throw new Error("credentials cannot be empty");
    }

    //validation

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(email)) {
      throw new Error("invalid email ");
    }

    if (!usernameRegex.test(username)) {
      throw new Error("invalid username ");
    }

    if (!passwordRegex.test(password)) {
      throw new Error("invalid password ");
    }

    let existingUserNames = await client.user.findMany({
      select: {
        username: true,
        email: true,
      },
    });

    const emailAlreadyExists = existingUserNames.find(
      (user) => user?.email === email
    );

    if (emailAlreadyExists) {
      throw new Error("email already exits");
    }

    const usernameAlreadyExists = existingUserNames.find(
      (user) => user?.username === username
    );

    if (usernameAlreadyExists) {
      throw new Error("user name already exists");
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

    // verification token generation

    const token = crypto.randomUUID();

    const resp = await client.verification.create({
      data: {
        userId: res?.id,
        token: token,
        expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      select: {
        id: true,
      },
    });

    // console.log("token sucess ", res);

    //send token to email

    if (resp?.id) {
      const mailSend = sendMail({
        username,
        action: "verification",
        token,
        recipient: email,
      });

      if (!mailSend) {
        throw new Error("Failed to send verification token to mail");
      }
    }

    return NextResponse.json({ res }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }
};
