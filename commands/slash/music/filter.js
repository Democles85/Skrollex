const { SlashCommandBuilder } = require("@discordjs/builders");

const choices = Object.keys(require("discord-player").AudioFilters.filters)
	// Format the name to be readable by humans
	.map((filter) => ({
		name: filter[0].toUpperCase() + filter.slice(1).replace(/_/g, " "),
		value: filter,
	}))
	.splice(0, 25);

// console.log(choices);

let data = new SlashCommandBuilder()
	.setName("filter")
	.setDescription("Enable or disable a filter");

data.addStringOption((option) =>
	option.setName("filter").setDescription("The filter to enable or disable")
);

choices.forEach((choice) => {
	data.options[0].addChoices({ name: choice.name, value: choice.value });
});

module.exports = {
	data: data,
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

		const actualFilter = queue.getFiltersEnabled()[0];

		const infilter = interaction.options.getString("filter");

		const filters = [];

		queue.getFiltersEnabled().map((f) => filters.push(f));
		queue.getFiltersDisabled().map((f) => filters.push(f));

		const filter = filters.find(
			(x) => x.toLowerCase() === infilter.toLowerCase()
		);

		if (!filter)
			return interaction.followUp({
				content: `This filter doesn't exist ${
					interaction.member
				}... try again ? ❌\n${
					actualFilter ? `Filter currently active ${actualFilter}.\n` : ""
				}List of available filters ${filters
					.map((x) => `**${x}**`)
					.join(", ")}.`,
				ephemeral: true,
			});
		const filtersUpdated = {};

		filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter)
			? false
			: true;

		await queue.setFilters(filtersUpdated);

		return interaction.followUp({
			content: `✅ | Filter ${
				filtersUpdated[filter] ? "enabled" : "disabled"
			}! Current queue filters: ${
				queue
					.getFiltersEnabled()
					.map((f) => `**${f}**`)
					.join(", ") || "None"
			}`,
			ephemeral: true,
		});
	},
};
