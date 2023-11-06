"use client";

import { motion } from "framer-motion";

const FeedTabSwitch = ({ activeTab, setActiveTab }) => {
  const tabVariants = {
    active: { opacity: 1 },
    inactive: { opacity: 0.5 },
  };

  const tabTransition = {
    duration: 0.3, // Adjust the duration for a smoother animation
    delay: 0.15,
    ease: "easeInOut", // Use a smoother easing function
  };

  return (
    <div className="tabs tab-boxed w-full  flex items-center gap-2">
      <motion.div
        variants={tabVariants}
        initial="inactive"
        animate={activeTab === 0 ? "active" : "inactive"}
        transition={tabTransition}
        className={`ml-2 p-3 basis-[48%] cursor-pointer flex justify-center items-center  leading-loose hover:bg-neutral hover:text-neutral-content rounded-xl ${
          activeTab === 0
            ? "tab-active bg-secondary text-secondary-content rounded-xl font-bold tracking-wide hover:bg-secondary hover:text-secondary-content "
            : ""
        }`}
        role="button"
        tabIndex={0}
        onClick={() => setActiveTab(0)}
      >
        Explore
      </motion.div>
      <motion.div
        variants={tabVariants}
        initial="inactive"
        animate={activeTab === 1 ? "active" : "inactive"}
        transition={tabTransition}
        className={`p-3 basis-[48%] cursor-pointer flex justify-center items-center  leading-loose hover:bg-neutral hover:text-neutral-content rounded-xl   ${
          activeTab === 1
            ? "tab-active bg-secondary text-secondary-content rounded-xl font-bold tracking-wide hover:bg-secondary  hover:text-secondary-content   "
            : ""
        }`}
        role="button"
        tabIndex={0}
        onClick={() => setActiveTab(1)}
      >
        Following
      </motion.div>
    </div>
  );
};

export default FeedTabSwitch;
