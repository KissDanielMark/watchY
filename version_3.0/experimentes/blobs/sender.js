$(document).ready(function () {
  const socket = new WebSocket("ws://localhost:3000/stream");
  const fileInput = document.getElementById("fileInput");

  socket.addEventListener("open", () => {
    console.log("WebSocket connection opened");
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });

  fileInput.addEventListener("change", handleFileSelect);

  function handleFileSelect(event) {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        console.log(fileReader.result);
        const blob = new Blob([fileReader.result]); // Convert ArrayBuffer to Blob
        sendFileChunks(blob);
      };
      fileReader.readAsArrayBuffer(selectedFile);
    }
  }

  function sendFileChunks(blob) {
    const CHUNK_SIZE = 16384; // 16KB chunks
    let offset = 0;

    function readChunk() {
      const chunk = blob.slice(offset, offset + CHUNK_SIZE);
      offset += CHUNK_SIZE;

      if (chunk.size > 0) {
        socket.send(chunk);
        setTimeout(readChunk, 1000); // Adjust the delay as needed
      } else {
        socket.send("end");
      }
    }

    readChunk();
  }

  socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed:", event);
  });
});
