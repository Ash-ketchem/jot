import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import client from "@/libs/prismaClient";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import cloudinary from "@/libs/cloudinaryConfig";

export async function POST(req) {
  try {
    const {
      name,
      username,
      bio,
      profileImage,
      coverImage,
      oldPassword,
      newPassword,
    } = await req.json();

    let profileImageUrl = null;
    let coverImageUrl = null;

    if (
      (name && typeof name !== "string") ||
      (username && typeof username !== "string") ||
      (bio && typeof bio !== "string") ||
      (oldPassword && typeof oldPassword !== "string") ||
      (newPassword && typeof newPassword !== "string")
    ) {
      throw new Error("invalid fields types");
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("invalid session");
    }

    const { id: userId, hashedPassword } = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        hashedPassword: true,
      },
    });

    if (profileImage) {
      const res = await cloudinary.uploader.upload(profileImage, {
        resource_type: "image",
        public_id: `${userId}_profileImage`,
        overwrite: true,
      });
      profileImageUrl = res.secure_url;
    }

    if (coverImage) {
      const res = await cloudinary.uploader.upload(coverImage, {
        resource_type: "image",
        public_id: `${userId}_coverImage`,
        overwrite: true,
      });
      coverImageUrl = res.secure_url;
    }

    const updateFields = {
      ...(name ? { name } : {}),
      ...(username ? { username } : {}),
      ...(bio ? { bio } : {}),
      ...(profileImage ? { profileImage: profileImageUrl } : {}),
      ...(coverImage ? { coverImage: coverImageUrl } : {}),
    };

    if (!Object.keys(updateFields).length) {
      throw new Error("Nothing to update");
    }

    let updatedUser = await client.user.update({
      where: {
        id: userId,
      },
      data: updateFields,
      select: {
        id: true,
      },
    });

    if (oldPassword && newPassword) {
      const isCorrectPassword = await bcrypt.compare(
        oldPassword,
        hashedPassword
      );

      if (!isCorrectPassword) {
        throw new Error("Passwords doesnt match");
      }

      const updatedHashedPassword = await bcrypt.hash(newPassword, 12);

      updatedUser = await client.user.update({
        where: {
          id: userId,
        },
        data: {
          hashedPassword: updatedHashedPassword,
        },
        select: {
          id: true,
        },
      });
    }

    return NextResponse.json(updatedUser, {
      status: 200,
    });
  } catch (error) {
    console.log("error while updating profile", error);
    return NextResponse.json(
      {
        error: error?.message || "error while updating profile",
      },
      {
        status: 400,
      }
    );
  }
}
