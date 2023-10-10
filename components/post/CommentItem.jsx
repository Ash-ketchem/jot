"use client";

import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CommentItem = ({ comment, self, deleteComment }) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const commentVariants = {
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.25,
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    hide: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  return (
    <motion.div
      className="w-full h-full border-0 p-2 relative after:h-[90%] after:w-1 after:bg-accent/50 after:absolute  after:top-[20%] after:left-[1.4rem] after:z-30"
      variants={commentVariants}
      initial="hide"
      animate="show"
    >
      {/* left-7 = left-5 + p-2 */}
      <motion.div
        className="flex flex-col gap-4"
        exit={{
          x: 50,
          opacity: 0,
          transition: {
            duration: 0.3,
            delay: 0.1,
            x: { stiffness: 1000, velocity: -100 },
          },
        }}
        layout
      >
        <div className="flex  items-center relative">
          <div className="flex items-center justify-start gap-4 flex-1">
            <div className="avatar z-50">
              <div className="w-8 h-8 rounded-full relative">
                <Image
                  src={comment?.user?.profileImage || "/images/intro.jpg"}
                  fill
                  alt="profile image"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm">{comment?.user?.name}</p>
              <p
                className="font-semibold text-sm cursor-pointer hover:underline leading-loose"
                onClick={() => router.push(`/user/${comment?.user?.id}`)}
              >
                {comment?.user?.username}
              </p>
            </div>
            <div>
              <p className="text-xs">2 sec ago</p>
            </div>
          </div>
          {self && (
            <div
              className="ml-0 leading-relaxed sm:text-sm text-xs "
              onClick={() => deleteComment(comment?.id, setIsLoading)}
            >
              <button
                className="btn btn-ghost hover:text-red-600 btn-circle btn-xs"
                disabled={isLoading}
              >
                <TrashIcon className="w-4.5 h-4.5 p-0.5" />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 items-start ">
          <p className="ml-6 leading-relaxed sm:text-sm text-xs pl-2 mb-2">
            {comment?.body}
            {isLoading && (
              <span className="loading loading-spinner h-5 w-5 p-2  text-error absolute left-[50%] top-[70%]"></span>
            )}
          </p>
          {/* <div className="hidden ">
            <div className="ml-9 leading-relaxed sm:text-sm text-xs">
              <div className="btn btn-ghost hover:text-red-600 btn-circle btn-xs">
                <TrashIcon className="w-5 h-5 " />
              </div>
            </div>
            <div className="ml-9 leading-relaxed sm:text-sm text-xs">
              <div className="btn btn-ghost hover:text-red-600 btn-circle btn-xs">
                <HeartIcon className="w-5 h-5 " />
              </div>
            </div>
          </div> */}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CommentItem;
