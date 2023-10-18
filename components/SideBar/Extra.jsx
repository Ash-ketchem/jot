"use client";

import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useCallback } from "react";

const Extra = ({ label = "More" }) => {
  const handleClick = useCallback(() => {}, []);
  return (
    <div className="dropdown dropdown-hover dropdown-bottom relative">
      <label tabIndex={0} className="flex justify-start items-center ">
        <div
          className="flex gap-4 justify-start items-center py-2 group"
          onClick={handleClick}
        >
          <EllipsisHorizontalCircleIcon className="w-6 h-6 group-hover:animate-[wiggle_1s_ease-in-out]" />
          <p className="font-semibold lg:text-base  text-sm">{label}</p>
        </div>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-full space-y-2"
      >
        <li>
          <Link href="/support">contact & Support</Link>
        </li>
        <li>
          <Link href="/about">About us</Link>
        </li>
      </ul>
    </div>
  );
};

export default Extra;
