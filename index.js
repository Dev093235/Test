const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log"); // सुनिश्चित करें कि यह पथ सही है

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////

const express = require('express');
const path = require('path');

const app = express();
// Render द्वारा प्रदान किया गया पोर्ट प्राप्त करें।
// यह सुनिश्चित करेगा कि Express सर्वर सही पोर्ट पर सुनता है।
const port = process.env.PORT; // <--- यह वह बदलाव है जो हमने किया था

// Serve the index.html file
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// यदि आपका बॉट Messenger वेबहुक का उपयोग करता है, तो आपको एक POST एंडपॉइंट की आवश्यकता होगी
// उदाहरण के लिए, यदि आपका Messenger वेबहुक /webhook पर रिक्वेस्ट भेजता है
// आपको यहां अपने Messenger बॉट के वेबहुक लॉजिक को एकीकृत करना होगा।
// यह केवल एक प्लेसहोल्डर है।
app.post('/webhook', (req, res) => {
    // Messenger वेबहुक सत्यापन के लिए लॉजिक
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN; // सुनिश्चित करें कि यह Render env variable में सेट है
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            logger('WEBHOOK_VERIFIED', '[ WEBHOOK ]');
            res.status(200).send(challenge);
        } else {
            logger('WEBHOOK_VERIFICATION_FAILED: Invalid token', '[ WEBHOOK ]');
            res.sendStatus(403);
        }
    } else {
        // यदि यह एक सामान्य POST रिक्वेस्ट है (जैसे Messenger इवेंट), तो इसे हैंडल करें
        // यहां आपके बॉट का मुख्य इवेंट हैंडलिंग लॉजिक आएगा।
        // चूंकि आपका बॉट Priyansh.js में listenMqtt का उपयोग करता है,
        // यह वेबहुक केवल Messenger सत्यापन के लिए आवश्यक हो सकता है,
        // या यदि आप वेबहुक के माध्यम से इवेंट प्राप्त करना चाहते हैं।
        logger('Received a non-verification webhook request.', '[ WEBHOOK ]');
        res.sendStatus(200); // Messenger को 200 OK भेजें
    }
});


// Start the server and add error handling
app.listen(port, () => {
    logger(`Server is running on port ${port}...`, "[ Starting ]");
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        logger(`Permission denied. Cannot bind to port ${port}.`, "[ Error ]");
    } else {
        logger(`Server error: ${err.message}`, "[ Error ]");
    }
});

/////////////////////////////////////////////////////////
//========= Create start bot and make it loop =========//
/////////////////////////////////////////////////////////

// Initialize global restart counter
global.countRestart = global.countRestart || 0;

function startBot(message) {
    if (message) logger(message, "[ Starting ]");

    // Priyansh.js को चाइल्ड प्रोसेस के रूप में चलाएं
    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Priyansh.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 && global.countRestart < 5) {
            global.countRestart += 1;
            logger(`Bot exited with code ${codeExit}. Restarting... (${global.countRestart}/5)`, "[ Restarting ]");
            startBot();
        } else {
            logger(`Bot stopped after ${global.countRestart} restarts.`, "[ Stopped ]");
        }
    });

    child.on("error", (error) => {
        logger(`An error occurred: ${JSON.stringify(error)}`, "[ Error ]");
    });
};

////////////////////////////////////////////////
//========= Check update from Github =========//
////////////////////////////////////////////////

// यह भाग आपके बॉट के अपडेट चेक लॉजिक का हिस्सा है।
// सुनिश्चित करें कि 'priyanshu192/bot' रिपॉजिटरी सार्वजनिक है या पहुंच योग्य है।
axios.get("https://raw.githubusercontent.com/priyanshu192/bot/main/package.json")
    .then((res) => {
        logger(res.data.name, "[ NAME ]");
        logger(`Version: ${res.data.version}`, "[ VERSION ]");
        logger(res.data.description, "[ DESCRIPTION ]");
    })
    .catch((err) => {
        logger(`Failed to fetch update info: ${err.message}`, "[ Update Error ]");
    });

// Start the bot
startBot();

