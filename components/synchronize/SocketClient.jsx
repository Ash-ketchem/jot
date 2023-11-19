"use client";

import reRenderStore from "@/stores/reRenderStore";
import socketStore from "@/stores/socketStore";
import axios from "axios";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketClient = ({ loggedUserId }) => {
  const socketRef = useRef(null);
  const socketConnectedRef = useRef(false);

  const reRenderPage = reRenderStore((state) => state.reRenderPage);

  const socketInitialize = async () => {
    try {
      socketRef.current = io("localhost:3001");

      socketRef.current.on("connect", async () => {
        console.log("Connected to Socket.IO server", socketRef);
        socketConnectedRef.current = true;

        try {
          const res = await axios.post("/api/socketAuth", {
            auth: true,
            socketId: socketRef.current?.id,
          });
        } catch (error) {
          console.error("Authentication error:");
        }
      });

      socketRef.current.on("notification", async (data) => {
        console.log(data, " notification event ");
        reRenderPage("notifications");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
        socketConnectedRef.current = false;
        socketRef.current = null;
      });

      socketRef.current.on("error", (error) => {
        console.error("Socket.IO error:", error);
      });
    } catch (error) {
      console.error("Error initializing socket:", error);
    }
  };

  useEffect(() => {
    socketInitialize();

    // Cleanup when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [loggedUserId]);

  return null;
};

export default SocketClient;
