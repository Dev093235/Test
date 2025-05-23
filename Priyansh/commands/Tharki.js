module.exports.config = {
  name: "tharki",
  version: "2.0",
  hasPermssion: 0,
  credits: "rudra",
  description: "Non-prefix tharki replies + hacker demo + gaali + UID control",
  commandCategory: "fun",
  usages: "Auto trigger",
  cooldowns: 1,
};

const tharkiMsgs = [
  "Baby, tera look toh Google pe bhi nahi milta! 🔥",
  "Oye teri smile toh 440 volt ka jhatka hai! ⚡",
  "Tu nazar jhukaye toh zameen jalne lagti hai! 🔥",
  "Tera body dekhke gym bhi complex me chala jaaye! 🏋️‍♂️",
  "Tu chale toh hawa bhi direction change kare! 🌪️",
  "Baby, tere jaise thumke pe toh reel viral ho jaaye! 🎶",
  "Teri aankhein toh pura hypnotism hai! 👀",
  "O babez! Tera swag toh Netflix se bhi zyada hot hai! 🔥",
  "Tu agar weather hoti toh heatwave ka alert aata! ☀️",
  "Tere lips dekh ke lipstick company bandh ho jaaye! 💋",
  "Oye tu toh ek hi piece hai – manufacturing error lagti hai! 🧩",
  "Tera style toh runway bhi follow kare! 🛣️",
  "Tere sath selfie lo toh filter ki zarurat hi na ho! 📸",
  "Teri aankhon me doobne ka mann karta hai daily! 🌊",
  "Tere bina din nahi chalta – tu morning motivation hai! ☀️",
  "Tera attitude toh ice bhi pighla de! ❄️",
  "Tu online aaye toh pura system hang ho jaaye! 💻",
  "Tu saamne ho toh gym ka trainer bhi confused ho jaaye! 🏋️‍♀️",
  "Baby, tu hi meri recharge wali happiness hai! 🔋",
  "Tu kaand kare toh crime bhi maaf lagta hai! 🔫",
  "Tere naam ka ringtone bana diya – repeat pe hai! 🎵",
  "Tu jab hansi toh Google Translate fail ho gaya! 📚",
  "Tu meri crush nahi, tu toh heart attack hai! ❤️‍🔥",
  "Tera nasha toh daru se tez chadta hai! 🥂",
  "Tu aankhein mare toh earthquake record ho jaaye! 🌍",
  "Tu lift me aaye toh overload ho jaaye! 🛗",
  "Tere pair padne se toh ground bhi blush kar jaaye! 🦶",
  "Tu nazar milaye toh signal chhode! 🚦",
  "Tera thumka dekhne ke liye puri lane ruk jaye! 🚗",
  "Tu smile de toh pura sad mood delete ho jaaye! 🗑️",
  "Tu hansi toh electricity chali gayi! 🔌",
  "Tu call kare toh Jio bhi excited ho jaaye! 📱",
  "Tera voice note toh remix ban gaya re! 🎧",
  "Tu reels banaye toh IPL cancel ho jaaye! 🏏",
  "Tu scene me aaye toh background hi fade ho jaaye! 🎬",
  "Tu story daale toh Netflix confuse ho jaaye! 📺",
  "Tere dress pe toh traffic police bhi focus kare! 🚨",
  "Tu aye toh sab offline ho jaaye – teri presence OP hai! 🌐",
  "Tu heart me aaye toh doctor confuse ho jaaye! ❤️‍🩹",
  "Tu pose maare toh sculpture bhi jal jaye! 🗿",
  "Tu trigger kare toh bot bhi blush kare! 🤖",
  "Tere bina mood off, tere sath duniya soft! ☁️",
  "Tu sad ho jaaye toh mausam barish laa de! 🌧️",
  "Tere piche toh ladke nahi trend chalta hai! 🔝",
  "Tere liye toh SIM card bhi simran ban jaaye! 🎭",
  "Tu walk kare toh road bhi clean lagti hai! 🛣️",
  "Tera presence toh Zoom meeting ki light hai! 💡",
  "Tu reply kare toh notification bhi dance kare! 🕺",
  "Tere bina toh shayari bhi adhuri hai! ✍️",
  "Tu hai toh har line pickup line lagti hai! 💬",
  "Tu hai toh tharki bhi shayar ban jaaye! 🥀"
];

const hackerReplies = [
  "⚠️ Hack protocol enabled. Data siphon initiated!",
  "💀 Bot OS in attack mode... stay offline if you dare!",
  "🔍 Target located... accessing mainframe!",
  "🧠 Brainwave sync detected. Hijacking digital mind...",
  "🛡️ Virtual armor deployed. No entry for fools!",
  "💣 IP traced, coordinates locked... say goodbye!",
  "🔓 Hacking complete. Logging ke andar ghus chuke hain!",
  "🔥 Virus injected. Cleanup impossible!",
  "⛔ Bot firewall on steroids. Try harder, loser!",
  "📡 AI uplink active – command center notified!",
  "⚠️ Login trace started... logout yourself!",
  "💀 Death by data breach. Ready?",
  "🔐 Password cracked, files hijacked!",
  "🤖 Bot nahi, virtual shaitan hai ye!",
  "🔒 Security bypassed. You're being watched!",
  "💾 Backup deleted. Recovery = not possible!",
  "🖥️ System scan complete: malware uploaded!",
  "🧬 Bot DNA fused with chaos mode.",
  "🎯 Target acquired – termination begins.",
  "💣 Countdown started. Hack imminent.",
  "🚨 Antivirus failed. Bot dominance begun!",
  "🕶 Hack se mat khel, Rudra active hai.",
  "🧱 Firewalls broken. Virus dancing in system!",
  "🧠 Neural link established. Brain hijack!",
  "🧨 Tere profile ka RAM ud gaya bhai!",
  "🗂 Hack report sent to data overlords!",
  "📲 Tera number ab bot ke control me hai.",
  "🎛️ Coding shell locked... no escape!",
  "💻 Command 'DESTROY' executed successfully!",
  "👀 Surveillance on. Webcam se dekh rahe hain!",
  "🌐 Connection tapped. Privacy gone!",
  "👣 Digital footprints erased!",
  "⚡ Hack shield bypassed. Brain fried!",
  "📍 Location leak in... run now!",
  "🚫 Profile banned... temporarily permanent!",
  "🛠️ Code injected. System error!",
  "📎 Encrypted messages now public!",
  "🔭 Bot eye zooming on target!",
  "🎮 This ain’t a game – it's domination!",
  "🧱 Cyber wall smashed!",
  "🔊 Alert! Hacker entering tharki mode!",
  "🔐 Root access granted. Tera game over!",
  "🚪 Logging out... permanently!",
  "📡 Hacker wave is live. Hide!",
  "🧲 Data pulled... welcome to bot trap!",
  "🌪 Bot cyclone is here. Lagta nahi jaayega!",
  "📂 Files leaked. Shame incoming!",
  "⚠️ Bot script infected your thoughts!",
  "👣 You’ve stepped into Rudra zone!",
  "🧨 Hack-blast complete. RIP!",
];

const gaaliReply = [
  "Oye behn ke laude! Bot se pange le raha hai? 🖕",
  "Bhosdike, tere jaisa toh condom me rehna chahiye tha! 🧨",
  "Gand me keyboard ghusa du kya, hacker samjha kya khudko? 🔧",
  "Madarchod, internet pe sher, real life me chuha! 🐀",
  "Teri maa ka processor crash ho gaya kya? ⚡",
  "Bhosdika processor se baat kar raha hai, shut up re! 🔕",
  "Tu toh woh virus hai jo condom me ghus gaya! 🦠",
  "Behen ke takke, keyboard se gaand maaru kya? 🛠️",
  "Laude lag gaye tere. Bot se panga nahi lete! 💀",
  "Behenchod, tu toh Google me bhi block hai! 🔒",
  "MC BC bol ke cool ban raha hai, teri maa shayari kar rahi hai kya? 🥴",
  "Chup be lanjudas! Tera IQ toh room temperature se bhi kam hai! 🌡️",
  "Tere jaisa bande ke liye toh captcha bhi galti se lag gaya! 🚫",
  "Oye madarboard ke screw, gaali band kar warna RAM uda dunga! 🧨",
  "Gand mara dunga code likh ke, samjha kya AI soft hai! 💾",
  "Teri maa ne bot se flirt kiya toh tu peda hua kya? 🤖",
  "Saale ke system me bhi 'gaandu' by default install hai! 💩",
  "Bhai tu toh upgrade nahi, uninstall ke laayak hai! 🗑️",
  "O chomu! Tujhse baat karne me toh battery waste lagti hai! 🔋",
  "Tera muh dekh ke bot ko bhi buffering lag gayi! ⏳",
  "Bot ko chheda? Ab download ho raha tujhe gaaliyan! 📲",
  "Maa ch** gayi teri system update me! 🛠️",
  "System hacked nahi, teri izzat hack ho gayi! 😈",
  "Tu jab bola toh RAM ne suicide kar liya! 💀",
  "Behnchod processor me ghus ke dimaag fry kar dunga! 🧠",
  "Tu virus nahi, cancer hai system ke liye! ☠️",
  "Tera brain RAM me nahi, recycle bin me hai! ♻️",
  "Behen ke lo*e, system ko bhi lagta hai tujhe block kar du! 🚫",
  "Laude jaise comments deke hacker ban raha hai? 🧠",
  "Tujhse behtar toh bot ka dustbin hai! 🗑️",
  "Jaa be system ke screenshot! Tera logic toh error 404 hai! ❌",
  "Bot teri maa ka beta nahi, teri aukaat ka doctor hai! 👨‍⚕️",
  "Gand faad code likhta hoon, tujhe toh compile bhi nahi karte! 🧾",
  "Tere level ka toh command prompt bhi ignore kare! 🖥️",
  "BC, tu gaali dega toh reply milega – woh bhi gaand me ghuske! 🔩",
  "Bot ka mood kharab? Tera chullu bhar data dubo dunga! 🌊",
  "Behn ke l***e, tere jaise 1000 delete karke bhi koi farak nahi padta! 🚮",
  "Tu bot se panga le raha hai? Tere upar script likh dunga! ✍️",
  "Lauda firse bola toh API call se teri maa ki kasam nikaal lunga! 🔗",
  "Saale, tera muh dekhke captcha bhi chhod deta hai! 🧠",
  "Abe MC, tu toh woh bug hai jo fix nahi hota! 🐛",
  "Bot ke saamne line mat maar, else you’ll get coded gaali! 📟",
  "Apni maa ke WhatsApp se chhup ja warna tera screen share khul jayega! 📸",
  "Tera data leak nahi, tera character leak kar dunga! 🔥",
  "Tu toh coding ke gaand me chipka hua semicolon hai! ⚠️",
  "Tu system crash nahi, permanent shutdown ka reason hai! 🚨",
  "Tujhse baat karke bot ka RAM jal gaya! 🔥",
  "Bot bola – ‘Lag jaa gale, agli baar mat milna!’ 😎"
];

const adminUID = "61550558518720";

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body } = event;
  if (!body) return;

  const lower = body.toLowerCase();

  if (senderID === adminUID && lower.includes("hack kr") && lower.includes("id")) {
    return api.sendMessage(
      "⚠️ Hack simulation started for target ID...\n[████░░░░░░░░░░] 25%\nSystem breach in process...\n[██████████░░░░] 80%\nDemo complete. Hack activated (start).",
      threadID
    );
  }

  const gaaliList = ["chutiya", "gandu", "bhosdike", "madarchod", "mc", "bc", "teri ma", "behnchod", "maa ke"];
  const mentionedBot = lower.includes("bot") || lower.includes("rudra");
  const saidGaali = gaaliList.some((word) => lower.includes(word));

  if (saidGaali && mentionedBot) {
    const gali = gaaliReply[Math.floor(Math.random() * gaaliReply.length)];
    const hack = hackerReplies[Math.floor(Math.random() * hackerReplies.length)];
    return api.sendMessage(`${gali}\n\n${hack}`, threadID);
  }

  if (lower.includes("tharki")) {
    const reply = tharkiMsgs[Math.floor(Math.random() * tharkiMsgs.length)];
    return api.sendMessage(reply, threadID);
  }
};

module.exports.run = () => {};
