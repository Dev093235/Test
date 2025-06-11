module.exports.config = {
  name: "owner",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Display stylish bot & owner info with background image",
  commandCategory: "info",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const canvas = require("canvas");
  const path = require("path");
  const moment = require("moment-timezone");

  const imgLinks = [
    "https://i.imgur.com/7vCTqbA.jpeg",
    "https://i.imgur.com/VoPlE0Q.jpeg",
    "https://i.imgur.com/5yHDG3r.jpeg",
    "https://i.imgur.com/6rlJUGk.jpeg"
  ];

  const bgURL = imgLinks[Math.floor(Math.random() * imgLinks.length)];

  const background = await canvas.loadImage(bgURL);
  const baseCanvas = canvas.createCanvas(800, 500);
  const ctx = baseCanvas.getContext("2d");

  ctx.drawImage(background, 0, 0, baseCanvas.width, baseCanvas.height);

  // Font setup
  const fontPath = path.join(__dirname, "cache", "Merriweather-Bold.ttf");
  if (!fs.existsSync(fontPath)) {
    const fontUrl = "https://github.com/google/fonts/raw/main/ofl/merriweather/Merriweather-Bold.ttf";
    const fontRes = await axios.get(fontUrl, { responseType: "arraybuffer" });
    fs.ensureDirSync(path.join(__dirname, "cache"));
    fs.writeFileSync(fontPath, Buffer.from(fontRes.data));
  }

  canvas.registerFont(fontPath, { family: "SwagFont" });
  ctx.font = "28px SwagFont";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 4;

  // Time & text
  const dateNow = moment.tz("Asia/Kolkata").format("DD/MM/YYYY • HH:mm:ss");
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const lines = [
    `👑 BOT: ${global.config.BOTNAME || "RUDRA AI 🤖"}`,
    `🧠 OWNER: Rudra (UID: 61550558518720)`,
    `📍 PREFIX: ${global.config.PREFIX || "+"}`,
    `📸 INSTA: @haryana_aala_sayzs`,
    `📆 DATE: ${dateNow}`,
    `⏳ UPTIME: ${hours}h ${minutes}m ${seconds}s`,
    `💌 TYPE "${global.config.PREFIX || "+"}help" FOR COMMANDS`
  ];

  lines.forEach((text, i) => {
    ctx.fillText(text, 30, 60 + i * 45);
  });

  const imgPath = path.join(__dirname, "cache", "owner_card.png");
  const buffer = baseCanvas.toBuffer("image/png");
  fs.writeFileSync(imgPath, buffer);

  return api.sendMessage({
    body: "📜 𝑶𝒘𝒏𝒆𝒓 𝑰𝒏𝒇𝒐 𝑪𝒂𝒓𝒅 🦾",
    attachment: fs.createReadStream(imgPath)
  }, event.threadID, () => fs.unlinkSync(imgPath));
};
