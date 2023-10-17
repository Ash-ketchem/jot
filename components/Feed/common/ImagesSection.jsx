"use client";

import { CldImage, CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import ImageCarousel from "./ImageCarousel";

const ImagesSection = ({ images }) => {
  // console.log(images);

  const cloudinaryPublicIdPattern = /v.*\/(.*?\..{3,4})$/;

  const imageGroup = images.map((img) => {
    const matchResult =
      (img?.image ?? img).match(cloudinaryPublicIdPattern)[1] || null;
    const height = img?.height ?? 0;
    const width = img?.width ?? 0;
    const media = matchResult?.split(".")[0] || null;
    const mediaType = matchResult?.split(".")[1] || null;
    const maxHeight = Math.min(img?.height || 0, 480);
    const objectFit = img?.height >= img?.width ? "contain p-1" : "cover";

    return {
      match: matchResult,
      height: height,
      width: width,
      media: media,
      mediaType: mediaType,
      maxHeight: maxHeight,
      objectFit: objectFit,
    };
  });

  return <ImageCarousel images={imageGroup} />;

  // const [media, mediaType] = imgPublicIds[0]?.match?.split(".") || [null, null];

  // const maxHeight = Math.min(images[0]?.height || 0, 480);

  // const objectFit =
  //   imgPublicIds[0]?.height > imgPublicIds[0]?.width ? "contain p-1" : "cover";

  // const maxWidthClass =
  //   objectFit === "contain" ? `w-[${imgPublicIds[0]?.width}px]` : "w-full";

  // const maxHeighClass = `h-[${maxHeight}px]`;

  // return (
  //   <div
  //     className={`w-full relative my-2 shadow-inner rounded-md  ${
  //       maxHeight > 0 ? "h-80" : "h-72"
  //     }`}
  //   >
  //     {["jpg", "png"].includes(mediaType) ? (
  //       <CldImage
  //         src={media}
  //         alt="post images"
  //         fill
  //         // blurDataURL="/images/blur.jpg"
  //         // placeholder="blur"
  //         className={` rounded-xl bg-base-200/60  object-${objectFit}`}
  //         loading="lazy"
  //       />
  //     ) : (
  //       <div
  //         onClick={(e) => e.stopPropagation()}
  //         className="w-full h-full  flex justify-center items-center  relative"
  //       >
  //         <CldVideoPlayer
  //           src={media}
  //           className="rounded-xl  w-full  !h-72"
  //           preload="auto"
  //         />
  //       </div>
  //     )}
  //   </div>
  // );
};

export default ImagesSection;
