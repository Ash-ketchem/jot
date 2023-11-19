"use client";

import userPostStore from "@/stores/posts/userPostStore";
import FeedItem from "../common/FeedItem";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import bookmarkStore from "@/stores/bookmarkStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Feed = ({
  userId,
  initialPosts,
  loggedUserId,
  useractionVisible = true,
}) => {
  let posts = userPostStore((state) => state.posts);
  posts = posts.filter((post) => post?.user?.id === userId);

  const bookmarkIds = bookmarkStore((state) => state.bookmarkIds);
  const addPosts = userPostStore((state) => state.addPosts);
  const removePosts = userPostStore((state) => state.removePosts);
  const addBookmarkIds = bookmarkStore((state) => state.addBookmarkIds);

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
    (posts) => {
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

      if (!newCursor.current || !userId || typeof userId !== "string") return;

      const url = `/api/posts/${userId}?cursor=${newCursor.current}`;

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
    if (initialPosts?.length) {
      newCursor.current = initialPosts[initialPosts.length - 1]?.id;
      addPosts(beautify(initialPosts));
    } else {
      // get initial posts

      async function initialFetch() {
        try {
          if (!userId || typeof userId !== "string") return;
          const url = `/api/posts/latest/${userId}`;
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
    if (!bookmarkIds.length) {
      getBookmarks();
    }

    if (bookmarksFetched.current) initialPostsAdded.current = true;

    // because the intersection observer calls the old definition of
    // fetchposts so the new definition is stored in a ref when
    // dependencies changes
    beautifyRef.current = beautify;
  }, [bookmarkIds]);

  useEffect(() => {
    if (posts?.length) {
      newCursor.current = posts[posts.length - 1]?.id;
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
    <div className="md:px-2 px w-auto h-fit rounded-box py-4  container mx-auto">
      <motion.div
        variants={variants}
        initial="hide"
        animate="show"
        className="px-2 lg:px-[5%] xl:px-[0%] h-full  flex flex-col gap-3  lg:container lg:mx-auto"
      >
        {posts?.length ? (
          <>
            {posts.map((post) => (
              <div
                onClick={() => router.push(`/post/${post?.id}`)}
                key={post?.id}
                className="cursor-pointer"
              >
                <FeedItem
                  post={post}
                  key={post.id}
                  type="user"
                  loggedUserId={loggedUserId}
                  useractionVisible={useractionVisible}
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
            className="h-[1px] bg-transparent border-1 w-full invisible"
            ref={trackerRef}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Feed;
