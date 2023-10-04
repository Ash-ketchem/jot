"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import SideBar from "./SideBar";

const Drawer = ({ loggedUserId }) => {
  return (
    <div className="dropdown md:hidden flex ">
      <div className="drawer z-50 w-md ">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content ">
          {/* Page content here */}
          <label
            htmlFor="my-drawer"
            className="btn btn-ghost btn-circle drawer-button"
          >
            <Bars3Icon className="w-6 h-6 lg:w-8 lg:h-8" />
          </label>
        </div>
        <div className="drawer-side ">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4  h-full bg-base-200 text-base-content w-[80%]">
            {/* Sidebar content here */}
            <SideBar loggedUserId={loggedUserId} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
