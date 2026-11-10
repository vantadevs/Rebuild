const fs = require('node:fs');
const path = require('node:path');
const { ChannelType } = require('discord.js');
const { roles: roleConfig, categories, categoryOverwrites, channelOverwrites } = require('./config');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function safeDelete(item, label, report) {
  try {
    await item.delete('Novex server rebuild');
    report.deleted.push(label);
    return true;
  } catch (error) {
    report.failed.push(`${label}: ${error.message}`);
    return false;
  }
}

async function cleanupGuild(guild, report) {
  console.log('[rebuild] Stage 1/6: recording and deleting existing channels');
  const channels = await guild.channels.fetch();
  const fetchedRoles = await guild.roles.fetch();
  report.original.channels = channels.filter(Boolean).map(c => ({ id: c.id, name: c.name, type: c.type, parentId: c.parentId }));
  report.original.roles = fetchedRoles.filter(r => r.id !== guild.id).map(r => ({ id: r.id, name: r.name, color: r.hexColor, position: r.position, managed: r.managed }));

  // Persist the original structure before the first destructive API call.
  const reportDir = path.join(process.cwd(), 'rebuild-reports');
  fs.mkdirSync(reportDir, { recursive: true });
  report.backupFile = path.join(reportDir, `pre-rebuild-${Date.now()}.json`);
  fs.writeFileSync(report.backupFile, JSON.stringify({ guildId: guild.id, guildName: guild.name, capturedAt: new Date().toISOString(), original: report.original }, null, 2));

  // Delete children before categories so category deletion is not blocked by children.
  const ordered = [...channels.values()].filter(Boolean).sort((a, b) => {
    const ac = a.type === ChannelType.GuildCategory ? 1 : 0;
    const bc = b.type === ChannelType.GuildCategory ? 1 : 0;
    return ac - bc;
  });
  for (const channel of ordered) {
    await safeDelete(channel, `channel #${channel.name} (${channel.id})`, report);
    await delay(180);
  }

  console.log('[rebuild] Stage 2/6: deleting existing non-managed roles');
  const deletable = fetchedRoles.filter(r => r.id !== guild.id && !r.managed && !r.tags?.botId && !r.tags?.integrationId);
  for (const role of deletable.sort((a, b) => a.position - b.position)) {
    await safeDelete(role, `role @${role.name} (${role.id})`, report);
    await delay(180);
  }
  const retained = fetchedRoles.filter(r => r.id !== guild.id && (r.managed || r.tags?.botId || r.tags?.integrationId));
  report.retainedManagedRoles = retained.map(r => `${r.name} (${r.id})`);
}

async function createRoles(guild, report) {
  console.log('[rebuild] Stage 3/6: creating Novex roles');
  const roleIds = {};
  const current = await guild.roles.fetch();

  for (const item of roleConfig) {
    // A Discord-managed integration role cannot be created or deleted by this bot.
    // Reuse a matching managed role when one exists; otherwise create a normal placeholder role.
    let role = current.find(r => r.name === item.name && r.managed);
    if (!role) {
      try {
        role = await guild.roles.create({
          name: item.name,
          color: item.color,
          permissions: item.permissions,
          mentionable: false,
          hoist: false,
          reason: 'Novex server rebuild'
        });
        report.createdRoles.push(role.name);
      } catch (error) {
        report.failed.push(`create role ${item.name}: ${error.message}`);
        continue;
      }
    } else {
      report.reusedManagedRoles.push(role.name);
    }
    roleIds[item.key] = role.id;
    await delay(220);
  }

  // Discord may constrain positions around managed roles. Attempt the requested order and report limits.
  const positions = [];
  for (let i = 0; i < roleConfig.length; i++) {
    const item = roleConfig[i];
    if (roleIds[item.key]) positions.push({ role: roleIds[item.key], position: roleConfig.length - i });
  }
  try {
    await guild.roles.setPositions(positions);
  } catch (error) {
    report.failed.push(`role hierarchy positioning: ${error.message}`);
  }
  return roleIds;
}

async function createChannels(guild, roleIds, report) {
  console.log('[rebuild] Stage 4/6: creating categories and channels');
  for (const categoryConfig of categories) {
    let category;
    try {
      category = await guild.channels.create({
        name: categoryConfig.name,
        type: ChannelType.GuildCategory,
        permissionOverwrites: categoryOverwrites(guild, roleIds, categoryConfig.access),
        reason: 'Novex server rebuild'
      });
      report.createdCategories.push(category.name);
    } catch (error) {
      report.failed.push(`create category ${categoryConfig.name}: ${error.message}`);
      continue;
    }

    for (const channelConfig of categoryConfig.channels) {
      try {
        const options = {
          name: channelConfig.name,
          type: channelConfig.type,
          parent: category.id,
          permissionOverwrites: channelOverwrites(guild, roleIds, channelConfig.access),
          reason: 'Novex server rebuild'
        };
        if (channelConfig.type === ChannelType.GuildForum) {
          options.defaultReactionEmoji = { emojiName: '💬' };
          options.defaultSortOrder = 0;
          options.defaultForumLayout = 1;
          options.availableTags = [];
        }
        const channel = await guild.channels.create(options);
        report.createdChannels.push(`${category.name} / ${channel.name}`);
        if (channelConfig.starterMessage && channel.isTextBased()) {
          await channel.send(channelConfig.starterMessage);
        }
      } catch (error) {
        report.failed.push(`create channel ${category.name} / ${channelConfig.name}: ${error.message}`);
      }
      await delay(250);
    }
  }
}

async function applyFinalPermissions(guild, report) {
  console.log('[rebuild] Stage 5/6: verifying channel permissions');
  const channels = await guild.channels.fetch();
  for (const channel of channels.values()) {
    if (!channel || channel.type === ChannelType.GuildCategory) continue;
    try {
      const everyoneOverwrite = channel.permissionOverwrites.cache.get(guild.id);
      if (!everyoneOverwrite) report.warnings.push(`${channel.name}: no explicit @everyone overwrite was returned by Discord`);
    } catch (error) {
      report.warnings.push(`${channel.name}: permission verification failed: ${error.message}`);
    }
  }
}

async function rebuildGuild(guild) {
  const report = {
    startedAt: new Date().toISOString(),
    original: { channels: [], roles: [] },
    deleted: [],
    createdRoles: [],
    reusedManagedRoles: [],
    retainedManagedRoles: [],
    createdCategories: [],
    createdChannels: [],
    failed: [],
    warnings: []
  };

  // Save the original structure in memory and a JSON file before destructive changes.
  await cleanupGuild(guild, report);
  const roleIds = await createRoles(guild, report);
  await createChannels(guild, roleIds, report);
  await applyFinalPermissions(guild, report);
  report.finishedAt = new Date().toISOString();
  report.summary = {
    deletedItems: report.deleted.length,
    rolesCreated: report.createdRoles.length,
    categoriesCreated: report.createdCategories.length,
    channelsCreated: report.createdChannels.length,
    failures: report.failed.length,
    warnings: report.warnings.length
  };
  console.log('[rebuild] Stage 6/6: finished', report.summary);
  return report;
}

module.exports = { rebuildGuild };
