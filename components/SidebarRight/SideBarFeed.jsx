"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import UserCard from "../user/UserCard";
import axios from "axios";

const SideBarFeed = ({ users, loggedUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  const finished = useRef(false);
  const cursor = useRef(null);

  const [usersToFollow, setUsersToFollow] = useState(users);

  const handleClick = useCallback(async () => {
    if (finished.current) return;
    try {
      setIsLoading(true);

      const res = await axios.get(`/api/users?cursor=${cursor.current}`);

      if (res?.status !== 200) {
        throw new Error("Something went wrong");
      }

      if (!res?.data?.length) {
        finished.current = true;
        return;
      }

      const newUsers = res?.data.filter((user) => user.id !== loggedUser?.id);

      setUsersToFollow((state) => [...state, ...newUsers]);

      if (newUsers?.length === 0) {
        finished.current = true;
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("/api/users");

      if (res?.status !== 200) {
        throw new Error("something went wrong");
      }

      cursor.current = res?.data?.[res?.data?.length - 1]?.id;
      setUsersToFollow(res?.data.filter((user) => user.id !== loggedUser?.id));
    } catch (error) {
      //  toast
    }
  }, [setUsersToFollow]);

  useEffect(() => {
    if (users?.length === 0) {
      fetchUsers();
    } else {
      cursor.current = users?.[users?.length - 1]?.id;
      setUsersToFollow(users);
    }
  }, [users, setUsersToFollow]);

  return (
    <>
      {usersToFollow?.length ? (
        <ul className="menu bg-base-100 w-full  rounded-box space-y-4 shadow-md cursor-default flex justify-center items-center [&_li>*]:rounded-xl">
          {usersToFollow.map((user) => (
            <li key={user?.id} className="w-[90%]">
              <UserCard
                user={user}
                isFollowing={loggedUser?.followingIds.includes(user?.id)}
                loggedUser={loggedUser}
              />
            </li>
          ))}
          {!finished?.current && (
            <li className="p-2">
              <button
                className="btn btn-ghost btn-sm rounded-full lowercase flex justify-center items-center h-auto"
                onClick={handleClick}
                disabled={isLoading || finished?.current}
              >
                <p className="font-semibold leading-loose tracking-wide ">
                  {!isLoading ? (
                    "more..."
                  ) : (
                    <span className="loading loading-spinner text-primary"></span>
                  )}
                </p>
              </button>
            </li>
          )}
        </ul>
      ) : (
        <span className="loading loading-spinner text-primary"></span>
      )}
    </>
  );
};

export default SideBarFeed;
