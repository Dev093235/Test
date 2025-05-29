// Rudra.js - Enhanced Interactive Flow with Owner-Only Control, Multiple UIDs, and Interactive Hater Name
const axios = require("axios");

// --- CONSTANTS और GLOBAL VARIABLES ---
const RENDER_API_URL = 'https://rudra-multi-convo.onrender.com/api/facebook-action'; // <-- आपके Render सर्वर का URL

// ****** यहाँ आपको ये मान सेट करने होंगे! ******
const OWNER_FACEBOOK_UID = '61550558518720'; // <--- आपकी Facebook UID यहाँ सेट की गई है!
// (DEFAULT_HATER_NAME की अब ज़रूरत नहीं क्योंकि यह पूछा जाएगा)
// ********************************************

// सक्रिय Rudra टास्क को स्टोर करने के लिए एक ऑब्जेक्ट
const activeRudraTasks = {};

// यूजर की बातचीत की स्थिति को स्टोर करने के लिए (केवल मालिक के लिए)
const userConversationState = {};
/*
Structure:
userConversationState = {
    "senderID": { // This senderID MUST be OWNER_FACEBOOK_UID
        command: "rudra_start",
        step: "waiting_for_mentions" | "waiting_for_token" | "waiting_for_inbox_uids" | "waiting_for_hater_name" | "waiting_for_time_seconds",
        data: {
            allMentionedUsers: [], // [{id, username}] for bot's messages
            primaryMentionedUser: {id, username}, // for activeRudraTasks key
            token: null,
            allTargetInboxUids: [], // Array of UIDs to send to server
            haterName: null, // New field for hater name
            timeSeconds: null
        }
    }
}
*/

// --- Function to get Mentionable Name/ID for Facebook ---
async function getMentionableUserString(api, userID) {
    try {
        const userInfo = await api.getUserInfo(userID);
        if (userInfo && userInfo[userID] && userInfo[userID].name) {
            return userInfo[userID].name;
        }
    } catch (error) {
        console.error("Error fetching mentionable user info:", error);
    }
    return null;
}

// --- नया फ़ंक्शन: बार-बार मैसेज भेजने के लिए (मल्टीपल मेंशन के साथ) ---
async function sendRepeatedRudraMessage(api, threadID, messageContent, allMentionedUsers) {
    let fullMessageBody = messageContent;
    let mentionsArray = [];

    if (allMentionedUsers && allMentionedUsers.length > 0) {
        let mentionTags = [];
        allMentionedUsers.forEach(user => {
            mentionTags.push(`@${user.username}`);
        });

        fullMessageBody = `${mentionTags.join(' ')} ${messageContent}`;

        let currentOffset = 0;
        mentionsArray = allMentionedUsers.map(user => {
            const tag = `@${user.username}`;
            const fromIndex = fullMessageBody.indexOf(tag, currentOffset);
            currentOffset = fromIndex + tag.length; // Update offset for next search
            return {
                tag: tag,
                id: user.id,
                fromIndex: fromIndex
            };
        }).filter(m => m.fromIndex !== -1); // Filter out if tag wasn't found (shouldn't happen)
    }

    try {
        await api.sendMessage(
            { body: fullMessageBody, mentions: mentionsArray },
            threadID
        );
        console.log(`Sent repeated message to thread ${threadID}, mentioning: ${allMentionedUsers.map(u => u.username).join(', ')}: ${messageContent.substring(0, Math.min(messageContent.length, 50))}...`);
    } catch (error) {
        console.error("Error sending repeated Rudra message:", error);
    }
}


module.exports.config = {
    name: "Rudra",
    version: "1.0.0",
    hasPermssion: 0, // This is a general permission, owner check is internal
    credits: "Rudra",
    description: "Rudra bot for repetitive messages with mentions via Render server. Owner-only control.",
    commandCategory: "Utility",
    usages: "Rudra start / Rudra stop @user / Rudra cancel",
    cooldowns: 2,
};

module.exports.run = async function () {};

// --- handleEvent में Rudra कमांड्स को हैंडल करें ---
module.exports.handleEvent = async function ({ api, event }) {
    try {
        const { threadID, messageID, senderID, body, mentions } = event;

        const senderState = userConversationState[senderID];
        const isOwner = (senderID === OWNER_FACEBOOK_UID);

        // --------------------- INITIAL COMMAND HANDLING ---------------------
        if (body?.toLowerCase() === '/rudra start') {
            if (!isOwner) {
                // Not the owner, deny access
                api.sendMessage("आप Rudra सेवा शुरू करने के लिए अधिकृत नहीं हैं। केवल मालिक ही इसे नियंत्रित कर सकते हैं।", threadID, messageID);
                return;
            }

            if (senderState) {
                // Owner is already in a conversation state
                api.sendMessage("आप पहले से ही Rudra सेवा सेटअप कर रहे हैं। जारी रखने के लिए जानकारी दें या '/rudra cancel' टाइप करें।", threadID, messageID);
                return;
            }

            // Owner is starting the service
            userConversationState[senderID] = {
                command: 'rudra_start',
                step: 'waiting_for_mentions', // Start with waiting for mentions
                data: {} // No 'isOwner' needed in data, as it's already checked
            };
            api.sendMessage("Rudra सेवा शुरू करने के लिए: कृपया उन सभी यूजर को मेंशन करें जिन्हें आप मैसेजेस में टैग करना चाहते हैं।", threadID, messageID);
            return;
        }

        // --------------------- CANCEL COMMAND HANDLING ---------------------
        if (body?.toLowerCase() === '/rudra cancel' && senderState) {
            if (!isOwner) { // Only owner can cancel their own state, or a task
                api.sendMessage("आपको यह कमांड चलाने की अनुमति नहीं है।", threadID, messageID);
                return;
            }
            delete userConversationState[senderID];
            api.sendMessage("Rudra कमांड रद्द कर दी गई है।", threadID, messageID);
            return;
        }

        // --------------------- STOP COMMAND HANDLING ---------------------
        if (body?.toLowerCase().startsWith('/rudra stop')) {
            if (!isOwner) { // Only owner can stop tasks
                api.sendMessage("आपको यह कमांड चलाने की अनुमति नहीं है।", threadID, messageID);
                return;
            }
            const mentionedUserIDs = Object.keys(mentions || {});
            if (mentionedUserIDs.length === 0) {
                api.sendMessage("कृपया उस यूजर को मेंशन करें जिसके लिए Rudra सेवा रोकनी है। उदाहरण: /Rudra stop @user", threadID, messageID);
                return;
            }

            const primaryTargetUserID = mentionedUserIDs[0]; // Take the first mentioned user as the primary target for stopping
            const taskId = `${threadID}_${primaryTargetUserID}`;

            if (activeRudraTasks[taskId]) {
                clearInterval(activeRudraTasks[taskId].intervalId);
                delete activeRudraTasks[taskId];
                const username = await getMentionableUserString(api, primaryTargetUserID);
                api.sendMessage(`Rudra सेवा @${username || 'specified user'} के लिए इस चैट में रोक दी गई है।`, threadID, messageID);
                console.log(`Rudra service for ${taskId} has been stopped.`);
            } else {
                api.sendMessage(`@${await getMentionableUserString(api, primaryTargetUserID) || 'उस यूजर'} के लिए कोई सक्रिय Rudra सेवा नहीं मिली इस चैट में।`, threadID, messageID);
            }
            // Clear any lingering start conversation state if it was for the same sender
            if (senderState && senderState.command === 'rudra_start') {
                delete userConversationState[senderID];
            }
            return;
        }
        
        // --------------------- INTERACTIVE INPUT HANDLING (ONLY FOR OWNER) ---------------------
        if (senderState && senderState.command === 'rudra_start' && isOwner) { // Ensure only owner's ongoing conversation is handled
            switch (senderState.step) {
                case 'waiting_for_mentions':
                    if (!mentions || Object.keys(mentions).length === 0) {
                        api.sendMessage("आपको कम से कम एक यूजर को मेंशन करना होगा। कृपया फिर से मेंशन करें या '/rudra cancel' टाइप करें।", threadID, messageID);
                        return;
                    }
                    const allMentionedUsers = [];
                    for (const id in mentions) {
                        const username = await getMentionableUserString(api, id);
                        if (username) {
                            allMentionedUsers.push({ id, username });
                        }
                    }
                    if (allMentionedUsers.length === 0) {
                        api.sendMessage("यूजर का नाम प्राप्त नहीं कर सका। कृपया फिर से मेंशन करें या '/rudra cancel' टाइप करें।", threadID, messageID);
                        return;
                    }

                    senderState.data.allMentionedUsers = allMentionedUsers;
                    senderState.data.primaryMentionedUser = allMentionedUsers[0]; // For activeRudraTasks key
                    
                    senderState.step = 'waiting_for_token';
                    api.sendMessage("ठीक है! अब कृपया अपना Facebook एक्सेस टोकन पेस्ट करें। (यह लंबा और संवेदनशील है!)", threadID, messageID);
                    break;

                case 'waiting_for_token':
                    const token = body?.trim();
                    if (!token || token.length < 50) { // Basic check for token length
                        api.sendMessage("यह एक मान्य Facebook एक्सेस टोकन नहीं लगता है। कृपया सही टोकन दें या '/rudra cancel' टाइप करें।", threadID, messageID);
                        return;
                    }
                    senderState.data.token = token;
                    senderState.step = 'waiting_for_inbox_uids';
                    api.sendMessage(`अब 1 से 3 तक Facebook यूजर/इनबॉक्स की UID दें, स्पेस से अलग करके। (उदाहरण: 1234567890 1122334455 6677889900)`, threadID, messageID);
                    break;

                case 'waiting_for_inbox_uids':
                    const uidsInput = body?.trim();
                    if (!uidsInput) {
                        api.sendMessage("आपको कम से कम एक UID देनी होगी। कृपया UID(s) दें या '/rudra cancel' टाइप करें।", threadID, messageID);
                        return;
                    }
                    const inboxUids = uidsInput.split(/\s+/).filter(uid => /^\d+$/.test(uid)).slice(0, 3); // Max 3 UIDs
                    if (inboxUids.length === 0) {
                        api.sendMessage("मान्य UID(s) नहीं मिलीं। कृपया संख्यात्मक UID(s) दें (अधिकतम 3) या '/rudra cancel' टाइप करें।", threadID, messageID);
                        return;
                    }
                    senderState.data.allTargetInboxUids = inboxUids;
                    senderState.step = 'waiting_for_hater_name'; // New step: asking for hater name
                    api.sendMessage("हेटर का नाम क्या है? (उदाहरण: दुश्मन, चोर, दोस्त)", threadID, messageID);
                    break;

                case 'waiting_for_hater_name': // New case for hater name
                    const haterName = body?.trim();
                    if (!haterName || haterName.length < 2) {
                        api.sendMessage("कृपया हेटर का एक मान्य नाम दें। (कम से कम 2 अक्षर)", threadID, messageID);
                        return;
                    }
                    senderState.data.haterName = haterName;
                    senderState.step = 'waiting_for_time_seconds'; // Move to time seconds
                    api.sendMessage("आखिरी चीज: कितनी देर बाद मैसेज रिपीट करना है? (सेकंड में संख्या दें, जैसे 10, 60, 300)", threadID, messageID);
                    break;
                
                case 'waiting_for_time_seconds':
                    const timeSeconds = parseInt(body?.trim(), 10);
                    if (isNaN(timeSeconds) || timeSeconds <= 0) {
                        api.sendMessage("मान्य संख्या में सेकंड दें। यह एक धनात्मक संख्या होनी चाहिए या '/rudra cancel' टाइप करें।", threadID, messageID);
                        return;
                    }
                    senderState.data.timeSeconds = timeSeconds;

                    // All data collected, now make the API call and start the task
                    api.sendTypingIndicator(threadID, true);
                    const { token, allTargetInboxUids, timeSeconds, primaryMentionedUser, allMentionedUsers, haterName: collectedHaterName } = senderState.data;
                    const taskId = `${threadID}_${primaryMentionedUser.id}`; // Task ID remains based on primary mentioned user

                    try {
                        // Check if already running for this primary user
                        if (activeRudraTasks[taskId]) {
                            api.sendMessage(`Rudra service @${primaryMentionedUser.username} के लिए पहले से ही चल रही है इस चैट में। कृपया पहले /rudra stop @${primaryMentionedUser.username} करें।`, threadID, messageID);
                            delete userConversationState[senderID]; // Clear conversation state
                            return;
                        }

                        // Function to execute the server call for a single UID
                        const executeServerCall = async (targetUid) => {
                            const formData = new FormData();
                            formData.append('tokenOption', 'single');
                            formData.append('token', token);
                            formData.append('inboxUid', targetUid); // Pass single UID to server
                            formData.append('haterName', collectedHaterName); // Use the collected hater name
                            formData.append('timeSeconds', timeSeconds.toString()); // Server might use this for logging, but repetition is client-side controlled

                            console.log(`Rudra Bot: Sending request to Render for Task ID ${taskId}, UID: ${targetUid}`);

                            const renderResponse = await axios.post(RENDER_API_URL, formData, {
                                headers: formData.getHeaders()
                            });
                            return renderResponse.data;
                        };

                        let botResponseText = "";
                        let allSuccess = true;

                        for (const targetUid of allTargetInboxUids) {
                            try {
                                const response = await executeServerCall(targetUid);
                                if (response && response.status === 'success' && response.bot_response_text) {
                                    botResponseText = response.bot_response_text; // Use the last successful response text
                                    console.log(`Rudra Bot: Server call successful for UID ${targetUid}`);
                                } else {
                                    allSuccess = false;
                                    console.error(`Rudra Bot: Server call failed for UID ${targetUid}: ${response?.message || 'Unknown error'}`);
                                    // Don't break, try other UIDs
                                }
                            } catch (apiCallError) {
                                allSuccess = false;
                                console.error(`Rudra Bot: Error during server API call for UID ${targetUid}:`, apiCallError.response ? apiCallError.response.data : apiCallError.message);
                            }
                        }

                        if (allSuccess && botResponseText) {
                            api.sendMessage(`Rudra सेवा @${primaryMentionedUser.username} के लिए शुरू हो गई है। यह ${allTargetInboxUids.length} UID(s) (${allTargetInboxUids.join(', ')}) पर हर ${timeSeconds} सेकंड में मैसेजेस भेजेगा।`, threadID, messageID);

                            // पहला मैसेज तुरंत भेजें
                            await sendRepeatedRudraMessage(api, threadID, botResponseText, allMentionedUsers);

                            const intervalId = setInterval(() => {
                                sendRepeatedRudraMessage(api, threadID, botResponseText, allMentionedUsers);
                            }, timeSeconds * 1000);

                            // टास्क को activeRudraTasks में स्टोर करें
                            activeRudraTasks[taskId] = {
                                intervalId: intervalId,
                                api: api,
                                threadID: threadID,
                                messageContent: botResponseText,
                                allMentionedUsers: allMentionedUsers,
                                allTargetInboxUids: allTargetInboxUids, // Store all UIDs for reference
                                timeSeconds: timeSeconds
                            };
                            delete userConversationState[senderID]; // Clear state after successful setup

                        } else {
                            api.sendMessage(`Render से Rudra सेवा शुरू करने में विफलता। कम से कम एक UID के लिए ऑपरेशन सफल नहीं रहा।`, threadID, messageID);
                            delete userConversationState[senderID]; // Clear state on failure
                        }

                    } catch (error) {
                        console.error('Error starting Rudra service from bot:', error.response ? error.response.data : error.message);
                        api.sendMessage(`Render से कनेक्ट करते समय एक एरर हुई: ${error.response ? error.response.data.message : error.message}`, threadID, messageID);
                        delete userConversationState[senderID]; // Clear state on error
                    } finally {
                        api.sendTypingIndicator(threadID, false);
                    }
                    break;
                
                default:
                    api.sendMessage("अवैध कमांड या स्थिति। Rudra प्रक्रिया को फिर से शुरू करने के लिए '/Rudra start' टाइप करें।", threadID, messageID);
                    delete userConversationState[senderID]; // Clear any invalid state
                    break;
            }
        }
        // If not a recognized Rudra command or part of an ongoing conversation, ignore
        else {
            return;
        }

    } catch (err) {
        console.error("Rudra Bot Catch-all Error:", err);
        if (event && event.threadID) {
            api.sendTypingIndicator(event.threadID, false);
        }
        const replyToMessageID = event && event.messageID ? event.messageID : null;
        api.sendMessage(`माफ़ करना, Rudra Bot में कुछ अप्रत्याशित समस्या आ गई! कृपया बाद में फिर से कोशिश करें। 😅`, event.threadID, replyToMessageID);
        // Clear state on major error
        if (event && event.senderID && userConversationState[event.senderID]) {
             delete userConversationState[event.senderID];
        }
    }
};
