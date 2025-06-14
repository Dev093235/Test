const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "4.0.0",
  credits: "Rudra",
  description: "Send desi-style leave message (smartly detects bhag gaya or bhaga diya)",
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, logMessageData, author } = event;
  const userID = logMessageData.leftParticipantFbId;

  // Ignore if bot left
  if (userID == api.getCurrentUserID()) return;

  const name = global.data.userName.get(userID) || await Users.getNameUser(userID);
  const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");

  const isKicked = author !== userID; // true = bhaga diya, false = khud bhag gaya

  const bhagaGayaMsgs = [
    `🦶 {name} ko bhaga diya gaya bhai! 😂\nGroup ka bardaasht level cross kar diya tha 🤣\n🕓 {time}`,
    `💼 {name} ne last warning ke baad exit le liya... Bhaga diya gaya! 😬\n🕙 {time}`,
    `🚨 {name} ka contract terminate kar diya gaya hai group se 😭\n⏰ {time}`,
    `👣 {name} ne kuch zyada hi swag dikhaya... bhaga diya gaya 🤣\n📆 {time}`
  ];

  const khudBhagGayaMsgs = [
    `🏃‍♂️ {name} khud bhag gaya bhai! 😂\nGroup ka swag digest nahi ho paya lagta hai 😎\n🕒 {time}`,
    `📤 {name} ne group ko alvida keh diya... Apne marzi se bhag gaya 😢\n🕞 {time}`,
    `😔 {name} bola "Main toxic logon ke beech nahi reh sakta!" aur nikal gaya\n🕚 {time}`,
    `🥲 {name} ka man bhar gaya... Khud nikal liya 😩\n⏱ {time}`
  ];

  const messages = isKicked ? bhagaGayaMsgs : khudBhagGayaMsgs;
  const msg = messages[Math.floor(Math.random() * messages.length)]
    .replace(/\{name}/g, name)
    .replace(/\{time}/g, time);

  const imgurLinks = [
    "https://i.imgur.com/fZjW9Ue.gif",
    "https://i.imgur.com/0TbfMzL.mp4",
    "https://i.imgur.com/9dfSHHO.gif",
    "https://i.imgur.com/WEXE6Vi.gif",
    "https://i.imgur.com/nVLwHgN.mp4"
  ];

  const chosen = imgurLinks[Math.floor(Math.random() * imgurLinks.length)];
  const ext = path.extname(chosen);
  const tempPath = path.join(__dirname, `temp_leave${ext}`);

  let form;
  try {
    const res = await axios.get(chosen, { responseType: "arraybuffer" });
    fs.writeFileSync(tempPath, res.data);
    form = {
      body: msg,
      attachment: fs.createReadStream(tempPath)
    };
  } catch (err) {
    console.error("❌ Media download failed:", err.message);
    form = { body: msg };
  }

  api.sendMessage(form, threadID, () => {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  });
};
