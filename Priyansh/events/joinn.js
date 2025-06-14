const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "join",
  eventType: ["log:subscribe"],
  version: "3.1.0",
  credits: "Rudra",
  description: "🔥 Desi swag welcome with Imgur media only",
};

module.exports.onLoad = () => {
  // No need for any folder setup
};

module.exports.run = async ({ api, event, Users, Threads }) => {
  const { threadID } = event;
  const newMembers = event.logMessageData.addedParticipants;
  const botID = api.getCurrentUserID();

  const hours = moment.tz("Asia/Kolkata").format("HH");
  const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || hh:mm A");

  for (const user of newMembers) {
    if (user.userFbId == botID) continue;

    const name = global.data.userName.get(user.userFbId) || await Users.getNameUser(user.userFbId);
    const threadInfo = await Threads.getData(threadID);
    const threadName = threadInfo.threadName || "iss group";

    const session =
      hours < 12 ? "🌅 Subah" :
      hours < 17 ? "☀️ Dopahar" :
      hours < 20 ? "🌇 Shaam" : "🌙 Raat";

    const messages = [
      `🔥 Arre *{name}* bhai aa gaye!\n👑 Swagat hai *{group}* mein 🎉\n🕰️ {time} || {session}`,
      `🚀 *{name}* land ho chuke hain *{group}* mein 😎\nBajao taaliyan doston! 🥁`,
      `🎊 Kya baat hai! *{name}* ne entry maari *{group}* mein 🔥\nAb maze aayenge 💃`,
      `💥 Lo bhai, ek aur superstar – *{name}* join kar chuke hain!\n👀 Scene ab banega *{group}* mein`,
      `🥂 Cheers dosto! *{name}* aa chuke hain *{group}* mein 🤝\n🕒 Time: {time}`,
      `🎈 Tali bajao! *{name}* ka swaggy welcome ho *{group}* mein 😍`,
      `⚡ *{name}* ka dhamaakedaar entry hua hai *{group}* mein 🚨\nSab welcome bolo 🗣️`,
      `💫 Vibe set hone wali hai, kyunki *{name}* aa gaye hain *{group}* mein! 🕺`,
      `💖 Arre arre... *{name}* ne to entry le li! 😍\nSwag welcome to *{group}* 🌀`,
      `🌟 Aur bhai *{name}*! Swagat hai aapka *{group}* family mein 💌`
    ];

    let msg = messages[Math.floor(Math.random() * messages.length)];
    msg = msg
      .replace(/\{name}/g, name)
      .replace(/\{group}/g, threadName)
      .replace(/\{time}/g, time)
      .replace(/\{session}/g, session);

    const imgurLinks = [
      "https://i.imgur.com/fZpCQoB.gif",
      "https://i.imgur.com/xIGvE1M.mp4",
      "https://i.imgur.com/vs43MyZ.gif",
      "https://i.imgur.com/V1GnJ7z.mp4",
      "https://i.imgur.com/qJPts3W.gif",
      "https://i.imgur.com/TaA20Kt.mp4",
      "https://i.imgur.com/Yy6rU2g.gif",
      "https://i.imgur.com/duEM0Mu.mp4",
      "https://i.imgur.com/x5KtTXM.gif",
      "https://i.imgur.com/GYlsJgW.gif"
    ];
    const chosen = imgurLinks[Math.floor(Math.random() * imgurLinks.length)];
    const ext = path.extname(chosen);
    const tempPath = path.join(__dirname, `join-temp${ext}`);

    let form;
    try {
      const res = await axios.get(chosen, { responseType: "arraybuffer" });
      fs.writeFileSync(tempPath, res.data);
      form = { body: msg, attachment: fs.createReadStream(tempPath) };
    } catch (e) {
      console.error("❌ Media load nahi hua:", e.message);
      form = { body: msg };
    }

    api.sendMessage(form, threadID, () => {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    });
  }
};
