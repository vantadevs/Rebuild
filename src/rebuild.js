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
  console.log('[rebuild] Stage 1/6: checking permissions and recording the existing server');
  const me = guild.members.me || await guild.members.fetchMe();
  if (!me.permissions.has('ManageChannels') || !me.permissions.has('ManageRoles')) {
    throw new Error('The bot needs Manage Channels and Manage Roles server permissions before it can rebuild. No channels or roles were deleted.');
  }

  const channels = await guild.channels.fetch();
  const fetchedRoles = await guild.roles.fetch();
  report.original.channels = channels.filter(Boolean).map(c => ({ id: c.id, name: c.name, type: c.type, parentId: c.parentId }));
  report.original.roles = fetchedRoles.filter(r => r.id !== guild.id).map(r => ({ id: r.id, name: r.name, color: r.hexColor, position: r.position, managed: r.managed }));

  // Discord only lets the bot manage roles strictly below its highest role.
  // Stop before deleting anything if a normal role is above it.
  const blockedRoles = fetchedRoles.filter(r => r.id !== guild.id && !r.managed && !r.tags?.botId && !r.tags?.integrationId && !r.editable);
  if (blockedRoles.length) {
    const names = blockedRoles.map(r => `@${r.name} (position ${r.position})`).join(', ');
    throw new Error(`Cannot delete these old roles because they are above the bot's highest role or the bot lacks hierarchy access: ${names}. Move the bot's highest role above all ordinary roles, confirm Manage Roles, then run /rebuild again. No channels or roles were deleted.`);
  }

  // Persist a backup before the first destructive API call.
  const reportDir = path.join(process.cwd(), 'rebuild-reports');
  fs.mkdirSync(reportDir, { recursive: true });
  report.backupFile = path.join(reportDir, `pre-rebuild-${Date.now()}.json`);
  fs.writeFileSync(report.backupFile, JSON.stringify({ guildId: guild.id, guildName: guild.name, capturedAt: new Date().toISOString(), original: report.original }, null, 2));

  console.log('[rebuild] Stage 2/6: deleting all existing channels and categories');
  const orderedChannels = [...channels.values()].filter(Boolean).sort((a, b) => {
    const ac = a.type === ChannelType.GuildCategory ? 1 : 0;
    const bc = b.type === ChannelType.GuildCategory ? 1 : 0;
    return ac - bc;
  });
  for (const channel of orderedChannels) {
    await safeDelete(channel, `channel #${channel.name} (${channel.id})`, report);
    await delay(180);
  }

  console.log('[rebuild] Stage 3/6: deleting all existing non-managed roles');
  const deletable = fetchedRoles.filter(r => r.id !== guild.id && !r.managed && !r.tags?.botId && !r.tags?.integrationId);
  // Delete from lowest to highest; never touch @everyone or managed integration roles.
  for (const role of deletable.sort((a, b) => a.position - b.position)) {
    await safeDelete(role, `role @${role.name} (${role.id})`, report);
    await delay(180);
  }
  const retained = fetchedRoles.filter(r => r.id !== guild.id && (r.managed || r.tags?.botId || r.tags?.integrationId));
  report.retainedManagedRoles = retained.map(r => `${r.name} (${r.id})`);
}

async function createRoles(guild, report) {
  console.log('[rebuild] Stage 4/6: creating Novex roles in exact hierarchy order');
  const roleIds = {};
  const current = await guild.roles.fetch();

  // Create in the requested order, then explicitly position the editable roles
  // directly beneath the bot's highest role. The preflight has already checked hierarchy access.
  for (const item of roleConfig) {
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

  // Place CEO at the top, with each subsequent role directly beneath it.
  // The bot's own highest role remains above this block as Discord requires.
  try {
    const botMember = await guild.members.fetchMe();
    const refreshed = await guild.roles.fetch();
    const ordered = roleConfig.map(item => ({ item, role: refreshed.get(roleIds[item.key]) })).filter(x => x.role && !x.role.managed);
    const topAvailablePosition = botMember.roles.highest.position - 1;
    const positionUpdates = ordered.map((entry, index) => ({
      role: entry.role.id,
      position: topAvailablePosition - index
    }));
    if (positionUpdates.length) await guild.roles.setPositions(positionUpdates);
  } catch (error) {
    report.failed.push(`role hierarchy positioning: ${error.message}`);
  }

  const verifiedRoles = await guild.roles.fetch();
  const positions = roleConfig.map(item => {
    const role = verifiedRoles.get(roleIds[item.key]);
    return role ? { name: item.name, position: role.position, managed: role.managed } : null;
  }).filter(Boolean);
  for (let i = 1; i < positions.length; i++) {
    if (positions[i - 1].position <= positions[i].position) {
      report.warnings.push(`Role order could not be fully verified between ${positions[i - 1].name} and ${positions[i].name}. A managed role may be fixed in Discord's hierarchy.`);
    }
  }
  report.roleOrder = positions;
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
          permissionOverwrites: channelOverwrites(guild, roleIds, categoryConfig.access),
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
    rolesDeleted: report.deleted.filter(x => x.startsWith('role @')).length,
    channelsDeleted: report.deleted.filter(x => x.startsWith('channel #')).length,
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
