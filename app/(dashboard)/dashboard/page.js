import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HeaderLogin from "@/components/common/HeaderLogin";
import BarChart from "@/components/dashbaord/BarChart";
import LineChart from "@/components/dashbaord/LineChart";
import PieChart from "@/components/dashbaord/PieChart";
import StackedBarChart from "@/components/dashbaord/StackedBarChart";
import { monthOrder, timeRanges } from "@/constants";
import client from "@/libs/prismaClient";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.role.toLowerCase() !== "admin") {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center flex-col gap-8 overflow-hidden">
        <div className="relative h-2/3 w-2/3 overflow-hidden">
          <Image alt="not found" src="/images/notFound.svg" fill />
        </div>
        <p className="text-md font-semibold leading-loose -tracking-wide">
          Not Authenticated
        </p>
      </div>
    );
  }
  // user stats
  const users = await client.user.groupBy({
    by: ["emailVerified"],
    _count: true,
  });

  const VerifiedUsers =
    users.filter((user) => user?.emailVerified)?.[0]?._count || 0;
  const UnVerifiedUsers =
    users.filter((user) => !user?.emailVerified)?.[0]?._count || 0;

  const Userdata = {
    labels: ["Email Verified", "Email Unverified"],
    datasets: [
      {
        label: "users",
        data: [VerifiedUsers, UnVerifiedUsers],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const userPosts = await client.post.groupBy({
    by: ["userId"],
    _count: true,
  });

  const allUsers = await client.user.findMany({
    select: {
      username: true,
      id: true,
      createdAt: true,
    },
  });

  let userPostsCountMap = new Map();

  // Initialize the map with usernames from allUsers and post count set to 0
  allUsers.forEach((user) => {
    userPostsCountMap.set(user.username, 0);
  });

  // Update post counts for users with posts
  userPosts.forEach((userPost) => {
    const username = allUsers.find(
      (user) => user?.id === userPost?.userId
    )?.username;
    if (username) {
      userPostsCountMap.set(username, userPost._count);
    }
  });

  let userJoinedMonthCollection = allUsers.reduce((accumulator, user) => {
    const createdAt = new Date(user?.createdAt);
    const monthYearKey = `${createdAt.toLocaleString("en-US", {
      month: "long",
    })} ${createdAt.getFullYear()}`;

    accumulator[monthYearKey] = (accumulator[monthYearKey] || 0) + 1;

    return accumulator;
  }, {});

  userJoinedMonthCollection = {
    ...userJoinedMonthCollection,

    //dummy data
    "july 2023": 40,
    "april 2023": 20,
    "july 2023": 60,
    "november 2023 ": 100,
    "january 2023 ": 50,
    "february 2023 ": 45,
    "december 2023 ": 12,
  };

  const sortedDates = Object.keys(userJoinedMonthCollection).sort((a, b) => {
    const [aMonth, aYear] = a.split(" ");
    const [bMonth, bYear] = b.split(" ");

    const aMonthIndex = monthOrder.indexOf(
      aMonth.charAt(0).toUpperCase() + aMonth.slice(1).toLowerCase()
    );
    const bMonthIndex = monthOrder.indexOf(
      bMonth.charAt(0).toUpperCase() + bMonth.slice(1).toLowerCase()
    );

    if (aYear !== bYear) {
      return parseInt(aYear) - parseInt(bYear);
    }

    return aMonthIndex - bMonthIndex;
  });

  let postCreatedDates = await client.post.findMany({
    select: {
      createdAt: true,
    },
  });

  postCreatedDates = postCreatedDates.reduce((accumulator, date) => {
    const createdAt = new Date(date.createdAt);
    const hour = createdAt.getHours();

    const ampm = hour >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    const displayHours = hour % 12 || 12; // Handle midnight (0) as 12 in 12-hour format

    const formattedTime = `${displayHours}:${createdAt.getMinutes()} ${ampm}`;

    accumulator[formattedTime] = (accumulator[formattedTime] || 0) + 1;

    return accumulator;
  }, {});

  const countByTimeRange = {};
  Object.keys(timeRanges).forEach((range) => {
    const { start, end } = timeRanges[range];

    countByTimeRange[range] = Object.keys(postCreatedDates).filter((count) => {
      const hour = parseInt(count.split(":")[0]);
      return hour >= start && hour < end;
    }).length;
  });

  postCreatedDates = null;

  const postsEngagement = await client.post.findMany({
    select: {
      createdAt: true,
      id: true,
      likeIds: true,
      user: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          comments: true,
          bookmarks: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let postsEngagementStats = postsEngagement.map((post) => ({
    id: post?.id,
    user: post?.user?.username,
    likeCount: post?.likeIds?.length,
    commentCount: post?._count?.comments,
    bookmarkCount: post?._count?.bookmarks,
  }));

  let groupedData = postsEngagementStats.reduce((accumulator, item) => {
    const { user, likeCount, commentCount, bookmarkCount } = item;
    if (!accumulator[user]) {
      accumulator[user] = {
        user: user,
        likeCount: 0,
        commentCount: 0,
        bookmarkCount: 0,
        engagementCount: 0,
      };
    }
    accumulator[user].likeCount += likeCount;
    accumulator[user].commentCount += commentCount;
    accumulator[user].bookmarkCount += bookmarkCount;
    accumulator[user].engagementCount +=
      likeCount + commentCount + bookmarkCount;
    return accumulator;
  }, {});

  groupedData = Object.values(groupedData)
    .sort((a, b) => {
      return b.engagementCount - a.engagementCount;
    })
    ?.slice(0, 5);

  groupedData = {
    labels: groupedData.map((item) => item.user),
    datasets: [
      {
        label: "Likes",
        data: groupedData.map((item) => item.likeCount),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderWidth: 1,
      },
      {
        label: "Comments",
        data: groupedData.map((item) => item.commentCount),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 1,
      },
      {
        label: "Bookmarks",
        data: groupedData.map((item) => item.bookmarkCount),
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        borderWidth: 1,
      },
    ],
  };

  const postEngagementGrowth = postsEngagement.reduce((accumulator, post) => {
    const createdAt = new Date(post?.createdAt).toLocaleString().split(",")[0];
    const engagementCount =
      post?.likeIds?.length + post?._count?.comments + post?._count?.bookmarks;
    if (!accumulator[createdAt]) {
      accumulator[createdAt] = engagementCount;
    } else {
      accumulator[createdAt] += engagementCount;
    }

    return accumulator;
  }, {});

  let trendingUsers = await client.user.findMany({
    select: {
      followingIds: true,
    },
  });
  trendingUsers = trendingUsers?.flatMap((user) => user?.followingIds);

  trendingUsers = trendingUsers.reduce((accumulator, user) => {
    if (!accumulator[user]) {
      accumulator[user] = 1;
    } else {
      accumulator[user] += 1;
    }

    return accumulator;
  }, {});

  trendingUsers = Object.fromEntries(
    Object.entries(trendingUsers).sort(([, a], [, b]) => b - a)
  );

  trendingUsers = Object.entries(trendingUsers).slice(0, 3);
  trendingUsers = Object.fromEntries(trendingUsers);

  let trendingUsersData = await client.user.findMany({
    where: {
      id: {
        in: Object.keys(trendingUsers),
      },
    },
    select: {
      id: true,
      username: true,
      profileImage: true,
    },
  });

  trendingUsers = trendingUsersData
    .map((user) => ({
      ...user,
      count: trendingUsers[user?.id],
    }))
    .sort((a, b) => b.count - a.count);

  trendingUsersData = null;

  let postGrowthOverTime = await client.post.groupBy({
    by: ["createdAt"],
    _count: true,
    orderBy: {
      createdAt: "asc",
    },
  });

  postGrowthOverTime = postGrowthOverTime.reduce((accumulator, post) => {
    const createdAt = new Date(post?.createdAt).toLocaleString().split(",")[0];

    if (!accumulator[createdAt]) {
      accumulator[createdAt] = post?._count;
    } else {
      accumulator[createdAt] += post?._count;
    }

    return accumulator;
  }, {});

  return (
    <>
      <HeaderLogin
        adminLoggedIn={session?.user?.role?.toLowerCase() === "admin"}
        showBackArrow={true}
      />
      <div className=" grid-cols-1 gap-8 p-4 h-full overflow-y-scroll w-screen">
        {/* user statistics */}
        <div className="flex flex-col gap-4 py-2">
          <h3 className="font-bold text-sm leading-relaxed tracking-wide lg:text-lg">
            User statistics
          </h3>
          <div className="lg:grid grid-cols-2 grid-rows-2 gap-4">
            {/* user pie chart */}
            <div className=" p-4">
              <div className="w-full  flex justify-center items-center shadow-md h-72 pb-2">
                <PieChart
                  data={Userdata}
                  heading="User Verification Status Distribution"
                />
              </div>
            </div>

            {/* user account creation line chart */}
            <div className=" p-4">
              <div className="w-full  flex justify-center items-center shadow-md h-72">
                <LineChart
                  labels={sortedDates}
                  heading="User Growth"
                  data={sortedDates.map(
                    (date) => userJoinedMonthCollection[date]
                  )}
                  Xlabel="No. Of Users"
                  Ylabel="Dates"
                  label="users"
                />
              </div>
            </div>

            {/* stacked bar chart for post engagement */}
            <div className=" p-4">
              <div className="w-full  flex justify-center items-center shadow-md h-72">
                <StackedBarChart
                  data={groupedData}
                  Xlabel="usernames"
                  Ylabel="Post Engagement"
                  heading="Top User Engagement Statistics"
                />
              </div>
            </div>

            {/* Trending users */}
            <div className=" p-4">
              <div className="flex justify-center items-center shadow-md h-72 w-full flex-col relative">
                <div className="flex gap-2 justify-start items-start absolute left-8 top-0">
                  <h3 className="text-md font-bold  leading-loose -tracking-wide">
                    Trending users
                  </h3>
                  <ArrowTrendingUpIcon className="w-14 h-14 text-primary absolute -top-4 left-[110%]" />
                </div>

                <div className="w-[80%] flex justify-around mt-3">
                  {trendingUsers?.map((user) => (
                    <div className="p-2 space-y-2" key={user?.id}>
                      <Link href={`/user/${user?.id}`} prefetch={true}>
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full relative">
                            <Image
                              src={
                                user?.profileImage || "/images/userProfile.jpg"
                              }
                              fill
                              alt="profile image"
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </Link>
                      <p className="text-sm leading-relaxed font-bold">
                        {user?.username}
                      </p>
                      <p className="text-sm leading-relaxed">
                        followers : {user?.count}
                      </p>
                    </div>
                  ))}
                </div>
                {/* ranking */}
                <div className="w-[80%] mt-4">
                  <ul className="steps w-full">
                    <li className="step step-primary"></li>
                    <li className="step step-secondary"></li>
                    <li className="step step-accent"></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post statistics */}
        <div className="flex flex-col gap-4 py-2">
          <h3 className="font-bold text-sm leading-relaxed tracking-wide lg:text-lg mt-2">
            Post statistics
          </h3>
          <div className="lg:grid grid-cols-2 grid-rows-1  gap-4">
            {/* user post count bar chart */}
            <div className="w-full  flex justify-center items-center shadow-md h-72">
              <BarChart
                labels={userPostsCountMap.keys()}
                data={userPostsCountMap.values()}
                heading="Top Contributors: Post Counts by Users"
                xLabel="Usernames"
                yLabel="Posts Count"
              />
            </div>

            {/* post growth line chart */}
            <div className=" p-4">
              <div className="w-full  flex justify-center items-center shadow-md h-72">
                <LineChart
                  labels={Object.keys(postGrowthOverTime)}
                  heading="Post Growth Over Time"
                  data={Object.values(postGrowthOverTime)}
                  Xlabel="Dates"
                  Ylabel="Posts"
                  label="Posts"
                />
              </div>
            </div>

            {/* user account creation line chart */}
            <div className=" p-4">
              <div className="w-full  flex justify-center items-center shadow-md h-72">
                <LineChart
                  labels={Object.keys(postEngagementGrowth)}
                  heading="Post Engagement Growth"
                  data={Object.values(postEngagementGrowth)}
                  Ylabel="Post Engagement"
                  Xlabel="Dates"
                  label="posts"
                />
              </div>
            </div>

            {/* post Frequency Bar chart */}
            <div className=" p-4">
              <div className="w-full  flex justify-center items-center shadow-md h-72">
                <BarChart
                  labels={Object.keys(countByTimeRange)}
                  data={Object.values(countByTimeRange)}
                  heading="Post Frequency by Time of Day"
                  xLabel="Time Period"
                  yLabel="Posts Count"
                  bgColor="#913D88"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
