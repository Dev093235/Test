const axios = require("axios");
const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Bot info with canvas background",
  commandCategory: "info",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const backgroundLinks = [
    "https://i.imgur.com/XATbDwP.jpeg",
    "https://i.imgur.com/zXV7snD.jpeg",
    "https://i.imgur.com/pZ1LEIm.jpeg",
    "https://i.imgur.com/HyQvK9J.jpeg"
  ];

  const rudraPics = [
    "https://i.imgur.com/7vCTqbA.jpeg",
    "https://i.imgur.com/VoPlE0Q.jpeg",
    "https://i.imgur.com/5yHDG3r.jpeg",
    "https://i.imgur.com/6rlJUGk.jpeg"
  ];

  const backgroundUrl = backgroundLinks[Math.floor(Math.random() * backgroundLinks.length)];
  const background = await Canvas.loadImage((await axios.get(backgroundUrl, { responseType: "arraybuffer" })).data);
  const canvas = Canvas.createCanvas(800, 600);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(background, 0, 0, 800, 600);

  const fontPath = path.join(__dirname, "UTM_Thu_Phap.ttf");
  Canvas.registerFont(fontPath, { family: "RudraFont" });
  ctx.font = "40px RudraFont";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("🌟 Welcome to Rudra's World 🌟", 100, 70);

  ctx.font = "28px RudraFont";
  ctx.fillText(`👑 Bot Name: ${global.config.BOTNAME || "RUDRA ⚔️"}`, 80, 150);
  ctx.fillText(`🛐 Owner: Rudra (UID: 61550558518720)`, 80, 200);
  ctx.fillText(`🔥 Insta: @haryana_aala_sayzs`, 80, 250);
  ctx.fillText(`📍 Prefix: ${global.config.PREFIX || "+"}`, 80, 300);

  // Paste bottom 4 Rudra photos
  let x = 80;
  for (let i = 0; i < rudraPics.length; i++) {
    const img = await Canvas.loadImage((await axios.get(rudraPics[i], { responseType: "arraybuffer" })).data);
    ctx.drawImage(img, x, 350, 120, 120);
    x += 140;
  }

  const imagePath = __dirname + "/cache/rudra_info.jpg";
  const buffer = canvas.toBuffer();
  fs.writeFileSync(imagePath, buffer);

  api.sendMessage(
    {
      body: `✨ 𝑹𝑼𝑫𝑹𝑨 𝑷𝑹𝑶 𝑰𝑵𝑭𝑶 ✨`,
      attachment: fs.createReadStream(imagePath)
    },
    event.threadID,
    () => fs.unlinkSync(imagePath)
  );
};
