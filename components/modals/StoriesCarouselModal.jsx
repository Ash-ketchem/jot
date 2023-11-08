"use client";

import { useState } from "react";
import BodySection from "../Feed/common/BodySection";
import ImagesSection from "../Feed/common/ImagesSection";
import UserSection from "../Feed/common/UserSection";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import MyStory from "../story/MyStory";

const StoriesCarouselModal = ({ stories }) => {
  const [currentIndex, setCurrentIndex] = useState(1);

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
                    <div className="my-2 h-full w-full " key={story?.id}>
                      <div className="card card-compact bg-base-100 shadow-xl min-h-full w-full p-2 pb-4">
                        <div className="flex flex-col">
                          <div className=" flex flex-col items-start card-body w-full">
                            <UserSection
                              user={story?.user}
                              createdAt={story?.createdAt}
                            />
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
          <button onClick={() => setCurrentIndex(1)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default StoriesCarouselModal;
