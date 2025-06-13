const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "coupledp",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Send couple dp images directly (no zip)",
  commandCategory: "fun",
  usages: "+coupledp mohit riya - 3",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
  const queryRaw = args.join(" ");
  if (!queryRaw.includes("-")) return api.sendMessage("⚠️ Usage: +coupledp mohit riya - 3", event.threadID, event.messageID);

  const query = queryRaw.substring(0, queryRaw.indexOf("-")).trim() + " couple dp";
  const count = parseInt(queryRaw.split("-").pop().trim()) || 3;

  const url = `https://rudra-pintrest-server.onrender.com/links?q=${encodeURIComponent(query)}&n=${count}`;

  try {
    const { data } = await axios.get(url);
    if (!data?.data?.length) throw new Error("No images");

    const imgLinks = data.data;
    const files = [];

    for (let i = 0; i < imgLinks.length; i++) {
      const res = await axios.get(imgLinks[i], { responseType: "arraybuffer" });
      const filePath = path.join(__dirname, "cache", `dp_${i}.jpg`);
      fs.ensureDirSync(path.dirname(filePath));
      fs.writeFileSync(filePath, res.data);
      files.push(fs.createReadStream(filePath));
    }

    api.sendMessage({
      body: `📸 Here's your *Couple DP* (${query})\n🖤 Powered by Rudra`,
      attachment: files
    }, event.threadID, () => {
      files.forEach((_, i) => fs.unlinkSync(path.join(__dirname, "cache", `dp_${i}.jpg`)));
    });

  } catch (err) {
    console.error(err.message);
    api.sendMessage("❌ Couldn't fetch couple DP. Try again later.", event.threadID, event.messageID);
  }
};
