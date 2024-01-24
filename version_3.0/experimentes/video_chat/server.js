const express = require("express");
const http = require("http");
const WebSocket = require("ws"); // Correct import

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Correct instantiation

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("A user connected");
  clients.add(ws);

  ws.on("message", (data) => {
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log("Sending data to a client");
        console.log(data);

        client.send(data);
      }
    });
  });

  ws.on("close", () => {
    console.log("User disconnected");
    clients.delete(ws);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
