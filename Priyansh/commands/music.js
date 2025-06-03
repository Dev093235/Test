const fs = require('fs');
const ytdl = require('ytdl-core');
const { resolve } = require('path');

async function downloadMusicFromYoutube(link, path) {
    const timestart = Date.now();
    if (!link) return 'Missing YouTube link';

    return new Promise((resolveFunc, rejectFunc) => {
        ytdl(link, {
            filter: format =>
                format.quality === 'tiny' && format.audioBitrate === 48 && format.hasAudio === true
        }).pipe(fs.createWriteStream(path))
            .on("close", async () => {
                const data = await ytdl.getInfo(link);
                const result = {
                    title: data.videoDetails.title,
                    dur: Number(data.videoDetails.lengthSeconds),
                    viewCount: data.videoDetails.viewCount,
                    likes: data.videoDetails.likes,
                    author: data.videoDetails.author.name,
                    timestart: timestart
                };
                resolveFunc(result);
            });
    });
}

// 🔒 Credit Lock: Don’t allow modification of credits
const CREDIT_NAME = "Rudra";

module.exports.config = {
    name: "music",
    version: "1.0.0",
    hasPermssion: 0,
    credits: CREDIT_NAME,
    description: "Play YouTube songs by link or search keyword",
    commandCategory: "utility",
    usages: "[song name | YouTube link]",
    cooldowns: 0
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    // 🛡️ Check if credits changed
    if (module.exports.config.credits !== CREDIT_NAME) {
        return api.sendMessage("❌ Don't change credits! Module by Rudra.", event.threadID, event.messageID);
    }

    const axios = require('axios');
    const { createReadStream, unlinkSync, statSync } = require("fs-extra");

    try {
        const path = `${__dirname}/cache/1.mp3`;
        const data = await downloadMusicFromYoutube('https://www.youtube.com/watch?v=' + handleReply.link[event.body - 1], path);

        if (fs.statSync(path).size > 26214400)
            return api.sendMessage('❌ File too large (limit: 25MB)', event.threadID, () => fs.unlinkSync(path), event.messageID);

        api.unsendMessage(handleReply.messageID);

        return api.sendMessage({
            body: `🎵 Title: ${data.title}\n🎶 Channel: ${data.author}\n⏱️ Duration: ${this.convertHMS(data.dur)}\n👀 Views: ${data.viewCount}\n👍 Likes: ${data.likes}\n⚡ Processing time: ${Math.floor((Date.now() - data.timestart) / 1000)} sec\n\n✨ Powered by Rudra`,
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);

    } catch (e) {
        console.log(e);
    }
};

module.exports.convertHMS = function (value) {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds;
};

module.exports.run = async function ({ api, event, args }) {
    // 🛡️ Check if credits changed
    if (module.exports.config.credits !== CREDIT_NAME) {
        return api.sendMessage("❌ Don't change credits! Module by Rudra.", event.threadID, event.messageID);
    }

    if (!args.length) return api.sendMessage('❗ Please enter a song name or YouTube link.', event.threadID, event.messageID);

    const keywordSearch = args.join(" ");
    const path = `${__dirname}/cache/1.mp3`;

    if (fs.existsSync(path)) fs.unlinkSync(path);

    // If input is a direct YouTube link
    if (keywordSearch.indexOf("https://") === 0) {
        try {
            const data = await downloadMusicFromYoutube(keywordSearch, path);

            if (fs.statSync(path).size > 26214400)
                return api.sendMessage('❌ File too large (limit: 25MB)', event.threadID, () => fs.unlinkSync(path), event.messageID);

            return api.sendMessage({
                body: `🎵 Title: ${data.title}\n🎶 Channel: ${data.author}\n⏱️ Duration: ${this.convertHMS(data.dur)}\n👀 Views: ${data.viewCount}\n👍 Likes: ${data.likes}\n⚡ Processing time: ${Math.floor((Date.now() - data.timestart) / 1000)} sec\n\n✨ Powered by Rudra`,
                attachment: fs.createReadStream(path)
            }, event.threadID, () => fs.unlinkSync(path), event.messageID);

        } catch (e) {
            console.log(e);
        }
    } else {
        // If input is a keyword search
        try {
            const Youtube = require('youtube-search-api');
            const results = (await Youtube.GetListByKeyword(keywordSearch, false, 6)).items;

            const link = [];
            let msg = "";
            results.forEach((value, index) => {
                link.push(value.id);
                msg += `${index + 1} ➤ ${value.title} (${value.length.simpleText})\n\n`;
            });

            return api.sendMessage({
                body: `🔍 Search results for "${keywordSearch}":\n\n${msg}Reply with the number of the song you want to download.`
            }, event.threadID, (error, info) => {
                global.client.handleReply.push({
                    type: 'reply',
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    link
                });
            }, event.messageID);

        } catch (e) {
            return api.sendMessage(`❌ Search failed, try again.\n${e}`, event.threadID, event.messageID);
        }
    }
};
