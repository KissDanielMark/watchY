const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());

const PORT = 3000;

// Serve HTML page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index_receiver.html");
});

let streamSocket;

// WebSocket connection
wss.on("connection", (socket) => {
  console.log("Client connected");

  // Receiver client subscribes to video stream
  socket.on("message", (message) => {
    if (!streamSocket) {
      console.log("Creating new stream socket");
      streamSocket = new WebSocket("ws://localhost:3000/stream");

      streamSocket.on("open", () => {
        console.log("Stream client connected");
      });

      streamSocket.on("close", () => {
        console.log("Stream client disconnected");
        streamSocket = null; // Reset the streamSocket variable
      });
    }

    // Forward the file chunks to the receiver client
    if (streamSocket && streamSocket.readyState === WebSocket.OPEN) {
      streamSocket.send(message);
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
