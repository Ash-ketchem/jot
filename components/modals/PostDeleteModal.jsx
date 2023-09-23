"use client";

import bookmarkStore from "@/stores/bookmarkStore";
import currentPostStore from "@/stores/currentPostStore";
import modalStore from "@/stores/modalStore";
import postStore from "@/stores/postStore";
import globalPostStore from "@/stores/posts/globalPostStore";
import userPostStore from "@/stores/posts/userPostStore";
import toastStore from "@/stores/toastStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const PostDeleteModal = () => {
  const deletePostGlobal = globalPostStore((state) => state.deletePost);
  const deletePostUser = userPostStore((state) => state.deletePost);
  const deletePost = postStore((state) => state.deletePost);
  const removeBookmark = bookmarkStore((state) => state.removeBookmark);
  const removeBookmarkId = bookmarkStore((state) => state.removeBookmarkId);

  const currentPostId = currentPostStore((state) => state.postId);
  const closeDeletePostModal = modalStore(
    (state) => state.closeDeletePostModal
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const addToast = toastStore((state) => state.addToast);

  const deletePostHandler = useCallback(async () => {
    try {
      if (!currentPostId) {
        throw new Error("invalid post");
      }
      setLoading(true);
      const res = await axios.delete("/api/post", {
        data: {
          id: currentPostId,
        },
      });
      deletePostGlobal(currentPostId);
      deletePostUser(currentPostId);
      deletePost(currentPostId);
      removeBookmark(currentPostId);
      removeBookmarkId(currentPostId);

      addToast("sucess !!");

      router.refresh();

      closeDeletePostModal();
    } catch (error) {
      console.log(error);
      addToast("something went wrong");
    } finally {
      setLoading(false);
    }
  }, [deletePostGlobal, deletePostUser, deletePost, currentPostId, router]);

  const bodyContent = (
    <div className="w-full h-full  flex flex-col items-center justify-evenly ">
      <div className="">
        <p className="text-sm">
          {loading ? (
            <span className="loading loading-spinner text-warning"></span>
          ) : (
            "Are you sure?"
          )}
        </p>
      </div>
      <div className="w-full flex justify-evenly items-center">
        <div>
          <button className="btn btn-info rounded-xl" disabled={loading}>
            close
          </button>
        </div>
        <div>
          <button
            className="btn btn-error rounded-xl"
            onClick={(e) => {
              e.preventDefault();
              deletePostHandler();
            }}
            disabled={loading}
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <dialog
        id="deletePostModal"
        className="modal h-full flex justify-center items-center"
      >
        <form
          method="dialog"
          className="modal-box md:w-2/3 w-[95%] flex items-center flex-col h-48 "
        >
          <main className="w-full h-full">{bodyContent}</main>
        </form>
      </dialog>
    </div>
  );
};

export default PostDeleteModal;
