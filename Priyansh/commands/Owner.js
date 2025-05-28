const axios = require('axios');

module.exports.config = {
  name: "owner",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rudra",
  description: "No prefix needed, responds to keywords",
  commandCategory: "No prefix",
  usages: "Just say 'owner' or 'rudra'",
  cooldowns: 5,
};

const imgs = [
  // Tere diye hue
  "https://i.imgur.com/RygyQj0.jpeg",
  "https://i.imgur.com/lKtqjkH.jpeg",
  "https://i.imgur.com/6a35Zrf.jpeg",
  "https://i.imgur.com/CojcGcE.jpeg",
  // Mere diye hue anime-style
  "https://i.imgur.com/aLszk7Y.jpeg",
  "https://i.imgur.com/8X2MQTT.jpeg",
  "https://i.imgur.com/sV6tdbh.jpeg",
  "https://i.imgur.com/Zhrl89g.jpeg",
  "https://i.imgur.com/vwXCDP1.jpeg",
  "https://i.imgur.com/qaC7UHo.jpeg"
];

module.exports.handleEvent = async function({ api, event }) {
  try {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const text = body.toLowerCase();
    if (text.includes("owner") || text.includes("rudra")) {
      const randomImage = imgs[Math.floor(Math.random() * imgs.length)];

      const response = await axios({
        method: 'GET',
        url: randomImage,
        responseType: 'stream'
      });

      const msg = {
        body: `★ 𝗢𝘄𝗻𝗲𝗿 + 𝗠𝗮𝗱𝗲 𝗕𝘆 ★\n\n✦ 𝐑𝐮𝐝𝐫𝐚 ✦\n\n▶ Youtube: https://youtube.com/@MirryKal`,
        attachment: response.data
      };

      api.sendMessage(msg, threadID, messageID);
      api.setMessageReaction("📷", messageID, () => {}, true);
    }
  } catch (err) {
    console.log("❌ Error:", err.message);
  }
};

module.exports.run = () => {};
