module.exports.config = {
  name: "pair",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "🔥 Ultimate Swag Pairing Command 🔥",
  commandCategory: "Fun",
  usages: "",
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  },
  cooldowns: 0
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { loadImage, createCanvas } = require("canvas");
  
  const pathImg = __dirname + "/cache/pairResult.png";
  const pathAvt1 = __dirname + "/cache/avt1.png";
  const pathAvt2 = __dirname + "/cache/avt2.png";

  const senderID = event.senderID;
  const senderName = await Users.getNameUser(senderID);

  // Get all users except sender and bot
  const threadInfo = await api.getThreadInfo(event.threadID);
  let members = threadInfo.userInfo.filter(u => u.id != senderID && u.id != api.getCurrentUserID());

  if (members.length === 0) {
    return api.sendMessage("😔 Arre bhai, akele hi ho is group mein! Koi match nahi mila. Thodi der baad try karo ya naye log lao!", event.threadID, event.messageID);
  }

  // Random partner pick
  const partner = members[Math.floor(Math.random() * members.length)];
  const partnerName = await Users.getNameUser(partner.id);

  // Compatibility score random with swag
  const scores = [69, 70, 80, 90, 99, 100, 88, 77];
  const compatibility = scores[Math.floor(Math.random() * scores.length)];

  // Cool backgrounds - tu apne hisab se add kar sakta hai
  const backgrounds = [
    "https://i.postimg.cc/wjJ29HRB/background1.png",
    "https://i.postimg.cc/zf4Pnshv/background2.png",
    "https://i.postimg.cc/5tXRQ46D/background3.png"
  ];
  const bgUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  // Download avatars & background
  const getImage = async (url, path) => {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    await fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
  };

  await getImage(`https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, pathAvt1);
  await getImage(`https://graph.facebook.com/${partner.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, pathAvt2);
  await getImage(bgUrl, pathImg);

  // Canvas setup
  const baseImg = await loadImage(pathImg);
  const avatar1 = await loadImage(pathAvt1);
  const avatar2 = await loadImage(pathAvt2);

  const canvas = createCanvas(baseImg.width, baseImg.height);
  const ctx = canvas.getContext("2d");

  // Draw background
  ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

  // Draw avatars with circle mask
  function drawCircleImage(img, x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, size, size);
    ctx.restore();
  }
  drawCircleImage(avatar1, 130, 150, 280);
  drawCircleImage(avatar2, 900, 150, 280);

  // Draw flashy heart
  ctx.font = "140px Arial";
  ctx.fillStyle = "#ff2e63";
  ctx.shadowColor = "#ff6f91";
  ctx.shadowBlur = 30;
  ctx.textAlign = "center";
  ctx.fillText("💖", canvas.width / 2, 350);

  // Compatibility text with style
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#fff";
  ctx.font = "bold 60px Poppins, Arial";
  ctx.fillText(`Compatibility Score: ${compatibility}%`, canvas.width / 2, 530);

  // Final save
  const buffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, buffer);

  // Clean up avatars
  fs.removeSync(pathAvt1);
  fs.removeSync(pathAvt2);

  // Send message with swag
  return api.sendMessage({
    body: `✨🔥 Wah bhai! Ek dum 🔥🔥🔥\n\n` +
          `🎯 ${senderName} ❤️ ${partnerName}\n` +
          `💘 Compatibility: ${compatibility}%\n\n` +
          `“Dil ke kone mein ek jagah hamesha reserved hai tumhare liye...”\n\n` +
          `───────────────\n` +
          `⚡ Powered by 𝗥𝘂𝗱𝗿𝗮 𝗕𝗼𝘁 ⚡\n` +
          `───────────────\n` +
          `Aage badho, aur pair command se aur matches dhundo!`,

    mentions: [{ id: partner.id, tag: partnerName }],
    attachment: fs.createReadStream(pathImg)
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
};
