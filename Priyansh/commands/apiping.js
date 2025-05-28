const axios = require("axios");

module.exports.config = {
    name: "apiping",
    version: "1.0.0",
    hasPermission: 0,
    credits: "MirryKal",
    description: "Manually check API status and auto-ping every 5 minutes",
    commandCategory: "utility",
    usages: "[apistatus]",
    cooldowns: 5,
    dependencies: {
        "axios": "1.4.0"
    }
};

// 🔹 Tumhari APIs
const API_URLS = {
    "rudra API": "https://rudra-here.onrender.com",
    "MirryKal API": "https://mirrykal.onrender.com",
    "Arun Music API": "https://arun-music.onrender.com",
    "Mello API": "https://test-50l9.onrender.com"
};

// 🔹 API Check Function (Ping Only)
async function autoPingAPIs() {
    for (const url of Object.values(API_URLS)) {
        try {
            await axios.get(url);
        } catch (error) {
            // Ignore errors, just keep APIs alive
        }
    }
}

// 🔹 API Status Function (For Command)
async function checkAPIs() {
    let statusMessage = "🔥 **API Status:**\n\n";

    for (const [name, url] of Object.entries(API_URLS)) {
        try {
            await axios.get(url);
            statusMessage += `✅ ${name} is **Running**\n`;
        } catch (error) {
            statusMessage += `❌ ${name} is **Down**\n`;
        }
    }
    return statusMessage;
}

// 🔹 Auto-Ping (Every 5 Minutes)
setInterval(autoPingAPIs, 5 * 60 * 1000);

// 🔹 Command Trigger
module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;

    api.sendMessage("⏳ Checking APIs, please wait...", threadID, messageID);

    try {
        const statusMessage = await checkAPIs();
        api.sendMessage(statusMessage, threadID, messageID);
    } catch (error) {
        api.sendMessage("❌ Error checking APIs!", threadID, messageID);
    }
};
