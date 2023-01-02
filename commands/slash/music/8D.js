const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("8d")
		.setDescription("Toggle 8D on or off")
		.addBooleanOption((option) =>
			option.setName("enabled").setDescription("enable/disable the 8D filter")
		),
	execute: async (interaction) => {
		const queue = interaction.client.player.getQueue(interaction.guildId);

		if (!interaction.member.voice.channel)
			return void interaction.followUp({
				content: "❌ | You need to be in a voice channel to use this command!",
			});

		if (
			interaction.guild.members.me.voice.channel &&
			interaction.member.voice.channel.id !==
				interaction.guild.members.me.voice.channel.id
		)
			return interaction.editReply({
				content: `❌ | You need to be in the same voice channel as me to do that`,
				ephemeral: true,
			});

		if (!queue || !queue.playing)
			return void interaction.followUp({
				content: "❌ | No music is being played!",
			});

		await queue.setFilters({
			"8D": !queue.getFiltersEnabled().includes("8D"),
			// normalizer2: !queue.getFiltersEnabled().includes("normalizer2"),
		});

		return void interaction.followUp({
			content: `✅ | 8D is now ${
				queue.getFiltersEnabled().includes("8D")
					? "**enabled**"
					: "**disabled**"
			}!`,
		});
	},
};
