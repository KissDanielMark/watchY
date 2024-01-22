const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Serve HTML page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Client connected");

  // Receive video stream from client
  socket.on("stream", (data) => {
    // Write received data to a file
    fs.writeFileSync("output.h264", data, { flag: "a" });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
