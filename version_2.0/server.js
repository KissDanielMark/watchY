const WebSocket = require("ws");
const http = require("http");

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
