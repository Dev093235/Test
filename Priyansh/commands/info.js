module.exports.config = {
  name: "info",
  version: "4.1.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Swaggy owner/bot info with animated style and image",
  commandCategory: "info",
  cooldowns: 1,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const moment = require("moment-timezone");

  const time = process.uptime();
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  const dateNow = moment.tz("Asia/Kolkata").format("『DD/MM/YYYY』 【HH:mm:ss】");

  const imgLinks = [
    "https://i.imgur.com/XATbDwP.jpeg",
    "https://i.imgur.com/zXV7snD.jpeg",
    "https://i.imgur.com/pZ1LEIm.jpeg",
    "https://i.imgur.com/HyQvK9J.jpeg"
  ];
  const chosenImage = imgLinks[Math.floor(Math.random() * imgLinks.length)];

  const anim = (txt) => `『💫 ${txt.split('').join(' 💫 ')} 💫』`;

  const msg =
`${anim("S W A G  M O D E")} ✨
━━━━━━━━━━━━━━━

👑 ${anim("B O T")}: ${global.config.BOTNAME || "🔥 RUDRA ⚔️"}
🧠 ${anim("O W N E R")}: 𝑹𝑼𝑫𝑹𝑨 🔥 (UID: 61550558518720)
📸 ${anim("I N S T A")}: @haryana_aala_sayzs
📍 ${anim("P R E F I X")}: ${global.config.PREFIX || "+"}
📆 ${anim("D A T E")}: ${dateNow}
⏳ ${anim("U P T I M E")}: ${hours}h ${minutes}m ${seconds}s

💌 𝗧𝗬𝗣𝗘 '${global.config.PREFIX || "+"}help' 𝗙𝗢𝗥 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 💌
━━━━━━━━━━━━━━━
💖 𝑴𝒂𝒅𝒆 𝒘𝒊𝒕𝒉 𝑺𝒘𝒂𝒈 𝒃𝒚 𝑹𝑼𝑫𝑹𝑨`;

  const cachePath = __dirname + "/cache";
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

  const callback = () =>
    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/rudra_info.jpg")
      },
      event.threadID,
      () => fs.unlinkSync(__dirname + "/cache/rudra_info.jpg")
    );

  request(encodeURI(chosenImage))
    .pipe(fs.createWriteStream(__dirname + "/cache/rudra_info.jpg"))
    .on("close", () => callback());
};
