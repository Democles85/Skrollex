module.exports = {
	execute: async (interaction) => {
		if (!interaction.member.voice.channel) {
			return interaction.editReply({
				content: ":x: |  You need to be in a voice channel to do this!",
				ephemeral: true,
			});
		}

		if (
			interaction.guild.members.me.voice.channel &&
			interaction.member.voice.channel.id !==
				interaction.guild.members.me.voice.channel.id
		) {
			return interaction.editReply({
				content:
					"❌ | You need to be in the same voice channel as me to do that",
				ephemeral: true,
			});
		}

		const queue = interaction.client.player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing) {
			return interaction.editReply({
				content: ":x: |  There is no music playing  in this guild !",
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
			const x = await queue.setPaused(false);
			return await interaction.editReply(
				x ? " ▶ | Resumed !" : ":x: |  Failed to resume"
			);
		}
	},
};
