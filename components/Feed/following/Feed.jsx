"use client";

import FeedItem from "../common/FeedItem";
import { useCallback, useEffect, useRef, useState } from "react";
import followingPostStore from "@/stores/posts/followingPostStore";
import axios from "axios";
import bookmarkStore from "@/stores/bookmarkStore";
import { motion } from "framer-motion";
import followStore from "@/stores/followStore";
import userStore from "@/stores/userStore";

const Feed = ({ initialPosts, loggedUserId }) => {
  const globalPosts = followingPostStore((state) => state.posts);
  const removeAll = followingPostStore((state) => state.removeAll);
  const bookmarkIds = bookmarkStore((state) => state.bookmarkIds);

  const addPosts = followingPostStore((state) => state.addPosts);
  const addBookmarkIds = bookmarkStore((state) => state.addBookmarkIds);

  const currentUser = userStore((state) => state.loggedUser);
  const setUser = userStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const trackerRef = useRef(null);
  const newCursor = useRef(null);
  const observer = useRef(null);
  const allDataFetched = useRef(false);
  const bookmarksFetched = useRef(false);
  const initialPostsAdded = useRef(false);

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

      const url = `/api/posts/following?cursor=${newCursor.current}`;

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

  let followingUsers = followStore((state) => state.users);
  followingUsers = followingUsers
    ?.filter((user) => user?.following)
    ?.map((user) => user?.id);

  async function initialFetch() {
    try {
      const url = "/api/posts/following";
      const latestPosts = await axios.get(url);
      newCursor.current = latestPosts.data[latestPosts.data.length - 1]?.id;

      if (latestPosts.status !== 200) {
        throw new Error("something went wrong");
      }

      if (latestPosts?.data?.length === 0) {
        allDataFetched.current = true;
      }

      addPosts(beautify(latestPosts.data));
    } catch (error) {
      console.log("failed to get latest posts");
    }
  }

  const handleLoadMoreUserPosts = useCallback(async () => {
    try {
      setLoadMore(false);

      allDataFetched.current = false;
      newCursor.current = null;

      setUser({
        ...currentUser,
        followingIds: followingUsers,
      });

      console.log("initialFetch");

      removeAll();
      await initialFetch();
    } catch (error) {
    } finally {
    }
  }, [initialFetch, currentUser, followingUsers]);

  useEffect(() => {
    if (currentUser && followingUsers) {
      if (followingUsers?.length !== currentUser?.followingIds?.length)
        setLoadMore(true);
    }
  }, [followingUsers, currentUser, setLoadMore]);

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
        delay: 0.3,
        duration: 0.5,
        staggerChildren: 0.15,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="sm:px-2 px w-full h-fit rounded-box py-4 relative">
      {loadMore && (
        <div className="w-full flex justify-center items-center py-2">
          <button
            className="btn btn-primary btn-xs rounded-full lowercase"
            onClick={handleLoadMoreUserPosts}
          >
            manage updates
          </button>
        </div>
      )}
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
                type="following"
              />
            ))}
          </>
        ) : (
          <div className="flex justify-center items-center h-32 w-full  ">
            {!allDataFetched?.current ? (
              <span className="loading loading-spinner text-primary loading-lg"></span>
            ) : (
              <p>follow someone</p>
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
      </motion.div>
    </div>
  );
};

export default Feed;
