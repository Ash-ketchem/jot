"use client";

import modalStore from "@/stores/modalStore";
import { FireIcon } from "@heroicons/react/24/solid";
import { useCallback } from "react";

const Jot = ({ label }) => {
  const openJotModal = modalStore((state) => state.openJotModal);

  const hanldleJot = useCallback(() => {
    openJotModal();
  }, []);

  return (
    <div
      className="group flex gap-4 justify-start items-center py-4 bg-primary text-primary-content hover:bg-primary-focus hover:text-primary-content "
      onClick={hanldleJot}
    >
      <FireIcon className="w-6 h-6 group-hover:animate-[wiggle_1s_ease-in-out]" />
      <p className="font-semibold lg:text-base  text-sm">{label}</p>
    </div>
  );
};

export default Jot;
