import sendMail from "@/libs/sendMail";
import { NextResponse } from "next/server";

export async function GET() {
  const res = sendMail({
    username: "ash",
    action: "reset",
    token: crypto.randomUUID(),
    recipient: "sangeethpg666@gmail.com",
  });

  if (res) {
    return NextResponse.json("sucess", {
      status: 200,
    });
  }
  return NextResponse.json("failed", {
    status: 400,
  });
}
