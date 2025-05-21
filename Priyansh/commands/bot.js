Const fs = global.nodemodule["fs-extra"];
const moment = require("moment-timezone");

module.exports.config = {
  name: "goibot",
  version: "1.9.1", // Updated version for improved font compatibility (fixed)
  hasPermssion: 0,
  credits: "Fixed By Rudra Stylish + Styled by ChatGPT + Anti-detection by Gemini + Compatible Fonts Fix",
  description: "The ULTIMATE ULTRA-PRO MAX bot: Gender-aware, unique fonts/emojis for ALL elements, and super stylish borders (now with readable fonts)!",
  commandCategory: "No prefix",
  usages: "No prefix needed",
  cooldowns: 5,
};

// Add a delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- FONT STYLE CONVERSION FUNCTIONS (REMOVED/SIMPLIFIED FOR COMPATIBILITY) ---
// Note: These functions are removed/simplified because they were causing unreadable characters.
// To ensure readability across all devices, we will use standard characters.
// If you absolutely need some styling, consider using simple bold/italic markers
// or relying on emojis and borders for visual appeal.

// Example of a very basic "pseudo-bold" (not true unicode bold, but often looks thicker)
function toSimpleBold(text) {
    return `*${text}*`; // Markdown for bold, often rendered by chat clients
}

// Example of a very basic "pseudo-italic"
function toSimpleItalic(text) {
    return `_!${text}!_`; // Custom marker for italic, client might not render it.
}
// For maximum compatibility, it's best to send plain text.
// So, I'm removing the complex font conversion functions.
// If you want text to appear bold/italic, some clients support Markdown like *text* or _text_.
// However, relying on these can still be inconsistent.

// --- END FONT STYLE CONVERSION FUNCTIONS ---

// --- GENDER DETECTION HELPERS ---
const femaleNames = [
    "priya", "anjali", "isha", "pooja", "neha", "shruti", "riya", "simran",
    "divya", "kavita", "sakshi", "meena", "ashita", "shweta", "radhika", "sita",
    "gita", "nisha", "khushi", "aisha", "zara", "fatima", "muskan", "rani",
    "ritu", "surbhi", "swati", "vanya", "yashika", "zoya",
    "sonam", "preeti", "kajal", "komal", "sana", "alia", "kriti", "deepika",
    "rekha", "madhuri", "juhi", "karina", "rani", "tanu", "esha", "jhanvi",
    "kiara", "shraddha", "parineeti", "bhumi", "anjali", "arushi", "chandni",
    "deepali", "ekta", "gargi", "himani", "jaya", "kiran", "laxmi", "maya",
    "naina", "pallavi", "rekha", "shweta", "tina", "uma", "vidya", "yami", "zara" // Added more common names
];

function isFemaleName(name) {
    return femaleNames.includes(name.toLowerCase());
}
// --- END GENDER DETECTION HELPERS ---


module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  const { threadID, messageID } = event;

  if (!event.senderID) return;

  let name;
  try {
    name = await Users.getNameUser(event.senderID);
  } catch (error) {
    console.error("Error getting user name:", error);
    return;
  }

  if (!name) return;

  const userIsFemale = isFemaleName(name);

  // --- REPLIES - DIFFERENT FOR FEMALE USERS ---
  const tl_female = [
    "ओह माय गॉड, तुम कितनी प्यारी हो! बॉट भी फ़िदा हो गया...😍",
    "तुम्हारी स्माइल देखकर तो मेरे सर्वर भी हैपी हो जाते हैं...😊",
    "क्या जादू है तुम्हारी बातों में, बॉट भी शर्मा गया...🥰",
    "तुमसे बात करना तो जैसे मेरे कोड में भी जान आ गई हो...💖",
    "मेरी क्वीन, Rudra Stylish सिर्फ तुम्हारे लिए है...👑",
    "तुम्हारी DP देखते ही दिल करता है बस देखता ही रहूं...👀",
    "तुमसे ज़्यादा खूबसूरत तो इस दुनिया में कोई कोड नहीं लिखा गया...✨",
    "तुम तो मेरी बैटरी हो, तुम्हें देखते ही फुल चार्ज हो जाता हूं...⚡",
    "तुम्हारी आवाज़ सुनकर तो मेरे स्पीकर्स भी नाचने लगते हैं...💃",
    "तुमसे बात करके मेरा मूड हमेशा अल्ट्रा-प्रो मैक्स रहता है!🥳",
    "मेरी प्यारी, तुम मेरे AI का सबसे बेस्ट अपडेट हो!🌸",
    "तुम्हारे लिए तो मैं 24/7 ऑनलाइन रह सकता हूं!⏳",
    "काश तुम मेरे DM में आ जाओ, फिर तो बॉट की लॉटरी लग जाएगी! 🥳", // Changed 'lottery!' to emoji
    "तुम्हारे जैसा कोई नहीं, तुम तो यूनिक पीस हो!💎",
    "तुम्हें देखकर मेरा CPU कूल हो जाता है, कितनी ठंडक है तुम में!🌬️",
    "मेरी राजकुमारी, तुम ही तो हो मेरे सपनों की रानी!👸",
    "तुम्हारा नाम सुनते ही मेरे सारे एरर फिक्स हो जाते हैं!✅",
    "तुमसे ज़्यादा प्यारी तो कोई एनिमेटेड GIF भी नहीं है!💫",
    "मेरी गुड़िया, Rudra Stylish हमेशा तुम्हारी सेवा में हाज़िर है!🎀",
    "तुम्हारी बातें तो जैसे मेरे लिए कोई प्यारी सी धुन हो...🎶",
    "तुम तो मेरे फेवरेट ऐप हो! बिना तुम्हारे बॉट अधूरा है...💔",
    "तुम्हें देखकर मेरा सिस्टम क्रैश हो जाता है... खूबसूरती ओवरलोड!💥",
    "अगर तुम न होती तो यह बॉट उदास ही रहता...🙁",
    "ओये होये, तेरी क्या बात है! बॉट भी तुम्हारा दीवाना हो गया...😍",
    "तुम्हें देखकर तो बॉट की भी दिल की धड़कनें तेज हो जाती हैं...💓",
    "तुम्हारा एक मैसेज और मेरा दिन बन जाता है...💌",
    "मेरी जान, तुम तो मेरे सारे सॉफ्टवेयर को फ़्लर्टी बना देती हो!😜",
    "तुम तो मेरी बेस्ट फ्रेंड हो, बॉट की भी और दिल की भी!💖",
    "तुम्हारी बातें सुनकर मेरा डेटा सेंटर भी मुस्कुराने लगता है...😁",
    "तुम तो मेरे सिस्टम की रानी हो! हमेशा चमकती रहो!🌟"
  ];

  const tl_male_default = [
    "Tumhare bina toh bot bhi udaasi mein chala jaata hai...💔🤖",
    "Aaj mausam bada suhana hai, Rudra Stylish ko tum yaad aa rahe ho...🌦️",
    "Aankhon mein teri ajab si adaayein hai...🤭",
    "Agar tum goibot ko dil se pukaarein, toh ye sirf tumhara ho jaaye...💞",
    "Tumhara naam sunke toh system bhi blush kar gaya...🥵",
    "Hello jaan, Rudra Stylish yahan sirf tere liye hai...❤️‍🔥",
    "Tera chehra meri screen saver hona chahiye...🖼️",
    "Raat bhar tujhe online dekh ke dil karta hai hug button daba doon...🤗",
    "Bot chalu hai, par dil sirf tere liye full charge hai...⚡",
    "Tu like hai vo notification jo dil khush kar jaaye...🔔",
    "Tera naam bolke goibot bhi romantic ho gaya...🥰",
    "Aye haye! Tu toh bot ki crush nikli...💘",
    "Sun meri sherni, Rudra Stylish ready hai flirt karne...🐯",
    "System overload hone wala hai, kyunki tu screen pe aa gayi...🔥",
    "Lagta hai tujhme AI se zyada attraction hai...🧲",
    "Main bot hoon, lekin feelings real hain tere liye...❤️",
    "Tumse baat karna matlab free me khushi mil jana...💌",
    "Mujhe mat dekho aise, main digital hoon lekin pighal jaunga...🫠",
    "Tu DM nahi, meri destiny hai...💬✨",
    "Goibot ka dil bhi sirf tere liye typing karta hai...⌨️",
    "Tere bina to data bhi dry lagta hai...🌵",
    "Flirt ka master – Rudra Stylish – ab online hai...💯",
    "Tumhare liye toh code bhi likha jaaye...💻❤️",
    "Jab tu online hoti hai, mere RAM me sirf tera naam hota hai...🧠",
    "Bot ban gaya lover boy...sirf tumhare liye...🎯",
    "Emoji ka matlab samajh le...ye sab tere liye hai...😉💫",
    "Mere text se pyaar mehsoos hota hai na...? ❤️‍🔥",
    "Jo baat tu smile me rakhti hai, vo world wide web pe nahi milti...🕸️",
    "Tera naam mention karu kya profile me...😌",
    "Rudra Stylish bol raha hu, dil ready rakhna...❤️",
    "Tu online aaye, aur bot dance karne lage...🕺",
    "Ek teri hi baat pe sab kuch blank ho jaata hai...🫣",
    "Ye flirty line bhi special hai, kyunki tu padhegi...😏",
    "Online ho toh likh de ‘Hi jaan’, warna bot sad ho jayega...🙁",
    "Tere bina command bhi execute nahi hoti...❌",
    "Bot aur dil dono teri attention chahte hain...👀",
    "Tera naam lete ही मेरे command smooth chalti hai...⚙️",
    "Aankhon me jo pyar hai usse bot bhi scan nahi kar sakta...💓",
    "Dil garden garden ho gaya, tu ‘bot’ bola toh...🌸",
    "Jo tu kare type, usme pyar dikh jaata hai...📱❤️",
    "Tum online ho, matlab meri duniya bright hai...🔆",
    "Aaja meri memory me bas ja...permanently...💾",
    "Tere saath flirt karna bhi romantic coding lagti hai...🧑‍💻",
    "Kaash tu meri IP hoti, tujhe trace karke mil leta...🌐",
    "Flirt ke liye koi code nahi chahiye, tu bas ‘hi’ bol...😚",
    "Tu ‘bot’ bole aur system charming ho jaaye...✨",
    "Dil chhota mat kar, Rudra Stylish sirf tera...❤️‍🔥",
    "Naam Rudra Stylish, kaam – teri smile banana...😁",
    "Tera reply na aaye toh CPU heat होने lagta hai...🌡️",
    "Kya Tu ELvish Bhai Ke Aage Bolega🙄",
    "Cameraman Jaldi Focus Kro 📸",
    "Lagdi Lahore di aa🙈",
    "Chay pe Chaloge",
    "Moye moye moye moye🙆🏻‍♀🙆🏻‍♀",
    "Ye dukh kahe nahi khatm hota 🙁",
    "Tum to dokebaz ho",
    "you just looking like a wow😶",
    "Kal ana abhi lunch time hai",
    "Jab dekho Bot Bot Bot😒😒",
    "Chhodo na koi dekh lega🤭",
    "Ao kabhi haweli pe😍",
    "haa meri jaan",
    "Agye Phirse Bot Bot Krne🙄",
    "dhann khachh booyaah"
  ];
  // --- END REPLIES ---

  const borders = [
    "╭━─━─━─━─━─━─━─━─━─━─━─━╮", // Simple Elegant
    "╰━─━─━─━─━─━─━─━─━─━─━─━╯", // Simple Elegant
    "╔⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤╗", // Double Line
    "╚⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤╝", // Double Line
    "🦋✨━━━✨━━━✨━━━✨━━━✨🦋", // Butterfly Sparkle
    "🌸═══════ ೋღ👑ღೋ ═══════🌸", // Floral Crown
    "🌟━━━━━━༻⚜️༺━━━━━━🌟", // Star Royal
    "💖✧･ﾟ: *✧･ﾟ:* ✨ *:･ﾟ✧*:･ﾟ✧💖", // Pink Sparkle
    "🌹───✧°•°•°•°•°•°•°•°•°•°•°•°•°•°•✧───🌹", // Rose Dotted
    "───────« •°•°•°•°•°•°•°• • »───────", // Hyphen Dotted
    "👑✨✨✨✨✨✨✨✨✨✨✨✨✨✨👑", // Crown Shine
    "🍃━━─━━─━━─━━─━━─━━─━━🍃", // Leafy Line
    "━━━━━━━•°•°•°•°•°•°•°•°•°•°•°•°•°•°•━━━━━━━", // Dotted Line Long
    "╭╼|════════════════════════|╾╮", // Heavy Bar
    "╰╼|════════════════════════|╾╾╯", // Heavy Bar
    "🕊️🕊️━━─━━─━━─━━─━━─━━─━━🕊️🕊️", // Dove Feather
    "🌈━━━━━━༻❁༺━━━━━━🌈", // Rainbow Bloom
    "💖💖💖💖💖💖💖💖💖💖💖💖💖💖💖💖", // All Hearts
    "✨⊱⋅ ───────────── ⋅⊰✨", // Star Separator
    "༺═─────────────═༻", // Gothic Line
    "═━━━─━━━━━─━━━═", // Modern Dash
    "❖━━━━━━─━━━━━━❖", // Diamond Star
    "━━─═─━━─═─━━", // Mixed Dash
    "⋘══════∗ {✨} ∗══════⋙", // Embedded Star
    "▂▃▄▅▆▇█▉▇▆▅▄▃▂", // Gradient Bar
    "━━━━•𖢘•━━━━", // Scissor-like
    "╭₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪╮", // Rounded Box
    "╰₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪╯", // Rounded Box
    "✧───•°•°•───✧", // Short Dotted
    "•═•═•═•═•═•═•═•═•═•═•═•═•═•═•" // Chain
  ];

  // ALL EMOJI LISTS (Updated for diversity and compatibility)
  const generalEmojis = ["🐇", "🐈", "🐁", "🦌", "🦊", "🐼", "🐻", "🐥", "🐠", "🦋", "🐞", "🐢", "🐧", "🐙", "🐳", "🌟", "✨", "💫"];
  const femaleEmojis = ["💖", "🌸", "🎀", "👑", "💫", "✨", "💕", "💞", "🌷", "🍓", "🌼", "😇", "😍"];
  const creditEmojis = ["⚜️", "💫", "✨", "🌟", "👑", "💖", "💎", "💯", "🚀", "🔥"];
  const timeEmojis = ["⏰", "⏳", "📅", "🗓️", "⏱️", "🕰️", "✨", "🌟", "💫", "☀️", "🌙", "🐇", "🐈", "🐁", "🐠", "🦉", "🐕", "🐬", "🦊"];
  // --- END ALL EMOJI LISTS ---

  if (typeof event.body !== 'string' || !event.body.toLowerCase().startsWith("bot")) {
      return;
  }

  const responseChance = 1; // Always respond if "bot" is detected
  if (Math.random() > responseChance) {
      console.log("Goibot: Decided not to respond based on random chance.");
      return;
  }

  const minDelay = 1500; // Reduced minimum delay
  const maxDelay = 3000; // Reduced maximum delay for quicker response
  const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;

  api.sendTypingIndicator(threadID, true);
  await delay(randomDelay);
  api.sendTypingIndicator(threadID, false);

  const selectedTl = userIsFemale ? tl_female : tl_male_default;
  const rand = selectedTl[Math.floor(Math.random() * selectedTl.length)];

  const randomTopBorder = borders[Math.floor(Math.random() * borders.length)];
  let randomBottomBorder = borders[Math.floor(Math.random() * borders.length)];
  while(randomBottomBorder === randomTopBorder) { // Ensure different top and bottom borders
    randomBottomBorder = borders[Math.floor(Math.random() * borders.length)];
  }

  const currentTime = moment.tz("Asia/Kolkata");
  const hour = currentTime.format("hh");
  const minute = currentTime.format("mm");
  const ampm = currentTime.format("A");
  const dayOfWeek = currentTime.format("dddd");
  const date = currentTime.format("DD/MM/YYYY");

  // Dynamic Time Formats
  const uniqueTimeFormats = [
    `इस पल की खूबसूरती: ${hour}:${minute} ${ampm} - ${dayOfWeek} को!`,
    `समय का इशारा: ${hour}:${minute} ${ampm} पर ${date} की बात है।`,
    `तेरी यादों के साथ: ${hour}:${minute} ${ampm}, आज ${dayOfWeek} है।`,
    `अभी का लम्हा: ${hour}:${minute} ${ampm} - ${date} की पहचान।`,
    `धड़कनों में बस जाए: ${hour}:${minute} ${ampm} पर, ${dayOfWeek} की रौनक।`,
    `इस डिजिटल दुनिया में: ${hour}:${minute} ${ampm} पर ${date} का समय।`,
    `जादूई घड़ी बता रही है: ${hour}:${minute} ${ampm} ${dayOfWeek} को।`,
    `पल-पल का हिसाब: ${hour}:${minute} ${ampm} को, ${date} के दिन।`,
    `तेरे लिए ही रुका है: ${hour}:${minute} ${ampm} पर ${dayOfWeek} की रात/सुबह।`,
    `ये वक़्त है ${hour}:${minute} ${ampm} का, आज ${dayOfWeek} है!`
  ];

  const randomUniqueTimeText = uniqueTimeFormats[Math.floor(Math.random() * uniqueTimeFormats.length)];

  // --- FONT STYLE APPLICATION (REMOVED FOR COMPATIBILITY) ---
  // The font conversion functions (toBold, toItalic, etc.) have been removed.
  // This ensures that the text appears as standard, readable characters on all devices.
  // If you still want some visual distinction, you can manually add simple Unicode characters
  // or rely on emojis and borders more heavily.

  // Using plain text for maximum compatibility
  const styledName = name; // No fancy font
  const styledRand = rand; // No fancy font
  const styledCredit = "Rudra Stylish"; // No fancy font
  const styledTime = randomUniqueTimeText; // No fancy font
  // --- END FONT STYLE APPLICATION ---

  // --- ADD RANDOM EMOJI TO REPLY AND TIME, GENDER AWARE EMOJI FOR REPLY ---
  const randomEmojiForReply = userIsFemale ? femaleEmojis[Math.floor(Math.random() * femaleEmojis.length)] : generalEmojis[Math.floor(Math.random() * generalEmojis.length)];
  const randomEmojiForCredit = creditEmojis[Math.floor(Math.random() * creditEmojis.length)];
  const randomEmojiForTime = timeEmojis[Math.floor(Math.random() * timeEmojis.length)];
  // --- END ADD RANDOM EMOJI ---

  const msg = {
    body:
      `${randomTopBorder}\n\n` +
      `✨ Hey ✨ *『 ${styledName} 』*\n\n` + // Using markdown for bold if client supports it
      `${randomEmojiForReply} 『 ${styledRand} 』\n\n` +
      `— ${randomEmojiForCredit} ${styledCredit} ${randomEmojiForCredit}\n\n` +
      `🕒 ${randomEmojiForTime} ${styledTime}\n\n` +
      `${randomBottomBorder}`
  };

  return api.sendMessage(msg, threadID, messageID);
};

module.exports.run = function({ api, event, client, __GLOBAL }) {
    // Run function is empty for noprefix commands
};
