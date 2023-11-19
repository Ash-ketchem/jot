"use client";

import modalStore from "@/stores/modalStore";
import viewdStoryStore from "@/stores/viewedStoriesStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

const StoryItem = ({
  userProfileImage,
  index,
  userViewedStories,
  storyIds,
}) => {
  const router = useRouter();

  const [visited, setVisited] = useState(userViewedStories);

  const openStoriesCarouselModal = modalStore(
    (state) => state.openStoriesCarouselModal
  );

  const viewStory = viewdStoryStore((state) => state.viewStory);
  const removeStories = viewdStoryStore((state) => state.removeStories);

  const pathname = usePathname();

  const handleViewStory = useCallback(async () => {
    router.push(`${pathname}/#slide${index}`);
    setVisited(true);
    openStoriesCarouselModal();

    try {
      const res = await axios.post("/api/storyViewed", {
        storyIds,
      });

      removeStories();

      router.refresh();
    } catch (error) {
      console.log("couldn't view some stories");
    }
  }, [
    router,
    setVisited,
    openStoriesCarouselModal,
    viewStory,
    index,
    storyIds,
    removeStories,
  ]);

  return (
    <div>
      <div className="avatar" onClick={handleViewStory}>
        <div
          className={`w-10 rounded-full ring ${
            visited ? "ring-neutral" : "ring-accent"
          }  ring-offset-base-100 ring-offset-0.5 `}
        >
          <img src={userProfileImage ?? "/images/userProfile.jpg"} />
        </div>
      </div>
    </div>
  );
};

export default StoryItem;
