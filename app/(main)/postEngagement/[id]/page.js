import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PostEngagement from "@/components/post/PostEngagement";
import client from "@/libs/prismaClient";
import { CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import Image from "next/image";

async function page({ params }) {
  const { id: postId } = params;

  let users = new Map();
  let post = null;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("invalid session");
    }

    post = await client.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
        likeIds: true,
        comments: {
          select: {
            userId: true,
          },
        },
        bookmarks: {
          select: {
            userId: true,
          },
        },
      },
    });

    const loggedUser = await client.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      select: {
        id: true,
      },
    });

    if (loggedUser?.id !== post?.userId) {
      return (
        <div className="flex w-full h-full justify-center items-center flex-col gap-4">
          <p className="text-sm font-semibold leading-relaxed tracking-wide">
            You can't view other user's post Engagement statistics
          </p>
          <div className="relative min-h-[50vh] w-full">
            <Image src="/images/noEntry.svg" alt="not authorized" fill />
          </div>
        </div>
      );
    }

    await Promise.all(
      [
        ...post?.likeIds,
        ...post?.comments?.map((comment) => comment?.userId),
        ...post?.bookmarks?.map((boookmark) => boookmark?.userId),
      ].map(async (userId) => {
        const user = await client.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            username: true,
            name: true,
            profileImage: true,
          },
        });

        if (user?.id) {
          users.set(userId, user);
        }
      })
    );
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="w-full h-full px-2 py-4 flex flex-col gap-6">
      <div className="flex gap-2 justify-center items-center w-full">
        <h2 className="font-bold font-md text-center w-fit p-2 leading-relaxed tracking-widest">
          Post Engagement
        </h2>
        <CursorArrowRaysIcon className="w-8 h-8 text-info" />
      </div>
      <div className="flex flex-wrap  w-full  gap-4">
        <PostEngagement post={post} users={users} />
      </div>
    </div>
  );
}

export default page;
