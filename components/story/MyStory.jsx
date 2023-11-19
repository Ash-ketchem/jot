"use client";

import modalStore from "@/stores/modalStore";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const MyStory = () => {
  const openStoriesModal = modalStore((state) => state.openStoriesModal);
  return (
    <div>
      <div className="avatar">
        <button
          className="btn btn-neutral btn-circle btn-md"
          onClick={() => openStoriesModal()}
        >
          <PlusCircleIcon className="w-full h-full" />
        </button>
      </div>
    </div>
  );
};

export default MyStory;
