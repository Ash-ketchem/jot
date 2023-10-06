"use client";

import modalStore from "@/stores/modalStore";
import timerStore from "@/stores/timerStore";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

const TimerModal = () => {
  const timer = timerStore((state) => state.timer);
  const startTimer = timerStore((state) => state.startTimer);
  const setTimerId = timerStore((state) => state.setTimerId);

  const openBreakModal = modalStore((state) => state.openBreakModal);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutues] = useState(0);

  const handleClick = useCallback(
    (e) => {
      startTimer({
        h: hours,
        m: minutes,
      });

      if (timer?.timerId) {
        // clearing old timer
        clearInterval(timer?.timerId);
      }

      if (hours == 0 && minutes == 0) {
        return;
      }

      const id = setInterval(() => {
        if (!window.breakModal.open) {
          openBreakModal();
        }
      }, [(hours * 60 * 60 + minutes * 60) * 1000]);

      setTimerId(id);
    },
    [startTimer, hours, minutes, timer, openBreakModal]
  );

  useEffect(() => {
    setHours(timer?.h || 0);
    setMinutues(timer?.m || 0);
  }, [timer]);

  const bodyContent = (
    <div className="w-full h-fit  flex flex-col items-center justify-evenly gap-y-4 relative">
      {/* set timer feature */}
      <>
        <button
          className="btn-xs btn-ghost btn-circle absolute top-1 left-1 cursor-pointer"
          onClick={() => {
            setHours(0);
            setMinutues(0);
          }}
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
        <p className="leading-loose tracking-wide text-sm">
          Remind me to take a break every
        </p>

        <div className="flex  w-48  justify-around items-center bg-base-200 rounded-xl p-2 h-auto ">
          {/* reminder banner */}
          <div className="basis-[50%] h-full flex justify-center items-center">
            <div
              className="overflow-y-scroll h-32 pb-2 space-y-2"
              onClick={(e) => {
                setHours(e.target.innerText);
              }}
            >
              {Array(12)
                .fill(0)
                .map((k, i) => (
                  <div
                    key={i}
                    className={`p-4 hover:bg-base-100 cursor-pointer rounded-xl text-center ${
                      hours == i ? "bg-base-100" : ""
                    }`}
                  >
                    {i}
                  </div>
                ))}
            </div>
          </div>
          <div className="basis-[50%]  flex justify-center items-center ">
            <div
              className="overflow-y-scroll h-32 pb-2 space-y-2"
              onClick={(e) => {
                setMinutues(e.target.innerText);
              }}
            >
              {Array(12)
                .fill(0)
                .map((k, i) => (
                  <div
                    key={i * 5}
                    className={`p-4 hover:bg-base-100 cursor-pointer rounded-xl text-center ${
                      minutes == i * 5 ? "bg-base-100" : ""
                    }`}
                  >
                    {i * 5}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-md leading-loose tracking-widest text-center">
            <p>
              {hours == 0 && minutes == 0
                ? "Timer off"
                : `${hours != 0 ? hours + " hour" : ""} ${
                    hours != 0 && minutes != 0 ? " and " : ""
                  } ${minutes != 0 ? minutes + " minutes" : ""}`}
            </p>
          </p>
        </div>
        <div>
          <button
            className="btn btn-sm btn-primary lowercase"
            onClick={handleClick}
          >
            set
          </button>
        </div>
      </>
    </div>
  );
  return (
    <div>
      <dialog
        id="timerModal"
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

export default TimerModal;
