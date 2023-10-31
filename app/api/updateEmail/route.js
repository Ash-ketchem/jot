import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";
import sendMail from "@/libs/sendMail";

export async function POST(req) {
  try {
    let emailAvaialable = false;
    let updatedUser = null;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const { email } = await req.json();

    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
      throw new Error("invalid email");
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("invalid session");
    }

    // check if username already exists

    const user = await client.user.findUnique({
      where: {
        email: email,
      },
      select: {
        email: true,
      },
    });

    if (!user) {
      emailAvaialable = true;
    }

    if (!emailAvaialable) {
      throw new Error("email linked to another account");
    }

    updatedUser = await client.user.update({
      where: {
        email: session?.user?.email,
      },
      data: {
        email,
        emailVerified: false,
      },
      select: {
        id: true,
        username: true,
      },
    });

    // verification token generation

    const token = crypto.randomUUID();

    const resp = await client.verification.create({
      data: {
        userId: updatedUser?.id,
        token: token,
      },
      select: {
        id: true,
      },
    });

    //send token to email

    if (resp?.id) {
      const mailSend = sendMail({
        username: updatedUser?.username || "",
        action: "verification",
        token,
        recipient: email,
      });

      if (!mailSend) {
        throw new Error("Failed to send verification token to mail");
      }
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
