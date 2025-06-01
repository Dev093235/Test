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
    version: "2.0.3",
    hasPermssion: 0,
    credits: "Mirrykal modified by Coding Partner",
    description: "Search and play a 30-second music preview from Deezer via your API.",
    commandCategory: "Media",
    usages: "[songName]",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    if (args.length === 0) {
      return api.sendMessage("⚠️ Gaane ka naam to likho na! 😒", event.threadID);
    }

    const songName = args.join(" ");

    const processingMessage = await api.sendMessage(
      `🔍 "${songName}" dhoondh rahi hoon... Ruko zara! 😏`,
      event.threadID,
      null,
      event.messageID
    );

    try {
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("YouTube par kuch nahi mila! Gaane ka naam sahi likho. 😑");
      }

      const topResult = searchResults.videos[0];
      const safeTitle = topResult.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
      const downloadDir = path.join(__dirname, "cache");
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      const thumbnailUrl = topResult.thumbnail;
      const thumbnailPath = path.join(downloadDir, `${safeTitle}_thumb.jpg`);

      const thumbnailFile = fs.createWriteStream(thumbnailPath);
      await new Promise((resolve, reject) => {
        https.get(thumbnailUrl, (response) => {
          if (response.statusCode === 200) {
            response.pipe(thumbnailFile);
            thumbnailFile.on("finish", () => {
              thumbnailFile.close(resolve);
            });
          } else {
            reject(new Error(`Thumbnail download failed with status: ${response.statusCode}`));
          }
        }).on("error", (error) => {
          fs.unlinkSync(thumbnailPath);
          reject(new Error(`Error downloading thumbnail: ${error.message}`));
        });
      });

      await api.sendMessage(
        {
          attachment: fs.createReadStream(thumbnailPath),
          body: `🎶 **Title:** ${topResult.title}\n⏰ Please wait, song loading... 🎧`,
        },
        event.threadID
      );

      deleteAfterTimeout(thumbnailPath, 5000);

      const yourRenderApiUrl = `https://rudra-music-spp.onrender.com/search/tracks?q=${encodeURIComponent(songName)}`;
      const deezerApiResponse = await axios.get(yourRenderApiUrl);

      if (!deezerApiResponse.data || !deezerApiResponse.data.data || !deezerApiResponse.data.data.length || !deezerApiResponse.data.data[0].preview) {
        throw new Error("Deezer API se song preview nahi mila. Gaane ka naam change karke dekho. 😢");
      }

      const firstTrack = deezerApiResponse.data.data[0];
      const previewUrl = firstTrack.preview.replace("http:", "https:");
      const downloadFilename = `${safeTitle}_preview.mp3`;
      const downloadPath = path.join(downloadDir, downloadFilename);

      const audioFileStream = fs.createWriteStream(downloadPath);
      await new Promise((resolve, reject) => {
        https.get(previewUrl, (response) => {
          if (response.statusCode === 200) {
            response.pipe(audioFileStream);
            audioFileStream.on("finish", () => {
              audioFileStream.close(resolve);
            });
          } else {
            fs.unlinkSync(downloadPath);
            reject(new Error(`Audio preview download failed. Status: ${response.statusCode}`));
          }
        }).on("error", (error) => {
          fs.unlinkSync(downloadPath);
          reject(new Error(`Error downloading audio preview: ${error.message}`));
        });
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `🎵 **Aapka gaana 🎧 (30-second preview) taiyaar hai!**\n🎶 Title: ${firstTrack.title}\n🎤 Artist: ${firstTrack.artist.name}\nEnjoy! 😍`,
        },
        event.threadID,
        event.messageID
      );

      deleteAfterTimeout(downloadPath, 5000);

    } catch (error) {
      console.error(`❌ Error in music command: ${error.message}`);
      api.sendMessage(`❌ Error: ${error.message} 😢`, event.threadID, event.messageID);
    } finally {
      if (processingMessage && api.unsendMessage) {
        api.unsendMessage(processingMessage.messageID);
      }
    }
  },
};
