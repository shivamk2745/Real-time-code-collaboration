import { Server } from "socket.io";
import { ACTIONS } from "../../helpers/SocketActions";

const userSocketmap = {};

const ioHandler = (req, res) => {
  let socketio = res.socket.server.io;
  if (!socketio) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    socketio = io;
  }
  socketio.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
      userSocketmap[socket.id] = username;
      socket.join("room");
      const clients = getAllConnectedClients(socketio, "room");
      console.log(clients);
      clients.forEach(({ socketId }) => {
        socketio.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          socketId: socket.id,
        });
      });
    });
  });
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;

function getAllConnectedClients(io, roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketmap[socketId],
      };
    }
  );
}
