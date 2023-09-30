"use client";

import { XCircleIcon } from "@heroicons/react/24/outline";
import TextArea from "../common/TextArea";
import { useCallback, useState } from "react";
import currentPostStore from "@/stores/currentPostStore";
import axios from "axios";
import postStore from "@/stores/postStore";
import userPostStore from "@/stores/posts/userPostStore";
import globalPostStore from "@/stores/posts/globalPostStore";
import commentStore from "@/stores/commentStore";
import modalStore from "@/stores/modalStore";
import followingPostStore from "@/stores/posts/followingPostStore";

const CommentModal = (label) => {
  const [isLoading, setIsLoading] = useState(false);

  const currentPostId = currentPostStore((state) => state.postId);
  const setComment = postStore((state) => state.setComment);
  const setCommentGlobal = globalPostStore((state) => state.setComment);
  const setCommentUser = userPostStore((state) => state.setComment);
  const setCommentFollowing = followingPostStore((state) => state.setComment);

  const addComment = commentStore((state) => state.addComment);
  const closeCommentModal = modalStore((state) => state.closeCommentModal);

  const handleComment = useCallback(
    async (e, body) => {
      e.preventDefault();

      if (!body) {
        alert("comment cannot be emprty");
        return;
      }

      try {
        setIsLoading(true);
        const res = await axios.post("/api/comment", {
          postId: currentPostId,
          body: body,
        });

        if (res.status !== 200) {
          throw new Error("Something went wrong");
        }

        closeCommentModal();

        setComment(currentPostId, "add");
        setCommentGlobal(currentPostId, "add");
        setCommentUser(currentPostId, "add");
        setCommentFollowing(currentPostId, "add");
        addComment(res?.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPostId]
  );

  const bodyContent = (
    <div>
      {/* <div>
        <p>comment 1</p>
        <p>comment 2</p>
        <p>comment 3</p>
      </div> */}
      <TextArea
        value=""
        placeholder="Comment something sweet!!"
        submitLabel="Comment"
        handleSubmit={handleComment}
        isLoading={isLoading}
        btnSize="md"
      />
    </div>
  );
  const footerContent = <div className="w-full"></div>;

  return (
    <div>
      <dialog
        id="commentModal"
        className="modal h-full flex justify-center items-center"
      >
        <form
          method="dialog"
          className="modal-box h-auto md:w-2/3 w-[95%] flex items-center flex-col"
        >
          <div className="right-2 top-2 h-auto py-2 flex justify-end items-center w-full -mt-4 ">
            <button className="btn btn-md btn-circle btn-ghost">
              <XCircleIcon className="w-8 h-8" />
            </button>
          </div>
          <div className="h-full w-full flex flex-col gap-2">
            <main>
              {bodyContent}
              {isLoading && (
                <div className="flex w-full h-full justify-center items-center">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              )}
            </main>
            <footer>{footerContent}</footer>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default CommentModal;
