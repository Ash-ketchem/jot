"use client";

import userStore from "@/stores/userStore";

const LoggedUserItem = () => {
  const loggedUser = userStore((state) => state.loggedUser);

  return (
    <div className="w-[90%] flex justify-start items-center rounded-full bg-base-100 py-2 gap-6">
      {!loggedUser ? (
        <span className="loading loading-spinner text-primary mx-auto"></span>
      ) : (
        <>
          <div className="avatar cursor-default">
            <div className="w-8 h-8 rounded-full  ">
              <div className="flex justify-center items-center  w-8 h-8 rounded-full bg-primary ">
                <span className="font-bold text-primary-content h-fit w-fit  rounded-full">
                  {loggedUser?.name?.slice(0, 1)}
                </span>
              </div>
            </div>
          </div>
          <div className=" overflow-hidden flex flex-col gap-2 cursor-default">
            <p className="text-ellipsis overflow-hidden text-sm tracking-wide">
              {loggedUser?.name}
            </p>
            <p className="text-ellipsis overflow-hidden font-semibold text-xs cursor-pointer ">
              @{loggedUser?.username}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default LoggedUserItem;
