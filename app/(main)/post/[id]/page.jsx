import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BodySection from "@/components/Feed/common/BodySection";
import ImagesSection from "@/components/Feed/common/ImagesSection";
import UserSection from "@/components/Feed/common/UserSection";
import CommentFeed from "@/components/post/CommentFeed";
import PostAction from "@/components/post/PostAction";
import client from "@/libs/prismaClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async ({ params }) => {
  const { id } = params;
  let post = null;
  let loggedUserId = null;
  let bookmarked = false;
  const commentCount = 5;

  try {
    post = await client.post.findUnique({
      where: {
        id,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
        comments: {
          take: commentCount,

          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!post) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-lg">Sorry no post found :)</p>
        </div>
      );
    }

    const session = await getServerSession(authOptions);

    if (session?.user?.email && !session?.user?.emailVerified) {
      throw new Error("user not verified");
    }

    if (session?.user?.email) {
      const loggedUser = await client.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
        },
      });

      loggedUserId = loggedUser?.id;

      const bookmark = await client.bookmark.findFirst({
        where: {
          userId: loggedUserId,
          postId: post?.id,
        },
        select: {
          id: true,
        },
      });

      bookmarked = bookmark?.id ? true : false;
    }

    const liked = post?.likeIds.includes(loggedUserId);

    post = {
      ...post,
      liked,
      likeCount: post?.likeIds?.length || 0,
      commentCount: post?._count?.comments || 0,
      bookmarked: bookmarked,
    };
  } catch (error) {
    console.log(error);
    if (error.message.toLowerCase() === "user not verified".toLowerCase()) {
      redirect("/verification");
    }
  }

  return (
    <div className=" h-fit p-2 pb-4 ">
      <div className="flex justify-center items-center">
        <div className="card card-compact w-full bg-base-100 shadow-xl h-full xl:max-w-lg pb-4">
          <div className="sm:card-body px-4 md:px-8 pb-4">
            <div className="card-title">
              <UserSection user={post?.user} createdAt={post?.createdAt} />
            </div>
            <div className=" rounded-lg  py-1 flex flex-col gap-4">
              <BodySection body={post?.body} />
              {post?.images.length > 0 && (
                <ImagesSection images={post?.images} />
              )}
            </div>
            <div className="w-full mt-2">
              <PostAction post={post} loggedUserId={loggedUserId} />
            </div>
            <div>
              <CommentFeed
                comments={post?.comments || []}
                postId={post?.id}
                timestamp={Date.now()}
                totalcomments={post?.commentCount || 0}
                postOwnerId={post?.user?.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
