"use client";

import { ArrowSmallLeftIcon, BellIcon } from "@heroicons/react/24/outline";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

const HeaderLogin = (showBackArrow, loggedUserId) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="navbar bg-base-100 top-0  z-0 flex  gap-4 py-3.5 items-center backdrop-filter  h-[8vh] justify-between absolute ">
      {/* backdrop-blur-lg bg-opacity-30 */}
      <div className="  justify-start items-center">
        <div
          className="md:flex hidden btn btn-ghost btn-circle justify-center items-center ml-4"
          onClick={handleClick}
        >
          {showBackArrow && <ArrowSmallLeftIcon className="w-6 h-6  " />}
        </div>
      </div>
    </div>
  );
};

export default HeaderLogin;
