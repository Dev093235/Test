const express = require("express");
const { spawn } = require("child_process");

const app = express();
const port = process.env.PORT || 3000;

// Just for keeping Render's web service alive
app.get("/", (req, res) => {
  res.send("🟢 Priyansh Bot is running!");
});

app.listen(port, () => {
  console.log(`🌐 Web server started on port ${port}`);
});

// Now start the actual bot
function startBot() {
  const bot = spawn("node", ["Priyansh.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  bot.on("close", (code) => {
    console.log(`❌ Bot exited with code ${code}. Restarting...`);
    startBot(); // auto restart
  });

  bot.on("error", (err) => {
    console.error("⚠️ Error spawning bot:", err);
  });
}

startBot();
