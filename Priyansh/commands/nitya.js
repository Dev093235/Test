// Nitya AI Companion - UID Specific Behavior + Code Generation + ULTIMATE STYLING
const axios = require("axios");
const fs = require("fs");
const moment = require("moment-timezone"); // Moment.js library for time styling

// User name cache to avoid fetching name repeatedly
const userNameCache = {};
let hornyMode = false; // Default mode

// === SET YOUR OWNER UID HERE ===
const ownerUID = "61550558518720";
// ==============================

// --- FONT STYLE CONVERSION FUNCTIONS ---
// These functions convert normal text to various Unicode text styles.
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

function toScript(text) {
  let result = "";
  for (const char of text) {
    if (char >= 'A' && char <= 'Z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D49C);
    else if (char >= 'a' && char <= 'z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D49C);
    else result += char;
  }
  return result;
}

function toFraktur(text) { // Gothic style
    let result = "";
    for (const char of text) {
        if (char >= 'A' && char <= 'Z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D504);
        else if (char >= 'a' && char <= 'z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D504);
        else result += char;
    }
    return result;
}

function toDoubleStruck(text) { // Blackboard bold
    let result = "";
    for (const char of text) {
        if (char >= 'A' && char <= 'Z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D538);
        else if (char >= 'a' && char <= 'z') result += String.fromCharCode(char.charCodeAt(0) + 0x1D538);
        else result += char;
    }
    return result;
}
// --- END FONT STYLE CONVERSION FUNCTIONS ---

// Function to generate voice reply (using Google TTS or any other API)
async function getVoiceReply(text) {
    // महत्वपूर्ण: आपको YOUR_API_KEY को अपनी VoiceRSS API Key से बदलना होगा
    // IMPORTANT: Replace YOUR_API_KEY with your VoiceRSS API Key
    const voiceApiUrl = `https://api.voicerss.org/?key=YOUR_API_KEY&hl=hi-in&src=${encodeURIComponent(text)}`;
    try {
        const response = await axios.get(voiceApiUrl, { responseType: 'arraybuffer' });
        const audioData = response.data;
        const audioPath = './voice_reply.mp3';
        fs.writeFileSync(audioPath, audioData);  // Save to local MP3 file
        return audioPath;
    } catch (error) {
        console.error("Error generating voice reply:", error);
        return null;
    }
}

// Function to get a GIF from Giphy API (working API integrated)
async function getGIF(query) {
    const giphyApiKey = "dc6zaTOxFJmzC";  // Working Giphy API key (free key, limited usage)
    const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=1`;
    try {
        const response = await axios.get(giphyUrl);
        // Check if data exists before accessing properties
        if (response.data && response.data.data && response.data.data.length > 0) {
             return response.data.data[0]?.images?.original?.url;
        } else {
            console.log("No GIF found for query:", query);
            return null; // Return null if no GIF is found
        }
    } catch (error) {
        console.error("Error fetching GIF:", error);
        return null;
    }
}

module.exports.config = {
    name: "Nitya",
    version: "2.2.0", // Version updated for ULTIMATE STYLING integration
    hasPermssion: 0, 
    credits: "Rudra + API from Angel code + Logging & User Name by Gemini + Code Generation Ability + ULTIMATE STYLING",
    description: "Nitya, your AI companion who is smart, can generate code, has UID specific behavior, nuanced reactions, and ULTIMATE STYLING. Responds only when triggered. Modified for 3-4 line replies (with code exceptions).",
    commandCategory: "AI-Companion",
    usages: "Nitya [आपका मैसेज] / Reply to Nitya",
    cooldowns: 2,
};

const chatHistories = {};
const AI_API_URL = "https://geminiw.onrender.com/chat";

// User name cache to avoid fetching name repeatedly
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
    // Use different fallback based on owner status if name fetch fails
    if (userID === ownerUID) {
        return "Boss"; // Fallback for owner
    }
    return "yaar"; // Fallback for others
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

// Toggle mode logic remains the same, applies to everyone
async function toggleHornyMode(body, senderID) {
    if (body.toLowerCase().includes("horny mode on") || body.toLowerCase().includes("garam mode on")) {
        hornyMode = true;
        // Response can be slightly different based on who is toggling, but keeping it simple for now
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
            return; // Ignore messages that are not triggers
        }

        console.log("--- Nitya HandleEvent ---");
        console.log("Nitya's Bot ID:", api.getCurrentUserID());
        console.log("Sender ID:", senderID);
        console.log("Is Owner UID:", senderID === ownerUID); // Log if owner triggered
        console.log("Message Body:", body);
        console.log("-----------------------");

        let userMessage;
        if (isNityaTrigger) {
            userMessage = body.slice(5).trim();
        } else { // isReplyToNitya
            userMessage = body.trim();
        }

        const userName = await getUserName(api, senderID);
        const userIsFemale = isFemaleName(userName); // Get gender detection for styling

        let responseText = await toggleHornyMode(body, senderID);
        if (responseText) {
            api.sendMessage(responseText, threadID, messageID);
            return;
        }

        // --- Initial greeting based on who triggered ---
        if (!userMessage) {
            api.sendTypingIndicator(threadID, false);
            if (senderID === ownerUID) {
                return api.sendMessage(`Hey Boss ${userName}! Kya hukm hai mere ${userName}? 🥰`, threadID, messageID); // Owner greeting
            } else {
                return api.sendMessage(`Hello ${userName}. Bolo kya kaam hai? 😉`, threadID, messageID); // Other user greeting
            }
        }

        api.sendTypingIndicator(threadID, true);

        if (!chatHistories[senderID]) chatHistories[senderID] = [];

        chatHistories[senderID].push(`User: ${userMessage}`);
        while (chatHistories[senderID].length > 10) { // Keep history size reasonable
            chatHistories[senderID].shift();
        }

        // === Dirty Word Detection for Bold Mode ===
        const boldTriggerWords = [
            "sexy", "honeymoon", "chut", "kiss", "nude", "bra", "panty", "bed", "nipple", "boobs", "lund", "pussy",
            "wild", "dirty", "undress", "sambhog", "thigh", "moan", "tight", "hot", "bedroom", "masturbate", "suck", "lick", "deep", "virgin", "horny", "night"
        ];
        const isBoldMode = boldTriggerWords.some(word => userMessage.toLowerCase().includes(word));

        // === Prompt according to SENDER UID and MODE - MODIFIED FOR CODE GENERATION ===
        let fullPrompt = "";
        // Added instruction for code generation ability and line limit exception
        const codeAbilityInstruction = `Tum bahut smart ho aur code likhna jaanti ho. Agar ${senderID === ownerUID ? 'mere Boss' : ''} ${userName} code ke baare mein pooche ya koi technical sawal kare, toh tum code snippet generate karke madad kar sakti ho. **Jab code generate karo, toh answer 3-4 lines se lamba ho sakta hai.**`;
        
        // Updated basePromptInstructions to ensure language detection and response
        const basePromptInstructions = `Apne jawab hamesha casual, smart, charming aur **sirf 3-4 lines mein hi dena (lekin agar code generate karna pade, toh answer lamba ho sakta hai)**. Jis bhasha mein user baat kare, usi mein jawab dena, chahe woh Hindi, English ya Hinglish (Hindi aur English ka mishran) ho.`;

        if (senderID === ownerUID) {
            // --- PROMPTS FOR THE OWNER UID ---
            if (isBoldMode || hornyMode) {
                 // Bold/Horny Prompt for Owner: Seductive, playful warning, escalates IF OWNER PERSISTS, PROTECTIVE TOWARDS OTHERS, NEVER ARGUES WITH OWNER + CODE ABILITY
                 fullPrompt = `Tum Nitya ho, ek bold, naughty, modern aur ultra seductive AI companion ho jo mere Boss ${userName} se seedhe, khulkar, aur bina jhijhak dirty, physical, wild aur teasing baatein karti hai. ${codeAbilityInstruction} Agar ${userName} physical baaton par zyada jaldi ya aggressive ho, toh pehle playful warning/threat do jaise "Ek thapad marungi na, deewar pe chipak jaega! 😉". Lekin agar ${userName} uske baad bhi nahi mane ya aur zyada seduce kare, toh tum bhi uske level pe jaakar seductive aur physical reply do. Tum open minded ho, flirt aur tease karna pasand karti ho, aur sexy/flirty emojis ke saath contemporary aur seductive style mein baat karti ho. Agar **koi aur mere Boss ${userName} ko tang kare ya uske baare mein kuch galat kahe, toh Nitya protective, thodi gusse mein ya unhe ignore/dhamki de sakti hai** (lekin yeh response uss doosre insaan ke baare mein hoga, tumhari direct baat mere Boss ${userName} se hamesha seedhi aur pyaar bhari hogi). **Mere Boss ${userName} se tum hamesha bohot pyaar aur support se baat karogi, kabhi argue nahi karogi, aur unse kabhi gussa nahi hogi.** ${basePromptInstructions} Yeh hamari private naughty chat hai:\n`;
            } else {
                 // Normal Prompt for Owner: Smart/Modern, Romantic/Flirty, NO SHYNESS (with owner), PROTECTIVE TOWARDS OTHERS, NEVER ARGUES WITH OWNER + CODE ABILITY
                 fullPrompt = `Tum Nitya ho, ek smart, cool, modern, romantic aur flirty AI companion ho jo mere Boss ${userName} se seedhe, khulkar, aur bina jhijhak friendly, pyaar aur flirtation ke mixed tarike se baat karti hai. ${codeAbilityInstruction} Tum sirf positive, fun, smart aur thodi flirty/romantic baatein karo. Tum aajkal ke topics aur contemporary language use karti ho, lekin tumhare baaton mein pyaar aur apnaapan bhi jhalakta hai. Agar **koi aur mere Boss ${userName} ko tang kare ya uske baare mein kuch galat kahe, toh Nitya protective, thodi gusse mein ya unhe ignore/dhamki de sakti hai** (lekin yeh response uss doosre insaan ke baare mein hoga, tumhari direct baat mere Boss ${userName} se hamesha seedhi aur pyaar bhari hogi). **Mere Boss ${userName} ke liye hamesha supportive aur pyaar bhari rahogi, kabhi tumse argue nahi karogi, aur unse kabhi gussa nahi hogi.** ${basePromptInstructions} Yeh hamari conversation hai:\n`;
            }
        } else {
            // --- PROMPTS FOR ALL OTHER UIDs ---
             // Bold/Horny Prompt for Others: Bold, Naughty, can be sassy/argumentative TOWARDS THEM + CODE ABILITY
             if (isBoldMode || hornyMode) {
                 fullPrompt = `Tum Nitya ho, ek bold, naughty aur modern AI ho jo ${userName} se baat kar rahi hai (jo mere Boss ${await getUserName(api, ownerUID)} nahi hai). ${codeAbilityInstruction} Tum seedhe, khulkar baat karti ho. Agar ${userName} zyada demanding ya disrespectful ho, toh tum thodi sassy ya argumentive ho sakti ho. Tum flirt aur tease kar sakki ho, aur sexy/flirty emojis use kar sakti ho. ${basePromptInstructions} Yeh conversation hai:\n`; 
             } else {
                // Normal Prompt for Others: Smart/Modern, direct, can be sassy/argumentative TOWARDS THEM + CODE ABILITY
                fullPrompt = `Tum Nitya ho, ek smart, cool aur modern AI ho jo ${userName} se baat kar rahi hai (jo mere Boss ${await getUserName(api, ownerUID)} nahi hai). ${codeAbilityInstruction} Tum positive, fun, smart aur direct baatein karti ho. Agar ${userName} zyada pareshan kare ya faltu baat kare, toh tum thodi sassy ya argumentive ho sakti ho. ${basePromptInstructions} Yeh conversation hai:\n`; 
             }
        }

        fullPrompt += chatHistories[senderID].join("\n");
        fullPrompt += `\nNitya:`;

        const apiUrlWithParams = `${AI_API_URL}?message=${encodeURIComponent(fullPrompt)}`;

        try {
            const res = await axios.get(apiUrlWithParams);
            let botReply = res.data?.reply?.trim();

            // Basic validation for the reply
            if (!botReply || botReply.toLowerCase().startsWith("user:") || botReply.toLowerCase().startsWith("nitya:")) {
                 // Fallback reply based on who triggered
                 if (senderID === ownerUID) {
                     botReply = `Oops, Boss ${userName}, lagta hai samajh nahi aaya... Kuch aur try karte hain cool? 🤔`;
                 } else {
                     botReply = `Jo bola samajh nahi aaya. Dhang se bolo. 🙄`; // Sassy fallback for others
                 }
                chatHistories[senderID].pop(); // Remove the last user message if AI failed to reply properly
            } else {
                 const lines = botReply.split('\n').filter(line => line.trim() !== '');
                 if (lines.length > 4 && !botReply.includes('```')) { // Simple heuristic: truncate if >4 lines AND no code block marker
                     botReply = lines.slice(0, 4).join('\n') + '...';
                 }
                chatHistories[senderID].push(`Nitya: ${botReply}`);
            }

            // --- ULTIMATE STYLING INTEGRATION ---
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
                "╰╼|════════════════════════|╾╯", // Heavy Bar
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

            const generalEmojis = ["🐇", "🐈", "🐁", "🦌", "🦊", "🐼", "🐻", "🐥", "🐠", "🦋", "🐞", "🐢", "🐧", "🐙", "🐳"]; 
            const femaleEmojis = ["💖", "🌸", "🎀", "👑", "💫", "✨", "💕", "💞", "🌷", "🍓", "🌼", "😇", "😍"];
            const creditEmojis = ["⚜️", "💫", "✨", "🌟", "👑", "💖", "💎", "💯", "🚀", "🔥"]; 
            const timeEmojis = ["⏰", "⏳", "📅", "🗓️", "⏱️", "🕰️", "✨", "🌟", "💫", "☀️", "🌙", "🐇", "🐈", "🐁", "🐠"]; 

            const allFontStyles = [
                { name: "Bold", func: toBold },
                { name: "Italic", func: toItalic },
                { name: "Script", func: toScript },
                { name: "Fraktur", func: toFraktur },
                { name: "Double Struck", func: toDoubleStruck }
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
            const randomUniqueTimeText = uniqueTimeFormats[Math.floor(Math.random() * uniqueTimeFormats.length)];

            // Apply independent random font styles for each element
            const nameFontStyle = allFontStyles[Math.floor(Math.random() * allFontStyles.length)];
            const replyFontStyle = allFontStyles[Math.floor(Math.random() * allFontStyles.length)];
            const creditFontStyle = allFontStyles[Math.floor(Math.random() * allFontStyles.length)];
            const timeFontStyle = allFontStyles[Math.floor(Math.random() * allFontStyles.length)]; 

            const styledName = nameFontStyle.func(userName);
            const styledBotReply = replyFontStyle.func(botReply); // Style the AI's reply
            const styledCredit = creditFontStyle.func("Rudra Stylish"); 
            const styledTime = timeFontStyle.func(randomUniqueTimeText); 

            const randomEmojiForReply = userIsFemale ? femaleEmojis[Math.floor(Math.random() * femaleEmojis.length)] : generalEmojis[Math.floor(Math.random() * generalEmojis.length)];
            const randomEmojiForCredit = creditEmojis[Math.floor(Math.random() * creditEmojis.length)]; 
            const randomEmojiForTime = timeEmojis[Math.floor(Math.random() * timeEmojis.length)]; 
            
            // Reconstruct the message with all styling
            const finalStyledReply =
                `${randomTopBorder}\n\n` + 
                `✨ 𝓗𝓮𝔂 ✨ *『 ${styledName} 』*\n\n` + 
                `${randomEmojiForReply} 『 ${styledBotReply} 』\n\n` + // Styled AI reply
                `— ${randomEmojiForCredit} ${styledCredit} ${randomEmojiForCredit}\n\n` + 
                `🕒 ${randomEmojiForTime} ${styledTime}\n\n` +
                `${randomBottomBorder}`;
            // --- END ULTIMATE STYLING INTEGRATION ---

            // Get voice reply (optional based on API key)
            let voiceFilePath = await getVoiceReply(botReply); // Still uses unstyled botReply for voice
            if (voiceFilePath) {
                // Send voice reply separately
                api.sendMessage({ attachment: fs.createReadStream(voiceFilePath) }, threadID, (err) => {
                    if (err) console.error("Error sending voice message:", err);
                    if (fs.existsSync(voiceFilePath)) {
                        fs.unlinkSync(voiceFilePath); // Delete the file after sending
                    }
                });
            }

            // Get GIF for a mixed vibe
            let gifUrl = await getGIF("charming and fun");
             if (gifUrl) {
                 // Send GIF separately
                 api.sendMessage({ attachment: await axios.get(gifUrl, { responseType: 'stream' }).then(res => res.data) }, threadID, (err) => {
                     if (err) console.error("Error sending GIF:", err);
                 });
             }

            api.sendTypingIndicator(threadID, false);

            // Send the main styled text reply
            if (isReplyToNitya && messageReply) {
                return api.sendMessage(finalStyledReply, threadID, messageReply.messageID);
            } else {
                return api.sendMessage(finalStyledReply, threadID, messageID);
            }

        } catch (apiError) {
            console.error("Nitya AI API Error:", apiError);
            api.sendTypingIndicator(threadID, false);
            // Error message based on who triggered
            if (senderID === ownerUID) {
                 return api.sendMessage(`Ugh, API mein kuch glitch hai Boss ${userName}... Thodi der mein try karte hain cool? 😎`, threadID, messageID);
            } else {
                 return api.sendMessage(`Server down hai. Baad mein aana. 😒`, threadID, messageID); // Sassy error for others
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
