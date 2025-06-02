const fs = require("fs-extra");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

module.exports.config = {
  name: "play", // change to "song" if you want
  version: "1.0",
  hasPermssion: 0,
  credits: "Priyansh Rajput & Rudra Edit",
  description: "Play music from YouTube",
  commandCategory: "music",
  usages: "[song name]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const searchString = args.join(" ");
  if (!searchString) return api.sendMessage("🔍 Song ka naam likh bhai!", event.threadID, event.messageID);

  try {
    const searchResult = await ytSearch(searchString);
    if (!searchResult.videos.length) return api.sendMessage("❌ Koi song nahi mila!", event.threadID, event.messageID);

    const video = searchResult.videos[0];
    const stream = ytdl(video.url, { filter: "audioonly" });
    const fileName = `music_${Date.now()}.mp3`;
    const filePath = path.join(__dirname, "cache", fileName);

    const writeStream = fs.createWriteStream(filePath);
    ffmpeg(stream)
      .audioBitrate(128)
      .save(filePath)
      .on("end", () => {
        api.sendMessage({
          body: `🎵 Playing: ${video.title}`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
      })
      .on("error", (err) => {
        console.error(err);
        api.sendMessage("⚠️ Error while converting the song.", event.threadID, event.messageID);
      });

  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Kuch galat ho gaya bhai!", event.threadID, event.messageID);
  }
};
