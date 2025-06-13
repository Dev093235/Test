const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "coupledp",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Stylish Couple DP fetcher with Rudra Swag 💖",
  commandCategory: "fun",
  usages: "+coupledp name1 name2 - count",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
  const input = args.join(" ");
  if (!input.includes("-")) {
    return api.sendMessage("⚠️ Usage: +coupledp mohit riya - 3", event.threadID, event.messageID);
  }

  const searchTerm = input.substring(0, input.indexOf("-")).trim() + " couple dp";
  const count = parseInt(input.split("-").pop().trim()) || 3;

  try {
    const res = await axios.get(`https://rudra-pintrest-server.onrender.com/dp?q=${encodeURIComponent(searchTerm)}&n=${count}`);
    const imageUrls = res.data?.data || [];

    if (!imageUrls.length) {
      return api.sendMessage("❌ Sorry! Koi DP nahi mili. Try another keyword.", event.threadID, event.messageID);
    }

    const files = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const imgUrl = imageUrls[i];
      const imgData = (await axios.get(imgUrl, { responseType: "arraybuffer" })).data;
      const imgPath = path.join(__dirname, "cache", `dp${i}.jpg`);

      fs.ensureDirSync(path.dirname(imgPath));
      fs.writeFileSync(imgPath, imgData);
      files.push(fs.createReadStream(imgPath));
    }

    const term = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);

    await api.sendMessage({
      body: `📸 Here's your *Couple DP* (${term})\n\n✨ Powered by 𝙍𝙪𝙙𝙧𝙖 💫`,
      attachment: files
    }, event.threadID, event.messageID);

    // Clean up
    for (let i = 0; i < imageUrls.length; i++) {
      fs.unlinkSync(path.join(__dirname, "cache", `dp${i}.jpg`));
    }

  } catch (err) {
    console.error("❌ Error in coupledp:", err.message);
    return api.sendMessage("🚫 DP laate waqt kuch gadbad ho gayi. Try again later!", event.threadID, event.messageID);
  }
};
