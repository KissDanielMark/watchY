// stream-creator.js

import { ffmpeg } from "./ffmpeg-init.js";

export async function createStream() {
  const input = "movie.mp4"; // Replace with your video file path

  // Read the video file
  ffmpeg.FS("writeFile", "input.mp4", await fetchFile(input));

  // Run FFmpeg to convert video into chunks
  await ffmpeg.run("-i", "input.mp4", "-c:v", "libx264", "-f", "mp4", "pipe:1");

  // Get the result as a Uint8Array
  const { data } = ffmpeg.FS("readFile", "pipe:1");

  // Connect to the WebSocket server
  const ws = new WebSocket("ws://localhost:3000");

  // Send video chunks to the server
  for (let offset = 0; offset < data.length; offset += 1024 * 1024) {
    ws.send(data.subarray(offset, offset + 1024 * 1024));
    await new Promise((resolve) => setTimeout(resolve, 100)); // Add a delay to control the sending rate
  }

  ws.close();
}
