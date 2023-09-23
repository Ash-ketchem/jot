import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const getSession = async () => {
  const session = await getServerSession(authOptions);

  return session?.user?.email ? true : false;
};

export default getSession;
