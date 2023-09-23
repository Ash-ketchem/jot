"use client";

import currentPostStore from "@/stores/currentPostStore";
import modalStore from "@/stores/modalStore";
import postStore from "@/stores/postStore";
import globalPostStore from "@/stores/posts/globalPostStore";
import userPostStore from "@/stores/posts/userPostStore";
import bookmarkStore from "@/stores/bookmarkStore";
import axios from "axios";
import { useCallback } from "react";
import CardAction from "../common/CardAction";

const UserAction = ({ postId, self }) => {
  const setLike = userPostStore((state) => state.setLike);
  const setLikeGlobal = globalPostStore((state) => state.setLike);
  const setLikePost = postStore((state) => state.setLike);

  const setBookmark = globalPostStore((state) => state.setBookmark);
  const setBookmarkUser = userPostStore((state) => state.setBookmark);
  const setBookmarkPost = postStore((state) => state.setBookmark);

  const addBookmarkId = bookmarkStore((state) => state.addBookmarkId);
  const addBookmark = bookmarkStore((state) => state.addBookmark);
  const removeBookmark = bookmarkStore((state) => state.removeBookmark);
  const removeBookmarkId = bookmarkStore((state) => state.removeBookmarkId);

  const currentPost = userPostStore(
    (state) => state.posts.find((post) => post.id === postId),
    postId
  );

  const openCommentModal = modalStore((state) => state.openCommentModal);
  const openDeletePostModal = modalStore((state) => state.openDeletePostModal);

  const setPostId = currentPostStore((state) => state.setPostId);
  const removePostId = currentPostStore((state) => state.removePostId);

  const cardStyle = currentPost?.images?.length ? "vertical" : "horizontal";

  const setLikeLocal = useCallback(
    async (e) => {
      e.preventDefault();
      setLike(postId);
      setLikeGlobal(postId);
      setLikePost(postId);
      try {
        const likeEndpoint = "/api/like";

        const res = await axios.post(likeEndpoint, {
          postId,
        });
      } catch (error) {
        console.log(error);

        // resetting likes
        setLike(postId);
        setLikeGlobal(postId);
        setLikePost(postId);
      }
    },
    [setLike, setLikeGlobal, setLikePost]
  );

  const handleComment = useCallback(
    (e) => {
      e.preventDefault();

      setPostId(currentPost?.id);

      openCommentModal();
    },
    [currentPost]
  );

  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();

      if (!self) return;

      setPostId(currentPost?.id);
      openDeletePostModal();
    },
    [openCommentModal, setPostId, currentPost?.id, self]
  );

  const setBookmarkLocal = useCallback(
    async (e) => {
      console.log(e);
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

        // updating bookmarks on both stores
        setBookmark(postId);
        setBookmarkUser(postId);
        setBookmarkPost(postId);
      } catch (error) {
        console.log(error);
      }
    },
    [
      currentPost,
      setBookmark,
      setBookmarkUser,
      setBookmarkPost,
      addBookmark,
      addBookmarkId,
      removeBookmark,
      removeBookmarkId,
    ]
  );

  return (
    <CardAction
      cardStyle={cardStyle}
      handleLike={setLikeLocal}
      handleComment={handleComment}
      handleBookmark={setBookmarkLocal}
      handleDelete={handleDelete}
      currentPost={{
        liked: currentPost?.liked,
        likeCount: currentPost?.likeCount,
        commentCount: currentPost?.commentCount,
        bookmarked: currentPost?.bookmarked,
      }}
      self={self}
    />
  );
};

export default UserAction;
