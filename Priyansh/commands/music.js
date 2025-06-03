const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");
const https = require("https");

function deleteAfterTimeout(filePath, timeout = 5000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (!err) {
          console.log(`✅ Deleted file: ${filePath}`);
        } else {
          console.error(`❌ Error deleting file: ${err.message}`);
        }
      });
    }
  }, timeout);
}

module.exports = {
  config: {
    name: "music",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "Mirrykal + Rudra",
    description: "Download YouTube song or video",
    commandCategory: "Media",
    usages: "[songName] [optional: video]",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    if (args.length === 0) {
      return api.sendMessage("⚠️ Gaane ka naam to likho na! 😒", event.threadID);
    }

    const mediaType = args[args.length - 1].toLowerCase() === "video" ? "video" : "audio";
    const songName = mediaType === "video" ? args.slice(0, -1).join(" ") : args.join(" ");

    const processingMessage = await api.sendMessage(
      `🔍 "${songName}" dhoondh rahi hoon... Ruko zara! 😏`,
      event.threadID,
      null,
      event.messageID
    );

    try {
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("Kuch nahi mila! Gaane ka naam sahi likho. 😑");
      }

      const topResult = searchResults.videos[0];
      const videoUrl = `https://www.youtube.com/watch?v=${topResult.videoId}`;
      const thumbnailUrl = topResult.thumbnail;
      const safeTitle = topResult.title.replace(/[^a-zA-Z0-9]/g, "_");
      const downloadDir = path.join(__dirname, "cache");

      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      const thumbnailPath = path.join(downloadDir, `${safeTitle}.jpg`);
      const thumbnailFile = fs.createWriteStream(thumbnailPath);
      await new Promise((resolve, reject) => {
        https.get(thumbnailUrl, (response) => {
          response.pipe(thumbnailFile);
          thumbnailFile.on("finish", () => {
            thumbnailFile.close(resolve);
          });
        }).on("error", (error) => {
          fs.unlinkSync(thumbnailPath);
          reject(new Error(`Thumbnail download failed: ${error.message}`));
        });
      });

      await api.sendMessage(
        {
          attachment: fs.createReadStream(thumbnailPath),
          body: `🎶 Title: ${topResult.title}\n⏳ Thoda wait karo, download ho raha hai... 😘`,
        },
        event.threadID
      );
      deleteAfterTimeout(thumbnailPath, 5000);

      // 🔁 Try both APIs
      const apis = [
        `https://arun-music.onrender.com/download?url=${encodeURIComponent(videoUrl)}&type=${mediaType}`,
        `https://saavnapi.onrender.com/yt?url=${encodeURIComponent(videoUrl)}&type=${mediaType}`,
      ];

      let fileUrl;
      for (const apiUrl of apis) {
        try {
          const response = await axios.get(apiUrl);
          if (response.data && response.data.file_url) {
            fileUrl = response.data.file_url.replace("http:", "https:");
            break;
          }
        } catch (e) {
          console.warn(`⚠️ API failed: ${apiUrl}`);
        }
      }

      if (!fileUrl) throw new Error("Dono API fail ho gayi 😭");

      const filename = `${safeTitle}.${mediaType === "video" ? "mp4" : "mp3"}`;
      const downloadPath = path.join(downloadDir, filename);

      const file = fs.createWriteStream(downloadPath);
      await new Promise((resolve, reject) => {
        https.get(fileUrl, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on("finish", () => file.close(resolve));
          } else {
            reject(new Error(`Download fail ho gaya. Status: ${response.statusCode}`));
          }
        }).on("error", (error) => {
          fs.unlinkSync(downloadPath);
          reject(new Error(`Error downloading file: ${error.message}`));
        });
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `🎵 Aapka ${mediaType === "video" ? "Video 🎥" : "Gaana 🎧"} taiyaar hai!\nEnjoy! 😍`,
        },
        event.threadID,
        event.messageID
      );

      deleteAfterTimeout(downloadPath, 5000);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      api.sendMessage(`❌ Error: ${error.message} 😢`, event.threadID, event.messageID);
    }
  },
};
