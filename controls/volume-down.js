module.exports = {
	execute: async (interaction) => {
		const player = interaction.client.player;

		if (!interaction.member.voice.channel)
			return interaction.editReply({
				content: ":x: |  You're not in a voice channel !",
				ephemeral: true,
			});

		if (
			interaction.guild.members.me.voice.channel &&
			interaction.member.voice.channel.id !==
				interaction.guild.members.me.voice.channel.id
		)
			return interaction.editReply({
				content: ":x:| - You are not in the same voice channel !",
				ephemeral: true,
			});

		const queue = player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing)
			return interaction.editReply({
				content: ":x: |  There is no music playing  in this guild !",
				ephemeral: true,
			});

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
			let volume = queue.volume;
			if (volume.value <= 0) {
				return interaction.editReply(
					":x: | Your volume cannot be decreased as it's 0 already"
				);
			}
			volume = volume - 10;
			queue.setVolume(volume);

			return interaction.editReply(
				`:white_check_mark: | Volume decreased to ${volume}`
			);
		}
	},
};
