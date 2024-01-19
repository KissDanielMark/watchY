const socket = new WebSocket("ws://localhost:3000");

$(document).ready(function () {
  console.log("Started.");

  // Event listener for when the connection is opened
  socket.addEventListener("open", (event) => {
    console.log("Connected to WebSocket server");
    // Send a message to the server
    socket.send("Hello, server!");
  });

  // Event listener for receiving messages from the server
  socket.addEventListener("message", (event) => {
    if (event.data instanceof Blob) {
      // If the received data is a Blob, read its content as text
      const reader = new FileReader();
      reader.onload = function () {
        console.log(`Received message from server: ${reader.result}`);
      };
      reader.readAsText(event.data);
    } else {
      // If it's not a Blob, treat it as a string
      console.log(`Received message from server: ${event.data}`);
    }
    //console.log(`Received message from server: ${event.data}`);
  });

  // Event listener for when the connection is closed
  socket.addEventListener("close", (event) => {
    console.log("Disconnected from WebSocket server");
  });

  $("#startButton").on("click", function () {
    // Get the message from an input field or any other source

    const message = "start";
    // Check if the WebSocket connection is open
    if (socket.readyState === WebSocket.OPEN) {
      // Send the message to the server
      socket.send(message);
    } else {
      console.error("WebSocket connection is not open.");
    }
  });

  $("#stopButton").on("click", function () {
    // Get the message from an input field or any other source

    const message = "stop";
    // Check if the WebSocket connection is open
    if (socket.readyState === WebSocket.OPEN) {
      // Send the message to the server
      socket.send(message);
    } else {
      console.error("WebSocket connection is not open.");
    }
  });
});
