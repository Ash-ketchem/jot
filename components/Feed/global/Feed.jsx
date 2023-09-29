"use client";

import FeedItem from "../common/FeedItem";
import { useCallback, useEffect, useRef, useState } from "react";
import globalPostStore from "@/stores/posts/globalPostStore";
import axios from "axios";
import bookmarkStore from "@/stores/bookmarkStore";
import { motion } from "framer-motion";
import scrollStore from "@/stores/ScrollStore";
import { usePathname } from "next/navigation";

const Feed = ({ initialPosts, loggedUserId }) => {
  const globalPosts = globalPostStore((state) => state.posts);
  const bookmarkIds = bookmarkStore((state) => state.bookmarkIds);

  const addPosts = globalPostStore((state) => state.addPosts);
  const addBookmarkIds = bookmarkStore((state) => state.addBookmarkIds);

  const paths = scrollStore((state) => state.paths);

  const [loading, setLoading] = useState(false);

  const trackerRef = useRef(null);
  const scrollRef = useRef(null);
  const newCursor = useRef(null);
  const observer = useRef(null);
  const allDataFetched = useRef(false);
  const bookmarksFetched = useRef(false);
  const initialPostsAdded = useRef(false);

  // ref to hold a function
  const beautifyRef = useRef(null);

  const pathname = usePathname();

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
      console.log(error);
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
    } finally {
      setLoading(false);
    }
  }, [addPosts]);

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
    <div className="sm:px-2 px w-full h-fit rounded-box py-4">
      <motion.div
        className="px-2 lg:px-[5%] xl:px-0 h-full w-full flex flex-col gap-3 pt-2 overflow-y-auto"
        variants={variants}
        initial="hide"
        animate="show"
      >
        {globalPosts?.length ? (
          <>
            {globalPosts.map((post) => (
              <FeedItem
                post={post}
                key={post.id}
                loggedUserId={loggedUserId}
                global={true}
              />
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
            className="h-[1px] bg-white border-4 w-full z-50"
            ref={trackerRef}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Feed;
