module.exports.config = {
  name: "info",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Show Ultimate Pro-Level Owner & Bot Info",
  commandCategory: "info",
  cooldowns: 2,
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
  const date = moment.tz("Asia/Kolkata").format("DD/MM/YYYY | hh:mm:ss A");

  // 🔥 Your own swag photos
  const rudraPhotos = [
    "https://i.imgur.com/7vCTqbA.jpeg",
    "https://i.imgur.com/VoPlE0Q.jpeg",
    "https://i.imgur.com/5yHDG3r.jpeg",
    "https://i.imgur.com/6rlJUGk.jpeg"
  ];

  // ⚔️ Anime with 'Rudra' styled name
  const animeSwag = [
    "https://i.imgur.com/rg0fjQE.jpg",
    "https://i.imgur.com/QcNXYfT.jpg",
    "https://i.imgur.com/WhVSHLB.png"
  ];

  const images = [...rudraPhotos, ...animeSwag];
  const imgURL = images[Math.floor(Math.random() * images.length)];
  const imgPath = __dirname + "/cache/rudra_info.jpg";

  const callback = () => {
    const msg = `✨ 𓆩 𝐑𝐔𝐃𝐑𝐀 𝐁𝐎𝐓 𝐏𝐑𝐎 𝐈𝐍𝐅𝐎 𓆪 ✨

👑 𝗢𝗪𝗡𝗘𝗥: 𒆜 𝑹𝑼𝑫𝑹𝑨 𒆜
📛 𝗙𝗕: fb.com/61550558518720
📸 𝗜𝗚: @haryana_aala_sayzs

🤖 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘: ${global.config.BOTNAME || "Riya"}
🔖 𝗣𝗥𝗘𝗙𝗜𝗫: ${global.config.PREFIX || "+"}

🕒 𝗧𝗜𝗠𝗘: ${date}
⏱ 𝗨𝗣𝗧𝗜𝗠𝗘: ${hours}h ${minutes}m ${seconds}s

🥷🏻 𝗣𝗘𝗥𝗦𝗢𝗡𝗔: Cool • Classy • Dangerous 😎
💌 𝗠𝗘𝗦𝗦𝗔𝗚𝗘: "Attitude to bas naam ka hai... Rudra naam hi काफी है 💥"

❤️ धन्यवाद जो Rudra Bot को यूज़ कर रहे हो 🙏`;

    api.sendMessage(
      { body: msg, attachment: fs.createReadStream(imgPath) },
      event.threadID,
      () => fs.unlinkSync(imgPath)
    );
  };

  request(encodeURI(imgURL)).pipe(fs.createWriteStream(imgPath)).on("close", callback);
};
