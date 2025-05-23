const axios = global.nodemodule["axios"];
const fs = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "pair",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Rudra (Stylish Hinglish Edition)",
  description: "Create romantic pairing with full emoji + anime feel",
  commandCategory: "Love",
  usages: "pair",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, senderID, messageID } = event;

  const loveRate = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', '0%', '48%'];
  const compatibility = loveRate[Math.floor(Math.random() * loveRate.length)];

  const threadInfo = await api.getThreadInfo(threadID);
  const members = threadInfo.participantIDs.filter(id => id !== senderID);
  const partnerID = members[Math.floor(Math.random() * members.length)];

  const user1 = await api.getUserInfo(senderID);
  const user2 = await api.getUserInfo(partnerID);

  const name1 = user1[senderID].name;
  const name2 = user2[partnerID].name;
  const gender = user2[partnerID].gender === 2 ? "Male 🧑" : user2[partnerID].gender === 1 ? "Female 👩" : "Unknown";

  const tagUsers = [
    { id: senderID, tag: name1 },
    { id: partnerID, tag: name2 }
  ];

  const avatar1 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?height=512&width=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  const avatar2 = (await axios.get(`https://graph.facebook.com/${partnerID}/picture?height=512&width=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  const loveGif = (await axios.get("https://media.tenor.com/HEwHf4Zah5EAAAAd/anime-love.gif", { responseType: "arraybuffer" })).data;

  fs.writeFileSync(__dirname + "/cache/user1.png", Buffer.from(avatar1, "utf-8"));
  fs.writeFileSync(__dirname + "/cache/user2.png", Buffer.from(avatar2, "utf-8"));
  fs.writeFileSync(__dirname + "/cache/love.gif", Buffer.from(loveGif, "utf-8"));

  const attachments = [
    fs.createReadStream(__dirname + "/cache/user1.png"),
    fs.createReadStream(__dirname + "/cache/love.gif"),
    fs.createReadStream(__dirname + "/cache/user2.png")
  ];

  const message = {
    body: `💘 | LOVE CONNECTOR 3000 ACTIVATED...\n━━━━━━━━━━━━━━━\n💞 Aaj ki Jodi Tay Ho Chuki Hai:\n✨ ${name1} ❤️ ${name2}\n\n❤️‍🔥 Compatibility Level: ${compatibility}\n⚧️ Partner Gender: ${gender}\n\n⏳ Connecting Hearts...\n💌 Sending Love Signals...\n💫 Destiny Matched!\n\n❝ Pyaar wahi hota hai... jo achanak ho jaye ❞\n\n💍 Shubh ho tum dono ka milan!\n━━━━━━━━━━━━━━━`,
    mentions: tagUsers,
    attachment: attachments
  };

  return api.sendMessage(message, threadID, messageID);
};
