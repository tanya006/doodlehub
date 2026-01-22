const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const server = http.createServer(app);
app.use(cors());

const rooms = {};

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const roomId = socket.handshake.query.roomId;

  if (!roomId) {
    console.log("No roomId provided, disconnecting socket");
    socket.disconnect();
    return;
  }

  socket.join(roomId);

  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }

  console.log("Socket connected:", socket.id, "Room:", roomId);

  // send initial state
  socket.emit("whiteboard-state", rooms[roomId]);

  socket.on("element-update", (elementData) => {
    const roomElements = rooms[roomId];

    const index = roomElements.findIndex((el) => el.id === elementData.id);

    if (index === -1) {
      roomElements.push(elementData);
    } else {
      roomElements[index] = elementData;
    }

    socket.to(roomId).emit("element-update", elementData);
  });

  socket.on("whiteboard-clear", () => {
    rooms[roomId] = [];
    socket.to(roomId).emit("whiteboard-clear");
  });

  socket.on("cursor-position", (cursorData) => {
    socket.to(roomId).emit("cursor-position", {
      ...cursorData,
      userId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    socket.to(roomId).emit("user-disconnected", socket.id);
    console.log("Socket disconnected:", socket.id, "Room:", roomId);
  });
});

/* -------- SERVE REACT BUILD -------- */
app.use(express.static(path.join(__dirname, "../my-app/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../my-app/build/index.html"));
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
