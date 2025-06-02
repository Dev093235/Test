const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const yts = require('yt-search');
const path = require('path');

module.exports.config = {
  name: "song",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Play a song from YouTube",
  commandCategory: "music",
  usages: "[song name]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const songName = args.join(" ");
  if (!songName) return api.sendMessage("⛔ Song name likho, jaise: play tum hi ho", event.threadID, event.messageID);

  const search = await yts(songName);
  if (!search.videos.length) return api.sendMessage("❌ Koi result nahi mila.", event.threadID, event.messageID);

  const video = search.videos[0];
  const stream = ytdl(video.url, { filter: "audioonly" });
  const filePath = path.join(__dirname, "cache", `${event.senderID}.mp3`);

  stream.pipe(fs.createWriteStream(filePath)).on("finish", () => {
    api.sendMessage({
      body: `🎶 Playing: ${video.title}`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
  });
};
