import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Connections from "@/components/user/Connections";
import client from "@/libs/prismaClient";
import {
  CursorArrowRaysIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
CursorArrowRaysIcon;

const page = async () => {
  let connections = null;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid session");
    }

    const loggedUser = await client.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        followingIds: true,
      },
    });

    if (!loggedUser?.id) {
      throw new Error("no such user exists");
    }

    let followers = await client.user.findMany({
      where: {
        followingIds: {
          has: loggedUser.id,
        },
      },
      select: {
        id: true,
      },
    });

    followers = followers.flatMap((user) => user?.id);

    connections = await client.user.findMany({
      where: {
        id: {
          in: [...loggedUser?.followingIds, ...followers],
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        profileImage: true,
      },
    });

    // const connections = await client.user.findMany({
    //   where: {
    //     OR: [
    //       {
    //         followingIds: {
    //           has: loggedUser.id,
    //         },
    //       },
    //       {
    //         id: {
    //           in: loggedUser?.followingIds ?? [],
    //         },
    //       },
    //     ],
    //   },
    //   select: {
    //     id: true,
    //     username: true,
    //     name: true,
    //     profileImage: true,

    //   },
    // });

    connections = connections.map((user) => ({
      ...user,
      following: loggedUser?.followingIds?.includes(user?.id),
      follower: followers?.includes(user?.id),
    }));
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="w-full h-full px-2 py-4 flex flex-col gap-6">
      <div className="flex gap-2 justify-center items-center w-full">
        <h2 className="font-bold font-md text-center w-fit p-2 leading-relaxed tracking-widest">
          Connections
        </h2>
        <UserGroupIcon className="w-8 h-8 text-accent" />
      </div>
      <div className="flex flex-wrap  w-full  gap-4">
        <Connections
          followers={connections.filter((user) => user?.follower)}
          following={connections.filter((user) => user?.following)}
        />
      </div>
    </div>
  );
};

export default page;
