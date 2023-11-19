import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";
import cloudinary from "@/libs/cloudinaryConfig";

export async function POST(req) {
  try {
    const { body, images } = await req.json();

    if (images && typeof images !== typeof []) {
      throw new Error("images must b an array");
    }

    if (typeof body !== "string") {
      throw new Error("invalid post body");
    }

    if (!body && !images?.length) {
      throw new Error("story can't be empty");
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

    const updatedImages = await Promise.all(
      (images || []).map((image) => {
        return new Promise((resolve) => {
          cloudinary.uploader.explicit(
            image,
            { type: "fetch" },
            function (error, result) {
              if (error) {
                console.log(error);
                resolve({ error: error });
              } else {
                console.log(result.width, result.height);
                resolve({ image, width: result.width, height: result.height });
              }
            }
          );
        });
      })
    );

    // console.log(updatedImages);

    const story = await client.story.create({
      data: {
        body,
        userId: userId,
        images: updatedImages ? updatedImages : [],
        views: [userId],
      },
      select: {
        id: true,
        body: true,
        images: true,
        likeIds: true,
        createdAt: true,
        views: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(story, {
      status: 200,
    });
  } catch (error) {
    console.log("error while creating a story", error);
    return NextResponse.json(
      {
        error: "error while creating a story",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(req) {
  const { storyId } = await req.json();

  try {
    if (!storyId || typeof storyId !== "string") {
      throw new Error("invalid story id");
    }

    const deletedStory = await client.story.delete({
      where: {
        id: storyId,
      },
      select: {
        id: true,
      },
    });

    if (!deletedStory?.id) {
      throw new Error("Failed to delete the story");
    }

    console.log(deletedStory);

    return NextResponse.json(deletedStory, {
      status: 200,
    });
  } catch (error) {
    console.log("error while deleting a story", error);
    return NextResponse.json(
      {
        error: "error while deleting a story",
      },
      {
        status: 400,
      }
    );
  }
}
