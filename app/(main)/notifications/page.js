"use client";

import UserSection from "@/components/Feed/common/UserSection";
import reRenderStore from "@/stores/reRenderStore";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const page = () => {
  const [notifications, setNotifications] = useState([]);

  const pageRenderedRef = useRef(false);

  const getNotifications = async () => {
    const notifications = await axios.get("/api/notifications");

    setNotifications((state) => [...notifications?.data]);
  };

  const state = reRenderStore((state) => state.routes, "notifications");

  useEffect(() => {
    getNotifications();
  }, [state]);

  if (!notifications?.length) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="w-full min-h-[70vh] relative  flex-col items-center justify-center">
          <Image src="/images/noNotifications.svg" fill alt="no notificatons" />
        </div>
        <p className="text-sm font-medium leading-relaxed tracking-wide border-0 text-center w-full mt-2">
          No new notifications
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col justify-around items-center py-2 gap-4">
        <h3 className="text-sm font-bold w-full text-center leading-relaxed tracking-wider">
          Notifications
        </h3>
        <div className="w-full h-full">
          {notifications?.map((notification) => (
            <div key={notification?.id}>
              <div className="w-full p-2 space-y-2 border-b-[1px] border-neutral-600/25">
                <UserSection
                  user={notification?.triggeringUser}
                  createdAt={notification?.createdAt}
                />
                <p className="text-sm px-1 ml-2.5">
                  <span>{notification?.triggeringUser?.username}</span>{" "}
                  <span>{notification?.body}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
