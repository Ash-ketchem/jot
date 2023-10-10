import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Login from "@/components/login/Login";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.emailVerified) {
    redirect("/");
  }
  return (
    <Login
      label="Register"
      header="Join for free!"
      body="Connecting minds, one post at a time"
      type="register"
      img="/images/register.svg"
    />
  );
};

export default page;
