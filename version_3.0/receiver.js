let mediaSourceBuffer;
const socket = io("http://localhost:3000");
$(document).ready(function () {
  const videoElement = document.getElementById("video");
  const mediaSource = new MediaSource();

  videoElement.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener("sourceopen", () => {
    mediaSourceBuffer = mediaSource.addSourceBuffer(
      'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
    );
  });

  socket.on("stream", (data) => {
    if (data === "end") {
      mediaSource.endOfStream();
    } else {
      console.log(data);
      const uint8Array = new Uint8Array(data);
      mediaSourceBuffer.appendBuffer(uint8Array);
      videoElement.load();
    }
  });

  socket.emit("subscribe");
});
