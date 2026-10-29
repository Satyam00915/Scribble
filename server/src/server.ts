import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT;

const roomShapes: Record<string, any[]> = {};

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);
    if (!roomShapes[roomId]) {
      roomShapes[roomId] = [];
    }
    console.log(`Socket ID: ${socket.id} joined room id ${roomId}`);
    socket.emit("initial_shapes", roomShapes[roomId]);
  });

  socket.on("draw_shape", ({ roomId, shape }) => {
    if (!roomShapes[roomId]) {
      roomShapes[roomId] = [];
    }
    roomShapes[roomId].push(shape);
    socket.to(roomId).emit("shape_drawn", shape);
  });

  socket.on("erase_shape", ({ roomId, shape }) => {
    console.log("shape erased", shape);
    if (roomShapes[roomId]) {
      //@ts-ignore
      roomShapes[roomId] = roomShapes[roomId].filter(
        (item) => item.id !== shape.id,
      );
    }
    socket.to(roomId).emit("erase", shape);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Hey there",
  });
});

server.listen(PORT);
