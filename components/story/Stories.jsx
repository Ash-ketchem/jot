import StoryItem from "./StoryItem";

const Stories = () => {
  const stories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="py-2 border-b-[0px] px-1 flex justify-center  sticky top-0 z-30 bg-base-200">
      <div className="flex px-2 py-4 space-x-4  rounded-box w-[100%]  overflow-scroll ">
        {stories.map((story) => (
          <div key={story} className="  btn btn-ghost btn-circle carousel-item">
            <StoryItem />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
