const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3000 }); // Use the desired port number

const clients = new Set();

server.on("connection", (socket) => {
  console.log("Client connected");

  // Add the new client to the set
  clients.add(socket);

  // Listen for messages from the client
  socket.on("message", (message) => {
    // Broadcast the message to all other clients
    console.log("Received message:", message);
    clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        console.log("Broadcasting message:", message);
        client.send(message);
      }
    });
  });

  // Listen for the close event
  socket.on("close", () => {
    console.log("Client disconnected");
    // Remove the client from the set when it disconnects
    clients.delete(socket);
  });
});

console.log("Signaling server running on port 3000"); // Change the port number if needed
