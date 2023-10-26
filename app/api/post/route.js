import cloudinary from "@/libs/cloudinaryConfig";
import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    if (!id || typeof id !== "string") {
      throw new Error("invalid id");
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

    const postToBeDeleted = await client.post.findUnique({
      where: {
        id: id,
      },
      select: {
        userId: true,
      },
    });

    if (postToBeDeleted?.userId !== loggedUser?.id) {
      throw new Error("user not authorized to perform post deletion");
    }

    let { images } = await client.post.findUnique({
      where: {
        id: id,
      },
      select: {
        images: true,
      },
    });

    const cloudinaryPublicIdPattern = /v.*\/(.*?)\..{3,4}$/;

    images = images?.map((img) => {
      const matchResult = img?.image?.match(cloudinaryPublicIdPattern)?.[1];

      return {
        media: matchResult?.split(".")[0] || null,
        mediaType: ["jpg", "png"].includes(matchResult?.split(".")[1] || null)
          ? "image"
          : "video",
      };
    });

    //deleting the original post

    const post = await client.post.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });

    if (!post?.id) {
      throw new Error("something went wrong");
    }

    // if(images?.every(img=>img === "image")){
    //   // bulk delete
    //   cloudinary.api
    //   .delete_resources(images.map(img=>img?.media))
    //   .then((result) => console.log(result));
    // }

    // deleting images from cloudinary

    for (const img of images) {
      if (img?.media) {
        cloudinary.uploader
          .destroy(img?.media, {
            resource_type: img?.mediaType,
          })
          .then((result) => console.log(result));
      }
    }

    return NextResponse.json(post, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "failed to delelte post",
      },
      {
        status: 400,
      }
    );
  }
}
