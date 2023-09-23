"use client";

import currentPostStore from "@/stores/currentPostStore";
import modalStore from "@/stores/modalStore";
import postStore from "@/stores/postStore";
import globalPostStore from "@/stores/posts/globalPostStore";
import userPostStore from "@/stores/posts/userPostStore";
import bookmarkStore from "@/stores/bookmarkStore";
import {
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  ChartBarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import {
  BookmarkIcon as BookmarkIconSolid,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/solid";
import axios from "axios";

import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const PostAction = ({ post, loggedUserId }) => {
  const postId = post?.id;
  const addPost = postStore((state) => state.addPost);
  const removePost = postStore((state) => state.removePost);

  const setLike = postStore((state) => state.setLike);
  const setLikeUser = userPostStore((state) => state.setLike);
  const setLikeGlobal = globalPostStore((state) => state.setLike);

  const setBookmark = postStore((state) => state.setBookmark);
  const setBookmarkUser = userPostStore((state) => state.setBookmark);
  const setBookmarkGlobal = globalPostStore((state) => state.setBookmark);

  const addBookmarkId = bookmarkStore((state) => state.addBookmarkId);
  const addBookmark = bookmarkStore((state) => state.addBookmark);
  const removeBookmark = bookmarkStore((state) => state.removeBookmark);
  const removeBookmarkId = bookmarkStore((state) => state.removeBookmarkId);

  const currentPost = postStore((state) => state.post, postId);

  const setPostId = currentPostStore((state) => state.setPostId);
  const openCommentModal = modalStore((state) => state.openCommentModal);
  const openDeletePostModal = modalStore((state) => state.openDeletePostModal);

  const LikeActionvariants = {
    liked: { opacity: 1, scale: [0, 0.5, 0.8, 1.3, 1] },

    unliked: { opacity: 1, scale: 1 },
  };

  const setLikeLocal = useCallback(async () => {
    // updating likes on both stores
    setLike(postId);
    setLikeUser(postId);
    setLikeGlobal(postId);

    try {
      const likeEndpoint = "/api/like";

      const res = await axios.post(likeEndpoint, {
        postId,
      });
    } catch (error) {
      console.log(error);

      // resetting likes
      setLike(postId);
      setLikeUser(postId);
      setLikeGlobal(postId);
    }
  }, [setLike, setLikeGlobal, setLikeUser]);

  const setBookmarkLocal = useCallback(
    async (e) => {
      e.preventDefault();

      const action = currentPost?.bookmarked ? "remove" : "add";

      try {
        let res;

        switch (action) {
          case "add":
            res = await axios.post("/api/bookmark", {
              postId,
            });
            if (res?.status !== 200) {
              throw new Error("something went wrong");
            }

            addBookmark(res?.data);
            addBookmarkId(res?.data?.post?.id);

            break;

          case "remove":
            res = await axios.delete("/api/bookmark", {
              data: {
                postId: postId,
              },
            });
            // returns {count : n}
            if (res?.status !== 200) {
              throw new Error("something went wrong");
            }

            removeBookmark(currentPost?.id);
            removeBookmarkId(currentPost?.id);

            break;
        }

        // updating bookmarks on all stores
        setBookmark(postId);
        setBookmarkUser(postId);
        setBookmarkGlobal(postId);
      } catch (error) {
        console.log(error);
      }
    },
    [
      currentPost,
      setBookmark,
      setBookmarkUser,
      setBookmarkGlobal,
      addBookmark,
      addBookmarkId,
      removeBookmark,
      removeBookmarkId,
    ]
  );

  const handleComment = useCallback(
    (e) => {
      e.preventDefault();

      setPostId(postId);
      openCommentModal();
    },
    [post?.id]
  );
  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();

      if (loggedUserId !== post?.user?.id) return;

      setPostId(currentPost?.id);
      openDeletePostModal();
    },
    [openCommentModal, loggedUserId, setPostId, currentPost?.id]
  );

  useEffect(() => {
    if (currentPost?.id !== post?.id) {
      addPost(post);
    }
  }, [post, addPost]);

  return (
    <div>
      <div className="py-2 flex justify-between items-center  w-full px-0 mt-2 ">
        <div
          className={`flex justify-start items-center w-full hover:text-red-300    
          }`}
          onClick={setLikeLocal}
        >
          <motion.div
            className="btn btn-ghost btn-sm btn-circle"
            variants={LikeActionvariants}
            animate={currentPost?.liked ? "liked" : "unliked"}
            transition={{
              duration: 0.25,
              ease: [0, 0.71, 0.2, 1.01],
              scale: {
                type: "spring",
                damping: 5,
                stiffness: 100,
                restDelta: 0.001,
              },
            }}
          >
            {currentPost?.liked ? (
              <HeartIconSolid className=" w-5 h-5 p-0.5 text-red-400" />
            ) : (
              <HeartIcon className=" w-5 h-5 p-0.5" />
            )}
          </motion.div>
          <span className="sm:ml-0.5 ml-0 text-xs sm:text-sm ">
            {currentPost?.likeCount}
          </span>
        </div>
        <div
          className="flex justify-start items-center  w-full hover:text-sky-300"
          onClick={handleComment}
        >
          <div className="btn btn-ghost btn-sm btn-circle ">
            <ChatBubbleOvalLeftIcon className=" w-5 h-5 p-0.5" />
          </div>
          <span className="sm:ml-0.5 ml-0 text-xs sm:text-sm">
            {currentPost?.commentCount}
          </span>
        </div>
        <div className="flex justify-start items-center  w-full hover:text-accent ">
          <div className="btn btn-ghost sm:btn-sm btn-xs btn-circle">
            <ChartBarIcon className=" w-5 h-5 " />
          </div>
          <span className="sm:ml-0.5 ml-0 text-xs sm:text-sm ">
            {(currentPost?.likeCount || 0) + (currentPost?.commentCount || 0)}
          </span>
        </div>

        <div
          className={`flex ${
            loggedUserId === post?.user?.id ? "justify-start" : "justify-center"
          } items-center  w-full`}
        >
          <div
            className="btn btn-ghost sm:btn-sm btn-xs btn-circle"
            onClick={setBookmarkLocal}
          >
            {currentPost?.bookmarked ? (
              <BookmarkIconSolid className=" w-5 h-5 p-0.5" />
            ) : (
              <BookmarkIcon className=" w-5 h-5 p-0.5" />
            )}
          </div>
          <span className="sm:ml-0.5 ml-0 text-xs sm:text-sm invisible">5</span>
        </div>

        {loggedUserId === post?.user?.id && (
          <div
            className="flex justify-start items-center  w-full hover:text-red-500"
            onClick={handleDelete}
          >
            <div className="btn btn-ghost sm:btn-sm btn-xs btn-circle">
              <TrashIcon className=" w-5 h-5 " />
            </div>
            <span className="sm:ml-0.5 ml-0 text-xs sm:text-sm invisible">
              6
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAction;
