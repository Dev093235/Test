const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs-extra");

// Access your API key as an environment variable
// Ensure you have set GEMINI_API_KEY as an environment variable in Termux/your server
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is not set. Please set it before running the bot.");
  // You might want to exit the process or handle this gracefully if the key is missing
  // process.exit(1); 
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

module.exports = {
  config: {
    name: "gemini",
    version: "1.0",
    author: "Priyansh",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Interact with Google Gemini AI"
    },
    longDescription: {
      en: "Interact with Google Gemini AI for various queries and tasks."
    },
    category: "AI",
    guide: {
      en: "{pn} <your query>"
    }
  },

  onStart: async function({ api, message, args, event }) {
    if (!args[0]) {
      return message.reply("Please provide a query for Gemini AI.");
    }

    const prompt = args.join(" ");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      message.reply(text);
    } catch (error) {
      console.error("Error interacting with Gemini API:", error);
      message.reply("क्षमा करें, मैं अभी आपकी मदद नहीं कर सकता। Gemini API में कुछ समस्या है।");
    }
  }
};
