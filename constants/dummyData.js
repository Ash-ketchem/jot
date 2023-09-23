const dummyData = [
  {
    id: 1,
    name: "John Doe",
    username: "john_doe",
    body: "This is the first post. Hello, world!",
    likecount: 10,
    commentscount: 3,
    //added client side
    liked: false,
    bookmarked: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "jane_smith",
    body: "Check out this cool photo!",
    likecount: 25,
    commentscount: 5,
    liked: true,
    bookmarked: false,
  },
  {
    id: 3,
    name: "Michael Johnson",
    username: "michael_johnson",
    body: "Just finished a great workout!",
    likecount: 50,
    commentscount: 8,
    liked: false,
  },
  {
    id: 4,
    name: "Emily Adams",
    username: "emily_adams",
    body: "Feeling blessed and grateful today.",
    likecount: 15,
    commentscount: 2,
    liked: false,
  },
  {
    id: 5,
    name: "David Lee",
    username: "david_lee",
    body: "Working on a new project. Excited!",
    likecount: 35,
    commentscount: 6,
    liked: false,
  },
];
const dummyDataUser = dummyData.filter((data) => data.id <= 3);

export { dummyData, dummyDataUser };
