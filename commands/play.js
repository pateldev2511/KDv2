//TODO : Need to create play functions
const { SlashCommandBuilder } = require('discord.js');
const ytdl = require("ytdl-core");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Heela worldiya!');
	},
};