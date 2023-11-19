"use client";

import {
  ArrowLeftOnRectangleIcon,
  ArrowSmallLeftIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Theme from "./Theme";
import { signOut } from "next-auth/react";

const HeaderLogin = ({ showBackArrow, adminLoggedIn }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="navbar bg-base-100 top-0  !z-50 flex  gap-4 py-3.5 items-center backdrop-filter  h-[8vh] justify-between">
      {/* backdrop-blur-lg bg-opacity-30 */}
      <div className="flex w-full  justify-between items-center ">
        <div
          className="btn btn-ghost btn-circle justify-center items-center"
          onClick={handleClick}
        >
          {showBackArrow && <ArrowSmallLeftIcon className="w-6 h-6  " />}
        </div>
        <div className="flex justify-center items-center gap-4 mr-2">
          {adminLoggedIn && (
            <>
              <button
                className="w-fit flex gap-2 justify-center items-center btn btn-accent mr-2"
                onClick={() => router.push("/dashboard/users")}
              >
                <p className="text-sm leading-relaxed lowercase">Users</p>
                <UsersIcon className="w-6 h-6" />
              </button>
              <div>
                <button
                  className="btn btn-ghost btn-circle relative btn-sm md:btn-md z-50"
                  onClick={async () => {
                    await signOut();
                    router.push("/");
                  }}
                >
                  <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                </button>
              </div>
            </>
          )}
          <div
            className=" right-2 top-2
        "
          >
            <Theme />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderLogin;
