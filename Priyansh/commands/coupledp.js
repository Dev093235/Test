module.exports.config = {
  name: "coupledp",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Send random stylish Couple DP",
  commandCategory: "Random-IMG",
  usages: "coupledp",
  cooldowns: 2,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];

  const approvedCredit = "Rudra";
  if (module.exports.config.credits !== approvedCredit) {
    return api.sendMessage("⚠️ Permission Denied: Do not change credits. Powered by Rudra 🔐", event.threadID, event.messageID);
  }

  const link = [
    "https://i.imgur.com/qwYcYzA.jpg",
    "https://i.imgur.com/IfLjNGU.jpg",
    "https://i.imgur.com/oLhivlR.jpg",
    "https://i.imgur.com/Av6vjSc.jpg",
    "https://i.imgur.com/UvdtrED.jpg",
    "https://i.imgur.com/f6PzDsM.jpg",
    "https://i.imgur.com/o3pMbAm.jpg",
    "https://i.imgur.com/ZUZiKWa.jpg",
    "https://i.imgur.com/vxqGGbi.jpg",
    "https://i.imgur.com/BX8KcrP.jpg",
    "https://i.imgur.com/EbHCSn8.jpg",
    "https://i.imgur.com/TuW6mYe.jpg",
    "https://i.imgur.com/0O9EGjB.jpg",
    "https://i.imgur.com/L2Qke3s.jpg",
    "https://i.imgur.com/NKfqMkx.jpg",
    "https://i.imgur.com/bbYgF3o.jpg",
    "https://i.imgur.com/zZVRtG0.jpg",
    "https://i.imgur.com/Up9uLZw.jpg",
    "https://i.imgur.com/EDBtTOz.jpg",
    "https://i.imgur.com/D9RrDGN.jpg",
    "https://i.imgur.com/q6fUEB1.jpg",
    "https://i.imgur.com/Zz0kaWa.jpg",
    "https://i.imgur.com/2n0AFOA.jpg",
    "https://i.imgur.com/3CzXV27.jpg",
    "https://i.imgur.com/hFCFQdN.jpg",
    "https://i.imgur.com/jJ7EiFd.jpg",
    "https://i.imgur.com/CYtHrHv.jpg",
    "https://i.imgur.com/SB1TXVP.jpg",
    "https://i.imgur.com/oY0Ux8u.jpg",
    "https://i.imgur.com/Pn5zY5U.jpg",
    "https://i.imgur.com/Wwe4v8l.jpg",
    "https://i.imgur.com/3IPZz1A.jpg",
    "https://i.imgur.com/jEnGxzm.jpg",
    "https://i.imgur.com/86azMxS.jpg",
    "https://i.imgur.com/Z62RiFl.jpg",
    "https://i.imgur.com/s0HGxUo.jpg",
    "https://i.imgur.com/AkblEUm.jpg",
    "https://i.imgur.com/JUeN2vn.jpg",
    "https://i.imgur.com/wibv3En.jpg",
    "https://i.imgur.com/jkzClvT.jpg",
    "https://i.imgur.com/I0ayF2e.jpg",
    "https://i.imgur.com/gOhHLs4.jpg",
    "https://i.imgur.com/98LPcAF.jpg",
    "https://i.imgur.com/ZVtk9vD.jpg",
    "https://i.imgur.com/qnvAO7r.jpg",
    "https://i.imgur.com/X2YRTpv.jpg",
    "https://i.imgur.com/sIoWBnB.jpg",
    "https://i.imgur.com/HVEYe6x.jpg",
    "https://i.imgur.com/J7zUivR.jpg",
    "https://i.imgur.com/YvDfjSM.jpg"
  ];

  const imgPath = __dirname + "/cache/couple.jpg";
  const selectedImg = link[Math.floor(Math.random() * link.length)];

  const callback = () => {
    api.sendMessage({
      body: `💑 Here's your lovely *Couple DP* 💘\n\n🖤 Powered by Rudra`,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
  };

  return request(encodeURI(selectedImg)).pipe(fs.createWriteStream(imgPath)).on("close", callback);
};
