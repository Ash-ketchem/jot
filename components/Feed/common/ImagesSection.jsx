"use client";

import { CldImage, CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const ImagesSection = ({ images }) => {
  const cloudinaryPublicIdPattern = /v.*\/(.*?\..{3,4})$/;

  const imgPublicIds = images.map(
    (img) => img.match(cloudinaryPublicIdPattern)[1] || null
  );

  if (images?.length > 1) {
    return <div>carousle</div>;
  }

  const [media, mediaType] = imgPublicIds[0]?.split(".") || [null, null];

  return (
    <div className=" w-full h-72 relative my-2 shadow-inner rounded-md">
      {["jpg", "png"].includes(mediaType) ? (
        <CldImage
          src={media}
          alt="post images"
          fill
          blurDataURL="/images/blur.jpg"
          placeholder="blur"
          className="rounded-xl object-cover"
          loading="lazy"
        />
      ) : (
        <div
          onClick={(e) => e.preventDefault()}
          className="w-full h-full  flex justify-center items-center  relative"
        >
          {/* <CldVideoPlayer src={media} className="rounded-xl  w-full  !h-72" /> */}
        </div>
      )}
    </div>
  );
};

export default ImagesSection;
