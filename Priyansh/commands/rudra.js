const fs = require("fs");
const path = require("path");

let activeThreads = {};

module.exports.config = {
  name: "rudra",
  version: "1.1",
  permission: 0,
  credits: "Rudra",
  description: "Owner-only auto reply to mentioned users",
  prefix: true,
  category: "owner",
  usages: "rudra start @user\nrudra stop",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  // ✅ Terii UID set hai yaha
  const ownerUID = "61550558518720";

  if (senderID !== ownerUID) {
    return api.sendMessage("❌ Sirf owner hi ye command chala sakta hai.", threadID);
  }

  const mentions = event.mentions;

  if (args[0] === "start") {
    if (!Object.keys(mentions).length)
      return api.sendMessage("❌ Kisi ek ya zyada user ko @mention karo.", threadID);

    if (!activeThreads[threadID]) activeThreads[threadID] = [];

    for (const uid in mentions) {
      if (!activeThreads[threadID].includes(uid)) {
        activeThreads[threadID].push(uid);
      }
    }

    return api.sendMessage(
      `✅ Auto-reply ON for ${Object.keys(mentions).length} user(s).`,
      threadID
    );
  }

  if (args[0] === "stop") {
    delete activeThreads[threadID];
    return api.sendMessage("❌ Auto-reply STOPPED for this chat.", threadID);
  }

  return api.sendMessage("⚠️ Use: rudra start @user OR rudra stop", threadID);
};

module.exports.handleEvent = async function ({ api, event }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  if (!activeThreads[threadID]) return;
  if (!activeThreads[threadID].includes(senderID)) return;

  const replyFilePath = path.join(__dirname, "..", "..", "rudra_replies.txt");
  if (!fs.existsSync(replyFilePath)) return;

  const lines = fs.readFileSync(replyFilePath, "utf-8").split("\n").filter(Boolean);
  if (!lines.length) return;

  const reply = lines[Math.floor(Math.random() * lines.length)];
  const name = (await api.getUserInfo(senderID))[senderID].name;

  return api.sendMessage({
    body: `@${name} ${reply}`,
    mentions: [{ id: senderID, tag: name }]
  }, threadID);
};
