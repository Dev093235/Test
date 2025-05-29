const fs = global.nodemodule["fs-extra"];

module.exports.config = { name: "goibot2", version: "1.0.2", hasPermssion: 0, credits: "Recrafted by Rudra ✨", description: "Anime-styled romantic messages with flair", commandCategory: "Noprefix", usages: "noprefix", cooldowns: 5, };

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) { const moment = require("moment-timezone"); const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss"); const { threadID, messageID } = event; const name = await Users.getNameUser(event.senderID);

const lyrics = [ "🎵 Main Tenu Samjhawan Ki, Na Tere Bina Lagda Jee... 💞", "🎶 Tere Ishq Mein Pagal Hogaya, Deewana Tera Re... ❤️", "💔 Ham Tere Bin Ab Reh Nahin Sakte... 😢", "💖 Tu Aata Hai Seene Mein, Jab Jab Saansen Bharti Hoon... 🌸", "🌧️ Kyun Ki Tum Hi Ho, Ab Tum Hi Ho, Zindagi Ab Tum Hi Ho... 💘", "💑 Janam Janam Saath Chalna Yunhi, Kasam Tumhe Kasam... 💫", "💓 Raabta, Kuch Toh Hai Tujhse Raabta... 🕊️", "🌙 Tera Ban Jaunga, Tera Ban Ke Rahunga... 💍", "🙏 Tujh Mein Rab Dikhta Hai, Yaara Main Kya Karoon... 🛐", "🌊 Pee Loon Tere Neelay Neelay Nainon Se Shabnam... 💦", "🌈 Tere Sang Yaara, Khush Rang Bahara... 💐", "🍃 Hawayein, Hawayein Bas Tera Naam Leke Chalti Hain... 🕊️", "🫂 Agar Tum Saath Ho, Roona Chhod Doon Main... 😭", "🎤 Phir Le Aaya Dil Majboor Kya Keejai... 💭", "💫 Tum Mile Toh Jaadu Chhane Laga... ✨", "🌃 Galliyan, Teri Galliyan Mujhko Bhaave Galliyan... 💖", "🌆 O Re Piya, Hai Teri Yaadon Mein Guzari Har Shaam... 🌌", "💌 Bolna Mahi Bolna, Mann Ki Main Baat Bolna... 🗣️", "🌟 Tum Jo Aaye Zindagi Mein, Baat Ban Gayi... 🎊", "🔥 Tera Hone Laga Hoon, Jab Se Mila Hoon... ❤️‍🔥", "🌠 Meherbaan Hua Rab, Dard Ka Rishta Chhoot Gaya... ✨", "🌹 Dil Diyan Gallan, Karange Naal Naal Beh Ke... 🥀", "🥰 Jeene Laga Hoon Pehle Se Zyada... 💝", "💃 Sun Saathiya Mahiya, Barsaat Ki Jaise Tu... ☔", "💘 Kaun Tujhe Yun Pyaar Karega Jaise Main Karti Hoon... 💞", "💫 Raahon Mein Unse Mulaqat Ho Gayi, Jise Duniya Kehti Hai Mohabbat... 💓", "🖤 Ek Tarfa Pyar Ki Taqat Hi Kuch Aur Hoti Hai... 🖤", "💭 Tera Naam Dene Lage Hain Saare Khwab Mujhe... 🌙", "💥 Yeh Dil Deewana, Ban Gaya Hai Tera Deewana... 💓", "🎶 Chahun Main Ya Naa, Khud Se Yeh Poochhun... ❣️" ];

const borders = [ "╔══════ ❀•°❀°•❀ ══════╗", "╭─────────────╮", "✦━━━━━━༺༻━━━━━━✦", "◆━───━◆━───━◆", "✧･ﾟ: ✧･ﾟ: 　　 :･ﾟ✧:･ﾟ✧", "╘═══ ▣◎▣ ═══╛", "🌸･･━━━･･🌸･･━━･･🌸", "★彡[ᴘʀᴇᴍɪᴜᴍ]彡★", "▁ ▂ ▄ ▅ ▆ ▇ █ LOVE █ ▇ ▆ ▅ ▄ ▂ ▁", "꧁༒☬𝓛𝓸𝓿𝓮𝓓𝓻𝓮𝓪𝓶☬༒꧂", "༶•┈┈୨♡୧┈┈•༶", "♥╣•══•╠♥", "★⋆｡°✩｡⋆★", "✿◕ ‿ ◕✿", "╭➤❥ ❝ ❞ ➤╮", "꧁༺♡༻꧂", "▣════════════════════▣", "❣️▪️❣️▪️❣️▪️❣️▪️❣️", "꒰ঌ🌹໒꒱", "🍁•°•═════•°•🍁" ];

if (event.body?.toLowerCase().startsWith("song")) { const lyric = lyrics[Math.floor(Math.random() * lyrics.length)]; const border = borders[Math.floor(Math.random() * borders.length)];

const msg = {
  body:

`${border} 💖  𝗛𝗲𝘆 𝗦𝘂𝗻𝗱𝗮𝗿 ${name} 💖 🎶 𝗧𝗵𝗶𝘀 𝗢𝗻𝗲'𝘀 𝗙𝗼𝗿 𝗬𝗼𝘂... ${border}

❝ ${lyric} ❞ 💕

──────────────✧✧──────────────

✨🅒🅡🅔🅓🅘🅣🅢 ✧ ꧁ ʀᴜᴅʀᴀ ꧂ ✨` }; return api.sendMessage(msg, threadID, messageID); } };

module.exports.run = function({ api, event, client, __GLOBAL }) {};

