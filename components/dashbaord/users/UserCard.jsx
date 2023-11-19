import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const UserCard = ({ user: [id, data] }) => {
  return (
    <div className="0">
      <div className=" card-side bg-base-100 shadow-xl  py-4 !z-20">
        <div className="flex">
          <div className="avatar m-2">
            <div className="w-12 h-12 rounded-full relative">
              <Image
                src={data?.profileImage || "/images/userProfile.jpg"}
                fill
                alt="profile image"
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-start items-start m-2">
            <h2 className="card-title ml-2  text-[1.15rem] leading-relaxed tracking-wide">
              {data?.username}
            </h2>
            <div className="flex w-full text-sm  gap-2 justify-center items-center">
              <p>{data?.email}</p>
              <p className="">
                {data?.emailVerified ? (
                  <CheckBadgeIcon className="w-6 h-6 text-success" />
                ) : (
                  <ExclamationCircleIcon className="w-6 h-6 text-error" />
                )}
              </p>
              <Link href={`users/${id}`}>
                <EyeIcon className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="">
          <div className="w-full text-sm grid grid-cols-2 p-2 gap-2.5 mt-2">
            <p className="flex justify-between items-center  w-fit">
              <span className="font-medium mr-1">Posts : </span>
              {data?.posts}
            </p>
            <p className="flex justify-between items-center  w-fit">
              <span className="font-medium mr-1">Comments : </span>
              {data?.comments}
            </p>
            <p className="flex justify-between items-center  w-fit">
              <span className="font-medium mr-1">following : </span>
              {data?.following}
            </p>
            <p className="flex justify-between items-center  w-fit">
              <span className="font-medium mr-1">followers : </span>
              {data?.followers}
            </p>
            <p className="flex justify-between items-center  w-fit">
              <span className="font-medium mr-1">bookmarks : </span>
              {data?.bookmarks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
