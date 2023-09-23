"use client";

import modalStore from "@/stores/modalStore";
import { FireIcon } from "@heroicons/react/24/outline";
import { useCallback } from "react";

const Jot = ({ label }) => {
  const openJotModal = modalStore((state) => state.openJotModal);

  const hanldleJot = useCallback(() => {
    openJotModal();
  }, []);

  return (
    <div
      className="flex gap-4 justify-start items-center py-4 bg-primary text-primary-content hover:bg-primary-focus"
      onClick={hanldleJot}
    >
      <FireIcon className="w-6 h-6" />
      <p className="font-semibold lg:text-base  text-sm">{label}</p>
    </div>
  );
};

export default Jot;
