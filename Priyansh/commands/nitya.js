// Nitya AI Companion - Google Gemini AI Integration (Simplified for Debugging)
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Gemini AI library

// User name cache taaki baar-baar naam fetch na karna pade
const userNameCache = {};
let hornyMode = false; // Bot ka default mode

// === YAHAN APNA OWNER UID SET KAREN ===
const ownerUID = "61550558518720"; // <-- Apne asli UID se badalna na bhulein!
// ==============================

// Google Gemini AI से response lene ka function (Simplified Prompting)
async function getAIResponse(userMessage, senderID, userName, isBoldMode, hornyMode, api) {
    console.log("DEBUG: getAIResponse function mein pravesh.");
    let genAI;
    const GEMINI_API_KEY = "AIzaSyDEjHbxMDw8xSlA2Zd7YiWNhKQTEu8jVDA"; // <<<--- आपकी API Key यहां डाली गई है

    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_ACTUAL_GEMINI_API_KEY_HERE") {
        console.warn("GEMINI_API_KEY set nahi hai ya default value hai. Google Gemini AI available nahi hoga.");
        return null;
    }

    try {
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        console.log("DEBUG: Google Gemini AI client successfully initialize ho gaya.");
    } catch (error) {
        console.error("DEBUG: Google Gemini AI client initialize karne mein error aaya:", error);
        return null;
    }

    // प्रॉम्प्ट को बहुत सरल किया गया है
    let systemPromptContent = `Tum Nitya ho, ek helpful AI assistant. User se uski bhasha mein jawab do.`;

    try {
        console.log("DEBUG: Calling genAI.getGenerativeModel...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro", systemInstruction: systemPromptContent });
        console.log("DEBUG: Model fetched. Calling chat.sendMessage...");

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
        console.log("DEBUG: chat.sendMessage successful. Getting response text...");
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("DEBUG: Google Gemini AI response lene mein error aaya:", error);
        return null;
    }
}

module.exports.config = {
    name: "nitya",
    version: "2.1.0",
    hasPermssion: 0,
    credits: "Rudra + API from Angel code + Advanced Prompting & History by Gemini",
    description: "Nitya, tumhari AI companion jo smart hai. Simple response deti hai.",
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

        const isBoldMode = false;

        let botReply = "";
        if (userMessage) {
            console.log("DEBUG: Calling getAIResponse with user message.");
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
                    chatHistories[senderID].push(`Nitya: ${botReply}`);
                }

            } else {
                console.log("DEBUG: getAIResponse returned null or undefined.");
                if (senderID === ownerUID) {
                    botReply = `Boss ${userName}, Google Gemini AI abhi respond nahi kar pa raha hai. Kya aapko kuch aur chahiye?`;
                } else {
                    botReply = `${userName}, Google Gemini AI abhi busy hai. Kuch simple pucho.`;
                }
                 chatHistories[senderID].pop();
            }
        } else {
            console.log("DEBUG: userMessage is empty, providing static fallback.");
            if (senderID === ownerUID) {
                botReply = `Boss ${userName}, Google Gemini AI abhi active nahi hai. Koi aur command try karo?`;
            } else {
                botReply = `${userName}, main abhi AI mode mein nahi hoon. Kuch simple pucho.`;
            }
            chatHistories[senderID].pop();
        }

        // Voice reply और GIF भेजने वाला कोड हटा दिया गया है
        // let voiceFilePath = await getVoiceReply(botReply);
        // if (voiceFilePath) {
        //     api.sendMessage({ attachment: fs.createReadStream(voiceFilePath) }, threadID, (err) => {
        //         if (err) console.error("Voice message bhejane mein error aaya:", err);
        //         if (fs.existsSync(voiceFilePath)) {
        //             fs.unlinkSync(voiceFilePath);
        //         }
        //     });
        // }

        // let gifUrl = await getGIF("charming and fun");
        // if (gifUrl) {
        //     api.sendMessage({ attachment: await axios.get(gifUrl, { responseType: 'stream' }).then(res => res.data) }, threadID, (err) => {
        //         if (err) console.error("GIF bhejane mein error aaya:", err);
        //     });
        // }

        let replyText = botReply;
        
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
