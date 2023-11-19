import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { storyIds } = await req.json();

    if (!storyIds?.length || typeof storyIds !== typeof []) {
      throw new Error("invalid story ids");
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("invalid session");
    }

    const { id: userId } = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!userId) {
      throw new Error("invalid user");
    }

    let requestSent = false;

    const updatedStories = await Promise.all(
      storyIds.map(async (storyId) => {
        const storyViews = await client.story.findUnique({
          where: {
            id: storyId,
          },
          select: {
            views: true,
          },
        });

        let updatedStory = {};

        if (!storyViews?.views?.includes(userId)) {
          requestSent = true;

          updatedStory = await client.story.update({
            where: {
              id: storyId,
            },
            data: {
              views: {
                push: userId,
              },
            },
            select: {
              id: true,
            },
          });
        }

        return updatedStory;
      })
    );

    console.log(updatedStories, "stories ");

    if (requestSent && !updatedStories.every((story) => story?.id)) {
      throw new Error("something went wrong");
    }

    return NextResponse.json(updatedStories, {
      status: 200,
    });
  } catch (error) {
    console.log("error while viewing a story", error);
    return NextResponse.json(
      {
        error: "error while viewing a story",
      },
      {
        status: 400,
      }
    );
  }
}
