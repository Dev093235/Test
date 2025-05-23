module.exports.config = {
  name: "pair3",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 + Modified to Pro by RUDRA",
  description: "Find your perfect match with aesthetic pairing image",
  commandCategory: "Love & Fun",
  usages: "pair3",
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  },
  cooldowns: 0
};

module.exports.run = async function ({ Users, api, event }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  const pathImg = __dirname + "/cache/pair_bg.png";
  const pathAvt1 = __dirname + "/cache/pair_avt1.png";
  const pathAvt2 = __dirname + "/cache/pair_avt2.png";

  const id1 = event.senderID;
  const name1 = await Users.getNameUser(id1);
  const threadInfo = await api.getThreadInfo(event.threadID);
  const allMembers = threadInfo.userInfo;
  const botID = api.getCurrentUserID();

  // Get gender of sender
  let gender1 = allMembers.find(u => u.id == id1)?.gender;

  // Filter eligible partners
  let candidates = allMembers.filter(u =>
    u.id !== id1 &&
    u.id !== botID &&
    ((gender1 === 1 && u.gender === 2) || (gender1 === 2 && u.gender === 1) || gender1 == undefined)
  );

  if (!candidates.length) {
    return api.sendMessage("Sorry! Koi perfect match nahi mila group me... Try again later ya naye log bulao!", event.threadID, event.messageID);
  }

  const id2 = candidates[Math.floor(Math.random() * candidates.length)].id;
  const name2 = await Users.getNameUser(id2);

  const percentages = ["99.99", "88", "77", "69", "51", "100", "91", "42", "60", "73", "101", "∞"];
  const match = percentages[Math.floor(Math.random() * percentages.length)];

  const backgrounds = [
    "https://i.postimg.cc/wjJ29HRB/background1.png",
    "https://i.postimg.cc/zf4Pnshv/background2.png",
    "https://i.postimg.cc/5tXRQ46D/background3.png"
  ];
  const bgURL = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  // Load avatars & background
  const avt1 = (await axios.get(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  const avt2 = (await axios.get(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  const bg = (await axios.get(bgURL, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(pathAvt1, Buffer.from(avt1));
  fs.writeFileSync(pathAvt2, Buffer.from(avt2));
  fs.writeFileSync(pathImg, Buffer.from(bg));

  const baseImg = await loadImage(pathImg);
  const avatar1 = await loadImage(pathAvt1);
  const avatar2 = await loadImage(pathAvt2);

  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImg, 0, 0, 1280, 720);
  ctx.drawImage(avatar1, 100, 200, 300, 300);
  ctx.drawImage(avatar2, 880, 200, 300, 300);

  const finalBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, finalBuffer);

  fs.removeSync(pathAvt1);
  fs.removeSync(pathAvt2);

  const message = {
    body:
`✨ *Ultimate Matchmaker Report* ✨

💞 *${name1}* just got paired with *${name2}* 💞

💘 Compatibility: *${match}%*
🌈 Vibe Level: Off the charts!

Kya hi cute lag rahe ho dono! Ab baat karna start karo aur anime jaisa love story likh daalo! ✍️

#RiyaMatchmakingBot`,
    mentions: [
      { tag: name1, id: id1 },
      { tag: name2, id: id2 }
    ],
    attachment: fs.createReadStream(pathImg)
  };

  return api.sendMessage(message, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
};
