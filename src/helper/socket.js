import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

export const initSocket = async () => {
  const option = {
    forceNew: true,
    reconnectionAttempts: 10000,
    timeout: 10000,
    transports: ["websocket"],
  };
  return io("http://localhost:5000/", option);
};
