var mediaSourceBuffer;
const socket = io("http://localhost:3000");
$(document).ready(function () {
  const videoElement = document.getElementById("video");
  const mediaSource = new MediaSource();

  videoElement.src = URL.createObjectURL(mediaSource);

  videoElement.addEventListener("error", (e) => {
    console.error("Video element error:", e);
  });

  videoElement.addEventListener("loadedmetadata", () => {
    console.log("Video metadata loaded");
  });

  videoElement.addEventListener("canplay", () => {
    console.log("Video can play");
  });

  mediaSource.addEventListener("sourceopen", () => {
    console.log("MediaSource opened");
    mediaSourceBuffer = mediaSource.addSourceBuffer(
      'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
    );
    mediaSourceBuffer.addEventListener("updateend", () => {
      // This event is triggered when the buffer update is complete
      //console.log("Buffer update complete");
      videoElement.play();
    });
  });

  mediaSource.addEventListener("error", (e) => {
    console.error("MediaSource error:", e);
  });

  socket.on("stream", (data) => {
    if (data === "end") {
      console.log("End of stream");
      mediaSource.endOfStream();
    } else {
      console.log(data);
      const uint8Array = new Uint8Array(data); // Convert data to Uint8Array
      //console.log("Before appending:", mediaSourceBuffer.updating);
      // Convert Uint8Array to Blob
      const blob = new Blob([uint8Array], { type: "image/jpeg" }); // Adjust the type accordingly

      // Create a data URL from the Blob
      const imageUrl = URL.createObjectURL(blob);

      // Display the image
      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      document.body.appendChild(imgElement);

      mediaSourceBuffer.appendBuffer(uint8Array);
      //console.log("After appending:", mediaSourceBuffer.updating);

      //console.log(mediaSourceBuffer);
    }
  });
  socket.emit("subscribe");

  $("#play").click(function () {
    console.log("Play video");
    videoElement.play();
  });
});
