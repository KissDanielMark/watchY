$(document).ready(function () {
  var mediaSourceBuffer;
  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", () => {
    console.log("WebSocket connection opened");
  });

  socket.addEventListener("message", (event) => {
    const data = event.data;
    if (data === "end") {
      console.log("End of stream");
      mediaSource.endOfStream();
    } else {
      console.log(data);
      const uint8Array = new Uint8Array(data);

      const blob = new Blob([uint8Array], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);

      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      document.body.appendChild(imgElement);

      mediaSourceBuffer.appendBuffer(uint8Array);
    }
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed:", event);
  });

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
        videoElement.play();
      });
    });

    mediaSource.addEventListener("error", (e) => {
      console.error("MediaSource error:", e);
    });

    // You can replace the socket.emit("subscribe") with a different method if needed

    $("#play").click(function () {
      console.log("Play video");
      videoElement.play();
    });
  });
});
