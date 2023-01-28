const Discord = require('discord.js');
const { Client, Instents, Collection } = require('discord.js')
const client = new Discord.Client({
    intents: [
        Instents.FLAGS.GUILDS,
        Instents.FLAGS.GUILDS_MESSAGES,
        Instents.FLAGS.GUILDS_VOICE_STATES
        // ...
    ]
});
const ytdl = require('ytdl-core');
const prefix = "!";

let queue = {};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(`[${timestamp}][${message.channel.name}][${message.author.username}]: ${message.content}`);
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (message.content === '!test') {
        message.channel.send('Test successful, I can read messages.');
        console.log(`Test command received from user ${message.author.username}`);
    }

    if (command === '!play') {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');

        console.log(`Joining voice channel ${voiceChannel.name}`);
    voiceChannel.join();

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send('I need the permissions to join and speak in your voice channel!');
        }

        const songInfo = await ytdl.getInfo(args[0]);
        const song = {
            title: songInfo.title,
            url:songInfo.video_url
        }

        if (!queue.hasOwnProperty(message.guild.id)) {
            queue[message.guild.id] = {};
            queue[message.guild.id].playing = false;
            queue[message.guild.id].songs = [];
        }
        queue[message.guild.id].songs.push(song);
        message.channel.send(`Added **${song.title}** to the queue`);

        if (!queue[message.guild.id].playing) {
            queue[message.guild.id].playing = true;
            play(message.guild, queue[message.guild.id].songs[0]);
        }
    } else if (command === 'skip') {
        if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!queue[message.guild.id]) return message.channel.send('There is no song that I could skip!');
        queue[message.guild.id].connection.dispatcher.end();
    } else if (command === 'stop') {
        if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!queue[message.guild.id]) return message.channel.send('There is no song that I could stop!');
        queue[message.guild.id].songs = [];
        queue[message.guild.id].connection.dispatcher.end();
    }
});

async function play(guild, song) {
    const voiceChannel = guild.me.voice.channel;
    if (!voiceChannel) return;

    const connection = await voice
voiceChannel.join();
queue[guild.id].connection = connection;
const dispatcher = connection.play(ytdl(song.url, { filter: 'audioonly' }));
dispatcher.on('finish',() => {
queue[guild.id].songs.shift();
if (queue[guild.id].songs.length > 0) {
play(guild, queue[guild.id].songs[0]);
} else {
queue[guild.id].playing = false;
voiceChannel.leave();
}
});
}

client.login('<BOT_TOCKEN>');
