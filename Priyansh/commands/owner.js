const axios = require("axios");

module.exports.config = {
  name: "owner",
  version: "1.0.7", // Version अपडेट किया
  hasPermssion: 0,
  credits: "Rudra & You",
  description: "जब कोई बोले owner तो stylish Rudra reply के साथ anime images भेजे",
  commandCategory: "No prefix",
  usages: "owner शब्द किसी भी मेसेज में लिखें",
  cooldowns: 5,
};

const imageLinks = [
  "https://i.imgur.com/RygyQj0.jpeg",
  "https://i.imgur.com/lKtqjkH.jpeg",
  "https://i.imgur.com/6a35Zrf.jpeg",
  "https://i.imgur.com/CojcGcE.jpeg",
  "https://i.imgur.com/aLszk7Y.jpeg",
  "https://i.imgur.com/8X2MQTT.jpeg",
  "https://i.imgur.com/sV6tdbh.jpeg",
  "https://i.imgur.com/Zhrl89g.jpeg",
  "https://i.imgur.com/vwXCDP1.jpeg",
  "https://i.imgur.com/qaC7UHo.jpeg",
  "https://i.imgur.com/9tX9vYU.jpeg"
];

// इमेज को Buffer के रूप में फेच करने के लिए फंक्शन
async function fetchImageBuffer(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    // axios.get में responseType 'arraybuffer' देने पर data एक ArrayBuffer होता है।
    // इसे Node.js में attachment के रूप में इस्तेमाल करने के लिए Buffer में बदलना पड़ता है।
    return Buffer.from(response.data);
  } catch (error) {
    console.error("Error fetching image buffer:", error);
    return null; // त्रुटि होने पर null वापस करें
  }
}

module.exports.handleEvent = async function({ api, event }) {
  try {
    const { threadID, messageID, body } = event;
    // अगर मैसेज खाली है या 'owner' शब्द नहीं है तो कुछ न करें
    if (!body || !body.toLowerCase().includes("owner")) return;

    const selectedImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    const imgBuffer = await fetchImageBuffer(selectedImage); // इमेज को Buffer के रूप में फेच करें

    // अगर इमेज Buffer नहीं मिल पाया तो एरर मैसेज भेजें
    if (!imgBuffer) {
      await api.sendMessage("माफ़ करना, मैं अभी इमेज नहीं भेज पा रहा हूँ. कृपया बाद में कोशिश करें.", threadID, messageID);
      return;
    }

    const stylishText = 
`✨🔥 𝙻𝚎𝚟𝚂𝚝𝚢𝚕𝚒𝚜𝚑 𝗥𝘂𝚍𝗿𝗮 𝗢𝘄𝗻𝗲𝗿 🔥✨

▶ Facebook: https://www.facebook.com/rudra.461718

📸 यहाँ आपकी रैंडम स्टाइलिश एनीमे इमेज है!`;

    await api.sendMessage({
      body: stylishText,
      attachment: imgBuffer // Buffer को attachment के रूप में दें
    }, threadID, messageID);

    // मैसेज पर रिएक्शन जोड़ें
    api.setMessageReaction("📷", messageID, () => {}, true);

  } catch (err) {
    console.error("Owner module में त्रुटि:", err);
    // उपयोगकर्ता को भी त्रुटि के बारे में सूचित करें
    api.sendMessage("माफ़ करना, owner मॉड्यूल में कुछ गड़बड़ हो गई है. कृपया बाद में कोशिश करें.", event.threadID, event.messageID);
  }
};

module.exports.run = () => {}; // यह फंक्शन खाली रहता है क्योंकि यह एक "नो-प्रिफिक्स" कमांड है
