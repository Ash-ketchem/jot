"use client";

import toastStore from "@/stores/toastStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const Toaster = () => {
  const { toasts, addToast, removeToast } = toastStore((state) => state);

  useEffect(() => {
    const interval = setInterval(() => {
      if (toasts.length) {
        removeToast();
      }
    }, 1000);
    if (!toasts.length) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [toasts]);

  return (
    <div className="w-screen h-screen  top-0 left-0 border-0 flex justify-center items-center  absolute pointer-events-none z-50">
      <motion.div
        layout
        className=" mt-4 h-full flex-col gap-4  w-[20rem] z-50 flex items-center "
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {
            opacity: 0,
            y: -20,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              damping: 20,
              stiffness: 300,
            },
          },
        }}
        exit={{ opacity: 0, y: -50 }}
      >
        {toasts.map((toast, i) => (
          <AnimatePresence key={toast?.id}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  duration: 0.3,
                  delay: 0.1,
                },
              }}
              exit={{
                opacity: 0,
                y: -20,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                },
              }}
              key={toast?.id}
            >
              <div className="alert  bg-white text-black w-[18rem] flex justify-center items-center z-50 leading-relaxed tracking-wide text-sm">
                <span className="w-full text-center">{toast?.label}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
      </motion.div>
    </div>
  );
};

export default Toaster;
