import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

export const initSocket = async () => {
  const option = {
    forceNew: true,
    path: "/socket",
    reconnectionAttempts: 10,
    timeout: 10000,
    transports: ["websocket", "polling"],
  };
  return io(process.env.REACT_APP_BACKEND_URL, option);
};
