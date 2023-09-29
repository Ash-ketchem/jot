"use client";

import BodySection from "@/components/Feed/common/BodySection";
import ImagesSection from "@/components/Feed/common/ImagesSection";
import UserSection from "@/components/Feed/common/UserSection";
import bookmarkStore from "@/stores/bookmarkStore";
import postStore from "@/stores/postStore";
import globalPostStore from "@/stores/posts/globalPostStore";
import userPostStore from "@/stores/posts/userPostStore";

import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const page = () => {
  const router = useRouter();

  const newCursor = useRef(null);
  const fetched = useRef(false);

  // const [bookamrks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const bookmarks = bookmarkStore((state) => state.bookmarks);

  const addBookmarks = bookmarkStore((state) => state.addBookmarks);
  const addBookmarkIds = bookmarkStore((state) => state.addBookmarkIds);

  const removeBookmark = bookmarkStore((state) => state.removeBookmark);
  const removeBookmarkId = bookmarkStore((state) => state.removeBookmarkId);

  const setBookmark = globalPostStore((state) => state.setBookmark);
  const setBookmarkUser = userPostStore((state) => state.setBookmark);
  const setBookmarkPost = postStore((state) => state.setBookmark);

  const fetchPosts = useCallback(async () => {
    if (fetched.current) return;

    try {
      setLoading(true);

      const url = newCursor?.current
        ? `/api/bookmark?cursor=${newCursor.current}`
        : "/api/bookmark?cursor=latest";

      const res = await axios.get(url);

      if (res?.status !== 200) {
        throw new Error("something went wrong");
      }

      if (!res?.data?.length) {
        fetched.current = true;
        return;
      }

      newCursor.current = res?.data[0]?.id;

      addBookmarks(res?.data.reverse());
      addBookmarkIds(res?.data?.map((bookmark) => bookmark?.post?.id));

      // setBookmarks((bookamrks) => [...bookamrks, ...res?.data.reverse()]);
    } catch (error) {
      console.log("error ", error);
    } finally {
      setLoading(false);
    }
  }, [addBookmarks, addBookmarkIds]);

  const handleDelete = useCallback(
    async (e, postId) => {
      try {
        setDeleteLoading(true);
        const res = await axios.delete("/api/bookmark", {
          data: {
            postId: postId,
          },
        });

        if (res?.status !== 200) {
          throw new Error("somethign went wrong");
        }

        removeBookmark(postId);
        removeBookmarkId(postId);
        setBookmark(postId);
        setBookmarkUser(postId);
        setBookmarkPost(postId);
      } catch (error) {
        console.log(error);
      } finally {
        setDeleteLoading(false);
      }
    },
    [setDeleteLoading]
  );

  useEffect(() => {
    if (bookmarks?.length) {
      newCursor.current = bookmarks[bookmarks.length - 1]?.id;
    }
    fetchPosts();
  }, [fetchPosts]);

  if (fetched.current && !bookmarks?.length) {
    return (
      <div className="h-full w-full flex flex-col gap-4 justify-center items-center">
        <div className="relative w-2/3 h-2/3">
          <Image
            alt="bookmark"
            src="/images/bookmarks.jpg"
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <p className=" text-center w-full p-2">Bookmark some posts</p>
      </div>
    );
  }

  const variants = {
    hide: { y: 50, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hide"
      animate="show"
      className="md:px-2 px w-auto h-fit rounded-box py-4  container mx-auto overflow-y-auto"
    >
      <div className="px-2 lg:px-[5%] xl:px-[0%] h-full  flex flex-col gap-3  lg:container lg:mx-auto relative">
        <AnimatePresence>
          {bookmarks?.length ? (
            <>
              {bookmarks.map((bookmark) => (
                <motion.div
                  key={bookmark?.id}
                  variants={variants}
                  exit={{
                    y: -50,
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      delay: 0.1,
                      y: { stiffness: 1000, velocity: -100 },
                    },
                  }}
                  layout
                  className="p-2 "
                >
                  {deleteLoading && (
                    <div className="absolute top-[50%] left-[50%]  z-40 w-full h-screen ">
                      <span className="loading loading-spinner text-error"></span>
                    </div>
                  )}
                  <div className="card card-compact bg-base-100 shadow-xl h-auto p-2 realtive">
                    <div className="flex flex-col sm:flex-row ">
                      <div className="flex-1 flex flex-col items-start card-body w-full">
                        <UserSection
                          user={bookmark?.post?.user}
                          createdAt={bookmark?.post?.createdAt}
                        />
                        {bookmark?.post?.images?.length > 0 && (
                          <div className=" w-full h-72  border-0 relative my-2 shadow-inner rounded-md">
                            <ImagesSection images={bookmark?.post?.images} />
                          </div>
                        )}
                        <BodySection body={bookmark?.post?.body} />
                      </div>

                      <div className="w-fit px-4 flex flex-row sm:flex-col  items-center justify-center  py-2 gap-8 card-actions">
                        <Link
                          href={`/post/${bookmark?.post?.id}`}
                          prefetch={false}
                        >
                          <button className="btn  btn-glass sm:btn-sm btn-sm btn-circle ">
                            <EyeIcon className="sm:w-6 sm:h-6 w-5 h-5" />
                          </button>
                        </Link>
                        <button
                          className="btn  btn-glass  sm:btn-sm btn-sm btn-circle hover:text-red-500"
                          onClick={(e) => handleDelete(e, bookmark?.post?.id)}
                          disabled={deleteLoading}
                        >
                          <TrashIcon className="sm:w-6 sm:h-6 w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          ) : (
            <div className="flex justify-center items-center h-32 w-full  ">
              <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
          )}
        </AnimatePresence>

        {bookmarks?.length > 0 && !fetched.current && (
          <div className="w-full flex justify-center items-center">
            <button
              className="btn btn-ghost btn-outline lowercase"
              onClick={fetchPosts}
              disabled={loading || fetched.current}
            >
              {loading ? (
                <p className="flex h-full w-full justify-center items-center leading-relaxed gap-x-2">
                  loading ...
                  <span className="loading loading-spinner text-primary"></span>
                </p>
              ) : (
                <p className="leading-realxed">load more</p>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default page;
