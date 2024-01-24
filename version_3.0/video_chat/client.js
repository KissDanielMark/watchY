const ws = new WebSocket("ws://localhost:3000");
const video = document.getElementById("video");
video.srcObject = new MediaStream(); // Empty stream for receiving

// Function to handle the received blob and create a live stream
function handleBlob(blob) {
  const videoElement = document.getElementById("video");

  // Check if the MediaSource API is supported
  if (window.MediaSource) {
    const mediaSource = new MediaSource();

    // Set up event listeners for the MediaSource
    mediaSource.addEventListener("sourceopen", function () {
      const sourceBuffer = mediaSource.addSourceBuffer(
        'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
      );

      // Append the received blob to the source buffer
      sourceBuffer.addEventListener("updateend", function () {
        if (!mediaSource.readyState || mediaSource.readyState === "open") {
          mediaSource.endOfStream();
        }
      });

      sourceBuffer.appendBuffer(blob);
    });

    // Set the video source to the MediaSource
    videoElement.src = URL.createObjectURL(mediaSource);
  } else {
    console.error("MediaSource API is not supported.");
  }
}

ws.onmessage = (event) => {
  console.log("Message received from server:", event.data);

  const blob = new Blob([event.data], { type: "video/mp4" });
  const blobURL = URL.createObjectURL(blob);

  video.src = blobURL;

  video.addEventListener("loadedmetadata", () => {
    console.log("Loaded metadata event triggered");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video.play();
    // Draw the video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  });
};
