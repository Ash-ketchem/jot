"use client";

import modalStore from "@/stores/modalStore";
import { FireIcon } from "@heroicons/react/24/solid";

const MobileJot = () => {
  const openJotModal = modalStore((state) => state.openJotModal);

  return (
    <button onClick={() => openJotModal()}>
      <FireIcon className="w-10 h-10 btn btn-circle btn-sm btn-primary" />
    </button>
  );
};

export default MobileJot;
