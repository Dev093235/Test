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
    let members = threadInfo.participantIDs;

    // Check if group has at least 2 members
    if (members.length < 2) {
      return api.sendMessage("😅 Sirf tum hi ho group me... pairing kaise ho bhai?", event.threadID);
    }

    // Random 2 users (excluding repeats)
    const lover1 = members[Math.floor(Math.random() * members.length)];
    let lover2 = members[Math.floor(Math.random() * members.length)];
    while (lover2 === lover1) lover2 = members[Math.floor(Math.random() * members.length)];

    const userInfo = await api.getUserInfo([lover1, lover2]);
    const name1 = userInfo[lover1].name;
    const name2 = userInfo[lover2].name;
    const shipName = `${name1.slice(0, 3)}💖${name2.slice(-3)}`.replace(/\s/g, "");

    // Anime image + voice
    const animeLinks = [
      "https://i.imgur.com/mkln5uE.jpeg",
      "https://i.imgur.com/yujmJm2.jpeg",
      "https://i.imgur.com/Wff7u4n.jpeg"
    ];
    const chosenImage = animeLinks[Math.floor(Math.random() * animeLinks.length)];
    const voiceLink = "https://files.catbox.moe/vhxfwx.mp3";

    const img = await axios.get(chosenImage, { responseType: "stream" });
    const voice = await axios.get(voiceLink, { responseType: "stream" });

    // Download both files
    await new Promise((resolve, reject) => {
      img.data.pipe(fs.createWriteStream(pathImg)).on("finish", resolve).on("error", reject);
    });
    await new Promise((resolve, reject) => {
      voice.data.pipe(fs.createWriteStream(pathSound)).on("finish", resolve).on("error", reject);
    });

    // Create message
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
      fs.unlinkSync(pathImg);
      fs.unlinkSync(pathSound);
    });

  } catch (err) {
    console.error("❌ Pair error:", err);
    return api.sendMessage("🚫 Error: Pair banate waqt kuch gadbad ho gayi bhai 😢", event.threadID);
  }
};
