const socket = io("http://localhost:3000");
const canvas = document.getElementById("video");
const player = new JSMpeg.Player(socket, { canvas });

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        socket.emit("stream", event.data);
      }
    };

    mediaRecorder.start(1000);

    mediaRecorder.onstop = () => {
      socket.emit("stream", "end");
    };
  })
  .catch((error) => {
    console.error("Error accessing webcam:", error);
  });
