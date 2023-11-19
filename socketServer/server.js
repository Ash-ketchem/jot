const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const connectedSocketsMap = new Map();

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");

    if (connectedSocketsMap.has(socket?.data?.userId)) {
      connectedSocketsMap.delete(socket.data.userId);
    }
  });
});

app.get("/", async (req, res) => {
  const sockets = await io.sockets.fetchSockets();
  console.log(connectedSocketsMap);

  return res.end();
});

app.post("/auth", async (req, res) => {
  try {
    const { token, socketId, userId } = req.body;

    if (!token || token !== process.env.SOCKET_AUTH_SECRET) {
      throw new Error("Invalid token");
    }

    const userSocketConnection = (await io.sockets.fetchSockets())?.find(
      (socket) => socket?.id === socketId
    );

    if (!userSocketConnection) {
      throw new Error("socket id doesnt exist");
    }

    connectedSocketsMap.set(userId, {
      id: userSocketConnection?.id,
      data: {
        userId,
      },
    });

    userSocketConnection.data = { userId };

    return res.json({
      status: "auth sucess",
    });
  } catch (error) {
    return res.status(400).json({
      error: error?.message || "something went wrong",
    });
  }
});

app.post("/emit", async (req, res) => {
  try {
    const { eventType, userId } = req.body;

    console.log("event type ", eventType, userId);

    if (!eventType || !userId) {
      throw new Error("invalid request body");
    }

    const userToRecieveEvent = connectedSocketsMap.get(userId);

    if (userToRecieveEvent?.id) {
      io.to(userToRecieveEvent.id).emit(eventType, "new notification");
    }

    return res.json({
      status: "ok",
    });
  } catch (error) {
    return res.status(400).json({
      error: error?.message || "something went wrong",
    });
  }
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
