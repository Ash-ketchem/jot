"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import TextArea from "../common/TextArea";
import CommentItem from "./CommentItem";
import axios from "axios";
import postStore from "@/stores/postStore";
import globalPostStore from "@/stores/posts/globalPostStore";
import userPostStore from "@/stores/posts/userPostStore";
import commentStore from "@/stores/commentStore";
import {
  ArrowDownCircleIcon,
  StopCircleIcon,
} from "@heroicons/react/24/outline";
import userStore from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import followingPostStore from "@/stores/posts/followingPostStore";

const CommentFeed = ({ comments, postId, totalcomments, postOwnerId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const newCursor = useRef(null);
  const finished = useRef(false);
  const commentCount = useRef(0);
  const totalComments = useRef(totalcomments);

  const setComment = postStore((state) => state.setComment);
  const setCommentGlobal = globalPostStore((state) => state.setComment);
  const setCommentUser = userPostStore((state) => state.setComment);
  const setCommentFollowing = followingPostStore((state) => state.setComment);

  const addComment = commentStore((state) => state.addComment);
  const addComments = commentStore((state) => state.addComments);
  const removeComment = commentStore((state) => state.removeComment);

  let postComments = commentStore((state) => state.comments, postId);

  postComments = postComments.filter((comment) => comment?.postId === postId);

  const loggedUserId = userStore((state) => state.loggedUser?.id);

  const router = useRouter();

  const handleComment = useCallback(
    async (e, body) => {
      e.preventDefault();

      if (!body) {
        alert("comment cannot be empty");
        return;
      }

      try {
        setIsLoading(true);
        const res = await axios.post("/api/comment", {
          postId: postId,
          body: body,
        });

        if (res.status !== 200) {
          throw new Error("Something went wrong");
        }
        addComment(res?.data);
        setComment(postId, "add");
        setCommentGlobal(postId, "add");
        setCommentUser(postId, "add");
        setCommentFollowing(postId, "add");
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [postId]
  );

  const deleteComment = useCallback(
    async (id, setIsLoading) => {
      try {
        setIsLoading(true);
        const res = await axios.delete("/api/comment", {
          data: {
            id: id,
          },
        });

        if (res?.status !== 200) {
          throw new Error("something went wrong");
        }

        removeComment(id);

        setComment(postId, "remove");
        setCommentGlobal(postId, "remove");
        setCommentUser(postId, "remove");
        setCommentFollowing(postId, "remove");

        if (commentCount.current === 1) {
          // if its the last comment
          router.refresh();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      removeComment,
      router,
      setComment,
      setCommentGlobal,
      setCommentUser,
      loggedUserId,
      postOwnerId,
    ]
  );

  const handleMoreComments = useCallback(async () => {
    if (finished.current) return;

    try {
      setIsLoading(true);
      const res = await axios.get(
        `/api/comment/${postId}?cursor=${newCursor.current}`
      );

      if (res.status !== 200) {
        throw new Error("Something went wrong");
      }

      if (!res?.data.length) {
        finished.current = true;
        return;
      }

      addComments(res?.data.reverse());

      newCursor.current = res?.data[res?.data?.length - 1]?.id;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [addComments]);

  useEffect(() => {
    commentCount.current = postComments?.length || commentCount.current;
  }, [postComments]);

  useEffect(() => {
    if (!postComments?.length) {
      addComments(comments);
    }
    newCursor.current = comments[comments.length - 1]?.id;
  }, [comments]);

  useEffect(() => {
    if (postComments?.length) {
      newCursor.current = postComments[postComments?.length - 1]?.id;
    }
    console.log(newCursor);
  }, []);

  const showArrowIcon =
    !finished.current &&
    postComments?.length < totalComments.current &&
    totalComments.current > 0;

  const noComments = !comments?.length && !postComments?.length;

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="w-full border-t-[1px] border-primary-content/10 py-2 mt-1">
        <div className="mt-2">
          <TextArea
            placeholder="Comment your reply"
            submitLabel="comment"
            btnSize="xs"
            handleSubmit={handleComment}
            isLoading={isLoading}
          />
          {isLoading && (
            <div className="flex w-full h-full justify-center items-center">
              <span className="loading loading-spinner text-primary"></span>
            </div>
          )}
        </div>

        <motion.div
          className="flex flex-col gap-0  rounded-box py-2"
          transition={{
            staggerChildren: 0.15,
            staggerDirection: -1,
          }}
        >
          <AnimatePresence>
            {postComments?.map((comment) => (
              <div key={comment?.id}>
                <CommentItem
                  comment={comment}
                  self={
                    postOwnerId === loggedUserId ||
                    loggedUserId === comment?.user?.id
                  }
                  deleteComment={deleteComment}
                />
              </div>
            ))}

            {postComments?.length > 0 ? (
              <div className="w-full h-full p-0 relative ">
                <button
                  className={`top-0 left-0 z-30  absolute btn-circle  btn btn-ghost   btn-sm ml-2.5 mt-2 ${
                    showArrowIcon ? "animate-bounce" : " opacity-30"
                  }`}
                  onClick={handleMoreComments}
                  disabled={isLoading || finished.current || !showArrowIcon}
                >
                  {!showArrowIcon ? (
                    <StopCircleIcon className="w-6 h-6 text-accent " />
                  ) : (
                    <ArrowDownCircleIcon className="w-6 h-6 text-accent " />
                  )}
                </button>
              </div>
            ) : (
              !noComments && (
                <div className="w-full flex justify-center items-center">
                  <span className="loading loading-spinner text-accent "></span>
                </div>
              )
            )}
          </AnimatePresence>

          {noComments && <p>Be the first to comment !!</p>}
        </motion.div>
      </div>
    </div>
  );
};

export default CommentFeed;
