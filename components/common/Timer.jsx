import modalStore from "@/stores/modalStore";
import { ClockIcon } from "@heroicons/react/24/outline";

const Timer = () => {
  const openTimerModal = modalStore((state) => state.openTimerModal);
  return (
    <div>
      <button
        className="btn btn-ghost btn-circle btn-sm md:btn-md lg:btn-md"
        onClick={() => openTimerModal()}
      >
        <ClockIcon className="w-6 h-6  " />
      </button>
    </div>
  );
};

export default Timer;
