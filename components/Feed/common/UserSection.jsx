"use client";

import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const UserSection = ({ user, createdAt }) => {
  const router = useRouter();

  const [dateFromNow, setDateFromNow] = useState("");

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      router.push(`/user/${user?.id}`);
    },
    [router, user?.id]
  );

  useEffect(() => {
    setDateFromNow(
      (createdAt && formatDistanceToNowStrict(new Date(createdAt))) || ""
    );
  }, [createdAt]);

  return (
    <div className="w-full font-normal leading-snug ">
      <div className="flex gap-6 py-2">
        <div className="flex justify-center items-center">
          <div className="avatar" onClick={handleClick}>
            <div className="w-10 h-10 rounded-full relative">
              <Image
                src={user?.profileImage || "/images/userProfile.jpg"}
                fill
                alt="profile image"
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start text-sm gap-1 tracking-wider  p-0">
          <p className="sm:text-sm text-sm font-bold">{user?.name}</p>
          <p
            className="font-semibold hover:underline cursor-pointer text-xs leading-loose tracking-wider"
            onClick={handleClick}
          >
            @{user?.username}
          </p>
        </div>
        <div className="flex justify-center items-end text-sm ml-4   p-0">
          <p className="text-sm w-fit  mb-0.5">{dateFromNow}</p>
        </div>
      </div>
    </div>
  );
};

export default UserSection;
