const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "join",
  eventType: ["log:subscribe"],
  version: "3.0.0",
  credits: "Rudra",
  description: "Stylish desi welcome with media from Imgur",
};

module.exports.run = async ({ api, event, Users }) => {
  const { threadID } = event;
  const newMembers = event.logMessageData.addedParticipants;
  const botID = api.getCurrentUserID();

  const hours = moment.tz("Asia/Kolkata").format("HH");
  const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");

  const welcomeMessages = [
    `🎉 Oye {name}, group me swag lekar aaya kya? 😎\n🕒 {time} | {session}`,
    `🔥 {name} ne entry maari! Ab to group me tadka lagega 🌶️\n⏰ {time} | {session}`,
    `💃 {name} aaya re! Chal party shuru karein 🎊\n📅 {time} | {session}`,
    `🚀 {name} ki aamad! Group ka vibe ab high ho gaya 😁\n🕞 {time} | {session}`,
    `✨ Swagat nahi karoge {name} ka? 🤗\n🕓 {time} | {session}`
  ];

  const imgurLinks = [
    "https://i.imgur.com/fZjW9Ue.gif",
    "https://i.imgur.com/0TbfMzL.mp4",
    "https://i.imgur.com/9dfSHHO.gif",
    "https://i.imgur.com/WEXE6Vi.gif",
    "https://i.imgur.com/nVLwHgN.mp4"
  ];

  for (const user of newMembers) {
    if (user.userFbId == botID) continue;

    const name = global.data.userName.get(user.userFbId) || await Users.getNameUser(user.userFbId);
    const session =
      hours < 11 ? "Good Morning" :
      hours < 15 ? "Good Afternoon" :
      hours < 19 ? "Good Evening" :
      "Good Night";

    const rawMsg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    const msg = rawMsg.replace(/\{name}/g, name).replace(/\{time}/g, time).replace(/\{session}/g, session);

    const chosen = imgurLinks[Math.floor(Math.random() * imgurLinks.length)];
    const ext = path.extname(chosen);
    const tempPath = path.join(__dirname, `temp_join${ext}`);

    try {
      const res = await axios.get(chosen, { responseType: "arraybuffer" });
      fs.writeFileSync(tempPath, res.data);

      const form = {
        body: msg,
        attachment: fs.createReadStream(tempPath)
      };

      api.sendMessage(form, threadID, () => {
        fs.existsSync(tempPath) && fs.unlinkSync(tempPath);
      });

    } catch (err) {
      console.error("❌ Error downloading media:", err.message);
      api.sendMessage({ body: msg }, threadID);
    }
  }
};
