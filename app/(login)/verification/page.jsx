import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EmailVerify from "@/components/verification/EmailVerify";
import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.emailVerified) {
    redirect("/");
  }

  let token = null;

  try {
    const user = await client.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        id: true,
      },
    });
    token = await client.verification.findUnique({
      where: {
        userId: user?.id,
      },
      select: {
        retryCount: true,
      },
    });
  } catch (error) {}

  return (
    <EmailVerify
      email={session?.user?.email}
      retryAttemptsLeft={token?.retryCount || 0}
    />
  );
};

export default page;
