"use client";

import { CldImage } from "next-cloudinary";

const ImagesSection = ({ images }) => {
  if (images?.length > 1) {
    return <div>carousle</div>;
  }

  return (
    <div className=" w-full h-72  border-0 relative my-2 shadow-inner rounded-md">
      <CldImage
        src={images?.[0]}
        alt="post images"
        fill
        className="rounded-xl object-cover"
      />
    </div>
  );
};

export default ImagesSection;
