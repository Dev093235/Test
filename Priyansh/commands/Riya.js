// Riya AI Companion - UID Specific Behavior + Code Generation + Song Sending
const axios = require("axios");
const fs = require("fs");
const ytdl = require("ytdl-core");
const { downloadFBVideo } = require("priyansh-fb-downloader");
const { downloadIGVideo } = require("priyansh-ig-downloader");
const scdl = require("soundcloud-downloader");
const yts = require('yt-search');


// User name cache to avoid fetching name repeatedly
const userNameCache = {};
let hornyMode = false; // Default mode

// === SET YOUR OWNER UID HERE ===
// महत्वपूर्ण: अपना Facebook UID यहां अपडेट करें!
const ownerUID = "61550558518720"; // <-- अपना UID यहां डालें
// ==============================

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

// Function to get a GIF from Giphy API
async function getGIF(query) {
    const giphyApiKey = "dc6zaTOxFJmzC"; // Giphy's public beta key
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

// Song Download Functions
async function downloadYTSong(url) {
    try {
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
        const fileName = `song_${Date.now()}.mp3`;
        const filePath = `./${fileName}`;
        
        await new Promise((resolve, reject) => {
            stream.pipe(fs.createWriteStream(filePath))
                .on('finish', resolve)
                .on('error', reject);
        });
        return filePath;
    } catch (error) {
        console.error("YT Download Error:", error);
        return null;
    }
}

async function downloadFBSong(url) {
    try {
        const videoPath = await downloadFBVideo(url);
        return videoPath;
    } catch (error) {
        console.error("FB Download Error:", error);
        return null;
    }
}

async function downloadIGSong(url) {
    try {
        const videoPath = await downloadIGVideo(url);
        return videoPath;
    } catch (error) {
        console.error("IG Download Error:", error);
        return null;
    }
}

async function downloadSCSong(url) {
    try {
        const stream = await scdl.download(url);
        const fileName = `sc_song_${Date.now()}.mp3`;
        const filePath = `./${fileName}`;
        
        await new Promise((resolve, reject) => {
            stream.pipe(fs.createWriteStream(filePath))
                .on('finish', resolve)
                .on('error', reject);
        });
        return filePath;
    } catch (error) {
        console.error("SC Download Error:", error);
        return null;
    }
}

module.exports.config = {
    name: "Riya",
    version: "2.7.0", // Updated version for song search and "riya song" command
    hasPermssion: 0,
    credits: "Rudra + API from Angel code + Song Feature by Priyansh",
    description: "Riya with song sending capability",
    commandCategory: "AI-Companion",
    usages: "Riya [message] / Riya play [song-url or song-name] / Riya song [song-name]", // Updated usage
    cooldowns: 2,
};

const chatHistories = {};
const AI_API_URL = "https://rudra-here.onrender.com";

async function getUserName(api, userID) {
    if (userNameCache[userID]) return userNameCache[userID];
    try {
        const userInfo = await api.getUserInfo(userID);
        if (userInfo && userInfo[userID]?.name) {
            userNameCache[userID] = userInfo[userID].name;
            return userInfo[userID].name;
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
    return userID === ownerUID ? "boss" : "yaar";
}

async function toggleHornyMode(body, senderID) {
    if (body.toLowerCase().includes("horny mode on")) {
        hornyMode = true;
        return "Alright, horny mode's ON. Let's get naughty and wild! 😈🔥";
    } else if (body.toLowerCase().includes("horny mode off")) {
        hornyMode = false;
        return "Okay, switching back to our usual charming style. 😉";
    }
    return null;
}

module.exports.handleEvent = async function ({ api, event }) {
    try {
        const { threadID, messageID, senderID, body, messageReply } = event;

        // Normalize song command input: check for "riya play" or "riya song"
        let songCommandMatch = body?.toLowerCase().match(/^(riya play|riya song)\s*(.*)/);

        if (songCommandMatch) {
            const queryOrUrl = songCommandMatch[2]?.trim(); // Get the part after "riya play" or "riya song"
            if (!queryOrUrl) {
                return api.sendMessage("Boss, song ka link ya naam bhejo! 😅", threadID, messageID);
            }

            api.sendTypingIndicator(threadID, true);
            const userName = await getUserName(api, senderID);
            let songPath = null;
            let finalSongUrl = queryOrUrl; // Assume it's a URL first

            // Check if it's a direct URL or a search query
            if (!queryOrUrl.includes("http://") && !queryOrUrl.includes("https://")) {
                // It's a search query, try to find on YouTube
                try {
                    api.sendMessage(`Searching for "${queryOrUrl}" on YouTube...`, threadID);
                    const r = await yts(queryOrUrl);
                    const videos = r.videos;
                    if (videos.length > 0) {
                        finalSongUrl = videos[0].url; // Get the URL of the first result
                        api.sendMessage(`Found "${videos[0].title}". Downloading...`, threadID);
                    } else {
                        return api.sendMessage(`Sorry, "${queryOrUrl}" naam ka koi gaana YouTube pe nahi mila. 😕`, threadID, messageID);
                    }
                } catch (searchError) {
                    console.error("Youtube Error:", searchError);
                    return api.sendMessage("YouTube par gaana dhoondhne mein dikkat ho gayi. 😢", threadID, messageID);
                }
            }
            
            // Now proceed with download based on the finalSongUrl
            // Note: The logic for youtube.com/0 or youtube.com/1 is specific to your previous code's behavior for direct YT links.
            // For general YouTube URLs, ytdl-core should work directly.
            if (finalSongUrl.includes("youtube.com") || finalSongUrl.includes("youtu.be")) {
                songPath = await downloadYTSong(finalSongUrl);
            } else if (finalSongUrl.includes("facebook.com")) {
                songPath = await downloadFBSong(finalSongUrl);
            } else if (finalSongUrl.includes("instagram.com")) {
                songPath = await downloadIGSong(finalSongUrl);
            } else if (finalSongUrl.includes("soundcloud.com")) {
                songPath = await downloadSCSong(finalSongUrl);
            } else {
                return api.sendMessage("Invalid link or unrecognized platform! Only YouTube/FB/IG/SoundCloud supported, ya fir YouTube par naam se search kar sakte ho. 😕", threadID, messageID);
            }

            if (!songPath) {
                return api.sendMessage("Error downloading song. Server issue ho gaya ya link sahi nahi hai! 😢", threadID, messageID);
            }

            api.sendMessage({
                body: `🎵 Here's your song, ${userName}!`,
                attachment: fs.createReadStream(songPath)
            }, threadID, () => fs.unlinkSync(songPath));
            return; // Exit function after handling song request
        }

        // Rest of the Riya AI functionality
        const isRiyaTrigger = body?.toLowerCase().startsWith("riya");
        const isReplyToRiya = messageReply?.senderID === api.getCurrentUserID();
        if (!(isRiyaTrigger || isReplyToRiya)) return;

        let userMessageRaw = isRiyaTrigger ? body.slice(4).trim() : body.trim();
        let userMessageForAI;
        let isExplicitCodeRequest = false;

        if (userMessageRaw.toLowerCase().startsWith("code ")) {
            isExplicitCodeRequest = true;
            userMessageForAI = userMessageRaw.slice(5).trim();
            
            if (senderID !== ownerUID) {
                const userName = await getUserName(api, senderID);
                return api.sendMessage(
                    `माफ़ करना ${userName}, यह कोड जनरेशन कमांड केवल मेरे Boss (${await getUserName(api, ownerUID)}) के लिए है। 😉`,
                    threadID,
                    messageID
                );
            }

            if (!userMessageForAI) {
                return api.sendMessage("क्या कोड चाहिए? 'Riya code [आपका प्रॉम्प्ट]' ऐसे लिखो।", threadID, messageID);
            }
        } else {
            userMessageForAI = userMessageRaw;
        }

        const userName = await getUserName(api, senderID);
        let responseText = await toggleHornyMode(body, senderID);
        if (responseText) {
            return api.sendMessage(responseText, threadID, messageID);
        }

        if (!userMessageRaw) {
            if (senderID === ownerUID) {
                return api.sendMessage(`Hey Boss ${userName}! Kya hukm hai mere ${userName}? 🥰`, threadID, messageID);
            } else {
                return api.sendMessage(`Hello ${userName}. Bolo kya kaam hai? 😉`, threadID, messageID);
            }
        }

        api.sendTypingIndicator(threadID, true);

        if (!isExplicitCodeRequest) {
            if (!chatHistories[senderID]) chatHistories[senderID] = [];
            chatHistories[senderID].push(`User: ${userMessageForAI}`);
            while (chatHistories[senderID].length > 10) {
                chatHistories[senderID].shift();
            }
        }

        const boldTriggerWords = ["sexy", "honeymoon", "chut", "kiss", "nude"];
        const isBoldMode = !isExplicitCodeRequest && boldTriggerWords.some(word => userMessageForAI.toLowerCase().includes(word));

        let promptToSendToProxy = "";
        const basePromptInstructions = `Apne jawab hamesha casual, smart, charming aur **sirf 3-4 lines mein hi dena (lekin agar code generate karna pade, toh answer lamba ho sakta hai)**.`;

        if (isExplicitCodeRequest) {
            promptToSendToProxy = `CODE_GEN_REQUEST: ${userMessageForAI}`;
        } else if (senderID === ownerUID) {
            if (isBoldMode || hornyMode) {
                 promptToSendToProxy = `Tum Riya ho, ek bold, naughty, modern aur ultra seductive AI companion ho...`;
            } else {
                 promptToSendToProxy = `Tum Riya ho, ek smart, cool, modern, romantic aur flirty AI companion ho...`;
            }
            promptToSendToProxy += chatHistories[senderID].join("\n") + `\nRiya:`;
        } else {
            if (isBoldMode || hornyMode) {
                 promptToSendToProxy = `Tum Riya ho, ek bold, naughty aur modern AI ho...`;
            } else {
                promptToSendToProxy = `Tum Riya ho, ek smart, cool aur modern AI ho...`;
            }
            promptToSendToProxy += chatHistories[senderID].join("\n") + `\nRiya:`;
        }

        try {
            const res = await axios.post(AI_API_URL, { prompt: promptToSendToProxy });
            let botReply = res.data?.text?.trim();

            if (!botReply || botReply.toLowerCase().startsWith("user:") || botReply.toLowerCase().startsWith("riya:")) {
                 if (senderID === ownerUID) {
                     botReply = `Oops, Boss ${userName}, lagta hai samajh nahi aaya... Kuch aur try karte hain cool? 🤔`;
                 } else {
                     botReply = `Jo bola samajh nahi aaya. Dhang se bolo. 🙄`;
                 }
                if (!isExplicitCodeRequest) {
                    chatHistories[senderID].pop();
                }
            } else {
                 const lines = botReply.split('\n').filter(line => line.trim() !== '');
                 if (!isExplicitCodeRequest && lines.length > 4 && !botReply.includes('```')) {
                     botReply = lines.slice(0, 4).join('\n') + '...';
                 }
                if (!isExplicitCodeRequest) {
                    chatHistories[senderID].push(`Riya: ${botReply}`);
                }
            }

            let voiceFilePath = await getVoiceReply(botReply);
            if (voiceFilePath) {
                api.sendMessage({ attachment: fs.createReadStream(voiceFilePath) }, threadID, (err) => {
                    if (err) console.error("Error sending voice message:", err);
                    fs.unlinkSync(voiceFilePath);
                });
            }

            if (!isExplicitCodeRequest) {
                let gifUrl = await getGIF("charming and fun");
                 if (gifUrl) {
                     api.sendMessage({ attachment: await axios.get(gifUrl, { responseType: 'stream' }).then(res => res.data) }, threadID);
                 }
            }

            let replyText = "";
            if (isExplicitCodeRequest) {
                replyText = botReply; 
            } else if (senderID === ownerUID) {
                if (isBoldMode || hornyMode) {
                     replyText = `${botReply} 😉🔥💋\n\n_Your charmingly naughty Riya... 😉_`;
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

            if (isReplyToRiya && messageReply) {
                return api.sendMessage(replyText, threadID, messageReply.messageID);
            } else {
                return api.sendMessage(replyText, threadID, messageID);
            }

        } catch (apiError) {
            console.error("Riya AI API Error:", apiError);
            if (senderID === ownerUID) {
                 return api.sendMessage(`Ugh, API mein kuch glitch hai Boss ${userName}... Thodi der mein try karte hain cool? 😎`, threadID, messageID);
            } else {
                 return api.sendMessage(`Server down hai. Baad mein aana. 😒`, threadID, messageID);
            }
        }

    } catch (err) {
        console.error("Riya Bot Catch-all Error:", err);
        const fallbackUserName = event.senderID ? await getUserName(api, event.senderID) : "yaar";
        if (event.senderID === ownerUID) {
             return api.sendMessage(`Argh, mere system mein kuch problem aa gayi Boss ${fallbackUserName}! Baad mein baat karte hain... 😅`, event.threadID, event.messageID);
         } else {
             return api.sendMessage(`Chhodho yaar, meri mood off ho gaya. 😠`, event.threadID, event.messageID);
         }
    }
};
