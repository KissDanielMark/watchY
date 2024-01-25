const remoteVideo = document.getElementById("remoteVideo");
const signalingServerUrl = "ws://localhost:3000"; // Change the URL if your signaling server is hosted elsewhere

$(document).ready(function () {
  const socket = new WebSocket(signalingServerUrl);
  const pc = new RTCPeerConnection();

  // Handling messages from the signaling server
  socket.onmessage = function (event) {
    if (typeof event.data === "string") {
      try {
        const data = JSON.parse(event.data);

        // Log the received message to the console for debugging
        console.log("Received message:", data);

        // Check the type of message and handle accordingly
        if (data.type === "offer") {
          handleOffer(data.offer);
        } else if (data.type === "answer") {
          handleAnswer(data.answer);
        } else if (data.type === "ice-candidate") {
          handleIceCandidate(data.candidate);
        } else {
          console.warn("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else if (event.data instanceof Blob) {
      // Handle Blob data (if needed)
      console.log("Received Blob data:", event.data);
    } else {
      console.warn("Unsupported data type:", typeof event.data);
    }
  };

  // Function to handle the offer
  function handleOffer(offer) {
    pc.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => pc.createAnswer())
      .then((answer) => pc.setLocalDescription(answer))
      .then(() => {
        // Send the answer to the signaling server
        socket.send(
          JSON.stringify({ type: "answer", answer: pc.localDescription })
        );
      })
      .catch((error) => console.error("Error creating answer:", error));
  }

  // Function to handle the answer
  function handleAnswer(answer) {
    pc.setRemoteDescription(new RTCSessionDescription(answer)).catch((error) =>
      console.error("Error setting remote description:", error)
    );
  }

  // Function to handle ICE candidates for WebRTC connectivity
  function handleIceCandidate(candidate) {
    pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((error) =>
      console.error("Error adding ICE candidate:", error)
    );
  }

  // Handling ICE candidates for WebRTC connectivity
  pc.onicecandidate = function (event) {
    if (event.candidate) {
      // Send the ICE candidate to the other client through the signaling server
      socket.send(
        JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
      );
    }
  };

  pc.oniceconnectionstatechange = function () {
    console.log("ICE connection state:", pc.iceConnectionState);
  };

  // Handling the remote stream
  pc.ontrack = function (event) {
    remoteVideo.srcObject = event.streams[0];
  };
});
