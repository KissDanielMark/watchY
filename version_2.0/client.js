const socket = new WebSocket("ws://localhost:3000");
let vid;
let fajlNev;

$(document).ready(function () {
  console.log("Started.");
  document.title = "watcHy";
  vid = document.getElementById("myVideo");

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
        handleMessage(reader.result);
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
    startVideo();
  });

  $("#stopButton").on("click", function () {
    stopVideo();
  });

  document.getElementById("fajl").addEventListener(
    "change",
    function () {
      var file = this.files[0];
      fajlNev = this.files[0].name;

      if (file) {
        var fileURL = URL.createObjectURL(file);
        vid.src = fileURL;
      }
    },
    false
  );

  document.getElementById("getReady").addEventListener("click", function () {
    keszulj();
  });

  document.getElementById("full").addEventListener("click", function () {
    openFullscreen();
  });
});

function handleMessage(message) {
  if (message == "stop") {
    pauseVid();
  } else if (message == "start") {
    playVid();
  } else {
    ///Syncing
  }
}

function startVideo() {
  // Get the message from an input field or any other source
  const message = "start";
  // Check if the WebSocket connection is open
  if (socket.readyState === WebSocket.OPEN) {
    // Send the message to the server
    socket.send(message);
    playVid();
  } else {
    console.error("WebSocket connection is not open.");
  }
}

function stopVideo() {
  // Get the message from an input field or any other source
  const message = "stop";
  // Check if the WebSocket connection is open
  if (socket.readyState === WebSocket.OPEN) {
    // Send the message to the server
    pauseVid();
    socket.send(message);
  } else {
    console.error("WebSocket connection is not open.");
  }
}

function jump() {
  var hova = document.getElementById("jumpIdo").value;
  vid.currentTime = hova;
}

function keszulj() {
  console.log("Halo");
  var x = document.getElementById("startButton");
  x.style.display = "block";

  var y = document.getElementById("stopButton");
  y.style.display = "block";

  var v = document.getElementById("myVideo");
  v.style.display = "block";

  var f = document.getElementById("full");
  f.style.display = "block";
}

function openFullscreen() {
  if (vid.requestFullscreen) {
    vid.requestFullscreen();
  } else if (vid.mozRequestFullScreen) {
    /* Firefox */
    vid.mozRequestFullScreen();
  } else if (vid.webkitRequestFullscreen) {
    /* Chrome, Safari & Opera */
    vid.webkitRequestFullscreen();
  } else if (vid.msRequestFullscreen) {
    /* IE/Edge */
    vid.msRequestFullscreen();
  }
}

function playVid() {
  vid.play();
  document.title = "Play -  " + fajlNev + ".mp4";
}

function pauseVid() {
  vid.pause();
  document.title = "Pause - " + fajlNev + ".mp4";
}
var myVar = setInterval(myTimer, 100);

function myTimer() {
  //console.log("current time: "+vid.currentTime);
  document.getElementById("ido").innerHTML =
    "Time: " + vid.currentTime + " sec";
}
//TODO: properly implement it
document.body.onkeyup = function (e) {
  if (e.keyCode == 83) {
    startVideo();
  }

  if (e.keyCode == 80) {
    stopVideo();
  }

  if (e.keyCode == 70) {
    openFullscreen();
  }
};
