"use client";

import UserCard from "@/components/user/UserCard";
import followingUpdatedStore from "@/stores/followingUpdatedStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Connections = ({ following, followers }) => {
  const state = followingUpdatedStore((state) => state);

  const router = useRouter();

  useEffect(() => {
    if (state.isThereUpdates) {
      state.setUpdates(false);
      router.refresh();
    }
  }, [state.isThereUpdates, router]);

  return (
    <>
      {/* following */}
      <div className="collapse bg-base-100">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          <h3 className="text-sm font-semibold leading-loose tracking-wide py-4">
            Following
          </h3>
        </div>
        <div className="collapse-content">
          <div className="ml-0 flex flex-wrap  justify-around items-center gap-y-2">
            {following.map((user) => (
              <div
                className="p-2 shadow-sm border-0 w-40"
                key={`following-${user?.id}`}
              >
                <UserCard user={user} showActions={true} />
              </div>
            ))}
            {followers?.length <= 0 && (
              <p className="text-sm leading-loose tracking-wide opacity-70">
                No followers yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* followers  */}
      <div className="collapse bg-base-100">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          <h3 className="text-sm font-semibold leading-loose tracking-wide py-4">
            Followers
          </h3>
        </div>
        <div className="collapse-content">
          <div className="ml-0 flex flex-wrap  justify-around items-center gap-y-2">
            {followers.map((user) => (
              <div className="p-2 shadow-sm w-40" key={`followers-${user?.id}`}>
                <UserCard user={user} showActions={true} />
              </div>
            ))}
            {followers?.length <= 0 && (
              <p className="text-sm leading-loose tracking-wide opacity-70">
                No followers yet
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Connections;
