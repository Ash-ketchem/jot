import client from "@/libs/prismaClient";
import StoryItem from "./StoryItem";
import StoriesCarouselModal from "../modals/StoriesCarouselModal";

const Stories = async ({ loggedUserId }) => {
  if (!loggedUserId) return null;

  const currentUser = await client.user.findUnique({
    where: {
      id: loggedUserId,
    },
    select: {
      followingIds: true,
    },
  });

  const storyGroup = await Promise.all(
    [loggedUserId, ...currentUser.followingIds].map((id) =>
      client.story.findMany({
        where: {
          userId: id,
        },
        select: {
          id: true,
          body: true,
          images: true,
          likeIds: true,
          createdAt: true,

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
      })
    )
  );

  return (
    <div className="my-0">
      <StoriesCarouselModal stories={storyGroup} />
      <div className="py-2 border-b-[0px] px-1 flex justify-center  sticky top-0 z-30 bg-base-200 mb-2 backdrop-blur-2xl opacity-95 mr-6">
        <div className="flex px-2 py-4 space-x-4  rounded-box w-[100%]  overflow-scroll ">
          {storyGroup.map(
            (stories, i) =>
              stories?.length > 0 && (
                <div
                  className="  btn btn-ghost btn-circle carousel-item"
                  key={stories[0]?.id}
                >
                  <StoryItem
                    userProfileImage={stories[0]?.user?.profileImage}
                    index={i + 1}
                  />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Stories;
