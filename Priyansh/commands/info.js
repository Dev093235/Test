module.exports.config = {
  name: "info",
  version: "3.0.1",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Show full Pro-level info with swag",
  commandCategory: "info",
  cooldowns: 1,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function({ api, event }) {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const moment = require("moment-timezone");

  const time = process.uptime(),
        hours = Math.floor(time / (60 * 60)),
        minutes = Math.floor((time % (60 * 60)) / 60),
        seconds = Math.floor(time % 60);
  const now = moment.tz("Asia/Kolkata").format("『D/MM/YYYY』 【HH:mm:ss】");

  // 💫 Rudra’s Personal Photos
  const rudraPics = [
    "https://i.imgur.com/7vCTqbA.jpeg",
    "https://i.imgur.com/VoPlE0Q.jpeg",
    "https://i.imgur.com/5yHDG3r.jpeg",
    "https://i.imgur.com/6rlJUGk.jpeg"
  ];

  // 🎌 Anime pics with Rudra vibes
  const animePics = [
    "https://i.imgur.com/XATbDwP.jpeg",
    "https://i.imgur.com/zXV7snD.jpeg",
    "https://i.imgur.com/pZ1LEIm.jpeg",
    "https://i.imgur.com/HyQvK9J.jpeg"
  ];

  const allImages = [...rudraPics, ...animePics];
  const pick = allImages[Math.floor(Math.random() * allImages.length)];

  const msg = `✨ 𓆩 𝐑𝐔𝐃𝐑𝐀 𝐁𝐎𝐓 ✘ 𝐈𝐍𝐅𝐎 𓆪 ✨

🧠 𝗢𝗪𝗡𝗘𝗥 ➤ 𝐑𝐔𝐃𝐑𝐀 ⚡ (UID: 61550558518720)
📸 𝗜𝗡𝗦𝗧𝗔 ➤ @haryana_aala_sayzs
💌 𝗙𝗕 ➤ fb.com/61550558518720

🛡️ 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘 ➤ ${global.config.BOTNAME || "𝐑𝐢𝐲𝐚 💖"}
📍 𝗣𝗥𝗘𝗙𝗜𝗫 ➤ ${global.config.PREFIX || "+"}
⏳ 𝗨𝗣𝗧𝗜𝗠𝗘 ➤ ${hours}h ${minutes}m ${seconds}s
🕒 𝗧𝗜𝗠𝗘 ➤ ${now}

💬 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 ➤ “𝐓𝐞𝐫𝐞 𝐣𝐚𝐢𝐬𝐞 𝐛𝐨𝐭 𝐧𝐡𝐢 — 𝐑𝐮𝐝𝐫𝐚 𝐞𝐤 𝐟𝐞𝐞𝐥 𝐡𝐚𝐢 ❖🔥”

🔮 𝗧𝗬𝗣𝗘 '${global.config.PREFIX || "+"}help' 𝐟𝐨𝐫 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬 🧠
━━━━━━━━━━━━━━━━━━━━━━━`;

  const callback = () => api.sendMessage({
    body: msg,
    attachment: fs.createReadStream(__dirname + "/cache/rudra_info.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/rudra_info.jpg"));

  return request(encodeURI(pick)).pipe(fs.createWriteStream(__dirname + "/cache/rudra_info.jpg")).on("close", () => callback());
};
