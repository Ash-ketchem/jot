"use client";

import toastStore from "@/stores/toastStore";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const Logout = ({ loggedUserId }) => {
  const router = useRouter();

  const addToast = toastStore((state) => state.addToast);

  // console.log("logout");

  let label = loggedUserId ? "Logout" : "Login";

  const handleLogout = useCallback(async () => {
    if (!loggedUserId) {
      router.push("/login");
    } else {
      addToast("Logging out...");
      await signOut();
    }
  }, [router, loggedUserId]);

  return (
    <div
      className="flex gap-4 justify-start items-center py-4"
      onClick={handleLogout}
    >
      <ArrowLeftOnRectangleIcon className="w-6 h-6" />
      <p className="font-semibold lg:text-base  text-sm">{label}</p>
    </div>
  );
};

export default Logout;
