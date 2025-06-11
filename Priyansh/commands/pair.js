module.exports.config = {
  name: "pair",
  version: "6.0.0",
  hasPermssion: 0,
  credits: "Rudra 24K",
  description: "Pair two users with swag, anime photo & hindi voice line",
  commandCategory: "love",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const pathImg = __dirname + `/cache/rudra_pair.jpg`;
  const pathSound = __dirname + `/cache/rudra_voice.mp3`;

  const threadInfo = await api.getThreadInfo(event.threadID);
  const members = threadInfo.userInfo
    .filter(u => u.gender !== undefined && !u.isBlocked && u.type !== "INBOX")
    .map(u => u.id)
    .filter(id => id != api.getCurrentUserID());

  if (members.length < 2)
    return api.sendMessage("⚠️ Pair banane ke liye kam se kam 2 dil zaruri hai!", event.threadID);

  const lover1 = members[Math.floor(Math.random() * members.length)];
  let lover2 = members[Math.floor(Math.random() * members.length)];
  while (lover2 === lover1) lover2 = members[Math.floor(Math.random() * members.length)];

  const userInfo = await api.getUserInfo([lover1, lover2]);
  const name1 = userInfo[lover1].name;
  const name2 = userInfo[lover2].name;
  const shipName = `${name1.slice(0, 3)}💖${name2.slice(-3)}`.replace(/\s/g, "");

  const animeLinks = [
    "https://i.imgur.com/mkln5uE.jpeg",
    "https://i.imgur.com/yujmJm2.jpeg",
    "https://i.imgur.com/Wff7u4n.jpeg",
    "https://i.imgur.com/qxPc39z.jpeg",
    "https://i.imgur.com/3gYjJ5A.jpeg"
  ];
  const chosenImage = animeLinks[Math.floor(Math.random() * animeLinks.length)];
  const soundURL = "https://files.catbox.moe/vhxfwx.mp3"; // Hindi romantic voice

  // Download image
  const imgRes = await axios.get(chosenImage, { responseType: "stream" });
  imgRes.data.pipe(fs.createWriteStream(pathImg));

  // Download sound
  const soundRes = await axios.get(soundURL, { responseType: "stream" });
  soundRes.data.pipe(fs.createWriteStream(pathSound)).on("close", () => {
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
  });
};
