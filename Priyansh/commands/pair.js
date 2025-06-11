module.exports.config = {
  name: "pair",
  version: "6.0.2",
  hasPermssion: 0,
  credits: "Rudra 24K",
  description: "Pair two users with swag, anime photo & hindi voice line",
  commandCategory: "love",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = __dirname + `/cache`;
  const pathImg = `${path}/rudra_pair.jpg`;
  const pathSound = `${path}/rudra_voice.mp3`;

  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const botID = api.getCurrentUserID();
    const members = threadInfo.participantIDs.filter(id => id !== botID && id !== event.senderID);

    if (members.length < 1)
      return api.sendMessage("⚠️ Pair banane ke liye group me aur log bhi hone chahiye!", event.threadID);

    const lover1 = event.senderID;
    let lover2 = members[Math.floor(Math.random() * members.length)];

    const userInfo = await api.getUserInfo([lover1, lover2]);
    const name1 = userInfo[lover1]?.name || "User1";
    const name2 = userInfo[lover2]?.name || "User2";
    const shipName = `${name1.slice(0, 3)}💖${name2.slice(-3)}`.replace(/\s/g, "");

    const animeLinks = [
      "https://i.imgur.com/mkln5uE.jpeg",
      "https://i.imgur.com/yujmJm2.jpeg",
      "https://i.imgur.com/Wff7u4n.jpeg"
    ];
    const voiceLink = "https://files.catbox.moe/vhxfwx.mp3";

    const chosenImage = animeLinks[Math.floor(Math.random() * animeLinks.length)];

    const [imgRes, voiceRes] = await Promise.all([
      axios.get(chosenImage, { responseType: "stream" }),
      axios.get(voiceLink, { responseType: "stream" })
    ]);

    await Promise.all([
      new Promise((res) => imgRes.data.pipe(fs.createWriteStream(pathImg)).on("close", res)),
      new Promise((res) => voiceRes.data.pipe(fs.createWriteStream(pathSound)).on("close", res))
    ]);

    const msg = `💞 𝗣𝗔𝗜𝗥 𝗔𝗟𝗘𝗥𝗧 💞\n━━━━━━━━━━━━━━\n` +
      `👩🏻‍🤝‍👨🏼 ${name1} ❤️ ${name2}\n\n` +
      `🌸 Ek naya rishta... do dilon ka milan...\n` +
      `🔗 𝗟𝗢𝗩𝗘 𝗕𝗢𝗡𝗗: ${shipName}\n\n` +
      `🎧 "Yeh rishta na taqdeer ne banaya... na kismet ne likha...\n` +
      `💫 Is prem kahani ka kalam tha Rudra ke haathon mein ✍️"\n\n` +
      `👑 Rudra ka faisla final hota hai... pairing ho gayi bhai, ab to mohabbat pakki! 🔥\n` +
      `🌟 Anime ka feel, awaaz ka jaadu, aur Rudra ka tashan — sab kuch ek saath 💘\n━━━━━━━━━━━━━━`;

    api.sendMessage({
      body: msg,
      mentions: [
        { id: lover1, tag: name1 },
        { id: lover2, tag: name2 }
      ],
      attachment: [
        fs.createReadStream(pathImg),
        fs.createReadStream(pathSound)
      ]
    }, event.threadID, () => {
      if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
      if (fs.existsSync(pathSound)) fs.unlinkSync(pathSound);
    });

  } catch (err) {
    console.error("❌ Rudra Pair Error:", err);
    return api.sendMessage("🚫 Error: Pair banate waqt kuch gadbad ho gayi bhai 😢", event.threadID);
  }
};
