const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "join",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "Rudra",
  description: "Automatically welcomes new users with media",
};

module.exports.onLoad = () => {
  const joinFolder = path.join(__dirname, "cache", "joinGif", "randomgif");
  if (!fs.existsSync(joinFolder)) fs.mkdirSync(joinFolder, { recursive: true });
};

module.exports.run = async ({ api, event, Users, Threads }) => {
  const { threadID } = event;
  const newMembers = event.logMessageData.addedParticipants;
  const botID = api.getCurrentUserID();

  const hours = moment.tz("Asia/Kolkata").format("HH");
  const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");

  for (const user of newMembers) {
    if (user.userFbId == botID) continue;

    const name = global.data.userName.get(user.userFbId) || await Users.getNameUser(user.userFbId);
    const threadData = global.data.threadData.get(threadID) || (await Threads.getData(threadID)).data;

    let msg = (typeof threadData.customJoin === "undefined")
      ? `🌸 Namaste {name}!\n✨ Welcome to the group! 🤗\n💌 We're glad to have you here.\n\n🕓 Time: {time} || {session}`
      : threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, name)
      .replace(/\{session}/g,
        hours <= 10 ? "Morning" :
        hours <= 12 ? "Afternoon" :
        hours <= 18 ? "Evening" : "Night")
      .replace(/\{time}/g, time);

    const gifFolder = path.join(__dirname, "cache", "joinGif", "randomgif");
    const files = fs.readdirSync(gifFolder);
    let form;

    if (files.length > 0) {
      const selected = path.join(gifFolder, files[Math.floor(Math.random() * files.length)]);
      form = { body: msg, attachment: fs.createReadStream(selected) };
    } else {
      const imgurLinks = [
        "https://i.imgur.com/yI3U9iF.mp4",
        "https://i.imgur.com/gq4lHoT.gif",
        "https://i.imgur.com/kXfPxW2.gif",
        "https://i.imgur.com/lYm3MxD.gif",
        "https://i.imgur.com/2Q1V9vw.jpeg"
      ];
      const chosen = imgurLinks[Math.floor(Math.random() * imgurLinks.length)];
      const ext = path.extname(chosen);
      const tmpPath = path.join(__dirname, "cache", `join-temp${ext}`);

      try {
        const res = await axios.get(chosen, { responseType: "arraybuffer" });
        fs.writeFileSync(tmpPath, res.data);
        form = { body: msg, attachment: fs.createReadStream(tmpPath) };
      } catch (e) {
        console.error("❌ Error loading Imgur image:", e.message);
        form = { body: msg };
      }
    }

    api.sendMessage(form, threadID);
  }
};
