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
    <div className="w-screen h-screen  top-0 left-0  flex justify-start items-center  absolute  flex-col gap-4">
      {toasts.map((toast) => (
        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.25,
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.25,
                delay: 0.1,
              },
            }}
            layout
            key={toast?.id}
            className="toast toast-top toast-center z-50 absolute top-20"
          >
            <div className="alert bg-neutral text-neutral-content w-[20rem] flex justify-center items-center ">
              <span>{toast?.label}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
};

export default Toaster;
