import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";
import sendMail from "@/libs/sendMail";

export async function POST(req) {
  try {
    const { resend } = await req.json();

    if (!resend) {
      throw new Error("something went wrong");
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("invalid session");
    }

    const user = await client.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        id: true,
        username: true,
      },
    });

    const existingToken = await client.verification.findUnique({
      where: {
        userId: user?.id,
      },
      select: {
        id: true,
        resendCount: true,
      },
    });

    if (!existingToken?.id) {
      throw new Error("Account doesnt exist");
    }

    if (existingToken?.resendCount <= 0) {
      throw {
        message: "Maximum resend limit reached",
        resendCount: existingToken?.resendCount,
      };
    }

    const token = crypto.randomUUID();

    const updatedToken = await client.verification.update({
      where: {
        id: existingToken.id,
      },
      data: {
        token: token,
        resendCount: Math.max(0, (existingToken?.resendCount || 0) - 1),
        retryCount: 3,
      },
      select: {
        id: true,
        resendCount: true,
        retryCount: true,
      },
    });

    if (!updatedToken?.id) {
      throw new Error("something went wrong");
    }

    //send token to email

    const mailSend = sendMail({
      username: user?.username || "user",
      action: "verification",
      token,
      recipient: session?.user?.email,
    });

    if (!mailSend) {
      throw new Error("Failed to send reset token to mail");
    }

    return NextResponse.json(
      {
        updatedToken,
        resendCount: updatedToken?.resendCount,
        retryCount: updatedToken?.retryCount,
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
        retryCount: error?.retryCount,
      },
      { status: 400 }
    );
  }
}
