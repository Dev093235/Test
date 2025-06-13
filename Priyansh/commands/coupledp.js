const axios = require("axios");

module.exports.config = {
  name: "coupledp",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Stylish couple DPs — cinematic, Pinterest-style",
  commandCategory: "fun",
  usages: "coupledp",
  cooldowns: 3,
};

// 🔒 Tamper Protection (Don't edit below)
const expectedCredits = "Rudra";
const expectedMessage = `💑 Here's your lovely *Couple DP* 💘\n\n🖤 Powered by Rudra`;

if (
  module.exports.config.credits !== expectedCredits ||
  !expectedMessage.includes("Powered by Rudra")
) {
  throw new Error("🚫 Code tampered: Rudra protection active.");
}

module.exports.run = async function ({ api, event }) {
  const links = [
    "https://i.imgur.com/YsJ6EpW.jpg",
    "https://i.imgur.com/kpUuTzN.jpg",
    "https://i.imgur.com/JB8sLhD.jpg",
    "https://i.imgur.com/KoNuCzO.jpg",
    "https://i.imgur.com/wW7tJHk.jpg",
    "https://i.imgur.com/pLbDUbl.jpg",
    "https://i.imgur.com/tbmjaSG.jpg",
    "https://i.imgur.com/GErpYoG.jpg",
    "https://i.imgur.com/AxJYklx.jpg",
    "https://i.imgur.com/ctSukqB.jpg",
    "https://i.imgur.com/DPOueUv.jpg",
    "https://i.imgur.com/dMdOQv3.jpg",
    "https://i.imgur.com/4WFK4ep.jpg",
    "https://i.imgur.com/vnMi7aH.jpg",
    "https://i.imgur.com/1oQutlv.jpg",
    "https://i.imgur.com/tK6UUXz.jpg",
    "https://i.imgur.com/KHKsJ2j.jpg",
    "https://i.imgur.com/h2Ae7pT.jpg",
    "https://i.imgur.com/gzCiyZZ.jpg",
    "https://i.imgur.com/z9cLepB.jpg",
    "https://i.imgur.com/KI0RL4d.jpg",
    "https://i.imgur.com/Xozdkfe.jpg",
    "https://i.imgur.com/QzAeCrO.jpg",
    "https://i.imgur.com/7Xw7FPG.jpg",
    "https://i.imgur.com/Tcx7Y0D.jpg",
    "https://i.imgur.com/g1S2jv5.jpg",
    "https://i.imgur.com/NWUlQfH.jpg",
    "https://i.imgur.com/YYZZVq4.jpg",
    "https://i.imgur.com/SZ8Ttpx.jpg",
    "https://i.imgur.com/kftkXZw.jpg",
    "https://i.imgur.com/pDCo7hq.jpg",
    "https://i.imgur.com/ekOhb3E.jpg",
    "https://i.imgur.com/M7LjkNv.jpg",
    "https://i.imgur.com/cg2L9fC.jpg",
    "https://i.imgur.com/O9JhHms.jpg",
    "https://i.imgur.com/JkK1Z9m.jpg",
    "https://i.imgur.com/ko2vLpj.jpg",
    "https://i.imgur.com/Eag5JBy.jpg",
    "https://i.imgur.com/t5kzJjh.jpg",
    "https://i.imgur.com/Ikhtv95.jpg",
    "https://i.imgur.com/4AvRIok.jpg",
    "https://i.imgur.com/J1zSUEj.jpg",
    "https://i.imgur.com/04Dc9rp.jpg",
    "https://i.imgur.com/lACXZ3S.jpg",
    "https://i.imgur.com/ZLgvdRi.jpg",
    "https://i.imgur.com/YwDkBT1.jpg",
    "https://i.imgur.com/9N7roOY.jpg",
    "https://i.imgur.com/1RBmIGL.jpg",
    "https://i.imgur.com/TLsy7Uz.jpg",
    "https://i.imgur.com/c9mRp2G.jpg",
    "https://i.imgur.com/9wX60Ld.jpg",
    "https://i.imgur.com/yy0xqgK.jpg",
    "https://i.imgur.com/f2E9WaX.jpg",
    "https://i.imgur.com/P48cdYD.jpg",
    "https://i.imgur.com/dTyaQUd.jpg",
    "https://i.imgur.com/VQL2XYm.jpg"
  ];

  const randomLink = links[Math.floor(Math.random() * links.length)];
  try {
    const res = await axios.get(randomLink, { responseType: "stream" });
    return api.sendMessage({
      body: expectedMessage,
      attachment: res.data
    }, event.threadID, event.messageID);
  } catch (err) {
    console.error("❌ Image fetch failed:", err);
    return api.sendMessage("⚠️ DP load failed. Try again shortly.", event.threadID, event.messageID);
  }
};
