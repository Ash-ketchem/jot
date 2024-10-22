"use client";

import FeedItem from "../common/FeedItem";
import { useCallback, useEffect, useRef, useState } from "react";
import globalPostStore from "@/stores/posts/globalPostStore";
import axios from "axios";
import bookmarkStore from "@/stores/bookmarkStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toastStore from "@/stores/toastStore";

const Feed = ({ initialPosts, loggedUserId }) => {
  // to render only 5 cards on first render
  // to make entry animation smoother
  const [limit, setLimit] = useState(true);

  let globalPosts = globalPostStore((state) => state.posts);

  const bookmarkIds = bookmarkStore((state) => state.bookmarkIds);

  const addPosts = globalPostStore((state) => state.addPosts);
  const addBookmarkIds = bookmarkStore((state) => state.addBookmarkIds);

  const addToast = toastStore((state) => state.addToast);

  const [loading, setLoading] = useState(false);

  const trackerRef = useRef(null);
  const newCursor = useRef(null);
  const observer = useRef(null);
  const allDataFetched = useRef(false);
  const bookmarksFetched = useRef(false);
  const initialPostsAdded = useRef(false);

  const router = useRouter();

  // ref to hold a function
  const beautifyRef = useRef(null);

  const checkLiked = useCallback((likeIds) => {
    return likeIds.includes(loggedUserId);
  }, []);

  const beautify = useCallback(
    (posts = []) => {
      return posts.map((post) => ({
        ...post,
        liked: checkLiked(post?.likeIds || []),
        likeCount: post?.likeIds?.length || 0,
        commentCount: post?._count?.comments || 0,
        bookmarked: bookmarkIds?.includes(post?.id) || post?.bookmarked,
      }));
    },
    [bookmarkIds]
  );

  const getBookmarks = useCallback(async () => {
    if (bookmarksFetched.current) return;
    try {
      const res = await axios.get("/api/bookmark");

      if (res?.status !== 200) {
        throw new Error("something went wrong");
      }

      bookmarksFetched.current = true;

      addBookmarkIds(res?.data);
    } catch (error) {
      // console.log(error);
    }
  }, [addBookmarkIds]);

  const fetchPosts = useCallback(async () => {
    if (allDataFetched.current) {
      return;
    }
    try {
      setLoading(true);

      if (!newCursor.current) return;

      const url = `/api/posts?cursor=${newCursor.current}`;

      const res = await axios.get(url);

      if (res.status !== 200) {
        throw new Error("Something went wrong");
      }

      if (!res.data?.length) {
        allDataFetched.current = true;
      } else {
        newCursor.current = res.data[0]?.id;
        addPosts(beautifyRef.current(res.data));
      }
    } catch (error) {
      console.log(error);
      //add a toast
      addToast("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [addPosts]);

  useEffect(() => {
    if (limit) {
      globalPosts = globalPosts.slice(0, 5);
    }
  }, []);

  // infinite scroll setup
  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!loading) {
            // fetch new posts

            fetchPosts();
          }
        }
      });
    }

    const currentObserver = observer.current;

    if (trackerRef.current) {
      // hooking up the loading div to observer
      currentObserver.observe(trackerRef.current);
    }

    return () => {
      if (trackerRef.current) {
        currentObserver.unobserve(trackerRef.current);
      }
    };
  }, [loading]);

  useEffect(() => {
    if (globalPosts?.length) {
      return;
    }

    if (initialPosts?.length) {
      newCursor.current = initialPosts[initialPosts.length - 1]?.id;
      addPosts(beautify(initialPosts));
    } else {
      // get initial posts

      async function initialFetch() {
        try {
          const url = "/api/posts/latest";
          const latestPosts = await axios.get(url);
          newCursor.current = latestPosts.data[latestPosts.data.length - 1]?.id;

          addPosts(beautify(latestPosts.data));
        } catch (error) {
          console.log("failed to get latest posts");
        }
      }

      initialFetch();
    }
  }, [initialPosts]);

  useEffect(() => {
    if (!bookmarkIds?.length) {
      getBookmarks();
    }

    if (bookmarksFetched.current) initialPostsAdded.current = true;

    // because the intersection observer calls the old definition of
    // fetchposts so the new definition is stored in a ref when
    // dependencies changes
    beautifyRef.current = beautify;
  }, [bookmarkIds]);

  useEffect(() => {
    if (globalPosts?.length) {
      newCursor.current = globalPosts[globalPosts.length - 1]?.id;
    }
  }, []);

  // restet limit
  useEffect(() => {
    const timer = setTimeout(() => {
      //slow down full initial render
      setLimit(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const variants = {
    hide: { y: 50, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        // delay: 0.3,
        duration: 0.3,
        staggerChildren: 0.15,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="md:px-2 px w-auto h-fit rounded-box py-4  container mx-auto">
      <motion.div
        variants={variants}
        // initial="hide"
        // animate="show"
        // layout
      >
        <div className="px-2 lg:px-[5%] xl:px-[0%] h-full  flex flex-col gap-3  lg:container lg:mx-auto">
          {globalPosts?.length ? (
            <>
              {globalPosts.map((post) => (
                <div
                  onClick={() => router.push(`/post/${post?.id}`)}
                  key={post?.id}
                  className="cursor-pointer"
                >
                  <FeedItem
                    post={post}
                    key={post.id}
                    loggedUserId={loggedUserId}
                    type="global"
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="flex justify-center items-center h-32 w-full  ">
              {initialPosts?.length ? (
                <span className="loading loading-spinner text-primary loading-lg"></span>
              ) : (
                <p>No posts found!!</p>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center">
              <span className="loading loading-dots loading-lg "></span>
            </div>
          ) : (
            <div
              className="h-[1px] bg-white border-0 w-full z-50 invisible"
              ref={trackerRef}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Feed;
