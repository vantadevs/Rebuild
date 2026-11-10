require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { rebuildGuild } = require('./rebuild');

const required = ['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const command = new SlashCommandBuilder()
  .setName('rebuild')
  .setDescription('Delete the current server structure and rebuild the Novex layout')
  .setDefaultMemberPermissions(null);

async function registerCommand() {
  if (String(process.env.SKIP_COMMAND_REGISTRATION).toLowerCase() === 'true') return;
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
    body: [command.toJSON()]
  });
  console.log('Registered /rebuild in guild', process.env.GUILD_ID);
}

function isAuthorised(interaction) {
  const configuredOwner = process.env.BOT_OWNER_ID;
  return interaction.guild && (
    interaction.user.id === interaction.guild.ownerId ||
    (configuredOwner && interaction.user.id === configuredOwner)
  );
}

function formatReport(report) {
  const s = report.summary;
  const lines = [
    '**Novex rebuild finished.**',
    `• Existing channels/categories deleted: **${s.channelsDeleted}**`,
    `• Old roles deleted: **${s.rolesDeleted}**`,
    `• Roles created: **${s.rolesCreated}**`,
    `• Categories created: **${s.categoriesCreated}**`,
    `• Channels created: **${s.channelsCreated}**`,
    `• Failures: **${s.failures}**`,
    `• Warnings: **${s.warnings}**`
  ];
  if (report.reusedManagedRoles.length) lines.push(`• Reused managed roles: ${report.reusedManagedRoles.join(', ')}`);
  if (report.failed.length) lines.push('\n**Failures (first 10):**\n' + report.failed.slice(0, 10).map(x => `• ${x}`).join('\n'));
  if (report.warnings.length) lines.push('\n**Warnings (first 10):**\n' + report.warnings.slice(0, 10).map(x => `• ${x}`).join('\n'));
  lines.push('\nMembers were kept. Old non-managed roles and their assignments were removed. Public channels are view-only for members; staff writing is limited to staff channels.');
  return lines.join('\n').slice(0, 1900);
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    await registerCommand();
  } catch (error) {
    console.error('Command registration failed:', error);
  }
});

client.on('guildMemberAdd', async member => {
  // Give new members the default Novex role after the rebuild has created it.
  try {
    const novexRole = member.guild.roles.cache.find(role => role.name === '❄️ Novex');
    if (novexRole) await member.roles.add(novexRole, 'Default Novex member role');
  } catch (error) {
    console.error(`Could not assign Novex role to ${member.user.tag}:`, error.message);
  }
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand() && interaction.commandName === 'rebuild') {
    if (!interaction.guild || interaction.guild.id !== process.env.GUILD_ID) {
      return interaction.reply({ content: 'This command is not configured for this server.', ephemeral: true });
    }
    if (!isAuthorised(interaction)) {
      return interaction.reply({ content: 'Only the actual server owner or configured bot owner can run this destructive rebuild.', ephemeral: true });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('novex_rebuild_confirm').setLabel('Delete and rebuild').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('novex_rebuild_cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
    );
    return interaction.reply({
      content: '**WARNING: This permanently deletes the existing channels, categories and all non-managed roles.**\nMembers stay in the server, but their existing non-managed roles and role assignments will be lost. The Novex structure will then be created.',
      components: [row],
      ephemeral: true
    });
  }

  if (interaction.isButton() && ['novex_rebuild_confirm', 'novex_rebuild_cancel'].includes(interaction.customId)) {
    if (!isAuthorised(interaction)) {
      return interaction.reply({ content: 'You are not authorised to confirm this rebuild.', ephemeral: true });
    }
    if (interaction.customId === 'novex_rebuild_cancel') {
      return interaction.update({ content: 'Rebuild cancelled. No server changes were made.', components: [] });
    }

    await interaction.update({ content: 'Rebuild confirmed. Deleting the old structure and creating Novex. This may take several minutes...', components: [] });
    try {
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      const report = await rebuildGuild(guild);
      const reportDir = path.join(process.cwd(), 'rebuild-reports');
      fs.mkdirSync(reportDir, { recursive: true });
      const reportPath = path.join(reportDir, `rebuild-${Date.now()}.json`);
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      await interaction.followUp({ content: formatReport(report), ephemeral: true });
    } catch (error) {
      console.error('Rebuild failed:', error);
      await interaction.followUp({ content: `The rebuild stopped because of an unexpected error: ${error.message}`, ephemeral: true }).catch(() => {});
    }
  }
});

client.on('error', error => console.error('Discord client error:', error));
process.on('unhandledRejection', error => console.error('Unhandled rejection:', error));

client.login(process.env.DISCORD_TOKEN);
