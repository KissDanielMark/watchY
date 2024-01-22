const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // Adjust this to your client's origin
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = 3000;

// Serve HTML page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index_receiver.html");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Client connected");

  // Receiver client subscribes to video stream
  socket.on("subscribe", () => {
    // Sender client sends file chunks to the receiver
    io.of("/stream").on("connection", (streamSocket) => {
      console.log("Stream client connected");

      streamSocket.on("stream", (data) => {
        // Forward the file chunks to the receiver client
        socket.emit("stream", data);
      });
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
