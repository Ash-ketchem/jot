import {
  HomeIcon,
  PlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const NavBarSmall = () => {
  return (
    <div className="w-full h-fit py-4 px-2 flex justify-evenly lg:hidden  top-[90%] left-0  shadow-md rounded-xl z-40 border sticky">
      <div className="btn btn-sm btn-circle">
        <HomeIcon className="sm:w-6 sm:h-6 h-5 w-5" />
      </div>
      <div className="btn btn-sm btn-circle bg-primary text-bg-content">
        <PlusIcon className="sm:w-6 sm:h-6 h-5 w-5 bg-" />
      </div>
      <div className="btn btn-sm btn-circle">
        <UserCircleIcon className="sm:w-6 sm:h-6 h-5 w-5" />
      </div>
    </div>
  );
};

export default NavBarSmall;
