import Feed from "@/components/Feed/user/Feed";

const UserFeed = ({
  loggedUserId,
  initialPosts,
  userId,
  useractionVisible = true,
}) => {
  return (
    <>
      <Feed
        userId={userId}
        initialPosts={initialPosts}
        loggedUserId={loggedUserId}
        useractionVisible={useractionVisible}
      />
    </>
  );
};

export default UserFeed;
