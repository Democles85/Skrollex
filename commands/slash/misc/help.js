const {
	EmbedBuilder: MessageEmbed,
	ActionRowBuilder: MessageActionRow,
	ButtonBuilder: MessageButton,
	PermissionsBitField,
} = require("discord.js");
const paginate = require("../../../functions/pagination");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("List all commands of bot"),

	async execute(interaction) {
		const MAX_FIELDS = 25;

		const commands = interaction.client.slashCommands;
		const fields = commands.map((command) => ({
			name: `/${command.data.name}`,
			value: command.data.description,
		}));

		const client = interaction.client;

		if (fields.length <= MAX_FIELDS) {
			helpEmbed.addFields(fields);
			return interaction.editReply({
				embeds: [helpEmbed],
			});
		}

		const embeds = [];
		const chunks = chunkify(fields, MAX_FIELDS);

		for (let i = 0; i < chunks.length; i++) {
			const embed = new MessageEmbed()
				.setColor("Red")
				.setAuthor({
					name: `${interaction.user.username}`,
					iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
					url: `https://discord.com/users/${interaction.user.id}`,
				})
				.setDescription(
					`Hey there! I am ${client.user.username}, a  bot programmed by **[Democles](https://github.com/Democles85)** to help you with playing music.\n I support Spotify/YouTube/SoundCloud and my commands are listed below -`
				)
				.setTitle(`**${client.user.username}**`)
				.setThumbnail(client.user.avatarURL({ dynamic: true }))
				.setFooter({
					text: `${client.user.username.toUpperCase()} ${new Date().getFullYear()} | Page ${
						i + 1
					} of ${chunks.length}`,
					iconURL: client.user.avatarURL({ dynamic: true }),
				})
				.setTimestamp();
			embeds.push(embed.addFields(chunks[i]));
		}

		paginate(interaction, embeds);
	},
};

function chunkify(arr, chunkSize) {
	const chunks = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		chunks.push(arr.slice(i, i + chunkSize));
	}
	return chunks;
}
