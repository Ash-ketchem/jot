"use client";

import modalStore from "@/stores/modalStore";
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";

const Search = () => {
  const openSearchModal = modalStore((state) => state.openSearchModal);

  return (
    <div>
      <button
        className="btn btn-ghost btn-circle btn-sm md:btn-md lg:btn-md"
        onClick={() => openSearchModal()}
      >
        <MagnifyingGlassPlusIcon className="w-6 h-6 md:w-8 md:h-8 " />
      </button>
    </div>
  );
};

export default Search;
