"use client";

import { CldImage, CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const ImagesSection = ({ images }) => {
  // console.log(images);

  const cloudinaryPublicIdPattern = /v.*\/(.*?\..{3,4})$/;

  const imgPublicIds = images.map((img) => {
    return {
      match: (img?.image ?? img).match(cloudinaryPublicIdPattern)[1] || null,
      height: img?.height ?? 0,
      width: img?.width ?? 0,
    };
  });

  if (images?.length > 1) {
    return <div>carousle</div>;
  }

  const [media, mediaType] = imgPublicIds[0]?.match?.split(".") || [null, null];

  const maxHeight = Math.min(images[0]?.height || 0, 480);

  const objectFit =
    imgPublicIds[0]?.height > imgPublicIds[0]?.width ? "contain p-1" : "cover";

  // const maxWidthClass =
  //   objectFit === "contain" ? `w-[${imgPublicIds[0]?.width}px]` : "w-full";

  const maxHeighClass = `h-[${maxHeight}px]`;

  return (
    <div
      className={`w-full relative my-2 shadow-inner rounded-md  ${
        maxHeight > 0 ? "h-80" : "h-72"
      }`}
    >
      {["jpg", "png"].includes(mediaType) ? (
        <CldImage
          src={media}
          alt="post images"
          fill
          // blurDataURL="/images/blur.jpg"
          // placeholder="blur"
          className={` rounded-xl bg-base-200/60  object-${objectFit}`}
          loading="lazy"
        />
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full h-full  flex justify-center items-center  relative"
        >
          <CldVideoPlayer
            src={media}
            className="rounded-xl  w-full  !h-72"
            preload="auto"
          />
        </div>
      )}
    </div>
  );
};

export default ImagesSection;
