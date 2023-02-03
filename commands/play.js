const { SlashCommandBuilder } = require('discord.js');
const ytdl = require("ytdl-core");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};

async function play(guild, song) {
  const voiceChannel = guild.me.voice.channel;
  if (!voiceChannel) return;

  const connection = await voice;
  voiceChannel.join();
  queue[guild.id].connection = connection;
  const dispatcher = connection.play(ytdl(song.url, { filter: "audioonly" }));
  dispatcher.on("finish", () => {
    queue[guild.id].songs.shift();
    if (queue[guild.id].songs.length > 0) {
      play(guild, queue[guild.id].songs[0]);
    } else {
      queue[guild.id].playing = false;
      voiceChannel.leave();
    }
  });
}
