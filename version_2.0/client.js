const socket = new WebSocket("ws://localhost:3000"); //"ws://localhost:3000");//ws://13.53.68.179:3000
let vid;
let fajlNev;

$(document).ready(function () {
  console.log("Started.");
  document.title = "watcHy";
  vid = document.getElementById("myVideo");

  // Event listener for when the connection is opened
  socket.addEventListener("open", (event) => {
    console.log("Connected to WebSocket server");
    document.getElementById("connectionStatus").innerHTML =
      "Connection: Connected";
    // Send a message to the server
    socket.send("Hello, server!");
  });

  // Event listener for receiving messages from the server
  socket.addEventListener("message", (event) => {
    const receivedData = event.data;

    // Check if the received data is a Blob
    if (receivedData instanceof Blob) {
      const reader = new FileReader();

      // Set up the FileReader onload event to handle the read data
      reader.onload = function () {
        try {
          const jsonData = JSON.parse(reader.result);
          console.log("Received JSON:", jsonData);
          handleMessage(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      // Read the contents of the Blob as text
      reader.readAsText(receivedData);
    } else {
      console.error("Received data is not a Blob:", receivedData);
    }
  });

  // Event listener for when the connection is closed
  socket.addEventListener("close", (event) => {
    console.log("Disconnected from WebSocket server");
    document.getElementById("connectionStatus").innerHTML =
      "Connection: Disconnected";
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
  sync(message);
  if (message.state == "stop") {
    pauseVid();
  } else if (message.state == "start") {
    playVid();
  }
}

function startVideo() {
  if (socket.readyState === WebSocket.OPEN) {
    // Get the message from an input field or any other source
    const data = {
      currentTime: vid.currentTime,
      state: "start",
    };
    const message = JSON.stringify(data);
    // Check if the WebSocket connection is open
    // Send the message to the server
    socket.send(message);
    playVid();
  } else {
    console.error("WebSocket connection is not open.");
  }
}

function stopVideo() {
  // Check if the WebSocket connection is open
  if (socket.readyState === WebSocket.OPEN) {
    // Send the message to the server
    pauseVid();
    // Get the message from an input field or any other source
    const data = {
      currentTime: vid.currentTime,
      state: "stop",
    };
    const message = JSON.stringify(data);
    socket.send(message);
  } else {
    console.error("WebSocket connection is not open.");
  }
}

//NOTE: we need this
function sync(message) {
  console.log("sync");
  vid.currentTime = message.currentTime;
  myTimer();
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
var myVar = setInterval(myTimer, 1);

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
