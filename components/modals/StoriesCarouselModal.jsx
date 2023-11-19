"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BodySection from "../Feed/common/BodySection";
import ImagesSection from "../Feed/common/ImagesSection";
import UserSection from "../Feed/common/UserSection";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import MyStory from "../story/MyStory";
import viewdStoryStore from "@/stores/viewedStoriesStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import toastStore from "@/stores/toastStore";
import modalStore from "@/stores/modalStore";

const StoriesCarouselModal = ({ stories, loggedUserId }) => {
  const [currentIndex, setCurrentIndex] = useState(1);

  const storyIds = viewdStoryStore((state) => state.StoryIds);
  const removeStories = viewdStoryStore((state) => state.removeStories);
  const viewStory = viewdStoryStore((state) => state.viewStory);
  const addToast = toastStore((state) => state.addToast);
  const closeStoriesCarouselModal = modalStore(
    (state) => state.closeStoriesCarouselModal
  );
  const router = useRouter();

  const handleClose = useCallback(async () => {
    setCurrentIndex(1);

    const storyIdsToUpload = Array.from(storyIds);

    if (!storyIdsToUpload?.length) {
      return;
    }

    try {
      const res = await axios.post("/api/storyViewed", {
        storyIds: storyIdsToUpload,
      });

      removeStories();
    } catch (error) {
      console.log("couldn't view some stories");
    }

    router.refresh();
  }, [router, setCurrentIndex]);

  const handleDelete = useCallback(
    async (storyId) => {
      try {
        const res = await axios.delete("/api/story", {
          data: {
            storyId: storyId,
          },
        });

        if (res?.status !== 200) {
          throw new Error("somethign went wrong");
        }

        addToast("Story deleted");

        closeStoriesCarouselModal();

        router.refresh();
      } catch (error) {
        addToast("Something went wrong");
      }
    },
    [router]
  );

  useEffect(() => {
    if (currentIndex > 1) {
      viewStory(stories[currentIndex - 1]?.map((story) => story?.id));
    }
  }, [currentIndex, viewStory]);

  const bodyContent = (
    <div className=" w-full h-[35rem]">
      <div className="carousel w-full h-full ">
        {stories.map((storyGroup, i) => {
          return (
            storyGroup?.length > 0 && (
              <div
                id={`slide${i + 1}`}
                className="carousel-item  w-full "
                key={`slide${i + 1}`}
              >
                <div className="h-[35rem] w-full rounded-box flex flex-col  lg:p-8 overflow-y-auto">
                  {storyGroup.map((story) => (
                    <div className="my-2 h-full w-full" key={story?.id}>
                      <div className="card card-compact bg-base-100 shadow-sm min-h-full w-full p-2 pb-4 justify-center items-center relative">
                        <div className="flex flex-col w-full border-b-[1px] border-neutral-700/30">
                          <div className=" flex flex-col items-start card-body w-full">
                            <UserSection
                              user={story?.user}
                              createdAt={story?.createdAt}
                            />
                            {loggedUserId === story?.user?.id && (
                              <div className="absolute right-12 top-1/6 mt-2">
                                <button
                                  className="btn btn-xs btn-error btn-circle"
                                  onClick={() => handleDelete(story?.id)}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            <BodySection body={story.body} />

                            <div className="w-full h-full flex sm:flex-row flex-col gap-y-2.5 sm:gap-0 ">
                              <>
                                {story?.images?.length > 0 && (
                                  <ImagesSection images={story?.images} />
                                )}
                              </>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <dialog id="StoriesCarouselModal" className="modal ">
        <div className="modal-box sm:min-w-[80%] sm:min-h-100 lg:min-w-[50%] lg:min-h-100">
          <main className="h-full w-full">{bodyContent}</main>
        </div>
        <div className="absolute borders  overflow-hidden  flex justify-between top-1/2 left-4 right-4 xl:left-24 xl:right-24 z-40">
          <button>
            <a
              href={`#slide${Math.max(currentIndex, 1)}`}
              className="btn btn-sm lg:btn-lg btn-circle"
              onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 1))}
            >
              <ArrowLeftCircleIcon className="w-6 h-6" />
            </a>
          </button>
          <button>
            <a
              // href={`#slide${Math.min(currentIndex + 1, stories.length - 1)}`}
              href={`#slide${currentIndex}`}
              onClick={() =>
                setCurrentIndex(Math.min(currentIndex + 1, stories.length))
              }
              className="btn btn-sm lg:btn-lg btn-circle"
            >
              <ArrowRightCircleIcon className="w-6 h-6" />
            </a>
          </button>
        </div>
        <div className="absolute right-6 bottom-6 lg:bottom-16 lg:right-24">
          <MyStory />
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default StoriesCarouselModal;
