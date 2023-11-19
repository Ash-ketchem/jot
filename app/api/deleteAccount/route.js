import cloudinary from "@/libs/cloudinaryConfig";
import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function DELETE(req) {
  const { verificationToken: token } = await req.json();

  console.log(token, "token");

  try {
    if (!token || typeof token !== "string") {
      throw new Error("invalid token");
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }

    const loggedUser = await client.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        id: true,
      },
    });

    const tokenData = await client.verification.findUnique({
      where: {
        userId: loggedUser?.id,
      },
    });

    if (!tokenData?.token) {
      throw new Error("something went wrong");
    }

    if (tokenData?.retryCount <= 0) {
      throw {
        message: "maximum retries reached",
        retryCount: tokenData?.retryCount,
      };
    }

    if (token !== tokenData?.token) {
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

    const accountDeleted = await client.user.delete({
      where: {
        id: loggedUser?.id,
      },
      select: {
        id: true,
      },
    });

    // delete the likes of deleted account id from other posts

    if (!accountDeleted?.id) {
      throw new Error("Account couldnt be deleted");
    }

    return NextResponse.json(accountDeleted, {
      status: 200,
    });
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
