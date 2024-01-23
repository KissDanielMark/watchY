const localVideo = document.getElementById("localVideo");
const signalingServerUrl = "ws://localhost:3000"; // Change the URL if your signaling server is hosted elsewhere

const socket = new WebSocket(signalingServerUrl);

navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then(function (stream) {
    localVideo.srcObject = stream;

    // Initialize the PeerConnection
    const pc = new RTCPeerConnection();

    // Add the local stream to the PeerConnection
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Create an offer and set it as the local description
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .then(() => {
        // Send the offer to the signaling server
        console.log("Sending offer:", pc.localDescription);
        socket.send(
          JSON.stringify({ type: "offer", offer: pc.localDescription })
        );
      })
      .catch((error) => console.error("Error creating offer:", error));
  })
  .catch((error) => console.error("Error accessing camera:", error));
