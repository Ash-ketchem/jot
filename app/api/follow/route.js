import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    // id of the user to follow
    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      throw new Error("invalid user id");
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid session");
    }

    const loggedUser = await client.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        id: true,
        followingIds: true,
      },
    });

    if (id === loggedUser?.id) {
      throw new Error("cannot follow yourself");
    }

    let updateUser = null;

    const currentlyFollowing = loggedUser.followingIds.includes(id);

    if (currentlyFollowing) {
      //unfollow by deleting from array

      updateUser = await client.$runCommandRaw({
        update: "User",
        updates: [
          {
            q: { email: session?.user?.email }, // Query conditions (empty object matches all documents)
            u: {
              $pull: {
                followingIds: id,
              },
            },
          },
        ],
      });

      if (updateUser?.ok !== 1) {
        throw new Error("something went wrong");
      }
    } else {
      //follow

      updateUser = await client.user.update({
        where: {
          id: loggedUser.id,
        },
        data: {
          followingIds: {
            push: id,
          },
        },
        select: {
          id: true,
        },
      });

      if (!updateUser?.id) {
        throw new Error("something went wrong");
      }
    }

    if (!currentlyFollowing) {
      try {
        const notification = await client.notification.create({
          data: {
            userId: id,
            body: "started following you",
            triggeringUserId: loggedUser.id,
          },
          select: {
            id: true,
          },
        });

        const res = await axios.post("http://localhost:3001/emit", {
          eventType: "notification",
          userId: id,
        });
      } catch (error) {
        console.log(error);
      }
    }

    return NextResponse.json(updateUser, {
      status: 200,
    });
  } catch (error) {
    console.log("error while foloowing a user", error);
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
