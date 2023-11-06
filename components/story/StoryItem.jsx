"use client";

import modalStore from "@/stores/modalStore";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState } from "react";

const StoryItem = ({ userProfileImage, index }) => {
  const router = useRouter();

  const [visited, setVisited] = useState(false);

  const openStoriesCarouselModal = modalStore(
    (state) => state.openStoriesCarouselModal
  );

  const pathname = usePathname();
  return (
    <div>
      <div
        className="avatar"
        onClick={() => {
          router.push(`${pathname}/#slide${index}`);
          setVisited(true);
          openStoriesCarouselModal();
        }}
      >
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
