module.exports.config = {
  name: "coupledp",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "PREM BABU + Rudra 💘",
  description: "Couple Dp photos (Pinterest-style)",
  commandCategory: "Random-IMG",
  usages: "coupledp",
  cooldowns: 2,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args, Users, Threads, Currencies }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  var link = [
    "https://i.imgur.com/VXY4Fxy.jpg", "https://i.imgur.com/wO9aM6S.jpg", "https://i.imgur.com/nQ7w5mA.jpg",
    "https://i.imgur.com/qVblWRM.jpg", "https://i.imgur.com/h3iNUfa.jpg", "https://i.imgur.com/FNVuPgH.jpg",
    "https://i.imgur.com/z4ffGUO.jpg", "https://i.imgur.com/B5sTULW.jpg", "https://i.imgur.com/Y7jDLa9.jpg",
    "https://i.imgur.com/lA8ts2N.jpg", "https://i.imgur.com/5gb8bTI.jpg", "https://i.imgur.com/oeocHt3.jpg",
    "https://i.imgur.com/4dTzZ7r.jpg", "https://i.imgur.com/Rwi0FYY.jpg", "https://i.imgur.com/1Lu3o2L.jpg",
    "https://i.imgur.com/4WRDJSj.jpg", "https://i.imgur.com/Oz1Ek1n.jpg", "https://i.imgur.com/EI39BHe.jpg",
    "https://i.imgur.com/FCLFc9T.jpg", "https://i.imgur.com/F9aPaU4.jpg", "https://i.imgur.com/5rEBx5m.jpg",
    "https://i.imgur.com/jLx4qVG.jpg", "https://i.imgur.com/iwzLoB3.jpg", "https://i.imgur.com/5HkzYkA.jpg",
    "https://i.imgur.com/BBFDDQI.jpg", "https://i.imgur.com/WIG0WVI.jpg", "https://i.imgur.com/ovHd3Z8.jpg",
    "https://i.imgur.com/lKmA1Ex.jpg", "https://i.imgur.com/5sL3om7.jpg", "https://i.imgur.com/zwk0qYY.jpg",
    "https://i.imgur.com/lUYR1wv.jpg", "https://i.imgur.com/fD0yPjA.jpg", "https://i.imgur.com/93LRaJ5.jpg",
    "https://i.imgur.com/JPBywQu.jpg", "https://i.imgur.com/z3zkSQf.jpg", "https://i.imgur.com/v0KUmJJ.jpg",
    "https://i.imgur.com/XapLU1W.jpg", "https://i.imgur.com/J3m9VuM.jpg", "https://i.imgur.com/SJb1IXU.jpg",
    "https://i.imgur.com/mk9vA9O.jpg", "https://i.imgur.com/82uHTa6.jpg", "https://i.imgur.com/bAFIovg.jpg",
    "https://i.imgur.com/ovCRD2g.jpg", "https://i.imgur.com/ezSBuRh.jpg", "https://i.imgur.com/8U0FL5T.jpg",
    "https://i.imgur.com/zoFzZT9.jpg", "https://i.imgur.com/YzY6Xhw.jpg", "https://i.imgur.com/S1ezHsn.jpg",
    "https://i.imgur.com/JChMT6L.jpg", "https://i.imgur.com/TuADzYI.jpg"
  ];

  var callback = () => api.sendMessage({
    body: `💑 Here's your lovely *Couple DP* 💘`,
    attachment: fs.createReadStream(__dirname + "/cache/1.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));

  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/1.jpg"))
    .on("close", () => callback());
};
