const axios = require("axios");

module.exports.config = {
  name: "owner",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Rudra & You",
  description: "जब कोई बोले owner तो stylish Rudra reply के साथ anime images भेजे",
  commandCategory: "No prefix",
  usages: "owner शब्द किसी भी मेसेज में लिखें",
  cooldowns: 5,
};

const imageLinks = [
  "https://i.imgur.com/RygyQj0.jpeg",
  "https://i.imgur.com/lKtqjkH.jpeg",
  "https://i.imgur.com/6a35Zrf.jpeg",
  "https://i.imgur.com/CojcGcE.jpeg",
  "https://i.imgur.com/aLszk7Y.jpeg",
  "https://i.imgur.com/8X2MQTT.jpeg",
  "https://i.imgur.com/sV6tdbh.jpeg",
  "https://i.imgur.com/Zhrl89g.jpeg",
  "https://i.imgur.com/vwXCDP1.jpeg",
  "https://i.imgur.com/qaC7UHo.jpeg",
  "https://i.imgur.com/9tX9vYU.jpeg"
];

async function fetchImageStream(url) {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream"
  });
  return response.data;
}

module.exports.handleEvent = async function({ api, event }) {
  try {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const msg = body.toLowerCase();

    if (msg.includes("owner")) {
      const selectedImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
      const imgStream = await fetchImageStream(selectedImage);

      const stylishText = 
`✨🔥 𝙻𝚎𝚟𝚂𝚝𝚢𝚕𝚒𝚜𝚑 𝗥𝘂𝗱𝗿𝗮 𝗢𝘄𝗻𝗲𝗿 🔥✨

▶ YouTube: https://youtube.com/@MirryKal
▶ Facebook: https://www.facebook.com/rudra.461718

📸 Here's your random stylish anime image!`;

      await api.sendMessage({
        body: stylishText,
        attachment: imgStream
      }, threadID, messageID);

      api.setMessageReaction("📷", messageID, () => {}, true);
    }
  } catch (err) {
    console.error("Owner module error:", err);
  }
};

module.exports.run = () => {};
