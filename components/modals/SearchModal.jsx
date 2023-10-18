"use client";

import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SearchModal = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [usersFound, setUsersFound] = useState([]);
  const cursorRef = useRef(null);
  const timerRef = useRef(null);
  const allDataFetched = useRef(false);

  const getUsers = useCallback(
    async (query) => {
      try {
        const res = await axios.get(
          `/api/search?query=${query}${
            cursorRef?.current ? "&cursor=" + cursorRef.current : ""
          }`
        );

        if (res?.status !== 200) {
          throw new Error("something went wrong");
        }

        return {
          data: res?.data,
          status: 200,
        };
      } catch (error) {
        return {
          data: [],
          status: 400,
        };
      }
    },
    [cursorRef]
  );

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();

      try {
        setSearchValue(e.target.value);

        cursorRef.current = null; // resetting cursor on new search
        allDataFetched.current = false; // resetting  on new search
        setUsersFound([]);

        if (!e.target.value) {
          setUsersFound([]);
          return;
        }

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(async () => {
          if (!e.target.value) {
            return;
          }
          try {
            setLoading(true);

            const res = await getUsers(e.target.value);

            // console.log(e.target.value, res);

            clearInterval(timerRef.current);

            if (res?.status !== 200) {
              throw new Error("something went wrong");
            }

            if (res?.data?.length === 0) {
              allDataFetched.current = true;
              return;
            }

            setUsersFound(res?.data);

            if (res?.data?.length < 5) {
              //i fetch 5 posts each
              allDataFetched.current = true;
            }

            cursorRef.current = res?.data?.[res?.data?.length - 1]?.id;
          } catch (error) {
            //toast
          } finally {
            setLoading(false);
          }

          // console.log(res?.data);

          clearInterval(timerRef.current);
          timerRef.current = null;
        }, 3000);
      } catch (error) {
        console.log(error);
      }
    },
    [timerRef, searchValue, cursorRef, getUsers]
  );

  // handle more users on current search
  const handleMore = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setLoadingMore(true);
        const res = await getUsers(searchValue);

        if (res?.status !== 200) {
          throw new Error("something went wrong");
        }

        if (!res?.data?.length) {
          allDataFetched.current = true;
          return;
        }

        setUsersFound((users) => [...users, ...res?.data]);
      } catch (error) {
        //toast
      } finally {
        setLoadingMore(false);
      }
    },
    [searchValue, setUsersFound]
  );

  useEffect(() => {
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  const searchResultsUi = (
    <div className="w-full my-4">
      {usersFound?.length > 0 && (
        <div className="w-full flex items-center justify-between flex-wrap menu  rounded-box !flex-row">
          {usersFound?.map((user, i) => (
            //  UserCard
            <div
              className="w-full p-2  rounded-xl flex gap-4  justify-evenly items-center py-4 !basis-[48%] bg-base-200 "
              key={i}
            >
              <div className="flex gap-5 items-center justify-start  flex-1">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full  relative">
                    <Image
                      src={user?.profileImage || "/images/userProfile.jpg"}
                      alt="profile image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1  border-0">
                  <p className="text-sm">{user?.name}</p>
                  <Link href={`/user/${user.id}`}>
                    <p className="cursor-pointer font-semibold text-xs hover:underline">
                      @{user?.username}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {usersFound?.length === 0 && searchValue && allDataFetched.current && (
        <div className="w-full h-full flex justify-center items-center">
          <p>No users Found :)</p>
        </div>
      )}

      {/* load more users of current search */}
      {!allDataFetched.current && cursorRef.current && (
        <div className="w-full flex justify-center items-center p-2">
          {loadingMore ? (
            <span className="loading loading-spinner text-accent"></span>
          ) : (
            <button
              className="btn  btn-circle  btn-ghost rounded-xl lowercase btn-xs mt-2 hover:text-accent hover:!bg-transparent"
              onClick={handleMore}
            >
              <PlusCircleIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );

  const bodyContent = (
    <div className="w-full h-full  flex flex-col items-center justify-evenly relative">
      <div className="w-full flex justify-end items-center">
        <button
          className="btn btn-sm btn-ghost btn-circle"
          onClick={() => {
            setSearchValue("");
            setUsersFound([]);
          }}
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
      </div>

      {/* search input */}
      <div className="w-full mt-2">
        <label className="label">
          <span className="label-text font-semibold">
            search by name or username
          </span>
        </label>
        <input
          type="text"
          placeholder="search"
          className="input input-bordered w-full"
          value={searchValue}
          onChange={handleSearch}
        />
      </div>

      {/* search results */}
      <div className="w-full flex flex-col items-center gap-2 ">
        {loading ? (
          <div className="p-12 mt-4">
            <span className="loading loading-ball loading-md bg-accent"></span>
            <span className="loading loading-ball loading-lg bg-accent"></span>
            <span className="loading loading-ball loading-md bg-accent"></span>
          </div>
        ) : (
          searchResultsUi
        )}
      </div>
    </div>
  );
  return (
    <div>
      <dialog
        id="searchModal"
        className="modal h-full flex justify-center items-center"
      >
        <form
          method="dialog"
          className="modal-box md:w-2/3 w-[95%] flex items-center flex-col h-fit "
        >
          <main className="w-full h-fit">{bodyContent}</main>
        </form>
      </dialog>
    </div>
  );
};

export default SearchModal;
