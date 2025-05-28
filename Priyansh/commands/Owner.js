module.exports.config = {
  name: "owner",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rudra",
  description: "no prefix",
  commandCategory: "No command marks needed",
  usages: "...",
  cooldowns: 100,
};

module.exports.handleEvent = function({ api, event }) {
  const { threadID, messageID, body } = event;
  const react = body.toLowerCase();

  if (react.includes("owner") || react.includes("rudra")) {
    const images = [
      // 🧠 Your provided images
      "https://i.imgur.com/RygyQj0.jpeg",
      "https://i.imgur.com/lKtqjkH.jpeg",
      "https://i.imgur.com/6a35Zrf.jpeg",
      "https://i.imgur.com/CojcGcE.jpeg",

      // 🔥 Anime-style Rudra images added
      "https://i.imgur.com/mW5YWyB.jpeg", // anime girl + Rudra text
      "https://i.imgur.com/NctYXm5.jpeg", // samurai style
      "https://i.imgur.com/2KfG3CE.jpeg", // Tokyo theme
      "https://i.imgur.com/rDqKuSA.jpeg", // glowing face
      "https://i.imgur.com/1RkBe2y.jpeg", // night demon
      "https://i.imgur.com/BRGF7kV.jpeg"  // red aesthetic
    ];

    // Random image
    const randomImage = images[Math.floor(Math.random() * images.length)];

    const msg = {
      body:
        "★ 𝗢𝘄𝗻𝗲𝗿 + 𝗠𝗮𝗱𝗲 𝗕𝘆 ★\n\n✦ 𝐑𝐮𝐝𝐫𝐚 ✦\n\n★★᭄ 𝐘𝐨𝐮𝐭𝐮𝐛𝐞 𝐋𝐢𝐧𝐤:\n\n✦ https://youtube.com/@MirryKal ✦\n\n𝗝𝗼𝗶𝗻 𝗢𝘂𝗿 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗚𝗿𝗼𝘂𝗽:\n𝗞𝗮𝗮𝗹 𝗟𝗼𝗸 😋\nhttps://www.facebook.com/groups/207371140648761/?ref=share_group_link",
      attachment: { url: randomImage }
    };

    api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("📷", messageID, (err) => {}, true);
  }
};

module.exports.run = function() {};
