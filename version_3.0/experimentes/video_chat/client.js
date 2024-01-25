/*const ws = new WebSocket("ws://localhost:3000");
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
};*/

// Assuming you have a WebSocket connection established
const ws = new WebSocket("ws://localhost:3000");
const video = document.getElementById("video");
video.srcObject = new MediaStream(); // Empty stream for receiving

ws.onmessage = function (event) {
  // Assuming the server sends blobs of video data
  const blob = new Blob([event.data], { type: "video/mp4" });

  // Read the blob as an ArrayBuffer
  const reader = new FileReader();
  reader.onload = function () {
    // Create a new Uint8Array from the ArrayBuffer
    const arrayBuffer = this.result;
    const uint8Array = new Uint8Array(arrayBuffer);

    // Create a Blob from the Uint8Array
    const newBlob = new Blob([uint8Array], { type: "video/mp4" });

    // Create a canvas element
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const context = canvas.getContext("2d");

    // Assuming the video frame format is RGBA (4 bytes per pixel)
    const imageData = context.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 1) {
      imageData.data[i] = uint8Array[i / 1];
      imageData.data[i + 1] = uint8Array[i / 1 + 1];
      imageData.data[i + 2] = uint8Array[i / 1 + 2];
      imageData.data[i + 3] = 255; // Alpha channel
    }
    context.putImageData(imageData, 0, 0);

    // Convert the canvas content to a data URL
    const imageDataURL = canvas.toDataURL("image/jpeg");

    // Create an img element and set its source to the data URL
    const imgElement = document.createElement("img");
    imgElement.src = imageDataURL;

    // Append the img element to the body
    document.body.appendChild(imgElement);

    // (Optional) If you want to update the video stream, dispatch the BlobEvent
    const blobEvent = new BlobEvent("addtrack", {
      data: newBlob,
      timecode: Date.now(),
    });
    video.srcObject.dispatchEvent(blobEvent);
  };
  reader.readAsArrayBuffer(blob);
};
