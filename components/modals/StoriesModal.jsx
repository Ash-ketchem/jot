"use client";

import { XCircleIcon } from "@heroicons/react/24/outline";
import { PencilIcon as PencilIconSolid } from "@heroicons/react/24/solid";
import TextAreaStories from "../common/TextAreaStories";
import { useCallback, useState } from "react";
import axios from "axios";
import modalStore from "@/stores/modalStore";
import toastStore from "@/stores/toastStore";
import { useRouter } from "next/navigation";

const StoriesModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const closeStoriesModal = modalStore((state) => state.closeStoriesModal);
  const addToast = toastStore((state) => state.addToast);

  const router = useRouter();

  const handlePost = useCallback(
    async (e, jotBody, images) => {
      e?.preventDefault();

      if (!jotBody && !images?.length) {
        addToast("Jot can't be  empty");
        return;
      }

      try {
        setIsLoading(true);

        const url = "/api/story";

        const postBody = {
          body: jotBody,
          images: images,
        };

        const res = await axios.post(url, postBody);

        if (res.status !== 200) {
          throw new Error("Something went wrong");
        }

        addToast("sucess !!");
        closeStoriesModal();
        router.refresh();
      } catch (error) {
        console.log(error);
        addToast("something went wrong !!");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const jotLabel = (
    <div className="flex gap-5 justify-center items-center">
      <span className=" leading-relaxed tracking-widest w-6 h-6">story</span>
      <PencilIconSolid className="w-4 h-4 p-0" />
    </div>
  );

  const bodyContent = (
    <div>
      <TextAreaStories
        value=""
        placeholder="What's happening now?"
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
        id="storiesModal"
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

export default StoriesModal;
