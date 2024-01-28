const WebSocket = require("ws");
const http = require("http");
const express = require("express");
const fs = require("fs");

const app = express();
const port = 3001;

const videoPath = "movie.mp4";
const videoSize = fs.statSync(videoPath).size;

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running");
});

// Create a WebSocket server by passing the HTTP server instance
const wss = new WebSocket.Server({ server });

// Event listener for when a WebSocket connection is established
wss.on("connection", (ws) => {
  console.log("A new client connected");

  // Event listener for receiving messages from clients
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Event listener for when a client closes the connection
  ws.on("close", () => {
    console.log("A client disconnected");
  });
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/movie", (req, res) => {
  console.log("/movie requested");
  const range = req.headers.range;

  if (!range) {
    res.status(400).send("Range header is required");
    return;
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

  const chunksize = end - start + 1;

  const file = fs.createReadStream(videoPath, { start, end });
  const head = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, head);
  file.pipe(res);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
