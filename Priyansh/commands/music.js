const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");
const https = require("https");

function deleteAfterTimeout(filePath, timeout = 10000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {});
    }
  }, timeout);
}

module.exports = {
  config: {
    name: "music",
    version: "3.0",
    hasPermssion: 0,
    credits: "Rudra",
    description: "Download YouTube audio/video by name",
    commandCategory: "Media",
    usages: "[song name] [optional: video]",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("⚠️ Gaane ka naam likho!", event.threadID, event.messageID);

    const mediaType = args[args.length - 1].toLowerCase() === "video" ? "video" : "audio";
    const query = mediaType === "video" ? args.slice(0, -1).join(" ") : args.join(" ");

    const processing = await api.sendMessage(`🔎 "${query}" dhoond rahi hoon...`, event.threadID);

    try {
      const res = await ytSearch(query);
      if (!res.videos.length) throw new Error("Kuch nahi mila!");

      const video = res.videos[0];
      const videoUrl = video.url;
      const titleSafe = video.title.replace(/[^\w\s]/gi, "_");
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const thumbPath = path.join(cacheDir, `${titleSafe}.jpg`);
      const thumb = fs.createWriteStream(thumbPath);
      await new Promise((resolve) => {
        https.get(video.thumbnail, (res) => {
          res.pipe(thumb);
          thumb.on("finish", () => thumb.close(resolve));
        });
      });

      await api.sendMessage({
        attachment: fs.createReadStream(thumbPath),
        body: `🎵 Title: ${video.title}\n⏳ Downloading ${mediaType}...`
      }, event.threadID);

      deleteAfterTimeout(thumbPath, 5000);

      // 🔁 Try both APIs
      const apis = [
        `https://youtube-downloader-by-subrata.onrender.com/${mediaType}/?link=${encodeURIComponent(videoUrl)}`,
        `https://rudra-music-py.onrender.com/download?url=${encodeURIComponent(videoUrl)}&type=${mediaType}`
      ];

      let fileUrl;
      for (const apiUrl of apis) {
        try {
          const res = await axios.get(apiUrl);
          if (res.data && (res.data.file || res.data.file_url)) {
            fileUrl = res.data.file || res.data.file_url;
            break;
          }
        } catch {}
      }

      if (!fileUrl) throw new Error("Dono API fail ho gayi 😭");

      const ext = mediaType === "video" ? "mp4" : "mp3";
      const filePath = path.join(cacheDir, `${titleSafe}.${ext}`);
      const file = fs.createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        https.get(fileUrl.replace("http:", "https:"), (res) => {
          if (res.statusCode === 200) {
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
          } else {
            reject(new Error("Download failed!"));
          }
        }).on("error", reject);
      });

      api.sendMessage({
        attachment: fs.createReadStream(filePath),
        body: `✅ Aapka ${mediaType === "video" ? "video" : "gaana"} taiyaar hai!`
      }, event.threadID, () => deleteAfterTimeout(filePath, 10000), event.messageID);

    } catch (e) {
      console.error(e);
      api.sendMessage("❌ Error: " + e.message, event.threadID, event.messageID);
    }
  }
};
