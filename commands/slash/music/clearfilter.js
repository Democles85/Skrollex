const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear-filter")
		.setDescription("Clears all filters from the queue"),
	async execute(interaction) {
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

		const filters = [];

		const actualFilter = queue.getFiltersEnabled()[0];

		queue.getFiltersEnabled().map((f) => filters.push(f));
		queue.getFiltersDisabled().map((f) => filters.push(f));

		if (filters.length === 0)
			return interaction.followUp({
				content: "❌ | There are no filters to clear!",
			});

		await queue.setFilters("remove");

		const formattedFilter =
			actualFilter.charAt(0).toUpperCase() +
			actualFilter
				.slice(1)
				.replace(/([A-Z])/g, " $1")
				.trim();

		return interaction.followUp({
			content: `✅ | Filter **${formattedFilter}** cleared!`,
		});
	},
};
