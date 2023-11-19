import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";
import client from "@/libs/prismaClient";

export async function POST(req, res) {
  const { auth, socketId } = await req.json();

  if (!auth) {
    throw new Error("invalid request");
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid session");
    }

    const { id: userId } = await client.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        id: true,
      },
    });

    const res = await axios.post("http://localhost:3001/auth", {
      token: process.env.SOCKET_AUTH_SECRET,
      socketId: socketId,
      userId,
    });

    if (res?.status !== 200) {
      throw new Error("authentication with the server failed");
    }

    return NextResponse.json({ res: "ok" }, { status: 200 });
  } catch (error) {
    console.log("error");
    return NextResponse.json(error, { status: 400 });
  }
}
