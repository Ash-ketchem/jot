import cloudinary from "@/libs/cloudinaryConfig";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    if (!id || typeof id !== "string") {
      throw new Error("invalid id");
    }

    const { images } = await client.post.findUnique({
      where: {
        id: id,
      },
      select: {
        images: true,
      },
    });

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

    // deleting images from cloudinary
    const cloudinaryPublicIdPattern = /v.*\/(.*?)\..{3,4}$/;

    for (const img of images) {
      const pub_id = img.match(cloudinaryPublicIdPattern)?.[1];

      if (pub_id) {
        const res = await cloudinary.uploader.destroy(pub_id, {
          resource_type: "image",
        });
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
