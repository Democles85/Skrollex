const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Loop The Queue"),
	async execute(interaction) {
		const player = interaction.client.player;
		if (!interaction.member.voice.channel)
			return interaction.editReply({
				content: ":x:|  You need to be in a voice channel to do this!",
				ephemeral: true,
			});

		if (
			interaction.guild.members.me.voice.channel &&
			interaction.member.voice.channel.id !==
				interaction.guild.members.me.voice.channel.id
		)
			return interaction.editReply({
				content:
					"❌ | You need to be in the same voice channel as me to do that",
				ephemeral: true,
			});

		const queue = player.getQueue(interaction.guild.id);
		if (!queue || !queue.playing) {
			return interaction.editReply({
				content: "❌ | There is nothing playing right now!",
				ephemeral: true,
			});
		}

		if (queue) {
			const db = interaction.client.db;
			const guild = interaction.guildId;
			const roll = db.get(`${guild}_dj_role`);

			if (
				interaction.user.id !== queue.nowPlaying().requestedBy.id &&
				!interaction.member.roles.cache.has(roll)
			) {
				return interaction.editReply(
					":x: | This command can only be used by the person who played the current track or someone who has your guild's DJ role"
				);
			}
			if (
				interaction.user.id !== queue.nowPlaying().requestedBy.id &&
				!interaction.member.roles.cache.has(roll)
			) {
				return interaction.editReply(
					":x: | This command can only be used by the person who played the current track or someone who has your guild's DJ role"
				);
			}
			const mode = queue.setRepeatMode(queue.repeatMode === 1 ? 0 : 1);
			const modee = mode === 1 ? "Enabled" : "Disabled";
			return interaction.editReply(`:white_check_mark: | Loop is now ${modee}`);
		}
	},
};
