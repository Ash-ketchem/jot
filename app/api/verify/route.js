import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("invalid session");
  }

  let updatedUser = null;

  try {
    const { token } = await req.json();

    if (!token) {
      throw new Error("invalid token");
    }

    const user = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        emailVerified: true,
      },
    });

    if (!user?.id) {
      throw new Error("User desont exist");
    }

    const tokenData = await client.verification.findUnique({
      where: {
        userId: user?.id,
      },
    });

    if (!tokenData?.token) {
      throw new Error("something went wrong");
    }

    // if (Date.now() > tokenData?.expirationTime) {
    //   // delete user from user table

    //   const deletedUser = await client.user.delete({
    //     where: {
    //       id: tokenData.userId,
    //     },
    //     select: {
    //       id: true,
    //     },
    //   });
    //   throw new Error("token has expired");
    // }

    if (tokenData?.retryCount <= 0) {
      throw new Error("maximum retries reached");
    }

    if (token === tokenData.token) {
      updatedUser = await client.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: true,
        },
        select: {
          id: true,
        },
      });

      const deletedToken = await client.verification.delete({
        where: {
          id: tokenData.id,
        },
        select: {
          id: true,
        },
      });
    } else {
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

      if (updatedToken.retryCount <= 0) {
        // delete user from user table
        const deletedUser = await client.user.delete({
          where: {
            id: tokenData.userId,
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

    return NextResponse.json(updatedUser, { status: 200 });
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
