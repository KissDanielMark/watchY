const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { createServer } = require("http");
const cors = require("cors"); // Import the cors package

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// Use CORS middleware
app.use(cors());

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    // Handle the received data (e.g., save to a file, process, etc.)
    console.log("Received data from client:", data);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
