"use client";

import { XCircleIcon } from "@heroicons/react/24/outline";
import { PencilIcon as PencilIconSolid } from "@heroicons/react/24/solid";
import TextArea from "../common/TextArea";
import { useCallback, useState } from "react";
import axios from "axios";
import globalPostStore from "@/stores/posts/globalPostStore";
import userPostStore from "@/stores/posts/userPostStore";
import modalStore from "@/stores/modalStore";
import toastStore from "@/stores/toastStore";

const JotModal = ({ label }) => {
  const [isLoading, setIsLoading] = useState(false);

  const addPost = globalPostStore((state) => state.addPost);
  const addPostUser = userPostStore((state) => state.addPost);
  const closeJotModal = modalStore((state) => state.closeJotModal);
  const addToast = toastStore((state) => state.addToast);

  const handlePost = useCallback(async (e, jotBody, images) => {
    e?.preventDefault();

    if (!jotBody && !images?.length) {
      addToast("Jot can't be  empty");
      return;
    }

    try {
      setIsLoading(true);

      const url = "/api/jot";

      const postBody = {
        body: jotBody,
        images: images,
      };

      const res = await axios.post(url, postBody);

      if (res.status !== 200) {
        throw new Error("Something went wrong");
      }

      addPost({
        ...res.data,
        liked: false,
        likeCount: 0,
        commentCount: 0,
      });
      addPostUser({
        ...res.data,
        liked: false,
        likeCount: 0,
        commentCount: 0,
      });
      addToast("sucess !!");
      closeJotModal();
    } catch (error) {
      console.log(error);
      addToast("something went wrong !!");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const jotLabel = (
    <div className="flex gap-2 justify-center items-center">
      <span className=" leading-relaxed tracking-widest w-6 h-6">Jot</span>
      <PencilIconSolid className="w-6 h-6 p-1" />
    </div>
  );

  const bodyContent = (
    <div>
      <TextArea
        value=""
        placeholder="Say something sweet!!"
        submitLabel={jotLabel}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        handleSubmit={handlePost}
        btnSize="md"
        options={true}
      />
    </div>
  );
  const footerContent = <div className="w-full"></div>;

  return (
    <div>
      <dialog
        id="jotModal"
        className="modal h-full w-full flex justify-center items-center"
      >
        <form
          method="dialog"
          className="modal-box h-auto md:w-2/3  w-[95%] flex items-center flex-col"
        >
          <div className="right-2 top-2 h-auto py-2 flex justify-end items-center w-full -mt-4 ">
            <button
              className="btn btn-md btn-circle btn-ghost"
              disabled={isLoading}
            >
              <XCircleIcon className="w-8 h-8" />
            </button>
          </div>
          <div className="h-full w-full flex flex-col gap-2">
            <main className="">
              {bodyContent}
              {isLoading && (
                <div className="w-full h-full flex justify-center items-center p-4">
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

export default JotModal;
