const {
	EmbedBuilder: MessageEmbed,
	ActionRowBuilder: row,
	ButtonBuilder: button,
	ButtonStyle,
} = require("discord.js");
const { inspect } = require("util");

module.exports = {
	name: "trackStart",
	execute(queue, track) {
		const rw = new row().addComponents(
			new button()
				.setCustomId("back")
				.setEmoji("⏮️")
				.setStyle(ButtonStyle.Primary),
			new button()
				.setCustomId("pause")
				.setEmoji("⏸️")
				.setStyle(ButtonStyle.Success),
			new button()
				.setCustomId("resume")
				.setEmoji("▶️")
				.setStyle(ButtonStyle.Success),
			new button()
				.setCustomId("shuffle")
				.setEmoji("🔀")
				.setStyle(ButtonStyle.Success),
			new button()
				.setCustomId("skip")
				.setEmoji("⏭️")
				.setStyle(ButtonStyle.Primary)
		);
		const rw2 = new row().addComponents(
			new button()
				.setCustomId("mute")
				.setEmoji("🔇")
				.setStyle(ButtonStyle.Danger),
			new button()
				.setCustomId("volume-down")
				.setEmoji("🔉")
				.setStyle(ButtonStyle.Success),
			new button()
				.setCustomId("volume-up")
				.setEmoji("🔊")
				.setStyle(ButtonStyle.Success),
			new button()
				.setCustomId("loop")
				.setEmoji("🔁")
				.setStyle(ButtonStyle.Success),
			new button()
				.setCustomId("stop")
				.setEmoji("⏹️")
				.setStyle(ButtonStyle.Danger)
		);
		queue.metadata.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor("Green")
					.setTitle("🎶 | Now Playing")
					.setDescription(`**${track.title}**`)
					.setThumbnail(track.thumbnail)
					.addFields([
						{
							name: "DURATION",
							value: `${track?.duration ? track.duration : "N/A"}s`,
							inline: true,
						},
						{
							name: "REQUESTER",
							value: `${track.requestedBy.username}`,
							inline: true,
						},
						{ name: "ARTIST", value: track.author, inline: true },
						{
							name: "URL",
							value: `**[Click Here](${track.url})**`,
							inline: false,
						},
					]),
			],
			components: [rw, rw2],
		});
	},
};
