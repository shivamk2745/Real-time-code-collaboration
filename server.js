import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./SocketActions.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static("dist"));
app.use((req, resp, next) => {
  resp.sendFile(path.join(__dirname, "dist", "index.html"));
});

const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket",
  wssEngine: ["ws", "wss"],
  transports: ["websocket", "polling"],
  cors: {
    origin: "",
  },
  allowEIO3: true,
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, html, css, js }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { html, css, js });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, html, css, js }) => {
    console.log(html, css, js);

    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { html, css, js });
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
      socket.leave(roomId);
    });
    delete userSocketMap[socket.id];
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
