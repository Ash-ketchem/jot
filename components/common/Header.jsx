"use client";

import { ArrowSmallLeftIcon, BellIcon } from "@heroicons/react/24/outline";
import Theme from "./Theme";
import Search from "./Search";
import Drawer from "../SideBar/Drawer";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FireIcon } from "@heroicons/react/24/solid";
import Timer from "./Timer";
import reRenderStore from "@/stores/reRenderStore";
import notificationStore from "@/stores/notificationsStore";

const Header = (showBackArrow, loggedUserId) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.back();
  }, [router]);

  const rerenderedRef = useRef(0);

  const unreadNotifications = notificationStore(
    (state) => state.notificationsAvailable
  );
  const setUnreadNotifications = notificationStore(
    (state) => state.setNotificationsAvailable
  );

  const state = reRenderStore((state) => state.routes, "notifications");

  const pathname = usePathname();

  useEffect(() => {
    if (rerenderedRef.current > 1 && pathname !== "/notifications") {
      setUnreadNotifications(true);
    }
    // console.log("rerendered", rerenderedRef, pathname);
  }, [state]);

  useEffect(() => {
    rerenderedRef.current += 1;
  }, []);

  return (
    <div className="navbar bg-base-100  sticky top-0  z-40 flex  gap-4 py-3.5 items-center backdrop-filter  h-[10vh] justify-between ">
      {/* backdrop-blur-lg bg-opacity-30 */}
      <div className="  justify-start items-center">
        <div
          className="md:flex hidden btn btn-ghost btn-circle justify-center items-center ml-4"
          onClick={handleClick}
        >
          {showBackArrow && <ArrowSmallLeftIcon className="w-6 h-6  " />}
        </div>
        <div className="md:hidden flex justify-center items-center">
          <Drawer loggedUserId={loggedUserId} />
        </div>
      </div>
      <div className="md:ml-24 flex gap-4 justify-center items-center  ">
        <div className="flex gap-4 justify-center items-center">
          <p className="normal-case text-md md:text-2xl font-semibold leading-relaxed tracking-widest p-4 -rotate-3 flex ml-6">
            <span className="hidden md:block mt-2 uppercase">j</span>
            <span className="uppercase text-lg px-1">
              <FireIcon className="w-10 h-10 lg:w-8 lg:h-8 text-info" />
            </span>
            <span className="mt-2 hidden md:block">t</span>
          </p>
        </div>
      </div>
      <div className=" justify-end items-center flex gap-4 mr-4 ">
        <div>
          <Timer />
        </div>
        <div>
          <Search />
        </div>
        <div className="flex ">
          <Theme />
        </div>

        <button
          className="btn btn-ghost btn-circle btn-sm md:btn-md"
          onClick={() => {
            setUnreadNotifications(false);
            router.push("/notifications");
          }}
        >
          <div className="indicator">
            <BellIcon className="w-6 h-6 " />
            {unreadNotifications && (
              <span className="badge badge-xs badge-primary indicator-item"></span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
