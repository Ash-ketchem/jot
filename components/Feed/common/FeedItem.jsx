import BodySection from "./BodySection";
import ImagesSection from "./ImagesSection";
import UserActionGlobal from "../global/UserAction";
import UserActionUser from "../user/UserAction";
import UserSection from "./UserSection";
import { AnimatePresence, motion } from "framer-motion";
import UserActionFollowing from "../following/UserAction";

const FeedItem = ({ post, loggedUserId, type = "global" }) => {
  const cardStyle = post?.images?.length ? "vertical" : "horizontal";

  const variants = {
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.25,
        delay: 0.15,
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
    <div>
      <AnimatePresence>
        <motion.div
          className="card card-compact bg-base-100 shadow-xl h-auto p-2 pb-4"
          variants={variants}
          exit={{
            y: -50,
            opacity: 0,
            transition: {
              duration: 0.3,
              delay: 0.1,
              y: { stiffness: 1000, velocity: -100 },
            },
          }}
          layout
        >
          <div
            className={`flex flex-col sm:${
              cardStyle === "vertical" ? "flex-row" : "flex-col"
            }`}
          >
            <div className=" flex flex-col items-start card-body w-full">
              <UserSection user={post?.user} createdAt={post?.createdAt} />
              {post?.images?.length > 0 && (
                <ImagesSection images={post?.images} />
              )}
              <BodySection body={post.body} />
            </div>

            {type === "global" && (
              <UserActionGlobal
                postId={post.id}
                self={loggedUserId === post?.user?.id}
              />
            )}
            {type === "user" && (
              <UserActionUser
                postId={post.id}
                self={loggedUserId === post?.user?.id}
              />
            )}
            {type === "following" && (
              <UserActionFollowing
                postId={post.id}
                self={loggedUserId === post?.user?.id}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FeedItem;

// const oldCardStyle = (
// <div className="flex justify-center items-center">
//   <div className="card w-full bg-base-100 shadow-xl h-full xl:max-w-lg ">
//     <div className="card-body px-4 md:px-8">
//       <div className="card-title">
//         <UserSection user={post?.user} createdAt={post?.createdAt} />
//       </div>
//       <div className=" rounded-lg  py-1 flex flex-col gap-4">
//         <BodySection body={post.body} />
//         {/* <ImagesSection /> */}
//       </div>
//       <div className=" overflow-hidden">
//         {global ? (
//           <UserActionGlobal postId={post.id} />
//         ) : (
//           <UserActionUser postId={post.id} />
//         )}
//       </div>
//     </div>
//   </div>
// </div>
// );
