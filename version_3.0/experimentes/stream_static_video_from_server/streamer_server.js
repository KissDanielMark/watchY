const express = require("express");
const fs = require("fs");

const app = express();
const port = 731;

const videoPath = "movie.mp4";
const videoSize = fs.statSync(videoPath).size;

app.get("/video", (req, res) => {
  console.log("video");
  const range = req.headers.range;

  if (!range) {
    res.status(400).send("Range header is required");
    return;
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

  const chunksize = end - start + 1;

  const file = fs.createReadStream(videoPath, { start, end });
  const head = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, head);
  file.pipe(res);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
