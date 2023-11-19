import client from "@/libs/prismaClient";
import StoryItem from "./StoryItem";
import StoriesCarouselModal from "../modals/StoriesCarouselModal";
import MyStory from "./MyStory";

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

  let storyGroup = await Promise.all(
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
          views: true,

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

  const myStoriesLength = storyGroup[0]?.length ?? 0;

  storyGroup = storyGroup.filter((group) => group.length > 0);

  return (
    <div className="my-0">
      <StoriesCarouselModal stories={storyGroup} loggedUserId={loggedUserId} />
      <div className="py-2 border-b-[0px] px-1 flex justify-center  sticky top-0 z-30 bg-base-200 mb-2 backdrop-blur-2xl opacity-95 mr-6">
        <div className="flex px-2 py-2 space-x-4  rounded-box w-[100%]  overflow-scroll ">
          {myStoriesLength === 0 && <MyStory />}
          {storyGroup?.map(
            (stories, i) =>
              stories?.length > 0 && (
                <div
                  className=" btn btn-ghost btn-circle carousel-item"
                  key={stories[0]?.id}
                >
                  <StoryItem
                    userProfileImage={stories[0]?.user?.profileImage}
                    index={i + 1}
                    storyIds={stories?.map((story) => story.id)}
                    userViewedStories={stories.every((story) =>
                      story.views?.includes(loggedUserId)
                    )}
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
