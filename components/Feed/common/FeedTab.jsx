"use client";

import Feed from "@/components/Feed/global/Feed";
import FeedFollowing from "@/components/Feed/following/Feed";
import { AnimatePresence, motion } from "framer-motion";
import PostTabStore from "@/stores/activePostTabStore";

const FeedTab = ({ initialPosts, loggedUserId }) => {
  const { activeTab, setActiveTab } = PostTabStore((state) => state);

  return (
    <div className="flex flex-col">
      <div className="tabs w-full  flex items-center p-2">
        <div
          className={`tab tab-bordered basis-[50%] cursor-pointer ${
            activeTab === 0 ? "tab-active !border-accent" : ""
          }`}
          role="button"
          tabIndex={0}
          onClick={() => setActiveTab(0)}
        >
          Explore
        </div>
        <div
          className={`tab tab-bordered basis-[50%] cursor-pointer ${
            activeTab === 1 ? "tab-active !border-accent" : ""
          }`}
          role="button"
          tabIndex={0}
          onClick={() => setActiveTab(1)}
        >
          Following
        </div>
      </div>
      <div>
        <AnimatePresence mode="await">
          {activeTab === 0 ? (
            <Feed initialPosts={initialPosts} loggedUserId={loggedUserId} />
          ) : (
            <FeedFollowing loggedUserId={loggedUserId} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeedTab;
