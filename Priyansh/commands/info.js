module.exports.config = {
  name: "info",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Display swaggy owner and bot info with random stylish image",
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

  // Your personal Imgur + anime links
  const imgLinks = [
    "https://i.imgur.com/7vCTqbA.jpeg",
    "https://i.imgur.com/VoPlE0Q.jpeg",
    "https://i.imgur.com/5yHDG3r.jpeg",
    "https://i.imgur.com/6rlJUGk.jpeg",
    "https://i.imgur.com/XATbDwP.jpeg",
    "https://i.imgur.com/zXV7snD.jpeg",
    "https://i.imgur.com/pZ1LEIm.jpeg",
    "https://i.imgur.com/HyQvK9J.jpeg"
  ];

  const chosenImage = imgLinks[Math.floor(Math.random() * imgLinks.length)];

  const msg = `✨ 𝙎𝙒𝘼𝙂 𝙈𝙊𝘿𝙀 𝙊𝙉 ✨\n━━━━━━━━━━━━━━━\n\n` +
              `👑 𝗕𝗢𝗧: ${global.config.BOTNAME || "🔥 RUDRA ⚔️"}\n` +
              `🧠 𝗢𝗪𝗡𝗘𝗥: 𝑹𝑼𝑫𝑹𝑨 🔥 (UID: 61550558518720)\n` +
              `📸 𝗜𝗡𝗦𝗧𝗔: @haryana_aala_sayzs\n` +
              `📍 𝗣𝗥𝗘𝗙𝗜𝗫: ${global.config.PREFIX || "+"}\n` +
              `📆 𝗗𝗔𝗧𝗘: ${dateNow}\n` +
              `⏳ 𝗨𝗣𝗧𝗜𝗠𝗘: ${hours}h ${minutes}m ${seconds}s\n\n` +
              `💌 𝗧𝗬𝗣𝗘 '${global.config.PREFIX || "+"}help' 𝗙𝗢𝗥 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 💌\n` +
              `━━━━━━━━━━━━━━━\n💖 𝑴𝒂𝒅𝒆 𝒘𝒊𝒕𝒉 𝑺𝒘𝒂𝒈 𝒃𝒚 𝑹𝑼𝑫𝑹𝑨`;

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
