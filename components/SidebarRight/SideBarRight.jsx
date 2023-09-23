import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SideBarFeed from "./SideBarFeed";

const SideBarRight = async () => {
  let users = [];
  let loggedUser = null;

  try {
    users = await client.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        profileImage: true,
      },
    });

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid session");
    }

    loggedUser = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: { id: true, followingIds: true },
    });

    users = users?.filter((user) => user.id !== loggedUser?.id);
  } catch (error) {
    console.log(error);
  }

  return (
    <div className=" w-full h-full rounded-box py-2 ">
      <div className="px-4 h-full w-full flex justify-center items-start">
        <SideBarFeed users={users} loggedUser={loggedUser} />
      </div>
    </div>
  );
};

export default SideBarRight;
