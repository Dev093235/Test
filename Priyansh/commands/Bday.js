const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bday')
    .setDescription('Wish a user a Happy Birthday in anime style!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User whose birthday it is')
        .setRequired(true)),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    const messages = [
      `**${user}**... on this special day, the stars shine brighter just for you! Happy Birthday!`,
      `*Kya tumhe pata hai ${user}... aaj tumhara din hai, aur duniya tumhare liye ruk gayi hai!*`,
      `**Baka ${user}**, tumhare bina Discord adhoora hota! Happy Birthday!`,
      `**Senpai ${user}**, otanjoubi omedetou! *Here's to another year of amazing adventures.*`,
    ];

    const gifs = [
      'https://media.giphy.com/media/3ohc13b3qdn1qGz2VO/giphy.gif',
      'https://media.giphy.com/media/kBZBlLVlfECvOQAVno/giphy.gif',
      'https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif'
    ];

    const videoUrl = 'https://cdn.discordapp.com/attachments/1149181833253040128/1243566038047930439/anime_bday_video.mp4';

    const embed = new EmbedBuilder()
      .setTitle('**Otanjoubi Omedetou!**')
      .setDescription(messages[Math.floor(Math.random() * messages.length)])
      .setImage(gifs[Math.floor(Math.random() * gifs.length)])
      .setColor('#FFB6C1')
      .setFooter({ text: '— From your waifu bot, Riya' });

    await interaction.reply({ content: `Hey ${user}!`, embeds: [embed] });

    // Send anime birthday video
    await interaction.followUp({
      content: `**Special Birthday Gift Video for ${user}!**`,
      files: [videoUrl]
    });
  },
};
