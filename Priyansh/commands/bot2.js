const fs = global.nodemodule["fs-extra"]; // 'Const' को 'const' किया गया

module.exports.config = {
  name: "goibot2",
  version: "1.0.6", // Version updated to reflect credit change
  hasPermssion: 0,
  credits: "Recrafted by Rudra ✨", // Credit updated to Rudra only
  description: "Anime-styled romantic messages with flair (lyrics only)",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
  const { threadID, messageID } = event;
  const name = await Users.getNameUser(event.senderID);

  const lyrics = [
    "🎵 Main Tenu Samjhawan Ki, Na Tere Bina Lagda Jee. Tu Ki Jaane Pyar Mera, Main Karoon Intezaar Tera. Tu Dil, Tu Yun Jaan Meri. Main Tenu Samjhawan Ki, Na Tere Bina Lagda Jee. 💞",
    "🎶 Tere Ishq Mein Pagal Hogaya, Deewana Tera Re. Sach Hote Hote Hogaya Afsana Mera Re. Tere Ishq Mein Pagal Hogaya, Deewana Tera Re. ❤️",
    "💔 Hum Tere Bin Ab Reh Nahin Sakte, Tere Bina Kya Wajood Mera. Tujhse Juda Gar Ho Jayenge, Khud Se Hi Ho Jayenge Juda. Kyunki Tum Hi Ho, Ab Tum Hi Ho, Zindagi Ab Tum Hi Ho. 😢",
    "💖 Tu Aata Hai Seene Mein, Jab Jab Saansein Bharti Hoon. Tere Dil Ki Galiyon Se Main Har Roz Gujarti Hoon. Hawa Ke Jaise Chalta Hai Tu, Main Ret Jaise Murti Hoon. Kaun Tujhe Yun Pyaar Karega Jaise Main Karti Hoon. 🌸",
    "💑 Janam Janam Saath Chalna Yunhi, Kasam Tumhe Kasam Aake Milna Yunhi. Ek Jaan Hai Bhale Do Badan Ho, Mere Humsafar Bas Ek Tum Hi Ho. Tere Sang Yaara, Khush Rang Bahara. 💫",
    "💓 Raabta, Kuch Toh Hai Tujhse Raabta. Tu Hum Safar Hai, Hum Nawa Hai, Tu Hum Kadam Hai, Humnasheen. Raabta, Kuch Toh Hai Tujhse Raabta. 🕊️",
    "🌙 Tera Ban Jaunga, Tera Ban Ke Rahunga. Tu Hai Zaroori, Meri Zindagi Ka. Ab Har Din, Har Raat, Bas Tera Hi Naam Loon. Tera Ban Jaunga, Tera Ban Ke Rahunga. 💍",
    "🙏 Tujh Mein Rab Dikhta Hai, Yaara Main Kya Karoon. Sajde Sar Jhukta Hai, Yaara Main Kya Karoon. Tujh Mein Rab Dikhta Hai, Yaara Main Kya Karoon. 🛐",
    "🌊 Pee Loon Tere Neelay Neelay Nainon Se Shabnam. Choom Loon Haseen Haseen Khwabon Ko. Leke Tujhe Main Chala Hoon, Kahan Meri Jaan. Pee Loon Tere Neelay Neelay Nainon Se Shabnam. 💦",
    "🍃 Hawayein, Hawayein Bas Tera Naam Leke Chalti Hain. Zameen Se Falak Tak, Har Jagah Teri Parchai Hai. Hawayein, Hawayein Bas Tera Naam Leke Chalti Hain. 🕊️",
    "🫂 Agar Tum Saath Ho, Roona Chhod Doon Main. Bin Tere Hum Bhi Toh Adhoore Hain. Agar Tum Saath Ho, Toh Duniya Chhod Doon Main. 😭",
    "🎤 Phir Le Aaya Dil Majboor Kya Keejai. Raas Na Aaya Re Jeena Mujhko. Phir Le Aaya Dil Majboor Kya Keejai. 💭",
    "💫 Tum Mile Toh Jaadu Chhane Laga, Mera Dil Deewana Jaane Kya Kehne Laga. Tum Mile Toh Jaadu Chhane Laga. ✨",
    "🌃 Galliyan, Teri Galliyan Mujhko Bhaave Galliyan. Teri Galiyon Mein Aana Jaana Hai. Tere Bin Ab Jeena Mushkil Hai. Galliyan, Teri Galliyan Mujhko Bhaave Galliyan. 💖",
    "🌆 O Re Piya, Hai Teri Yaadon Mein Guzari Har Shaam. Teri Har Baat Mein, Koi Raaz Chupa Hai. O Re Piya, Hai Teri Yaadon Mein Guzari Har Shaam. 🌌",
    "💌 Bolna Mahi Bolna, Mann Ki Main Baat Bolna. Dil Deewana Hua Tera. Bolna Mahi Bolna, Mann Ki Main Baat Bolna. 🗣️",
    "🌟 Tum Jo Aaye Zindagi Mein, Baat Ban Gayi. Ishq Mazhab, Ishq Meri Zaat Ho Gayi. Tum Jo Aaye Zindagi Mein, Baat Ban Gayi. 🎊",
    "🔥 Tera Hone Laga Hoon, Jab Se Mila Hoon. Tere Bin Guzara Ae Dil Hai Mushkil. Tera Hone Laga Hoon, Jab Se Mila Hoon. ❤️‍🔥",
    "🌠 Meherbaan Hua Rab, Dard Ka Rishta Chhoot Gaya. Jab Tum Mere Paas Ho, Sab Kuch Mil Gaya. Meherbaan Hua Rab, Dard Ka Rishta Chhoot Gaya. ✨",
    "🌹 Dil Diyan Gallan, Karange Naal Naal Beh Ke. Akh Naal Akh Nu Milake, Sachchiya Mohabbatan Nibha Ke. Dil Diyan Gallan, Karange Naal Naal Beh Ke. 🥀",
    "🥰 Jeene Laga Hoon Pehle Se Zyada, Pehle Se Zyada Tum Pe Marne Laga Hoon. Tera Naam Rakh Diya Maine, Mere Dil Ka. Jeene Laga Hoon Pehle Se Zyada. 💝",
    "💃 Sun Saathiya Mahiya, Barsaat Ki Jaise Tu. Har Boond Mein Tujhe Paa Loon, Har Lamha Jeena Chahta Hoon. Sun Saathiya Mahiya, Barsaat Ki Jaise Tu. ☔",
    "💘 Kaun Tujhe Yun Pyaar Karega Jaise Main Karti Hoon. Aankhon Mein Teri Ajab Si, Ajab Si Adaayein Hain. Kaun Tujhe Yun Pyaar Karega Jaise Main Karti Hoon. 💞",
    "💫 Raahon Mein Unse Mulaqat Ho Gayi, Jise Duniya Kehti Hai Mohabbat. Woh Hasti Hai Kahan Jo Meri Jaan Ban Gayi. Raahon Mein Unse Mulaqat Ho Gayi. 💓",
    "🖤 Ek Tarfa Pyar Ki Taqat Hi Kuch Aur Hoti Hai, Auro Ke Rishton Ki Tarah Do Logon Mein Nahi Bat'ti. Sirf Mera Haq Hai Ispe. Ek Tarfa Pyar Ki Taqat. 🖤",
    "💭 Tera Naam Dene Lage Hain Saare Khwab Mujhe, Jaise Main Tera Naam Hoon. Teri Yaadon Mein Khoya Rehta Hoon. Tera Naam Dene Lage Hain Saare Khwab Mujhe. 🌙",
    "💥 Yeh Dil Deewana, Ban Gaya Hai Tera Deewana. Ab Tere Siva Kuch Bhi Nahi. Yeh Dil Deewana, Ban Gaya Hai Tera Deewana. 💓",
    "🎶 Chahun Main Ya Naa, Khud Se Yeh Poochhun. Kya Mujhko Bhi Hai Tumse Ishq Hua. Chahun Main Ya Naa, Khud Se Yeh Poochhun. ❣️",
    "Main Tenu Smjhava ki, Naa Yere bina lagda jee, tu ki jaane pyar mera, me kru intezaar tera. Tu dil, tu yun jaan meri, me tenu samjhava ki, na tere bina lagda jee. 💞",
    "Tere ishq me pagal hogya, Diwana Tera Re, sach hote hote hogya afsana mera re. Tere ishq me pagal hogya, Diwana Tera Re. ❤️",
    "Chahat Kasam Nahin Hai, Koi Rasam Nahin Hai, Dil Ka vaham Nahin Hai Pana Hai Tujhko Khwabon Mein Gaon Jiska, rasta na aam jiska, Chahat Hai Naam Jiska, Pana Hai Tujhko. ✨",
    "Kyu Bewaja di Ye saza, kyu Khwab deke wo legy, jiye jo hum, lage sitam, azab ese wo degya. Kyu Bewaja di Ye saza. 😢",
    "Jaati hu me, jaldj hai kya, dhadke jiya, wo kyu bhala, khud se hi darne lagi hu, me pyar krne lgi hu. Jaati hu me. 💖",
    "Tu naa jaan di, kaarobar ni, jaali number plate lagi car di, ha face utte a glow, puchi naa tikaane sare rhnde aa ni low, ek do. Tu naa jaan di. 🚗",
    "kehndi hundi si chann tak raah banade, taare ne pasand menu heyha saare laade, ohna tareya de vicho jado menu dekhegi ni meri yaad jado au, odo pata laggu ga. kehndi hundi si. 🌟",
    "Ham Tere Bin Ab Rah Nahin Sakte Tere Bina Kya wajood Mera Tujhse Judaa Gar Ho Jaenge Khud Se Hi Ho Jaenge Juda. Ham Tere Bin. 💔",
    "Kal raaste me, gum mil gya tha, lag ke gale me ro diy, jo sirf mera, tha sirf mera, mene use ku kho diya, haa wo ankhe jinhe me chum ta bewajah, pyaar mere liye kyu unme baki naa rha. Kal raaste me. 😔",
    "waqt Bhi thahara Hai Kaise Kyun ye Hua Kash Tu Aise Aaye Jaise koi Dua Yeh Meri zamanat Hai Tu Meri Ibadat Hai Apne Karm Ki Kar adaen Kar Le idhar Bhi Tu Nigahen Sun Raha Hai Na Tu Ro Raha Hun Main. waqt Bhi thahara Hai. 🙏",
    "Kyon Ek Pal Ki Bhi Judaai sahi jaaye na kyon Har Subah Tu Meri Sanson Mein Samaye na Aaja Na Tu mere pass Dunga Itna Pyar Kitni Raat Gujari hai tere Intezar Mein. Kyon Ek Pal Ki. 💘",
    "uska hun, usmein hun, use hun Usi Ka Rahane De Main To Pyasa Hoon Hai Dariya O zariya wo Jeene Ka Mere, Dil Mujhe De Agar, Dard De uska per, uski ho vah Hansi Gunje Jo Mera Ghar. uska hun. 🏡",
    "Ese jaruri ho mujhko tum, jese hawaye saaso ko, ese talashu me tumko, jese ke per zamino ko, hasna ya rona ho mujhe, pagal sa dhundo me tumhe, kal mujhse mohabbat ho na ho, kal mujhko ijazat ho na ho, toote dil ke tookde lekar tere dar pe bi reh jauga, mai phir b tumko chahuga. ❤😓",
    "mai jarurat hu teri, tu jaroori hai mujhe, maanta hu bin tere hai adhoori mehfile, kam nahi jashn se ye akelapan mera, sath h raat din ye diwana pan mera, tou mujhe na kbhi mud k awaj du me sunuga tumhe har jagah, mene tera nam dil❤ rkh diya. mai jarurat hu teri. 🎶",

    // 15 New Bollywood Hindi Lyrics (with 5-6 lines)
    "🎶 Dil Ibadat Kar Raha Hai, Dhadkane Meri Sun. Tujhko Main Kar Loon Hasil, Aa Lag Ja Seene Se. Tere Ishq Mein Dooba Rahoon, Raat Din Bas Yahi Kahoon. Dil Ibadat Kar Raha Hai, Dhadkane Meri Sun. 💖",
    "💕 Tere Bin Kive Rahaan Main, Tu Meri Jaan Ae. Har Saah Vich Naam Tera, Bas Yahi Ardaas Ae. Tere Bin Kive Rahaan Main, Tu Meri Jaan Ae. 🥺",
    "💫 Tujhme Rab Dikhta Hai, Yaara Main Kya Karoon. Har Ek Adaa Teri, Jaise Koi Jadoo. Tujhme Rab Dikhta Hai, Yaara Main Kya Karoon. 🌟",
    "💖 Humari Adhuri Kahani, Hamari Adhuri Kahani. Tum Ne Kya Jaana Hai, Humari Adhuri Kahani. Yeh Dil Kya Kare, Kya Bole. 💔",
    "🎵 Chura Liya Hai Tumne, Jo Dil Ko. Nazar Nahin Churana Sanam, Badalke Meri Tum Zindagani. Chura Liya Hai Tumne, Jo Dil Ko. 🎶",
    "🌹 Jab Koi Baat Bigad Jaaye, Jab Koi Mushkil Pad Jaaye. Tum Dena Saath Mera, Oh Humnava. Jab Koi Baat Bigad Jaaye. 🫂",
    "🥺 Tera Fitoor Jab Se Chadh Gaya Re, Ishq Jo Zara Sa Tha Woh Badh Gaya Re. Dil Tera Hua, Tu Meri Hui. Tera Fitoor. ❤️‍🔥",
    "🌧️ Bheegi Bheegi Raaton Mein, Phir Tum Aao Na. Aisi Barsaton Mein, Aao Na. Bheegi Bheegi Raaton Mein. ☔",
    "💖 Kabhi Shaam Dhale Toh Mere Dil Mein Aa Jaana, Kabhi Chaand Khile Toh Mere Dil Mein Aa Jaana. Magar Aana, Magar Aana. 🌙",
    "🎶 Dil Sambhal Ja Zara, Phir Mohabbat Karne Chala Hai Tu. Dil Yahin Ruk Ja Zara. Dil Sambhal Ja Zara. 😔",
    "🌟 Kaise Hua, Kaise Hua, Tu Itna Zaroori Kaise Hua. Kaise Hua, Kaise Hua. Tere Bin Guzara Ae Dil Hai Mushkil. ✨",
    "💞 Lambi Judai, Char Dinon Da Pyar Ho Rabba. Badi Lambi Judai. Lambi Judai, Lambi Judai. 😭",
    "🥰 Tere Naam, Humne Kiya Hai Jeevan Apna Sara Sanam. Ho Jeevan Apna Sara Sanam. Tere Naam. 🙏",
    "🎧 Tujhe Kitna Chahne Lage Hum, Tere Saath Ho Gaye Gum. Ab Na Karenge Tujhe Kum. Tujhe Kitna Chahne Lage Hum. 🥺",
    "💘 Dilbar Dilbar, Ho Dilbar. Aaja Mere Paas Aaja. Dilbar Dilbar. 💃"
  ];

  const borders = [
    "╔══════ ❀•°❀°•❀ ══════╗",
    "╭─────────────╮",
    "✦━━━━━━༺༻━━━━━━✦",
    "◆━───━◆━───━◆",
    "✧･ﾟ: ✧･ﾟ: 　　 :･ﾟ✧:･ﾟ✧",
    "╘═══ ▣◎▣ ═══╛",
    "🌸･･━━━･･🌸････━━･･🌸",
    "★彡[ᴘʀᴇᴍɪᴜᴍ]彡★",
    "  ▂ ▄ ▅ ▆ ▇ █ LOVE █ ▇ ▆ ▅ ▄ ▂  ",
    "꧁༒☬𝓛𝓸𝓿𝓮𝓓𝓻𝓮𝓪𝓶☬༒꧂",
    "༶•┈┈୨♡୧┈┈•༶",
    "♥╣•══•╠♥",
    "★⋆｡°✩｡⋆★",
    "✿◕ ‿ ◕✿",
    "╭➤❥ ❝ ❞ ➤╮",
    "꧁༺♡༻꧂",
    "▣════════════════════▣",
    "❣️▪️❣️▪️❣️▪️❣️▪️❣️",
    "꒰ঌ🌹໒꒱",
    "🍁•°•═════•°•🍁"
  ];

  // Array of different time display formats
  const timeFormats = [
      `⏰ अभी का समय है: **${moment.tz("Asia/Kolkata").format("h:mm:ss A")}**`,
      `⏳ *यह इस समय है*: \`${moment.tz("Asia/Kolkata").format("HH:mm:ss || DD-MM-YYYY")}\``,
      `🕰️ **आज ${moment.tz("Asia/Kolkata").format("dddd, D MMMM YYYY")} को, ${moment.tz("Asia/Kolkata").format("h:mm A")} हो रहे हैं।**`,
      `⏱️ _घड़ी की सुईयाँ बताती हैं_: **${moment.tz("Asia/Kolkata").format("hh:mm A")}**`,
      `🗓️ *दिनांक और समय*: \`${moment.tz("Asia/Kolkata").format("DD/MM/YYYY @ h:mm:ss A")}\``,
      `✨ वर्तमान पल: **${moment.tz("Asia/Kolkata").format("HH:mm")}**`,
      `💖 समय गुजर रहा है: *${moment.tz("Asia/Kolkata").format("h:mm A")}*`,
      `🌟 आपकी सेवा में: ` + `**${moment.tz("Asia/Kolkata").format("HH:mm:ss")}**`,
      `💫 अभी ठीक ` + `_` + `${moment.tz("Asia/Kolkata").format("h:mm A")}` + `_` + ` हुआ है।`,
      `📅 ` + `\`आज है ${moment.tz("Asia/Kolkata").format("DD MMMM YYYY")}, ${moment.tz("Asia/Kolkata").format("h:mm A")} पर\``
  ];

  if (event.body?.toLowerCase().startsWith("song")) {
    const lyric = lyrics[Math.floor(Math.random() * lyrics.length)];
    const border = borders[Math.floor(Math.random() * borders.length)];
    const randomTimeFormat = timeFormats[Math.floor(Math.random() * timeFormats.length)]; // Select a random time format

    const msg = {
      body:
        `${border} 💖  𝗛𝗲𝘆 𝗦𝘂𝗻𝗱𝗮𝗿 ${name} 💖 🎶 𝗧𝗵𝗶𝘀 𝗢𝗻𝗲'𝘀 𝗙𝗼𝗿 𝗬𝗼𝘂... ${border}\n\n` +
        `❝ ${lyric} ❞ 💕\n\n` +
        `_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _\n` +
        `${randomTimeFormat}\n\n` + // Add the random time format here
        `✨🅒🅡🅔🅓🅘🅣🅢 ✧ ꧁ ʀᴜᴅʀᴀ ꧂ ✨` // Credit updated here
    };
    return api.sendMessage(msg, threadID, messageID);
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) {};
