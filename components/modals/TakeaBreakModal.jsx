"use client";

import Image from "next/image";

const TakeaBreakModal = () => {
  const bodyContent = (
    <div className="w-full h-fit  flex flex-col items-center justify-evenly gap-y-4">
      {/* set timer feature */}

      <div className="w-full h-fit justify-center items-center flex flex-col gap-4">
        <div className="w-full relative h-96">
          <Image
            src="/images/break.svg"
            alt="take a break"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <p className="leading-loose tracking-wide text-sm">
          Times up !! <span className="font-bold">take a break boss</span>
        </p>
        <div>
          <button className="btn btn-primary lowercase btn-sm">skip</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <dialog
        id="breakModal"
        className="modal h-full flex justify-center items-center bg-opacity-50 bg-neutral"
      >
        <form
          method="dialog"
          className="modal-box md:w-2/3 w-[95%] flex items-center flex-col h-fit "
        >
          <main className="w-full h-full">{bodyContent}</main>
        </form>
      </dialog>
    </div>
  );
};

export default TakeaBreakModal;
