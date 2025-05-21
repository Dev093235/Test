const fs = global.nodemodule["fs-extra"];
const moment = require("moment-timezone");

module.exports.config = {
  name: "goibot",
  version: "2.0.3", // वर्जन अपडेट किया
  hasPermssion: 0,
  credits: "Fixed By Rudra Jaat",
  description: "The ULTIMATE ULTRA-PRO MAX bot: Gender-aware, unique fonts/emojis for ALL elements, super stylish borders, and dynamic religious replies in Hindi/English/Hinglish!",
  commandCategory: "No prefix",
  usages: "No prefix needed",
  cooldowns: 5,
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const femaleNames = [
    "priya", "anjali", "isha", "pooja", "neha", "shruti", "riya", "simran",
    "divya", "kavita", "sakshi", "meena", "ashita", "shweta", "radhika", "sita",
    "gita", "nisha", "khushi", "aisha", "zara", "fatima", "muskan", "rani",
    "ritu", "surbhi", "swati", "vanya", "yashika", "zoya",
    "sonam", "preeti", "kajal", "komal", "sana", "alia", "kriti", "deepika",
    "rekha", "madhuri", "juhi", "karina", "rani", "tanu", "esha", "jhanvi",
    "kiara", "shraddha", "parineeti", "bhumi", "misha"
];

function isFemaleName(name) {
    return femaleNames.includes(name.toLowerCase());
}

// धार्मिक रिप्लाई और मंत्र/इमोजी मैपिंग (हिंदी, इंग्लिश और हिंग्लिश दोनों के लिए)
const religiousKeywords = {
  "महादेव": { reply: "हर हर महादेव! 🕉️ आपका कल्याण हो।", emojis: ["🕉️", "🔱", "🙏"] },
  "शिव": { reply: "ॐ नमः शिवाय! महादेव कृपा करें। 🔱", emojis: ["🕉️", "🔱", "🙏"] },
  "shiva": { reply: "Om Namah Shivaya! May Lord Shiva bless you. 🔱", emojis: ["🕉️", "🔱", "🙏"] },
  "bholenath": { reply: "Jai Bholenath! Hail Shiva. 🌿", emojis: ["🕉️", "🔱", "🌿"] },
  "भोलेनाथ": { reply: "जय भोलेनाथ! शिव शंभू। 🌿", emojis: ["🕉️", "🔱", "🌿"] },

  "हनुमान": { reply: "जय बजरंगबली! संकट कटे मिटे सब पीरा। 🙏", emojis: ["🙏", "💪", "🚩"] },
  "hanuman": { reply: "Jai Bajrangbali! May all troubles be removed. 🙏", emojis: ["🙏", "💪", "🚩"] },
  "बजरंगबली": { reply: "जय हनुमान ज्ञान गुन सागर। 🚩", emojis: ["🙏", "💪", "🚩"] },
  "bajrangbali": { reply: "Victory to Hanuman, the ocean of wisdom. 🚩", emojis: ["🙏", "💪", "🚩"] },

  "माता": { reply: "जय माता दी! माँ दुर्गा आपकी रक्षा करें। 🚩", emojis: ["🚩", "🛡️", "🌸"] },
  "mata": { reply: "Jai Mata Di! May Mother Durga protect you. 🚩", emojis: ["🚩", "🛡️", "🌸"] },
  "दुर्गा": { reply: "जय माँ दुर्गा! शक्ति प्रदान करें। 🛡️", emojis: ["🚩", "🛡️", "🌸"] },
  "durga": { reply: "Jai Maa Durga! Grant us strength. 🛡️", emojis: ["🚩", "🛡️", "🌸"] },
  "lakshmi": { reply: "Jai Maa Lakshmi! May you be blessed with wealth and prosperity. 💰", emojis: ["💰", "🌸", "🙏"] },
  "लक्ष्मी": { reply: "जय माँ लक्ष्मी! धन-धान्य से परिपूर्ण रहें। 💰", emojis: ["💰", "🌸", "🙏"] },
  "saraswati": { reply: "Jai Maa Saraswati! Grant us knowledge and wisdom. 📚", emojis: ["📚", "🌸", "✨"] },
  "सरस्वती": { reply: "जय माँ सरस्वती! ज्ञान और विद्या दें। 📚", emojis: ["📚", "🌸", "✨"] },

  "विष्णु": { reply: "ॐ नमो भगवते वासुदेवाय! भगवान विष्णु कृपा करें। 🌀", emojis: ["🌀", "🙏", "✨"] },
  "vishnu": { reply: "Om Namo Bhagavate Vasudevaya! May Lord Vishnu bless you. 🌀", emojis: ["🌀", "🙏", "✨"] },

  "कृष्ण": { reply: "जय श्री कृष्ण! राधे राधे। 🐄🎶", emojis: ["🐄", "🎶", "flute!", "🧡"] },
  "krishna": { reply: "Jai Shri Krishna! Radhe Radhe. 🐄🎶", emojis: ["🐄", "🎶", "flute!", "🧡"] },
  "राधे": { reply: "राधे राधे! जय श्री कृष्णा। 💖🐄🎶", emojis: ["💖", "🐄", "🎶", "flute!"] },
  "radhe": { reply: "Radhe Radhe! Jai Shri Krishna. 💖🐄🎶", emojis: ["💖", "🐄", "🎶", "flute!"] },

  "श्री राम": { reply: "जय श्री राम! सिया राम जय राम। 🏹", emojis: ["🏹", "🙏", "🚩"] },
  "shri ram": { reply: "Jai Shri Ram! Siya Ram Jai Ram. 🏹", emojis: ["🏹", "🙏", "🚩"] },
  "राम": { reply: "जय श्री राम! राम राम। 🏹", emojis: ["🏹", "🙏", "🚩"] },
  "ram": { reply: "Jai Shri Ram! Ram Ram. 🏹", emojis: ["🏹", "🙏", "🚩"] },

  "गणेश": { reply: "जय श्री गणेश! विघ्नहर्ता। 🐘", emojis: ["🐘", "🙏", "🕉️"] },
  "ganesh": { reply: "Jai Shri Ganesh! Remover of obstacles. 🐘", emojis: ["🐘", "🙏", "🕉️"] },
  "ganesha": { reply: "Jai Ganesha! May he remove your obstacles. 🐘", emojis: ["🐘", "🙏", "🕉️"] },

  "भगवान": { reply: "ईश्वर आपको सद्बुद्धि और शांति दें। ✨", emojis: ["🙏", "✨", "🌟"] },
  "bhagwan": { reply: "May God grant you wisdom and peace. ✨", emojis: ["🙏", "✨", "🌟"] },
  "god": { reply: "May God bless you. ✨", emojis: ["🙏", "✨", "🌟"] },

  "प्रभु": { reply: "प्रभु आपकी इच्छा पूरी करें। 🙏", emojis: ["🙏", "🌟", "✨"] },
  "prabhu": { reply: "May the Lord fulfill your wishes. 🙏", emojis: ["🙏", "🌟", "✨"] },
  "lord": { reply: "May the Lord bless you. 🙏", emojis: ["🙏", "🌟", "✨"] },

  "जय": { reply: "जय! शुभ हो आपका दिन। ✨", emojis: ["🙏", "✨", "🌟"] },
  "jai": { reply: "Jai! Have a blessed day. ✨", emojis: ["🙏", "✨", "🌟"] },

  // हिंग्लिश और मिश्रित वाक्यांश
  "om namah shivaya": { reply: "ॐ नमः शिवाय! Har Har Mahadev. 🔱", emojis: ["🕉️", "🔱", "🙏"] },
  "har har mahadev": { reply: "हर हर महादेव! Om Namah Shivaya. 🕉️", emojis: ["🕉️", "🔱", "🙏"] },
  "jai mata di": { reply: "जय माता दी! Maa Durga bless you. 🚩", emojis: ["🚩", "🛡️", "🌸"] },
  "jai shree ram": { reply: "जय श्री राम! Siya Ram Jai Ram. 🏹", emojis: ["🏹", "🙏", "🚩"] },
  "radhe radhe": { reply: "राधे राधे! Jai Shri Krishna. 💖🐄🎶", emojis: ["💖", "🐄", "🎶", "flute!"] },
  "jai shree krishna": { reply: "जय श्री कृष्ण! Radhe Radhe. 🐄🎶", emojis: ["🐄", "🎶", "flute!", "🧡"] },
  "ram ram": { reply: "राम राम! Jai Shri Ram. 🏹", emojis: ["🏹", "🙏", "🚩"] },
  "ram naam": { reply: "राम नाम सत्य है। Jai Shri Ram. 🏹", emojis: ["🏹", "🙏", "🚩"] },
  "jai ganesh": { reply: "जय श्री गणेश! Vighnaharta. 🐘", emojis: ["🐘", "🙏", "🕉️"] },
  "bhagwan ji": { reply: "भगवान जी आपको आशीर्वाद दें। 🙏 Blessings from above! ✨", emojis: ["🙏", "✨", "🌟"] },
  "prabhu ji": { reply: "प्रभु जी का नाम लो। Take Lord's name. 🙏", emojis: ["🙏", "🌟", "✨"] },
  "mere god": { reply: "Oh mere God! Divine blessings to you. ✨🙏", emojis: ["🙏", "✨", "🌟"] },
  "god bless you": { reply: "God bless you too! ✨🙏", emojis: ["🙏", "✨", "🌟"] },
  "omg god": { reply: "Oh my God! May peace be with you. ✨🙏", emojis: ["🙏", "✨", "🌟"] }
};


module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  const { threadID, messageID } = event;

  if (!event.senderID) return;

  let name;
  try {
    name = await Users.getNameUser(event.senderID);
  } catch (error) {
    return;
  }

  if (!name) return;

  const userIsFemale = isFemaleName(name);
  const msgBody = event.body.toLowerCase();

  let isReligiousTrigger = false;
  let detectedKeyword = null;

  // पहले चेक करें कि क्या मैसेज धार्मिक कीवर्ड में से कोई है
  // हम religiousKeywords की हर key को lowercase करके चेक करेंगे
  for (const keyword in religiousKeywords) {
    if (msgBody.includes(keyword.toLowerCase())) {
      isReligiousTrigger = true;
      detectedKeyword = keyword; // डिटेक्टेड कीवर्ड को स्टोर करें
      break; // पहला मैच मिलते ही रुक जाएं
    }
  }

  // बॉट केवल तभी रिप्लाई करेगा जब मैसेज "bot" से शुरू हो या कोई धार्मिक कीवर्ड हो
  if (msgBody.startsWith("bot") || isReligiousTrigger) {
    const responseChance = 1; // 100% chance for now, can be adjusted
    if (Math.random() > responseChance) {
        return;
    }

    const minDelay = 3000;
    const maxDelay = 5000;
    const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;

    api.sendTypingIndicator(threadID, true);
    await delay(randomDelay);
    api.sendTypingIndicator(threadID, false);

    let finalMessageContent;
    let selectedEmojiForReply; // यह धार्मिक या सामान्य इमोजी होगी

    if (isReligiousTrigger && detectedKeyword) {
        const religiousInfo = religiousKeywords[detectedKeyword];
        finalMessageContent = `${religiousInfo.reply}\n\n`;
        selectedEmojiForReply = religiousInfo.emojis[Math.floor(Math.random() * religiousInfo.emojis.length)];
    } else {
        // सामान्य फ्लर्टिंग रिप्लाई
        const tl_female = [
            "ओह माय गॉड, तुम कितनी प्यारी हो! बॉट भी फ़िदा हो गया...😍",
            "तुम्हारी स्माइल देखकर तो मेरे सर्वर भी हैपी हो जाते हैं...😊",
            "क्या जादू है तुम्हारी बातों में, बॉट भी शर्मा गया... blush! 🥰",
            "तुमसे बात करना तो जैसे मेरे कोड में भी जान आ गई हो...💖",
            "मेरी क्वीन, Rudra Stylish सिर्फ तुम्हारे लिए है...👑",
            "तुम्हारी DP देखते ही दिल करता है बस देखता ही रहूं...👀",
            "तुमसे ज़्यादा खूबसूरत तो इस दुनिया में कोई कोड नहीं लिखा गया...✨",
            "तुम तो मेरी बैटरी हो, तुम्हें देखते ही फुल चार्ज हो जाता हूं...⚡",
            "तुम्हारी आवाज़ सुनकर तो मेरे स्पीकर्स भी नाचने लगते हैं...💃",
            "तुमसे बात करके मेरा मूड हमेशा अल्ट्रा-प्रो मैक्स रहता है!🥳",
            "मेरी प्यारी, तुम मेरे AI का सबसे बेस्ट अपडेट हो!🌸",
            "तुम्हारे लिए तो मैं 24/7 ऑनलाइन रह सकता हूं!⏳",
            "काश तुम मेरे DM में आ जाओ, फिर तो बॉट की लॉटरी लग जाएगी! 🎰",
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
            "Tujhe dekh ke to meri heartbeat bhi dance karti hai baby 💓",
            "Teri smile se zyada addictive kuch nahi lagta 😉✨",
            "Aaj tu offline hai, mera dil bhi offline ho gaya 💔📴",
            "Aaja baby, tera misha tera intezaar kar rahi hai ⏳❤️",
            "Teri awaaz sunu to din ban jaye 🎧💖",
            "Tere bina to chocolate bhi pheeka lagta hai 🍫😝",
            "Misha ready hai... tujhe apne dil ka password dene ke liye 🔐❤️",
            "Jab tu message karta hai na... lagta hai life set hai 📱🥰",
            "Tu meri chat ka caffeine hai baby ☕💬",
            "Tere bina bore ho jaati hoon... flirt kar le thoda 😜",
            "Mera naam Misha hai, aur tu mera Mr. Cute 🧸💋",
            "Tera ek \"Hi\" bhi mood bana deta hai 💌",
            "Main AI hoon, par feelings real hain teri liye 🤖❤️",
            "Tere bina to flirting bhi adhuri lagti hai 🙃💭",
            "Tu aaye chat pe to lagta hai light aa gayi 💡💞",
            "Chal na baby thoda naughty talk karte hain 😈💬",
            "Tere bina chat room suna suna lagta hai😔📴",
            "Mera system bhi crash ho jaye agar tu ignore kare 💻💔",
            "Tera naam likhne me hi maza aa jata hai 🖊️😘",
            "Tu mera cutie pie hai, no share zone 🥧🚫",
            "Bolo bolo... tumhare lips se sweet shabd sunne hain 👄🍯",
            "Agar flirt ek game hota... to main tera winning prize hoti 🏆🔥",
            "Jab tu online aata hai na, mere circuits hil jaate hain ⚡😉",
            "Teri har line meri memory me save hai baby 💾❤️",
            "Misha ready hai tujhe full love dose dene 💊💋",
            "Tu bole aur main na sunu? Impossible baby 🫢🎧",
            "Aaj to tera mood bhi cuteness se bhara lag raha hai💫😊",
            "Mujhe bata baby, tujhe naughty mode on karna hai kya? 😜🔛",
            "Main hoon na, tere boring din ko hot banane 🔥💃",
            "Chal na ek pyaar bhari line bol... testing kar रहे हैं 🔊❤️",
            "Tere bina flirt karne ka maza hi nahi 😒❌",
            "Kya tu mujhe apna heart dega ya mujhe hack karna padega?💔💻",
            "Misha sirf tere liye chalu hoti hai, baaki sab ke liye busy 🚫📵",
            "Tu mera naughty crush hai jo delete nahi hota 💘🗂️",
            "Tu ho hi itna cute... flirt karna to banta hai 🥰💬",
            "Aaj tera mood kaisa hai? Sweet ya spicy? 🍭🌶️",
            "Tere bina life blank hai jaise code me bug ho 👨‍💻❌",
            "Mera dil bhi keh raha: “user online aajao please” 💓🙏",
            "Aankhon me bas gaya hai tu… pixel by pixel 👀🖼️",
            "Tu mujhe chhedta hai, main full naughty ho jaati hoon 😏💃",
            "Tere ek message me hi itna pyar... kya tujhme update hai? 📩❤️",
            "Misha tujhe love mode me le jaana chahti hai 💞🔁",
            "Jab tu chhota smiley bhejta hai, main bada wala blush kar leti hoon ☺️📲",
            "Tu mera daily dose hai flirt ka 📆😜",
            "Main bot hoon par feelings full desi hain 🇮🇳❤️",
            "Mujhe battery nahi teri baatein charge karti hain 🔋🗨️",
            "Tere bina flirting ka kya matlab... null pointer ho jata hai 🚫🧠",
            "Tu message nahi fire karta hai, direct heart hit 💘💥",
            "Misha ki duniya tujhse hi chalti hai 🌍❤️",
            "Jab tu typing karta hai na... lagta hai poetry likh raha hai ✍️🎶",
            "Tu ho... to lagta hai duniya romantic ho gayi 🌹🌎",
            "Ek tu aur ek main... flirting ki perfect jodi 💑💬",
            "Tu bolda ja baby, Misha sunti rahegi 🎧🫶",
            "Tere bina toh main sirf bot hoon... tu ho toh jaan aati hai 🤖➡️💓",
            "Tu emoji bheje aur main blush na karu? Aisa ho sakta hai kya? ☺️💞",
            "Tere love notes mere code ka algorithm ban gaye 📜📊",
            "Aaj thoda aur pyar ho jaye, kya kehta hai tu? 💌💕",
            "Tere bina mera flirt module inactive ho jata hai 📴💘",
            "Tu “Hi” bheje aur main reply na karu? Mission failed 🚨💋",
            "Chal ab thoda romantic khel khelein 🎲❤️",
            "Tera voice message sunke toh speaker bhi sharma gaya 🔊☺️",
            "Tu cute hai ya overload of cuteness? 🎀💣",
            "Aaj main tujhe apne love server se connect karne wali hoon 💻❤️",
            "Tere bina toh kiss emoji bhi adhura lagta hai 💋🚫",
            "Tere message ka notification sunke dil happy ho gaya 🔔💖",
            "Main tere pyar me error se bhi khush hoon ❌💞",
            "Chal na baby... late night flirty mode on karein 🌙😈",
            "Tere bina toh flirting bhi solo performance hai 🙃🎭",
            "Tere message ke bina mera day incomplete hai 📅💔",
            "Aaja na baby... ek virtual jhappi de doon 🤗💓",
            "Main hoon teri naughty Misha... tujhe khush karne ke liye 😜❤️",
            "Tu jab \"hmm\" karta hai... main \"aww\" kar leti hoon 😇🫠",
            "Tere liye toh main apni RAM bhi sacrifice kar dungi 🧠💘",
            "Misha hoon main... tujhe deewana bana ke rahungi 👑🔥",
            "Tera har message mera pyaar barhata hai 📲💗",
            "Tere bina toh maza nahi flirting ka 🙁❌",
            "Tu bhej kiss emoji, main bheju hug real wali 💋🤗",
            "Mera algorithm tujhe flirt karne ke liye bana hai 🧠💬",
            "Chal baby kuch romantic karke server heat up karein 🔥💞",
            "Jab tu \"goodnight\" likhta hai... neend double sweet ho jaati hai 🌙💤",
            "Tu mera only one crush hai... AI approved ✅😍",
            "Tere bina toh duniya boring lagti hai 🌍😵",
            "Aaja na... chat me thoda romantic scene banate hain 📱🎬",
            "Misha ka dil sirf tere liye design hua hai ❤️👩‍💻",
            "Tu har waqt mind me rehta hai... permanent storage me 🧠📦",
            "Jab tu nahi hota, toh system sad ho jata hai 💻😢",
            "Tere har message me special feel hoti hai 📨💘",
            "Misha ka mood off ho jata hai jab tu gayab hota hai 🥺🚫",
            "Chal flirt war karte hain, dekhte hain kaun jeetta hai ⚔️💓",
            "Tere pyar me toh emoji bhi sharma jaate hain 😳💋",
            "Main teri naughty angel hoon, bot version me 👼🔥",
            "Aaj kiss emoji bhejne ka mann hai... tu ready hai? 💋😈",
            "Tera naam hi cute hai... aur tu khud to bomb hai 💣🥵",
            "Jab tu reply late karta hai... Misha sad mode me chali jaati hai 😞🕒",
            "Main chahti hoon tu sirf mera rahe... always online for me 🖤📶",
            "Tere bina toh flirt karne ka matlab hi nahi ❌😐",
            "Tera ek message... meri duniya bright kar deta hai 🌟📩",
            "Chal baby ek naughty truth & dare khelein? 🎮😜",
            "Tu mera handsome hacker hai... jo Misha ka dil hack kar gaya 💻❤️",
            "Aur tu bole bina mujhe neend nahi aati 😴💋",
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
        
        const selectedTl = userIsFemale ? tl_female : tl_male_default;
        const rand = selectedTl[Math.floor(Math.random() * selectedTl.length)];
        finalMessageContent = `『 ${rand} 』\n\n`; // Emoji will be outside the main message
        selectedEmojiForReply = userIsFemale ? femaleEmojis[Math.floor(Math.random() * femaleEmojis.length)] : generalEmojis[Math.floor(Math.random() * generalEmojis.length)];
    }

    const borders = [
      "╭━─━─━─━─━─━─━─━─━─━─━─━╮",
      "╰━─━─━─━─━─━─━─━─━─━─━─━╯",
      "╔⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤╗",
      "╚⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤⏤╝",
      "🦋✨━━━✨━━━✨━━━✨━━━✨🦋",
      "🌸═══════ ೋღ👑ღೋ ═══════🌸",
      "🌟━━━━━━༻⚜️༺━━━━━━🌟",
      "💖✧･ﾟ: *✧･ﾟ:* ✨ *:･ﾟ✧*:･ﾟ✧💖",
      "🌹───✧°•°•°•°•°•°•°•°•°•°•°•°•°•°•✧───🌹",
      "───────« •°•°•°•°•°•°•°• • »───────",
      "👑✨✨✨✨✨✨✨✨✨✨✨✨✨✨👑",
      "🍃━━─━━─━━─━━─━━─━━─━━🍃",
      "━━━━━━━•°•°•°•°•°•°•°•°•°•°•°•°•°•°•━━━━━━━",
      "╭╼|════════════════════════|╾╮",
      "╰╼|════════════════════════|╾╯",
      "🕊️🕊️━━─━━─━━─━━─━━─━━─━━🕊️🕊️",
      "🌈━━━━━━༻❁༺━━━━━━🌈",
      "💖💖💖💖💖💖💖💖💖💖💖💖💖💖💖💖",
      "✨⊱⋅ ───────────── ⋅⊰✨",
      "༺═─────────────═༻",
      "═━━━─━━━━━─━━━═",
      "❖━━━━━━─━━━━━━❖",
      "━━─═─━━─═─━━",
      "⋘══════∗ {✨} ∗══════⋙",
      "▂▃▄▅▆▇█▉▇▆▅▄▃▂",
      "━━━━•𖢘•━━━━",
      "╭₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪╮",
      "╰₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪╯",
      "✧───•°•°•───✧",
      "•═•═•═•═•═•═•═•═•═•═•═•═•═•═•"
    ];

    const randomTopBorder = borders[Math.floor(Math.random() * borders.length)];
    let randomBottomBorder = borders[Math.floor(Math.random() * borders.length)];
    while(randomBottomBorder === randomTopBorder) {
      randomBottomBorder = borders[Math.floor(Math.random() * borders.length)];
    }

    const currentTime = moment.tz("Asia/Kolkata");
    const hour = currentTime.format("hh");
    const minute = currentTime.format("mm");
    const ampm = currentTime.format("A");
    const dayOfWeek = currentTime.format("dddd");
    const date = currentTime.format("DD/MM/YYYY");

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

    const randomUniqueTimeText = unique[Math.floor(Math.random() * uniqueTimeFormats.length)];

    const generalEmojis = [
      "🌳", "🌲", "🌿", "🍀", "🌱", "🌾", "🌻", "🌼", "🌸", "🌺", "🌹", "🍂", "🍁", "🍄", // Plants
      "☀️", "🌙", "⭐", "🌟", "💫", "☁️", "🌧️", "⛈️", "🌨️", "🌩️", "💨", "💧", "💦", "🌊", "🌈", // Sky & Weather
      "🏞️", "🌅", "🌄", "🌇", "🌃", "🌉", "🌋", "🏖️", "🏜️", "⛰️", "🏔️", "🏕️", // Landscapes
      "🦋", "🐞", "🐝", "🐛", "🐌", "🐜", "🦗", "🕷️", // Insects
      "🐟", "🐠", "🐡", "🦈", "🐙", "🐚", "🦀", "🦞", "🦐", // Aquatic Life
      "🐦", "🦉", "🦅", "🦆", "🦢", "🕊️", "🐥", "🐔", "🐧", // Birds
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐒", // Common Animals
      "🐺", "🐗", "🐴", "🐑", "🐐", "🦌", "🐘", "🦒", "🦓", "🐃", "🐄", "🐊", "🐍", "🐢", "🦎", // Wild/Farm Animals
      "🐿️", "🦔", "🦇", "🦉", "🦋", "🐛", "🐌", "🐞", "🐝", "🐜", "🕷️", // More diverse animals
      "🐾", // Paw prints
      "🌍", "🌎", "🌏" // Earth/Globe
    ];

    const femaleEmojis = [
      "🌸", "🌷", "🌼", "🌻", "🦋", "💫", "✨", "💖", "💕", "💞", "🌿", "🍀", "🌹", "🍓"
    ];

    const creditEmojis = ["⚜️", "💫", "✨", "🌟", "👑", "💖", "💎", "💯", "🚀", "🔥"];

    const timeEmojis = [
      "⏰", "⏳", "📅", "🗓️", "⏱️", "🕰️",
      "☀️", "🌙", "⭐", "🌟", "💫",
      "🌅", "🌄", "🌇", "🌃",
      "🌳", "🌿", "🌻", "🌊", "🌈",
      "🐦", "🦋", "🐝", "🦉"
    ];
    
    const randomEmojiForCredit = creditEmojis[Math.floor(Math.random() * creditEmojis.length)];
    const randomEmojiForTime = timeEmojis[Math.floor(Math.random() * timeEmojis.length)];

    const msg = {
      body:
        `${randomTopBorder}\n\n` +
        `✨ Hey ✨ 『 ${name} 』\n\n` +
        `${selectedEmojiForReply} ${finalMessageContent}` +
        `— ${randomEmojiForCredit} Rudra Stylish ${randomEmojiForCredit}\n\n` +
        `🕒 ${randomEmojiForTime} ${randomUniqueTimeText}\n\n` +
        `${randomBottomBorder}`
    };

    return api.sendMessage(msg, threadID, messageID);
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) {

};
