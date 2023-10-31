import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";
import sendMail from "@/libs/sendMail";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const { newPassword, verificationToken, email } = await req.json();

    if (
      !newPassword ||
      typeof newPassword !== "string" ||
      !passwordRegex.test(newPassword)
    ) {
      throw new Error("invalid password");
    }

    if (!verificationToken && typeof verificationToken !== "string") {
      throw new Error("invalid verification token");
    }

    const session = await getServerSession(authOptions);

    if (!session && !email) {
      throw new Error("invalid session");
    }

    const user = await client.user.findUnique({
      where: {
        email: session?.user?.email ?? email,
      },
      select: {
        id: true,
      },
    });

    const tokenData = await client.verification.findUnique({
      where: {
        userId: user?.id,
      },
    });

    if (!tokenData?.token) {
      throw new Error("something went wrong");
    }

    // if (Date.now() > tokenData?.expirationTime) {
    //   //deleting token
    //   const deletedToken = await client.verification.delete({
    //     where: {
    //       id: tokenData.id,
    //     },
    //     select: {
    //       id: true,
    //     },
    //   });
    //   throw {
    //     message: "token has expired",
    //     retryCount: -1,
    //   };
    // }

    if (tokenData?.retryCount <= 0) {
      throw {
        message: "maximum retries reached",
        retryCount: tokenData?.retryCount,
      };
    }

    if (verificationToken !== tokenData?.token) {
      const updatedToken = await client.verification.update({
        where: {
          id: tokenData.id,
        },
        data: {
          retryCount: Math.max(tokenData.retryCount - 1, 0),
        },
        select: {
          retryCount: true,
        },
      });

      if (updatedToken?.retryCount <= 0) {
        const deletedToken = await client.verification.delete({
          where: {
            id: tokenData.id,
          },
          select: {
            id: true,
          },
        });
      }

      throw {
        message: "invalid Token",
        retryCount: updatedToken?.retryCount,
      };
    }

    //sucess

    const deletedToken = await client.verification.delete({
      where: {
        id: tokenData.id,
      },
      select: {
        id: true,
      },
    });

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await client.user.update({
      where: {
        email: session?.user?.email ?? email,
      },
      data: {
        hashedPassword,
      },
      select: {
        id: true,
      },
    });

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
        retryCount: error?.retryCount,
      },
      { status: 400 }
    );
  }
}
