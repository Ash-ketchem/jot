import Image from "next/image";

const page = () => {
  return (
    <div className="w-full h-full flex justify-evenly items-center  flex-col">
      <div className="relative w-2/3 h-2/3 ">
        <Image
          className=" object-contain"
          fill
          src="/images/feature.svg"
          alt="coming soon"
        />
      </div>
      <p className="w-full p-4 text-center">Working on it :)</p>
    </div>
  );
};

export default page;
