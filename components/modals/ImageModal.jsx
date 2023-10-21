"use client";

import { XCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import selectedImageStore from "@/stores/selectedImageStore";
import { CldImage } from "next-cloudinary";

const ImageModal = () => {
  const selectedImage = selectedImageStore((state) => state.image);

  const modalStyle = {
    maxWidth: `${selectedImage?.w}px`, // Set max-width using inline style
    maxHeight: `${selectedImage?.h}px`, // Set max-height using inline style
  };

  // console.log(selectedImage, "image");

  const bodyContent = (
    <div>
      {selectedImage?.img && (
        <div className="">
          <CldImage
            src={selectedImage?.img}
            alt="post images"
            fill
            // blurDataURL="/images/blur.jpg"
            // placeholder="blur"
            className={` rounded-xl bg-base-200/60  relative cursor-pointer`}
            loading="lazy"
          />

          <button>
            <XCircleIcon className="w-6 h-6 absolute top-2 right-2  btn btn-circle  btn-sm " />
          </button>
        </div>
      )}
    </div>
  );
  return (
    <div>
      <dialog
        id="imageModal"
        className="modal h-full flex justify-center items-center"
      >
        <form
          method="dialog"
          //   lg:max-w-[60vw] max-w-[90vw]
          style={selectedImage?.h !== selectedImage?.w ? modalStyle : {}}
          className={`modal-box  flex items-center flex-col h-[70vh]`}
        >
          <main className="w-full h-auto">{bodyContent}</main>
        </form>
      </dialog>
    </div>
  );
};

export default ImageModal;
