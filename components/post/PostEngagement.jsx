import UserCard from "@/components/user/UserCard";

const PostEngagement = ({ post, users }) => {
  return (
    <>
      {/* likes */}
      <div className="collapse bg-base-100">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          <h3 className="text-sm font-semibold leading-loose tracking-wide py-4">
            Likes
          </h3>
        </div>
        <div className="collapse-content">
          <div className="ml-0 flex flex-wrap  justify-around items-center gap-y-2">
            {post?.likeIds.map((id) => {
              return (
                users.has(id) && (
                  <div className="p-2 shadow-sm  w-40" key={`like-${id}`}>
                    <UserCard user={users.get(id)} showActions={true} />
                  </div>
                )
              );
            })}
            {post?.likeIds?.length <= 0 && (
              <p className="text-sm leading-loose tracking-wide opacity-70">
                No likes yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* comments  */}
      <div className="collapse bg-base-100">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          <h3 className="text-sm font-semibold leading-loose tracking-wide py-4">
            Comments
          </h3>
        </div>
        <div className="collapse-content">
          <div className="ml-0 flex flex-wrap  justify-around items-center gap-y-2">
            {post?.comments
              ?.map((comment) => comment?.userId)
              .map((id) => {
                return (
                  users.has(id) && (
                    <div className="p-2 shadow-sm w-40" key={`comment-${id}`}>
                      <UserCard user={users.get(id)} showActions={true} />
                    </div>
                  )
                );
              })}
            {post?.comments?.length <= 0 && (
              <p className="text-sm leading-loose tracking-wide opacity-70">
                No comments yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* bookmarks */}
      <div className="collapse bg-base-100">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          <h3 className="text-sm font-semibold leading-loose tracking-wide py-4">
            Bookmarks
          </h3>
        </div>
        <div className="collapse-content">
          <div className="flex flex-wrap  justify-around items-center gap-y-2">
            {post?.bookmarks
              ?.map((bookmark) => bookmark?.userId)
              .map((id) => {
                return (
                  users.has(id) && (
                    <div className="p-2 shadow-sm w-40" key={`comment-${id}`}>
                      <UserCard user={users.get(id)} showActions={true} />
                    </div>
                  )
                );
              })}
            {post?.bookmarks?.length <= 0 && (
              <p className="text-sm leading-loose tracking-wide opacity-70">
                No bookmarks yet
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostEngagement;
