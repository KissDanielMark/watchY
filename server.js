const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { exec } = require("child_process");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    // If the message is a file path, start streaming it
    if (message.startsWith("file:")) {
      const filePath = message.slice(5);
      const ffmpegCommand = `ffmpeg -i ${filePath} -c:v libx264 -preset ultrafast -tune zerolatency -c:a aac -ar 44100 -f flv -strict -2 rtmp://localhost:1935/live/stream`;
      exec(ffmpegCommand);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server is listening on http://localhost:${PORT}`);
});
