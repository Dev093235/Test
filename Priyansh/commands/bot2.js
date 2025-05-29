const fs = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "goibot2",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Fixed & Styled By Rudra 🔥",
  description: "goibot2 with Stylish Song Lines",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  const { threadID, messageID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
  const name = await Users.getNameUser(event.senderID);

  const borders = [
    "『💘━━━━༺❀༻━━━━💘』",
    "✦───༺♡༻───✦",
    "🌸⌈✦✧✦⌋🌸",
    "╔═════ஜ۩۞۩ஜ═════╗",
    "•´¯`•.✿.｡.:*☆",
    "『♥』━━━『♬』━━━『♥』",
    "༒━━━•◦ ⚜️ ◦•━━━༒",
    "╚»★«╝✦╚»★«╝",
    "◈═══════❖═══════◈",
    "｡☆✼★━━━━━━━━★✼☆｡",
    "༼❤️‍🔥༽╭⊙✿⊙╮༼❤️‍🔥༽",
    "𓆩♱𓆪☾𓆩♱𓆪",
    "╭•⊰✿⊱.•╮",
    "🖤🌹━━❖━━🌹🖤",
    "♚━━━༺༻━━━♚",
    "𖠌🖤✦✧✦🖤𖠌",
    "╰┈➤♡𝓛𝓸𝓿𝓮♡┈╯",
    "✿⊱╮༻💜༺╭⊰✿",
    "💫➻❥❝ＳＴＹＬＩＳＨ❞➻💫",
    "🔱━═━༺༻━═━🔱"
  ];

  const quotes = [
    "Main Tenu Smjhava ki, Naa Tere bina lagda jee, tu ki jaane pyar mera , me kru intezaar tera ..",
    "Tere ishq me pagal hogya, Diwana Tera Re, sach hote hote hogya afsana mera re",
    "Chahat Kasam Nahin Hai, Koi Rasam Nahin Hai ,Dil Ka vaham Nahin Hai Pana Hai Tujhko...",
    "Kyu Bewaja di Ye saza ,kyu Khwab deke wo legy, jiye jo hum, lage sitam...",
    "Jaati hu me , jald hai kya ,dhadke jiya , wo kyu bhala , khud se hi darne lagi hu , me pyar krne lgi hu",
    "Tu naa jaan di, kaarobar ni, jaali number plate lagi car di...",
    "kehndi hundi si chann tak raah banade , taare ne pasand menu heyha saare laade...",
    "Ham Tere Bin Ab Rah Nahin Sakte Tere Bina Kya wajood Mera...",
    "Kal raaste me , gum mil gya tha, lag ke gale me ro diya, jo sirf mera , tha sirf mera...",
    "Tu Aata Hai Seene Mein Jab Jab Saanse Bharti Hun...",
    "waqt Bhi thahara Hai Kaise Kyun ye Hua Kash Tu Aise Aaye Jaise koi Dua...",
    "Kyon Ek Pal Ki Bhi Judaai sahi jaaye na...",
    "uska hun ,usmein hun ,use hun Usi Ka Rahane De Main To Pyasa Hoon...",
    "Ese jaruri ho mujhko tum, jese hawaye saaso ko...",
    "mai jarurat hu teri , tu jaroori hai mujhe , maanta hu bin tere hai adhoori mehfile...",
    "Tujh Mein Rab Dikhta Hai, Yaara Main Kya Karoon...",
    "Dil Diyan Gallan, Karange Naal Naal Beh Ke...",
    "Mann mast magan, mann mast magan bas tera naam dohraaye...",
    "Tum Hi Ho, Bas Tum Hi Ho, Zindagi Ab Tum Hi Ho...",
    "Jo Tu Mera Humdard Hai, Suhaana Har Dard Hai...",
    "Raabta, jo bhi hai woh tera hai...",
    "Sun Saathiya, Mahiya Barse Teri Rahiya...",
    "Kya Hua Tera Wada, Woh Kasam Woh Irada...",
    "Main Rang Sharbaton Ka, Tu Meethe Ghaat Ka Paani...",
    "Jeene Laga Hoon Pehle Se Zyada, Pehle Se Zyada Tumpe Marne Laga Hoon...",
    "Nazm Nazm Sa Tu, Meri Nazmon Mein Likha Tu...",
    "Tera Hone Laga Hoon, Khud Se Juda Hone Laga Hoon...",
    "Phir Bhi Tumko Chaahunga, Har Lamha Chaahunga...",
    "Raat Bhar Tera Intezaar Kiya, Sapno Mein Tujhko Pukara...",
    "Meri Aashiqui Ab Tum Hi Ho, Har Pal Bas Tum Hi Ho..."
  ];

  const randBorder = borders[Math.floor(Math.random() * borders.length)];
  const randQuote = quotes[Math.floor(Math.random() * quotes.length)];

  if (/^song$/i.test(event.body)) {
    const msg = {
      body: `${randBorder}\n🎶 𝗛𝗲𝘆 ${name}, 𝗙𝗲𝗲𝗹 𝘁𝗵𝗲𝘀𝗲 𝘃𝗶𝗯𝗲𝘀 💌\n\n❝ ${randQuote} ❞\n${randBorder}\n\n✨ 𝘾𝙧𝙚𝙙𝙞𝙩𝙨 ➤ 『🅡︎🅤︎🅓︎🅡︎🅐︎』`
    };
    return api.sendMessage(msg, threadID, messageID);
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) {};
