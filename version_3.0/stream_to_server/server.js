const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (message) => {
    // Assuming the message is a chunk of video data
    // You can save the chunks, process them, or broadcast to other clients
    console.log("Received chunk:", message.length);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
