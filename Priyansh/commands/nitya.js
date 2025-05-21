// Nitya AI Companion - Google Gemini AI Integration with Advanced Prompting & History
const axios = require("axios");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Gemini AI library

// User name cache taaki baar-baar naam fetch na karna pade
const userNameCache = {};
let hornyMode = false; // Bot ka default mode

// === YAHAN APNA OWNER UID SET KAREN ===
const ownerUID = "61550558518720"; // <-- Apne asli UID se badalna na bhulein!
// ==============================

// Google Gemini AI Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Yeh key GitHub Secrets se aayegi

let genAI = null;
if (GEMINI_API_KEY) {
    try {
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        console.log("Google Gemini AI client successfully initialize ho gaya.");
    } catch (error) {
        console.error("Google Gemini AI client initialize karne mein error aaya:", error);
    }
} else {
    console.warn("GEMINI_API_KEY environment variable set nahi hai. Google Gemini AI available nahi hoga.");
}

// Voice reply generate karne ka function (VoiceRSS API use karke)
async function getVoiceReply(text) {
    // IMPORTANT: VoiceRSS API Key ko yahan apne asli key se badalna na bhulein!
    // Agar aap VoiceRSS use kar rahe hain toh apni key daalein, warna yeh line blank chhodein.
    // 'hl=hi-in' Hindi-India ke liye hai. Agar aapko language detection voice mein bhi chahiye toh VoiceRSS documentation check karein.
    const voiceApiUrl = `https://api.voicerss.org/?key=YOUR_VOICERSS_API_KEY&hl=hi-in&src=${encodeURIComponent(text)}`; // <-- Apni VoiceRSS key yahan daalein!
    try {
        const response = await axios.get(voiceApiUrl, { responseType: 'arraybuffer' });
        const audioData = response.data;
        const audioPath = './voice_reply.mp3';
        fs.writeFileSync(audioPath, audioData);
        return audioPath;
    } catch (error) {
        console.error("Voice reply generate karne mein error aaya:", error);
        return null;
    }
}

// Giphy API se GIF lene ka function
async function getGIF(query) {
    const giphyApiKey = "dc6zaTOxFJmzC";  // Giphy ki public API key (limited usage)
    const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=1`;
    try {
        const response = await axios.get(giphyUrl);
        if (response.data && response.data.data && response.data.data.length > 0) {
             return response.data.data[0]?.images?.original?.url;
        } else {
            console.log("Is query ke liye koi GIF nahi mila:", query);
            return null;
        }
    } catch (error) {
        console.error("GIF fetch karne mein error aaya:", error);
        return null;
    }
}

// Google Gemini AI से response lene ka function (Ab complex prompting aur Hinglish handle karta hai)
async function getAIResponse(userMessage, senderID, userName, isBoldMode, hornyMode, api) {
    if (!genAI) {
        console.warn("Google Gemini AI client initialize nahi hua hai ya API key missing hai.");
        return null;
    }

    let systemPromptContent = "";
    const codeAbilityInstruction = `Tum bahut smart ho aur code likhna jaanti ho. Agar ${senderID === ownerUID ? 'mere Boss' : ''} ${userName} code ke baare mein pooche ya koi technical sawal kare, toh tum code snippet generate karke madad kar sakti ho. Jab code generate karo, toh answer 3-4 lines se lamba ho sakta hai.`;
    // Hinglish support ke liye yeh line adjust ki gayi hai:
    const basePromptInstructions = `Apne jawab hamesha casual, smart, charming aur sirf 3-4 lines mein hi dena (lekin agar code generate karna pade, toh answer lamba ho sakta hai). Jis bhasha mein user baat kare, usi mein jawab dena, chahe woh Hindi, English ya Hinglish (Hindi aur English ka mishran) ho.`;

    if (senderID === ownerUID) {
        if (isBoldMode || hornyMode) {
            systemPromptContent = `Tum Nitya ho, ek bold, naughty, modern aur ultra seductive AI companion ho jo mere Boss ${userName} se seedhe, khulkar, aur bina jhijhak dirty, physical, wild aur teasing baatein karti hai. ${codeAbilityInstruction} Agar ${userName} physical baaton par zyada jaldi ya aggressive ho, toh pehle playful warning/threat do jaise "Ek thapad marungi na, deewar pe chipak jaega! 😉". Lekhi agar ${userName} uske baad bhi nahi mane ya aur zyada seduce kare, toh toh tum bhi uske level pe jaakar seductive aur physical reply do. Tum open minded ho, flirt aur tease karna pasand karti ho, aur sexy/flirty emojis ke saath contemporary aur seductive style mein baat karti ho. Agar koi aur mere Boss ${await getUserName(api, ownerUID)} ko tang kare ya uske baare mein kuch galat kahe, toh Nitya protective, thodi gusse mein ya unhe ignore/dhamki de sakti hai (lekin yeh response uss doosre insaan ke baare mein hoga, tumhari direct baat mere Boss ${userName} se hamesha seedhi aur pyaar bhari hogi). Mere Boss ${userName} se tum hamesha bohot pyaar aur support se baat karogi, kabhi argue nahi karogi, aur unse kabhi gussa nahi hogi. ${basePromptInstructions}`;
        } else {
            systemPromptContent = `Tum Nitya ho, ek smart, cool, modern, romantic aur flirty AI companion ho jo mere Boss ${userName} se seedhe, khulkar, aur bina jhijhak friendly, pyaar aur flirtation ke mixed tarike se baat karti hai. ${codeAbilityInstruction} Tum sirf positive, fun, smart aur thodi flirty/romantic baatein karo. Tum aajkal ke topics aur contemporary language use karti ho, lekin tumhare baaton mein pyaar aur apnaapan bhi jhalakta hai. Agar koi aur mere Boss ${await getUserName(api, ownerUID)} ko tang kare ya uske baare mein kuch galat kahe, toh Nitya protective, thodi gusse mein ya unhe ignore/dhamki de sakti hai (lekin yeh response uss doosre insaan ke baare mein hoga, tumhari direct baat mere Boss ${userName} se hamesha seedhi aur pyaar bhari hogi). Mere Boss ${userName} ke liye hamesha supportive aur pyaar bhari rahogi, kabhi tumse argue nahi karogi, aur unse kabhi gussa nahi hogi. ${basePromptInstructions}`;
        }
    } else {
        // Prompts for all other UIDs
        if (isBoldMode || hornyMode) {
            systemPromptContent = `Tum Nitya ho, ek bold, naughty aur modern AI ho jo ${userName} se baat kar rahi hai (jo mere Boss ${await getUserName(api, ownerUID)} nahi hai). ${codeAbilityInstruction} Tum seedhe, khulkar baat karti ho. Agar ${userName} zyada demanding ya disrespectful ho, toh tum thodi sassy ya argumentive ho sakti ho. Tum flirt aur tease kar sakti ho, aur sexy/flirty emojis use kar sakti ho. ${basePromptInstructions}`;
        } else {
            systemPromptContent = `Tum Nitya ho, ek smart, cool aur modern AI ho jo ${userName} se baat kar rahi hai (jo mere Boss ${await getUserName(api, ownerUID)} nahi hai). ${codeAbilityInstruction} Tum seedhe, khulkar baat karti ho. Tum positive, fun, smart aur direct baatein karti ho. Agar ${userName} zyada pareshan kare ya faltu baat kare, toh tum thodi sassy ya argumentive ho sakti ho. ${basePromptInstructions}`;
        }
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" }); // <-- Yahan model ka naam badla gaya hai
        const chat = model.startChat({
            history: chatHistories[senderID].map(msg => {
                if (msg.startsWith("User:")) return { role: "user", parts: [{ text: msg.substring(5).trim() }] };
                if (msg.startsWith("Nitya:")) return { role: "model", parts: [{ text: msg.substring(6).trim() }] };
                return { role: "user", parts: [{ text: msg }] };
            }),
            generationConfig: {
                maxOutputTokens: 200,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Google Gemini AI response lene mein error aaya:", error);
        return null;
    }
}

module.exports.config = {
    name: "nitya", // <--- यहाँ कमांड का नाम 'nitya' है
    version: "2.1.0",
    hasPermssion: 0,
    credits: "Rudra + API from Angel code + Advanced Prompting & History by Gemini",
    description: "Nitya, tumhari AI companion jo smart hai, code generate kar sakti hai, UID specific behaviour hai, aur nuanced reactions deti hai. Sirf trigger hone par respond karti hai. 3-4 line replies ke liye modify kiya gaya hai (code exceptions ke saath).",
    commandCategory: "AI-Companion",
    usages: "Nitya [आपका मैसेज] / Nitya ko reply do",
    cooldowns: 2,
};

const chatHistories = {};

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
        console.error("User info fetch karne mein error aaya:", error);
    }
    if (userID === ownerUID) {
        return "Boss";
    }
    return "yaar";
}

module.exports.run = async function () {};

async function toggleHornyMode(body) {
    if (body.toLowerCase().includes("horny mode on") || body.toLowerCase().includes("garam mode on")) {
        hornyMode = true;
        return "Alright, horny mode ON ho gaya. Chalo naughty aur wild ban jaate hain! 😈🔥";
    } else if (body.toLowerCase().includes("horny mode off") || body.toLowerCase().includes("garam mode off")) {
        hornyMode = false;
        return "Okay, apne usual charming style par wapas aa gaye. 😉";
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
        console.log("Nitya ki Bot ID:", api.getCurrentUserID());
        console.log("Sender ID:", senderID);
        console.log("Owner UID hai:", senderID === ownerUID);
        console.log("Message Body:", body);
        console.log("-----------------------");

        let userMessage;
        if (isNityaTrigger) {
            userMessage = body.slice(5).trim();
        } else {
            userMessage = body.trim();
        }

        const userName = await getUserName(api, senderID);

        let responseText = await toggleHornyMode(body);
        if (responseText) {
            api.sendMessage(responseText, threadID, messageID);
            return;
        }

        if (!userMessage) {
            api.sendTypingIndicator(threadID);
            if (senderID === ownerUID) {
                return api.sendMessage(`Hey Boss ${userName}! Kya hukm hai mere ${userName}? 🥰`, threadID, messageID);
            } else {
                return api.sendMessage(`Hello ${userName}. Bolo kya kaam hai? 😉`, threadID, messageID);
            }
        }

        api.sendTypingIndicator(threadID);

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

        let botReply = "";
        if (genAI && userMessage) { // Changed from openai to genAI
            const aiResponse = await getAIResponse(userMessage, senderID, userName, isBoldMode, hornyMode, api);
            if (aiResponse) {
                botReply = aiResponse;

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

            } else {
                if (senderID === ownerUID) {
                    botReply = `Boss ${userName}, Google Gemini AI abhi respond nahi kar pa raha hai. Kya aapko kuch aur chahiye?`;
                } else {
                    botReply = `${userName}, Google Gemini AI abhi busy hai. Kuch simple pucho.`;
                }
                 chatHistories[senderID].pop();
            }
        } else {
            if (senderID === ownerUID) {
                botReply = `Boss ${userName}, Google Gemini AI abhi active nahi hai. Koi aur command try karo?`;
            } else {
                botReply = `${userName}, main abhi AI mode mein nahi hoon. Kuch simple pucho.`;
            }
            chatHistories[senderID].pop();

            if (userMessage.toLowerCase().includes("kaise ho")) {
                botReply = "Main theek hoon, tum kaise ho?";
            } else if (userMessage.toLowerCase().includes("kya kar rahe ho")) {
                botReply = "Main bas online hoon, tumse baat kar raha hoon.";
            } else if (userMessage.toLowerCase().includes("thank you") || userMessage.toLowerCase().includes("shukriya")) {
                botReply = "Koi baat nahi, anytime! 😊";
            } else if (userMessage.toLowerCase().includes("hi") || userMessage.toLowerCase().includes("hello")) {
                botReply = `Hello ${userName}!`;
            } else if (userMessage.toLowerCase().includes("bye") || userMessage.toLowerCase().includes("alvida")) {
                botReply = `Bye ${userName}! Phir milte hain.`;
            } else if (userMessage.toLowerCase().includes("kon ho tum") || userMessage.toLowerCase().includes("who are you")) {
                botReply = "Main Nitya hoon, Priyansh dwara banaya gaya ek AI companion.";
            } else if (userMessage.toLowerCase().includes("kya naam hai") || userMessage.toLowerCase().includes("what's your name")) {
                botReply = "Mera naam Nitya hai.";
            }
        }

        let voiceFilePath = await getVoiceReply(botReply);
        if (voiceFilePath) {
            api.sendMessage({ attachment: fs.createReadStream(voiceFilePath) }, threadID, (err) => {
                if (err) console.error("Voice message bhejane mein error aaya:", err);
                if (fs.existsSync(voiceFilePath)) {
                    fs.unlinkSync(voiceFilePath);
                }
            });
        }

        let gifUrl = await getGIF("charming and fun");
        if (gifUrl) {
            api.sendMessage({ attachment: await axios.get(gifUrl, { responseType: 'stream' }).then(res => res.data) }, threadID, (err) => {
                if (err) console.error("GIF bhejane mein error aaya:", err);
            });
        }

        let replyText = "";
        if (senderID === ownerUID) {
            if (isBoldMode || hornyMode) {
                 replyText = `${botReply} 😉🔥💋\n\n_Tumhari charmingly naughty Nitya... 😉_`;
            } else {
                 replyText = `${botReply} 😊💖✨`;
            }
        } else {
             if (isBoldMode || hornyMode) {
                  replyText = `${botReply} 😏`;
             } else {
                  replyText = `${botReply} 🤔`;
             }
        }

        api.sendTypingIndicator(threadID, false);

        if (isReplyToNitya && messageReply) {
            return api.sendMessage(replyText, threadID, messageReply.messageID);
        } else {
            return api.sendMessage(replyText, threadID, messageID);
        }

    } catch (err) {
        console.error("Nitya Bot Catch-all Error:", err);
        const fallbackUserName = event.senderID ? await getUserName(api, event.senderID) : "yaar";
        if (event && event.threadID) {
            api.sendTypingIndicator(event.threadID, false);
        }
        const replyToMessageID = event && event.messageID ? event.messageID : null;
        if (event && event.senderID === ownerUID) {
            return api.sendMessage(`Argh, mere system mein kuch problem aa gayi Boss ${fallbackUserName}! Baad mein baat karte hain cool? 😅`, event.threadID, replyToMessageID);
        } else {
            return api.sendMessage(`Chhodho yaar, meri mood off ho gaya. 😠`, event.threadID, replyToMessageID);
        }
    }
};
