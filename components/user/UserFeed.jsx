import Feed from "@/components/Feed/user/Feed";

const UserFeed = ({ loggedUserId, initialPosts, userId }) => {
  return (
    <>
      <Feed
        userId={userId}
        initialPosts={initialPosts}
        loggedUserId={loggedUserId}
      />
    </>
  );
};

export default UserFeed;
