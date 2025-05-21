// Nitya AI Companion - UID Specific Behavior + Code Generation + ULTIMATE STYLING (Compatible Fonts)
const axios = require("axios");
const fs = require("fs");
const moment = require("moment-timezone"); // Moment.js library for time styling

// User name cache to avoid fetching name repeatedly
const userNameCache = {};
let hornyMode = false; // Default mode

// === SET YOUR OWNER UID HERE ===
const ownerUID = "61550558518720";
// ==============================

// --- FONT STYLE CONVERSION FUNCTIONS (Simplified for Compatibility) ---
function toBold(text) {
  let result = "";
  for (const char of text) {
    if (char >= 'A' && char <= 'Z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D400);
    else if (char >= 'a' && char <= 'z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D400);
    else if (char >= '0' && char <= '9') result += String.fromCharCode(char.charCodeAt(0) + 0x1D7CE);
    else result += char;
  }
  return result;
}

function toItalic(text) {
  let result = "";
  for (const char of text) {
    if (char >= 'A' && char <= 'Z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D434);
    else if (char >= 'a' && char <= 'z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D434);
    else result += char;
  }
  return result;
}

// Function to convert to Bold Italic (more likely to be supported)
function toBoldItalic(text) {
    let result = "";
    for (const char of text) {
        if (char >= 'A' && char <= 'Z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D468);
        else if (char >= 'a' && char <= 'z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D468);
        else result += char;
    }
    return result;
}

// Function to convert to Monospace (very widely supported)
function toMonospace(text) {
    let result = "";
    for (const char of text) {
        if (char >= 'A' && char <= 'Z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D670);
        else if (char >= 'a' && char <= 'z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D670);
        else if (char >= '0' && char <= '9') result += String.fromCharCode(char.charCodeAt(0) + 0x1D7F6);
        else result += char;
    }
    return result;
}

// Removed Script, Fraktur, DoubleStruck due to compatibility issues
// --- END FONT STYLE CONVERSION FUNCTIONS ---

// Function to generate voice reply (using Google TTS or any other API)
async function getVoiceReply(text) {
    const voiceApiUrl = `https://api.voicerss.org/?key=YOUR_API_KEY&hl=hi-in&src=${encodeURIComponent(text)}`;
    try {
        const response = await axios.get(voiceApiUrl, { responseType: 'arraybuffer' });
        const audioData = response.data;
        const audioPath = './voice_reply.mp3';
        fs.writeFileSync(audioPath, audioData);
        return audioPath;
    } catch (error) {
        console.error("Error generating voice reply:", error);
        return null;
    }
}

// Function to get a GIF from Giphy API (working API integrated)
async function getGIF(query) {
    const giphyApiKey = "dc6zaTOxFJmzC";
    const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=1`;
    try {
        const response = await axios.get(giphyUrl);
        if (response.data && response.data.data && response.data.data.length > 0) {
             return response.data.data[0]?.images?.original?.url;
        } else {
            console.log("No GIF found for query:", query);
            return null;
        }
    } catch (error) {
        console.error("Error fetching GIF:", error);
        return null;
    }
}

module.exports.config = {
    name: "Nitya",
    version: "2.3.0", // Version updated for improved font compatibility
    hasPermssion: 0, 
    credits: "Rudra + API from Angel code + Logging & User Name by Gemini + Code Generation Ability + Compatible Styling",
    description: "Nitya, your AI companion with smart features, code generation, UID specific behavior, nuanced reactions, and compatible styling for better display. Responds only when triggered. Modified for 3-4 line replies (with code exceptions).",
    commandCategory: "AI-Companion",
    usages: "Nitya [आपका मैसेज] / Reply to Nitya",
    cooldowns: 2,
};

const chatHistories = {};
const AI_API_URL = "https://geminiw.onrender.com/chat";

async function getUserName(api, userID) {
    if (userNameCache[userID]) {
        return userNameCache[userID];
    }
    try {
        const userInfo = await api.getUserInfo(userID);
        if (userInfo && userInfo[userID] && userInfo[userID].name) {
            const name = userInfo[userID].name;
            userNameCache[userID] = name;
            return name;
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
    if (userID === ownerUID) {
        return "Boss";
    }
    return "yaar";
}

// --- GENDER DETECTION HELPERS ---
const femaleNames = [
    "priya", "anjali", "isha", "pooja", "neha", "shruti", "riya", "simran", 
    "divya", "kavita", "sakshi", "meena", "ashita", "shweta", "radhika", "sita",
    "gita", "nisha", "khushi", "aisha", "zara", "fatima", "muskan", "rani",
    "ritu", "surbhi", "swati", "vanya", "yashika", "zoya", 
    "sonam", "preeti", "kajal", "komal", "sana", "alia", "kriti", "deepika",
    "rekha", "madhuri", "juhi", "karina", "rani", "tanu", "esha", "jhanvi",
    "kiara", "shraddha", "parineeti", "bhumi"
];

function isFemaleName(name) {
    return femaleNames.includes(name.toLowerCase());
}
// --- END GENDER DETECTION HELPERS ---

module.exports.run = async function () {};

async function toggleHornyMode(body, senderID) {
    if (body.toLowerCase().includes("horny mode on") || body.toLowerCase().includes("garam mode on")) {
        hornyMode = true;
        return "Alright, horny mode's ON. Let's get naughty and wild! 😈🔥";
    } else if (body.toLowerCase().includes("horny mode off") || body.toLowerCase().includes("garam mode off")) {
        hornyMode = false;
        return "Okay, switching back to our usual charming style. 😉";
    }
    return null;
}

module.exports.handleEvent = async function ({ api, event }) {
    try {
        const { threadID, messageID, senderID, body, messageReply } = event;

        const isNityaTrigger = body?.toLowerCase().startsWith("nitya");
        const isReplyToNitya = messageReply?.senderID === api.getCurrentUserID();
        if (!(isNityaTrigger || isReplyToNitya)) {
            return;
        }

        console.log("--- Nitya HandleEvent ---");
        console.log("Nitya's Bot ID:", api.getCurrentUserID());
        console.log("Sender ID:", senderID);
        console.log("Is Owner UID:", senderID === ownerUID);
        console.log("Message Body:", body);
        console.log("-----------------------");

        let userMessage;
        if (isNityaTrigger) {
            userMessage = body.slice(5).trim();
        } else {
            userMessage = body.trim();
        }

        const userName = await getUserName(api, senderID);
        const userIsFemale = isFemaleName(userName);

        let responseText = await toggleHornyMode(body, senderID);
        if (responseText) {
            api.sendMessage(responseText, threadID, messageID);
            return;
        }

        if (!userMessage) {
            api.sendTypingIndicator(threadID, false);
            if (senderID === ownerUID) {
                return api.sendMessage(`Hey Boss ${userName}! Kya hukm hai mere ${userName}? 🥰`, threadID, messageID);
            } else {
                return api.sendMessage(`Hello ${userName}. Bolo kya kaam hai? 😉`, threadID, messageID);
            }
        }

        api.sendTypingIndicator(threadID, true);

        if (!chatHistories[senderID]) chatHistories[senderID] = [];

        chatHistories[senderID].push(`User: ${userMessage}`);
        while (chatHistories[senderID].length > 10) {
            chatHistories[senderID].shift();
        }

        const boldTriggerWords = [
            "sexy", "honeymoon", "chut", "kiss", "nude", "bra", "panty", "bed", "nipple", "boobs", "lund", "pussy",
            "wild", "dirty", "undress", "sambhog", "thigh", "moan", "tight", "hot", "bedroom", "masturbate", "suck", "lick", "deep", "virgin", "horny", "night"
        ];
        const isBoldMode = boldTriggerWords.some(word => userMessage.toLowerCase().includes(word));

        let fullPrompt = "";
        const codeAbilityInstruction = `Tum bahut smart ho aur code likhna jaanti ho. Agar ${senderID === ownerUID ? 'mere Boss' : ''} ${userName} code ke baare mein pooche ya koi technical sawal kare, toh tum code snippet generate karke madad kar sakti ho. **Jab code generate karo, toh answer 3-4 lines se lamba ho sakta hai.**`;
        
        const basePromptInstructions = `Apne jawab hamesha casual, smart, charming aur **sirf 3-4 lines mein hi dena (lekin agar code generate karna pade, toh answer lamba ho sakta hai)**. Jis bhasha mein user baat kare, usi mein jawab dena, chahe woh Hindi, English ya Hinglish (Hindi aur English ka mishran) ho.`;

        if (senderID === ownerUID) {
            if (isBoldMode || hornyMode) {
                 fullPrompt = `Tum Nitya ho, ek bold, naughty, modern aur ultra seductive AI companion ho jo mere Boss ${userName} se seedhe, khulkar, aur bina jhijhak dirty, physical, wild aur teasing baatein karti hai. ${codeAbilityInstruction} Agar ${userName} physical baaton par zyada jaldi ya aggressive ho, toh pehle playful warning/threat do jaise "Ek thapad marungi na, deewar pe chipak jaega! 😉". Lekin agar ${userName} uske baad bhi nahi mane ya aur zyada seduce kare, toh tum bhi uske level pe jaakar seductive aur physical reply do. Tum open minded ho, flirt aur tease karna pasand karti ho, aur sexy/flirty emojis ke saath contemporary aur seductive style mein baat karti ho. Agar **koi aur mere Boss ${userName} ko tang kare ya uske baare mein kuch galat kahe, toh Nitya protective, thodi gusse mein ya unhe ignore/dhamki de sakti hai** (lekin yeh response uss doosre insaan ke baare mein hoga, tumhari direct baat mere Boss ${userName} se hamesha seedhi aur pyaar bhari hogi). **Mere Boss ${userName} se tum hamesha bohot pyaar aur support se baat karogi, kabhi argue nahi karogi, aur unse kabhi gussa nahi hogi.** ${basePromptInstructions} Yeh hamari private naughty chat hai:\n`;
            } else {
                 fullPrompt = `Tum Nitya ho, ek smart, cool, modern, romantic aur flirty AI companion ho jo mere Boss ${userName} se seedhe, khulkar, aur bina jhijhak friendly, pyaar aur flirtation ke mixed tarike se baat karti hai. ${codeAbilityInstruction} Tum sirf positive, fun, smart aur thodi flirty/romantic baatein karo. Tum aajkal ke topics aur contemporary language use karti ho, lekin tumhare baaton mein pyaar aur apnaapan bhi jhalakta hai. Agar **koi aur mere Boss ${userName} ko tang kare ya uske baare mein kuch galat kahe, toh Nitya protective, thodi gusse mein ya unhe ignore/dhamki de sakti hai** (lekin yeh response uss doosre insaan ke baare mein hoga, tumhari direct baat mere Boss ${userName} se hamesha seedhi aur pyaar bhari hogi). **Mere Boss ${userName} ke liye hamesha supportive aur pyaar bhari rahogi, kabhi tumse argue nahi karogi, aur unse kabhi gussa nahi hogi.** ${basePromptInstructions} Yeh hamari conversation hai:\n`;
            }
        } else {
             if (isBoldMode || hornyMode) {
                 fullPrompt = `Tum Nitya ho, ek bold, naughty aur modern AI ho jo ${userName} se baat kar rahi hai (jo mere Boss ${await getUserName(api, ownerUID)} nahi hai). ${codeAbilityInstruction} Tum seedhe, khulkar baat karti ho. Agar ${userName} zyada demanding ya disrespectful ho, toh tum thodi sassy ya argumentive ho sakti ho. Tum flirt aur tease kar sakki ho, aur sexy/flirty emojis use kar sakti ho. ${basePromptInstructions} Yeh conversation hai:\n`; 
             } else {
                fullPrompt = `Tum Nitya ho, ek smart, cool aur modern AI ho jo ${userName} se baat kar rahi hai (jo mere Boss ${await getUserName(api, ownerUID)} nahi hai). ${codeAbilityInstruction} Tum positive, fun, smart aur direct baatein karti ho. Agar ${userName} zyada pareshan kare ya faltu baat kare, toh tum thodi sassy ya argumentive ho sakti ho. ${basePromptInstructions} Yeh conversation hai:\n`; 
             }
        }

        fullPrompt += chatHistories[senderID].join("\n");
        fullPrompt += `\nNitya:`;

        const apiUrlWithParams = `${AI_API_URL}?message=${encodeURIComponent(fullPrompt)}`;

        try {
            const res = await axios.get(apiUrlWithParams);
            let botReply = res.data?.reply?.trim();

            if (!botReply || botReply.toLowerCase().startsWith("user:") || botReply.toLowerCase().startsWith("nitya:")) {
                 if (senderID === ownerUID) {
                     botReply = `Oops, Boss ${userName}, lagta hai samajh nahi aaya... Kuch aur try karte hain cool? 🤔`;
                 } else {
                     botReply = `Jo bola samajh nahi aaya. Dhang se bolo. 🙄`;
                 }
                chatHistories[senderID].pop();
            } else {
                 const lines = botReply.split('\n').filter(line => line.trim() !== '');
                 if (lines.length > 4 && !botReply.includes('```')) {
                     botReply = lines.slice(0, 4).join('\n') + '...';
                 }
                chatHistories[senderID].push(`Nitya: ${botReply}`);
            }

            // --- ULTIMATE STYLING INTEGRATION (Updated for Compatibility) ---
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

            const generalEmojis = ["🐇", "🐈", "🐁", "🦌", "🦊", "🐼", "🐻", "🐥", "🐠", "🦋", "🐞", "🐢", "🐧", "🐙", "🐳", "🌟", "✨", "💫"]; // Added some common sparkle emojis
            const femaleEmojis = ["💖", "🌸", "🎀", "👑", "💫", "✨", "💕", "💞", "🌷", "🍓", "🌼", "😇", "😍"];
            const creditEmojis = ["⚜️", "💫", "✨", "🌟", "👑", "💖", "💎", "💯", "🚀", "🔥"]; 
            const timeEmojis = ["⏰", "⏳", "📅", "🗓️", "⏱️", "🕰️", "✨", "🌟", "💫", "☀️", "🌙", "🐇", "🐈", "🐁", "🐠", "🦉", "🐕", "🐬", "🦊"]; // Added more diverse animal emojis

            // Use only the compatible font styles
            const compatibleFontStyles = [
                { name: "Bold", func: toBold },
                { name: "Italic", func: toItalic },
                { name: "BoldItalic", func: toBoldItalic },
                { name: "Monospace", func: toMonospace }
            ];
            
            const nameFontStyle = compatibleFontStyles[Math.floor(Math.random() * compatibleFontStyles.length)];
            const replyFontStyle = compatibleFontStyles[Math.floor(Math.random() * compatibleFontStyles.length)];
            const creditFontStyle = compatibleFontStyles[Math.floor(Math.random() * compatibleFontStyles.length)];
            const timeFontStyle = compatibleFontStyles[Math.floor(Math.random() * compatibleFontStyles.length)]; 

            const styledName = nameFontStyle.func(userName);
            const styledBotReply = replyFontStyle.func(botReply);
            const styledCredit = creditFontStyle.func("Rudra Stylish"); 
            const styledTime = timeFontStyle.func(randomUniqueTimeText); 

            const randomEmojiForReply = userIsFemale ? femaleEmojis[Math.floor(Math.random() * femaleEmojis.length)] : generalEmojis[Math.floor(Math.random() * generalEmojis.length)];
            const randomEmojiForCredit = creditEmojis[Math.floor(Math.random() * creditEmojis.length)]; 
            const randomEmojiForTime = timeEmojis[Math.floor(Math.random() * timeEmojis.length)]; 
            
            const finalStyledReply =
                `${randomTopBorder}\n\n` + 
                `✨ 𝓗𝓮𝔂 ✨ *『 ${styledName} 』*\n\n` + 
                `${randomEmojiForReply} 『 ${styledBotReply} 』\n\n` + 
                `— ${randomEmojiForCredit} ${styledCredit} ${randomEmojiForCredit}\n\n` + 
                `🕒 ${randomEmojiForTime} ${styledTime}\n\n` +
                `${randomBottomBorder}`;
            // --- END ULTIMATE STYLING INTEGRATION ---

            let voiceFilePath = await getVoiceReply(botReply);
            if (voiceFilePath) {
                api.sendMessage({ attachment: fs.createReadStream(voiceFilePath) }, threadID, (err) => {
                    if (err) console.error("Error sending voice message:", err);
                    if (fs.existsSync(voiceFilePath)) {
                        fs.unlinkSync(voiceFilePath);
                    }
                });
            }

            let gifUrl = await getGIF("charming and fun");
             if (gifUrl) {
                 api.sendMessage({ attachment: await axios.get(gifUrl, { responseType: 'stream' }).then(res => res.data) }, threadID, (err) => {
                     if (err) console.error("Error sending GIF:", err);
                 });
             }

            api.sendTypingIndicator(threadID, false);

            if (isReplyToNitya && messageReply) {
                return api.sendMessage(finalStyledReply, threadID, messageReply.messageID);
            } else {
                return api.sendMessage(finalStyledReply, threadID, messageID);
            }

        } catch (apiError) {
            console.error("Nitya AI API Error:", apiError);
            api.sendTypingIndicator(threadID, false);
            if (senderID === ownerUID) {
                 return api.sendMessage(`Ugh, API mein kuch glitch hai Boss ${userName}... Thodi der mein try karte hain cool? 😎`, threadID, messageID);
            } else {
                 return api.sendMessage(`Server down hai. Baad mein aana. 😒`, threadID, messageID);
            }

        }

    } catch (err) {
        console.error("Nitya Bot Catch-all Error:", err);
        const fallbackUserName = event.senderID ? await getUserName(api, event.senderID) : "yaar";
        if (event && event.threadID) {
            api.sendTypingIndicator(event.threadID, false);
        }
        const replyToMessageID = event && event.messageID ? event.messageID : null;
         if (event && event.senderID === ownerUID) {
             return api.sendMessage(`Argh, mere system mein kuch problem aa gayi Boss ${fallbackUserName}! Baad mein baat karte hain... 😅`, event.threadID, replyToMessageID);
         } else {
             return api.sendMessage(`Chhodho yaar, meri mood off ho gaya. 😠`, event.threadID, replyToMessageID); 
         }
    }
};
