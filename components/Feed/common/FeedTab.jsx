"use client";

import Feed from "@/components/Feed/global/Feed";
import FeedFollowing from "@/components/Feed/following/Feed";
import { AnimatePresence, motion } from "framer-motion";
import PostTabStore from "@/stores/activePostTabStore";
import FeedTabSwitch from "./FeedTabSwitch";
// import Feed from "@/components/tests/Feed";

const FeedTab = ({ initialPosts, loggedUserId }) => {
  const { activeTab, setActiveTab } = PostTabStore((state) => state);

  return (
    <div className="flex flex-col mr-3">
      <FeedTabSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {activeTab === 0 ? (
          <Feed initialPosts={initialPosts} loggedUserId={loggedUserId} />
        ) : (
          <FeedFollowing loggedUserId={loggedUserId} />
        )}
      </div>
    </div>
  );
};

export default FeedTab;
