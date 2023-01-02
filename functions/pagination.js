const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
} = require("discord.js");

async function paginate(interaction, pages, timeout = 120000) {
	// Error handling
	if (!interaction) throw new Error("INTERACTION_NOT_PROVIDED");
	if (!pages) throw new Error("PAGES_NOT_PROVIDED");
	if (!Array.isArray(pages)) throw new Error("PAGES_NOT_ARRAY");

	if (typeof timeout !== "number") throw new Error("TIMEOUT_NOT_NUMBER");
	if (parseInt(timeout) < 30000) throw new Error("TIMEOUT_TOO_LOW");

	// Defer the reply
	// await interaction.deferReply({ ephemeral: true });

	// If there is only one page, send it and return
	if (pages.length === 1) {
		const page = await interaction.editReply({
			embeds: pages,
			components: [],
		});

		return page;
	}

	// Adding the buttons
	const prev = new ButtonBuilder()
		.setCustomId("paginate-prev")
		.setLabel("Previous")
		.setStyle(ButtonStyle.Primary)
		.setDisabled(true);

	const home = new ButtonBuilder()
		.setCustomId("paginate-home")
		.setLabel("Home")
		.setStyle(ButtonStyle.Danger)
		.setDisabled(true);

	const next = new ButtonBuilder()
		.setCustomId("paginate-next")
		.setLabel("Next")
		.setStyle(ButtonStyle.Primary);

	const buttonRow = new ActionRowBuilder().addComponents(prev, home, next);
	let index = 0;

	const currentPage = await interaction.editReply({
		embeds: [pages[index]],
		components: [buttonRow],
	});

	const collector = await currentPage.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: timeout,
	});

	collector.on("collect", async (i) => {
		if (i.user.id !== interaction.user.id) {
			return i.reply({
				content: ":x: | You are not the one who started this interaction!",
				ephemeral: true,
			});
		}

		await i.deferUpdate();

		if (i.customId === "paginate-prev") {
			if (index > 0) index--;
		} else if (i.customId === "paginate-home") {
			index = 0;
		} else if (i.customId === "paginate-next") {
			if (index < pages.length - 1) index++;
		}

		if (index === 0) prev.setDisabled(true);
		else prev.setDisabled(false);

		if (index === 0) home.setDisabled(true);
		else home.setDisabled(false);

		if (index === pages.length - 1) next.setDisabled(true);
		else next.setDisabled(false);

		await currentPage.edit({
			embeds: [pages[index]],
			components: [buttonRow],
		});

		collector.resetTimer();
	});

	// Ending the collector
	collector.on("end", async (i) => {
		await currentPage.edit({
			embeds: [pages[index]],
			components: [],
		});
	});

	return currentPage;
}

module.exports = paginate;
