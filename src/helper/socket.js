import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

export const initSocket = async () => {
  const option = {
    forceNew: true,
    path: "/socket",
    reconnectionAttempts: 100000,
    timeout: 80000,
    transports: ["websocket", "polling"],
  };
  return io("https://real-time-code-collaboration-5ib5.onrender.com", option);
};
