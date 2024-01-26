// ffmpeg-init.js

let ffmpeg;

export async function initFFmpeg() {
  // Dynamic import for use in a regular browser context
  const { createFFmpeg } = await import(
    "https://cdnjs.cloudflare.com/ajax/libs/ffmpeg/0.12.10/umd/ffmpeg.min.js"
  );
  ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
}

export { ffmpeg };
