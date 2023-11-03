import {
  BookmarkIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import {
  BookmarkIcon as BookmarkIconSolid,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const CardAction = ({
  cardStyle,
  handleLike,
  currentPost,
  handleComment,
  handleBookmark,
  handleDelete,
  self,
}) => {
  const LikeActionvariants = {
    liked: { opacity: 1, scale: [0.5, 1, 1.2, 1] },
    unliked: { opacity: 1, scale: 1 },
  };

  const variants = {
    inc: {
      // opacity: 1,
      y: 0,
      transition: {
        ease: "easeOut",
        duration: 0.3,
      },
    },
    dec: { y: -50, opacity: 1 },
  };

  return (
    <div
      className={`w-full flex flex-row items-center justify-between  sm:px-3.5 px-4  sm:py-2 
      ${
        cardStyle === "vertical"
          ? "sm:w-fit h-full sm:flex-col sm:justify-center gap-5"
          : "sm:w-full sm:flex-row sm:justify-start gap-7  !px-0 "
      }   

      `}
    >
      <div
        className={`flex justify-start items-center ${
          cardStyle === "vertical" ? "sm:w-full " : "sm:w-fit "
        }  hover:text-red-300  ${cardStyle === "vertical" ? "sm:mt-4 " : ""}`}
        onClick={handleLike}
      >
        <motion.div
          className="btn btn-ghost  sm:btn-sm btn-xs btn-circle"
          animate={currentPost?.liked ? "liked" : "unliked"}
          variants={LikeActionvariants}
          transition={{
            duration: 0.1,
            ease: "easeInOut",
            scale: {
              type: "spring",
              damping: 10,
              stiffness: 100,
              restDelta: 0.001,
              // velocity: 20,
            },
          }}
        >
          {currentPost?.liked ? (
            <HeartIconSolid className=" w-5 h-5  text-red-400 " />
          ) : (
            <HeartIcon className="  w-5 h-5  " />
          )}
        </motion.div>
        <div>
          <span className="sm:ml-0.5 ml-1 text-xs  ">
            {currentPost?.likeCount}
          </span>
        </div>
      </div>

      <div
        className={`flex justify-start items-center ${
          cardStyle === "vertical" ? "sm:w-full" : "sm:w-fit"
        }  hover:text-sky-300 `}
        onClick={handleComment}
      >
        <div className="btn btn-ghost sm:btn-sm btn-xs btn-circle">
          <ChatBubbleOvalLeftIcon className=" w-5 h-5 " />
        </div>

        <div>
          <span className="sm:ml-0.5 ml-1 text-xs ">
            {currentPost?.commentCount}
          </span>
        </div>
      </div>

      <div
        className={`flex justify-start items-center ${
          cardStyle === "vertical" ? "sm:w-full" : "sm:w-fit"
        }  hover:text-accent `}
      >
        <div className="btn btn-ghost sm:btn-sm btn-xs btn-circle">
          <ChartBarIcon className=" w-5 h-5 " />
        </div>
        <div>
          <span className="sm:ml-0.5 ml-1 text-xs ">
            {(currentPost?.likeCount || 0) + (currentPost?.commentCount || 0)}
          </span>
        </div>
      </div>

      <div
        className={`flex justify-start items-center ${
          cardStyle === "vertical" ? "sm:w-full" : "sm:w-fit"
        }  `}
      >
        <div
          className="btn btn-ghost sm:btn-sm btn-xs btn-circle"
          onClick={handleBookmark}
        >
          {currentPost?.bookmarked ? (
            <BookmarkIconSolid className=" w-5 h-5 " />
          ) : (
            <BookmarkIcon className=" w-5 h-5 " />
          )}
        </div>
        <span
          className={`sm:ml-0.5 ml-1 text-xs  ${
            cardStyle === "vertical" ? "invisible" : "hidden"
          }  `}
        >
          8
        </span>
      </div>

      {self && (
        <div
          className={`flex justify-start items-center ${
            cardStyle === "vertical" ? "sm:w-full" : "sm:w-fit"
          }     hover:text-red-500 `}
          onClick={handleDelete}
        >
          <div className="btn btn-ghost sm:btn-sm btn-xs btn-circle">
            <TrashIcon className=" w-5 h-5 " />
          </div>
          <span
            className={`sm:ml-0.5 ml-1 text-xs  ${
              cardStyle === "vertical" ? "invisible" : "hidden"
            }  `}
          >
            4
          </span>
        </div>
      )}
    </div>
  );
};

export default CardAction;
