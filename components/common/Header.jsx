"use client";

import { ArrowSmallLeftIcon, BellIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Theme from "./Theme";
import Search from "./Search";
import Drawer from "../SideBar/Drawer";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { FireIcon } from "@heroicons/react/24/solid";

const Header = (showBackArrow, loggedUserId) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="navbar bg-base-100  sticky top-0  z-50 flex  gap-4 py-3.5 items-center backdrop-filter  h-[10vh]">
      {/* backdrop-blur-lg bg-opacity-30 */}
      <div className="navbar-start  justify-start items-center">
        <div
          className="md:flex hidden btn btn-ghost btn-circle justify-center items-center ml-4"
          onClick={handleClick}
        >
          {showBackArrow && <ArrowSmallLeftIcon className="w-8 h-8 " />}
        </div>
        <div className="md:hidden flex justify-center items-center">
          <Drawer loggedUserId={loggedUserId} />
        </div>
      </div>
      <div className="navbar-center flex gap-4 justify-center items-center ">
        <div className="flex gap-4 justify-center items-center">
          <p className="normal-case text-xl font-semibold leading-relaxed tracking-widest p-4 -rotate-3 flex ">
            <span className=" mt-2 uppercase">j</span>
            <span className="uppercase text-lg px-1">
              <FireIcon className="w-8 h-8 text-info" />
            </span>
            <span className="mt-2">t</span>
          </p>
        </div>
      </div>
      <div className="navbar-end justify-end items-center flex gap-2 mr-4">
        <div className="md:block hidden">
          <Search />
        </div>
        <div className="md:block hidden">
          <Theme />
        </div>

        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <BellIcon className="w-8 h-8 " />
            {/* <span className="badge badge-xs badge-primary indicator-item"></span> */}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
