"use client";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import { useCallback, useRef, useState } from "react";

const ImageCarousel = ({ images }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const pageIndex = useRef(0);

  const wrap = useCallback((min, max, value) => {
    const range = max - min;
    return ((((value - min) % range) + range) % range) + min;
  }, []);

  pageIndex.current = wrap(0, images.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const maxImageHeight = Math.max(...images.map((img) => img?.maxHeight));

  return (
    <div
      className={`w-full relative my-0 shadow-inner rounded-md overflow-hidden  ${
        maxImageHeight > 0 ? "h-80" : "h-72"
      }`}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          className="relative w-full h-full flex"
          key={page}
          custom={direction}
          initial={{ x: direction * 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            x: { type: "spring", stiffness: 100, damping: 20, mass: 1.2 },
            opacity: { duration: 0.3 },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {["jpg", "png"].includes(images[pageIndex.current]?.mediaType) ? (
            <CldImage
              src={images[pageIndex.current]?.media}
              alt="post images"
              fill
              // blurDataURL="/images/blur.jpg"
              // placeholder="blur"
              className={` rounded-xl bg-base-200/60 object-${
                images[pageIndex.current]?.objectFit
              }`}
              loading="lazy"
            />
          ) : (
            <CldVideoPlayer
              src={images[pageIndex.current]?.media}
              className={`rounded-xl  w-full ${
                maxImageHeight > 0 ? "!h-80" : "!h-72"
              }`}
              preload="auto"
            />
          )}
        </motion.div>
      </AnimatePresence>
      {images?.length > 1 && (
        <div className="w-full flex justify-between items-center absolute top-[50%] left-0 z-30 text-white">
          <motion.div
            className="btn btn-sm btn-ghost btn-circle font-bold hover:text-accent hover:bg-transparent "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              paginate(-1);
            }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.1, ease: "easeInOut" },
            }}
          >
            <ArrowLeftCircleIcon className="w-5 h-5" />
          </motion.div>
          <motion.div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              paginate(1);
            }}
            className="btn btn-sm btn-ghost btn-circle font-bold hover:text-accent hover:bg-transparent"
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.1, ease: "easeInOut" },
            }}
          >
            <ArrowRightCircleIcon className="w-5 h-5 font-bol" />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
