import Image from "next/image";
import UserHeroAction from "./UserHeroAction";
import UserInfo from "./UserInfo";

const UserHero = ({
  user,
  buttonLabel,
  loggedUser = false,
  isFollowing,
  loggedUserId,
  useractionVisible = true,
}) => {
  const userBio = user?.bio?.split("\n").map((paragraph, index) => (
    <p key={index} className="text-md tracking-wide text-left leading-loose">
      {paragraph}
    </p>
  )) ?? <p> "I'm feeling good"</p>;
  // console.log(user);
  return (
    <div className="px-2 z-40 bg-base-300 rounded-b-xl pb-4">
      {/* sticky top-0  */}
      {/* coverimage */}
      <div>
        <div className="min-h-32 h-40 w-full bg-neutral relative">
          <Image
            src={user?.coverImage || "/images/girls.png"}
            className="object-cover"
            alt="cover image"
            fill
          />
        </div>
      </div>
      {/* about */}
      <div className=" flex gap-4  w-full justify-between items-center relative mt-2 ">
        <div className="h-full ">
          <div className="avatar  -top-12 left-4">
            <div className=" lg:w-28 w-20 rounded-full ring ring-white/50 ring-offset-base-100 ring-offset-1 relative">
              <Image
                src={user?.profileImage || "/images/userProfile.jpg"}
                alt="profile image"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <div className="mr-2">
          {useractionVisible && (
            <UserHeroAction
              buttonLabel={buttonLabel}
              loggedUser={loggedUser}
              loggedUserId={loggedUserId}
              userId={user?.id}
              isFollowing={isFollowing}
              followingCount={user?.followingIds.length || 0}
              followersCount={user?.followersCount || 0}
            />
          )}
        </div>
      </div>
      <div className=" flex flex-col gap-2.5 h-full flex-1 pl-2">
        <div className="flex gap-4">
          <p>{user?.name}</p>
          <p className="font-semibold">@{user?.username}</p>
        </div>
        <div className=" whitespace-pre-wrap">{userBio}</div>
        <div className="flex  gap-4">
          <UserInfo
            loggedUser={loggedUser}
            followingCount={user?.followingIds.length || 0}
            followersCount={user?.followersCount || 0}
            id={user?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default UserHero;
