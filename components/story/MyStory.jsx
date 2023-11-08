"use client";

import modalStore from "@/stores/modalStore";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const MyStory = () => {
  const openStoriesModal = modalStore((state) => state.openStoriesModal);
  return (
    <div>
      <div className="avatar">
        <button
          className="btn btn-primary btn-circle btn-sm lg:btn-lg"
          onClick={() => openStoriesModal()}
        >
          <PlusCircleIcon className="w-full h-full" />
        </button>
      </div>
    </div>
  );
};

export default MyStory;
