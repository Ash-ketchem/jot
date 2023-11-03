import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";
import sendMail from "@/libs/sendMail";

export async function POST(req) {
  let status = null;

  try {
    const { token, email } = await req.json();

    if (!token) {
      throw new Error("invalid token");
    }

    const session = await getServerSession(authOptions);

    if (!email && !session?.user?.email) {
      throw new Error("invalid session");
    }

    const user = await client.user.findUnique({
      where: {
        email: session?.user?.email ?? email,
      },
      select: {
        id: true,
        emailVerified: true,
        username: true,
      },
    });

    if (!user?.id) {
      throw new Error("User doesn't exist");
    }

    if (!user?.emailVerified) {
      throw new Error("User not verified");
    }

    const tokenData = await client.verification.findUnique({
      where: {
        userId: user?.id,
      },
    });

    if (!tokenData?.token) {
      // verification token generation

      const token = crypto.randomUUID();

      const resp = await client.verification.create({
        data: {
          userId: user?.id,
          token: token,
        },
        select: {
          id: true,
        },
      });

      //send token to email

      if (resp?.id) {
        const mailSend = sendMail({
          username: user?.username || "user",
          action: "reset",
          token,
          recipient: session?.user?.email,
        });

        if (!mailSend) {
          throw new Error("Failed to send reset token to mail");
        }
      }
    }

    if (tokenData?.retryCount <= 0) {
      // deleting timed out tokens
      const deletedToken = await client.verification.delete({
        where: {
          id: tokenData.id,
        },
        select: {
          id: true,
        },
      });

      status =
        "maximum retries reached.For your security, a new token is being generated";

      return NextResponse.json(
        {
          status: status || "token generated",
        },
        { status: 200 }
      );
    }

    if (tokenData?.token) {
      // we have a token that can be used
      throw {
        message: "Use the recent token sent by email",
        retryCount: tokenData?.retryCount,
      };
    }

    return NextResponse.json(
      {
        status: "token generated",
      },
      { status: 200 }
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
