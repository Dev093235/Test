const fs = require("fs");
const ytdl = require("ytdl-core");
const { exec } = require("child_process");
const path = require("path");

module.exports.run = async ({ api, event, args }) => {
  if (!args.length) 
    return api.sendMessage("Please provide a song name or YouTube URL.", event.threadID, event.messageID);

  const search = args.join(" ");

  // You can use yt-search or youtubei.js for search, but here for simplicity
  // Assume user sends YouTube link, or use yt-search to get first video URL

  // For demo, assume args[0] is YouTube URL (improve by searching later)
  let url = args[0];
  if (!ytdl.validateURL(url)) {
    return api.sendMessage("Please provide a valid YouTube URL.", event.threadID, event.messageID);
  }

  const id = event.senderID;
  const dir = __dirname + "/tmp/";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const filePath = path.join(dir, `${id}.mp3`);

  // Start downloading
  api.sendMessage("Downloading your song, please wait...", event.threadID, event.messageID);

  // Download audio only, save as mp3
  const stream = ytdl(url, { filter: 'audioonly' });

  // Use ffmpeg to convert to mp3 if needed
  const ffmpeg = require('fluent-ffmpeg');

  await new Promise((resolve, reject) => {
    ffmpeg(stream)
      .audioBitrate(128)
      .save(filePath)
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });

  // Send audio file to Messenger
  api.sendMessage(
    {
      body: `Here's your song 🎵`,
      attachment: fs.createReadStream(filePath)
    },
    event.threadID,
    () => {
      // Delete file after sending
      fs.unlinkSync(filePath);
    },
    event.messageID
  );
};

module.exports.config = {
  name: "song",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Download and send audio from YouTube",
  commandCategory: "media",
  usages: "[YouTube URL]",
  cooldowns: 5,
  aliases: ["music", "song"]
};
