const { ChannelType, PermissionFlagsBits } = require('discord.js');

// Central source of truth for every role, category, channel and access rule.
// Role icons are intentionally not fabricated. Add original icon assets separately if supplied.

const P = PermissionFlagsBits;

const roles = [
  { key: 'ceo', name: '👑 C.E.O', color: '#F1C40F', permissions: [P.ManageGuild, P.ManageRoles, P.ManageChannels, P.ViewAuditLog, P.ManageMessages, P.ModerateMembers, P.KickMembers, P.BanMembers, P.ManageNicknames, P.ManageWebhooks, P.ManageGuildExpressions, P.ManageEvents, P.ManageThreads, P.MuteMembers, P.DeafenMembers, P.MoveMembers] },
  { key: 'seniorManager', name: '👑 Senior Manager', color: '#E74C3C', permissions: [P.ViewAuditLog, P.ManageMessages, P.ModerateMembers, P.KickMembers, P.BanMembers, P.ManageNicknames, P.ManageThreads, P.MuteMembers, P.DeafenMembers, P.MoveMembers] },
  { key: 'manager', name: '💎 Manager', color: '#3498DB', permissions: [P.ViewAuditLog, P.ManageMessages, P.ModerateMembers, P.KickMembers, P.ManageNicknames, P.ManageThreads, P.MuteMembers, P.DeafenMembers, P.MoveMembers] },
  { key: 'trialManager', name: '🛡️ Trial Manager', color: '#E67E73', permissions: [P.ViewAuditLog, P.ManageMessages, P.ModerateMembers, P.ManageThreads] },
  { key: 'developer', name: '💻 Developer', color: '#FFFFFF', permissions: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.EmbedLinks, P.AttachFiles, P.ManageWebhooks] },
  { key: 'backupBot', name: 'Novex Backup Bot', color: '#5865F2', permissions: [] },
  { key: 'authBot', name: 'Novex Auth', color: '#5865F2', permissions: [] },
  { key: 'bots', name: '🤖 Bots', color: '#00DDEB', permissions: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.EmbedLinks, P.AttachFiles, P.UseApplicationCommands] },
  { key: 'admin', name: 'Admin', color: '#E84393', permissions: [P.ViewAuditLog, P.ManageMessages, P.ModerateMembers, P.KickMembers, P.BanMembers, P.ManageChannels, P.ManageThreads] },
  { key: 'trialAdmin', name: 'Trial Admin', color: '#E67E22', permissions: [P.ManageMessages, P.ModerateMembers, P.ManageThreads] },
  { key: 'staffWeek', name: '👑 Staff of the Week', color: '#F1C40F', permissions: [] },
  { key: 'moderator', name: '🛠️ Moderator', color: '#E74C3C', permissions: [P.ManageMessages, P.ModerateMembers, P.ManageThreads] },
  { key: 'support', name: '⚒️ Support', color: '#7289DA', permissions: [] },
  { key: 'trialSupport', name: '⚒️ Trial Support', color: '#D35400', permissions: [] },
  { key: 'studioStaff', name: 'Novex Studios | Staff', color: '#95A5A6', permissions: [] },
  { key: 'reseller', name: '🦇 Reseller', color: '#8E44AD', permissions: [] },
  { key: 'studios', name: 'Novex Studios', color: '#9B59B6', permissions: [] },
  { key: 'contentCreator', name: 'Content Creator', color: '#E84393', permissions: [] },
  { key: 'coolPeople', name: 'Cool People', color: '#D63384', permissions: [] },
  { key: 'booster', name: 'Server Booster', color: '#9B59B6', permissions: [] },
  { key: 'clients', name: 'Clients', color: '#2ECC71', permissions: [] },
  { key: 'novex', name: '❄️ Novex', color: '#A7D8F0', permissions: [] }
];

const groups = {
  management: ['ceo', 'seniorManager', 'manager', 'trialManager'],
  admins: ['ceo', 'seniorManager', 'manager', 'trialManager', 'admin'],
  seniorManagement: ['ceo', 'seniorManager', 'manager'],
  staff: ['ceo', 'seniorManager', 'manager', 'trialManager', 'developer', 'admin', 'trialAdmin', 'staffWeek', 'moderator', 'support', 'trialSupport', 'studioStaff'],
  moderation: ['ceo', 'seniorManager', 'manager', 'trialManager', 'admin', 'trialAdmin', 'moderator'],
  supportTeam: ['ceo', 'seniorManager', 'manager', 'trialManager', 'admin', 'trialAdmin', 'support', 'trialSupport'],
  verified: ['novex', 'clients', 'booster', 'coolPeople', 'reseller', 'studios', 'studioStaff', 'contentCreator', 'staffWeek', 'support', 'trialSupport', 'moderator', 'trialAdmin', 'admin', 'developer', 'trialManager', 'manager', 'seniorManager', 'ceo'],
  clientStaff: ['ceo', 'seniorManager', 'manager', 'admin', 'support', 'trialSupport'],
  contentStaff: ['ceo', 'seniorManager', 'manager', 'studioStaff', 'contentCreator']
};

const categories = [
  {
    name: '📊 | Statistics', access: 'public', channels: [
      { name: '🟢 | Getnovex.xyz', type: ChannelType.GuildVoice, access: 'stats' },
      { name: '👥 | Members: 598569', type: ChannelType.GuildVoice, access: 'stats' },
      { name: '🎯 | Goal: 750000', type: ChannelType.GuildVoice, access: 'stats' }
    ]
  },
  {
    name: '✅ | Verification', access: 'public', channels: [
      { name: '📖 | tos', type: ChannelType.GuildText, access: 'readOnly' },
      { name: '✅ | verify', type: ChannelType.GuildText, access: 'publicWrite' },
      { name: '🎭 | roles', type: ChannelType.GuildText, access: 'publicWrite' }
    ]
  },
  {
    name: '📢 | Important', access: 'public', channels: [
      { name: '📢 | news', type: ChannelType.GuildText, access: 'readOnly' },
      { name: '📜 | changes', type: ChannelType.GuildText, access: 'readOnly' },
      { name: '🔑 | hwid-reset', type: ChannelType.GuildText, access: 'verifiedWrite' },
      { name: '🎁 | giveaways', type: ChannelType.GuildText, access: 'verifiedWrite' },
      { name: '⭐ | reviews', type: ChannelType.GuildText, access: 'verifiedWrite' },
      { name: '🛒 | reseller-list', type: ChannelType.GuildText, access: 'readOnly' },
      { name: '📝 | staff-applications', type: ChannelType.GuildText, access: 'publicWrite' }
    ]
  },
  {
    name: '❓ | Support', access: 'public', channels: [
      { name: '📩 | tickets', type: ChannelType.GuildText, access: 'ticket' },
      { name: '🛒 | purchase', type: ChannelType.GuildText, access: 'ticket' },
      { name: 'Support', type: ChannelType.GuildForum, access: 'forum' },
      { name: 'Bug-Report', type: ChannelType.GuildForum, access: 'forum' },
      { name: 'Media', type: ChannelType.GuildForum, access: 'forum' }
    ]
  },
  {
    name: '🔮 | Novex Hub', access: 'verified', channels: [
      { name: '📜 | get-script', type: ChannelType.GuildText, access: 'verifiedWrite' },
      { name: '🎮 | supported-games', type: ChannelType.GuildText, access: 'readVerified' },
      { name: '👑 | premium', type: ChannelType.GuildText, access: 'clientWrite' },
      { name: '🔑 | get-key', type: ChannelType.GuildText, access: 'clientWrite' }
    ]
  },
  { name: '🛒 | Resellers', access: 'reseller', channels: [ { name: '🛒 | resellers', type: ChannelType.GuildText, access: 'resellerWrite' } ] },
  { name: '💬 | Community', access: 'verified', channels: [ { name: '💬 | chat', type: ChannelType.GuildText, access: 'verifiedWrite' } ] },
  {
    name: '💎 | Clients', access: 'clients', channels: [
      { name: '💎 | client-news', type: ChannelType.GuildText, access: 'clientRead' },
      { name: '💬 | client-chat', type: ChannelType.GuildText, access: 'clientWrite' },
      { name: '🌐 | client-panel', type: ChannelType.GuildText, access: 'clientWrite' },
      { name: '🐞 | bugs', type: ChannelType.GuildForum, access: 'clientForum' }
    ]
  },
  {
    name: '📸 | Content', access: 'content', channels: [
      { name: '📣 | cc-announcements', type: ChannelType.GuildText, access: 'contentRead' },
      { name: '💬 | chat', type: ChannelType.GuildText, access: 'contentWrite' },
      { name: '🎬 | youtube', type: ChannelType.GuildText, access: 'contentWrite' },
      { name: '🎵 | tiktok', type: ChannelType.GuildText, access: 'contentWrite' }
    ]
  },
  {
    name: '❗ | Staff Information', access: 'staff', channels: [
      { name: '📢 | staff-news', type: ChannelType.GuildText, access: 'staffRead' },
      { name: '❓ | staff-faq', type: ChannelType.GuildText, access: 'staffWrite', starterMessage: '**Novex Staff FAQ & Guidelines**\n\n1. Treat members and colleagues respectfully.\n2. Keep internal information confidential.\n3. Handle tickets professionally and never promise outcomes you cannot deliver.\n4. Escalate serious incidents to management.\n5. Record moderation actions accurately and use the correct channels.\n6. Do not misuse staff permissions or access customer information without a work-related reason.\n7. Follow management instructions and keep staff discussions in staff channels.\n\n**Ticket standards**\n- Respond promptly and remain professional.\n- Gather the relevant order, account or error details before escalating.\n- Never request passwords, tokens or other authentication secrets.\n\n**Moderation standards**\n- Apply rules consistently and proportionately.\n- Document timeouts, bans and other significant actions.\n- Do not use moderation tools for personal disputes.' },
      { name: '⬆️ | administrative-logs', type: ChannelType.GuildText, access: 'adminRead' }
    ]
  },
  {
    name: '👥 | Staff', access: 'staff', channels: [
      { name: '💬 | staff-chat', type: ChannelType.GuildText, access: 'staffWrite' },
      { name: '📜 | hr-chat', type: ChannelType.GuildText, access: 'managementWrite' },
      { name: '🤖 | staff-botspam', type: ChannelType.GuildText, access: 'staffWrite' },
      { name: '📜 | to-do', type: ChannelType.GuildText, access: 'staffWrite' },
      { name: '👥 | staff-vc', type: ChannelType.GuildVoice, access: 'staffVoice' }
    ]
  },
  {
    name: '🖊️ | Info', access: 'staff', channels: [
      { name: '🖊️ | timeout-info', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ | all-info', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ | ban-info', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ | role-info', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ | staff-apps', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ | verification-info', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ | transcripts', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ | staff-ratings', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ | auto-mod-logs', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ | generated-keys', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ | website-dev-logs', type: ChannelType.GuildText, access: 'developerRead' },
      { name: '🖊️ | key-gen', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ | join-info', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ | deleted-msg-info', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ | channel-info', type: ChannelType.GuildText, access: 'managementRead' }
    ]
  }
];

function overwrite(id, allow = [], deny = []) {
  return { id, allow, deny };
}

function categoryOverwrites(guild, roleIds, access) {
  const everyone = guild.roles.everyone.id;
  const rows = [{ id: everyone, allow: [], deny: [P.ViewChannel] }];
  const add = keys => keys.forEach(key => { if (roleIds[key]) rows.push({ id: roleIds[key], allow: [P.ViewChannel], deny: [] }); });
  if (access === 'public') rows[0] = { id: everyone, allow: [P.ViewChannel], deny: [] };
  else if (access === 'verified') add(groups.verified);
  else if (access === 'reseller') add(['reseller', ...groups.management, 'admin']);
  else if (access === 'clients') add(['clients', ...groups.clientStaff]);
  else if (access === 'content') add(groups.contentStaff);
  else if (access === 'staff') add(groups.staff);
  return rows;
}

function channelOverwrites(guild, roleIds, access) {
  const everyone = guild.roles.everyone.id;
  const view = P.ViewChannel;
  const read = [view, P.ReadMessageHistory];
  const write = [...read, P.SendMessages, P.EmbedLinks, P.AttachFiles, P.AddReactions];
  const staffRead = [...read];
  const staffWrite = [...write];
  const denySend = [P.SendMessages, P.AddReactions, P.CreatePublicThreads, P.CreatePrivateThreads, P.SendMessagesInThreads];
  const rows = [overwrite(everyone, [], [view])];
  const add = (keys, allow, deny = []) => keys.forEach(key => { if (roleIds[key]) rows.push(overwrite(roleIds[key], allow, deny)); });
  const publicRead = () => rows.push(overwrite(everyone, read));
  const publicWrite = () => rows.push(overwrite(everyone, write));
  const verifiedRead = () => { publicRead(); add(groups.verified, read); };
  const verifiedWrite = () => add(groups.verified, write);
  const staffOnly = (keys = groups.staff, allow = staffRead) => add(keys, allow);

  switch (access) {
    case 'stats':
      rows[0] = overwrite(everyone, [view], [P.Connect, P.Speak, P.Stream, P.UseVAD]);
      break;
    case 'publicWrite': publicWrite(); break;
    case 'readOnly': publicRead(); rows[1] = overwrite(everyone, read, denySend); break;
    case 'verified': verifiedRead(); break;
    case 'readVerified': add(groups.verified, read); break;
    case 'verifiedWrite': verifiedWrite(); break;
    case 'ticket':
      publicWrite();
      add(groups.supportTeam, [...write, P.ManageMessages, P.ManageThreads]);
      break;
    case 'forum':
      add(groups.verified, [...read, P.SendMessages, P.CreatePublicThreads, P.SendMessagesInThreads, P.EmbedLinks, P.AttachFiles]);
      add(groups.supportTeam, [...read, P.SendMessages, P.CreatePublicThreads, P.CreatePrivateThreads, P.SendMessagesInThreads, P.ManageThreads]);
      break;
    case 'clientRead':
      add(['clients', ...groups.clientStaff], read);
      break;
    case 'clientWrite':
      add(['clients', ...groups.clientStaff], write);
      break;
    case 'clientForum':
      add(['clients'], [...read, P.SendMessages, P.CreatePublicThreads, P.SendMessagesInThreads, P.EmbedLinks, P.AttachFiles]);
      add(groups.clientStaff, [...read, P.SendMessages, P.CreatePublicThreads, P.CreatePrivateThreads, P.SendMessagesInThreads, P.ManageThreads]);
      break;
    case 'resellerWrite': add(['reseller', ...groups.management, 'admin'], write); break;
    case 'contentRead': add(groups.contentStaff, read); break;
    case 'contentWrite': add(groups.contentStaff, write); break;
    case 'staffRead': staffOnly(); break;
    case 'staffWrite': staffOnly(groups.staff, staffWrite); break;
    case 'staffVoice':
      add(groups.staff, [view, P.Connect, P.Speak, P.Stream, P.UseVAD]);
      break;
    case 'managementRead': staffOnly(groups.management, staffRead); add(['admin'], staffRead); break;
    case 'managementWrite': staffOnly(groups.management, staffWrite); add(['admin'], staffWrite); break;
    case 'adminRead': staffOnly(groups.admins, staffRead); break;
    case 'developerRead': staffOnly(['ceo', 'seniorManager', 'manager', 'developer'], staffRead); break;
    default: break;
  }

  // The bot itself must retain access to rebuild and report the result.
  if (guild.members.me) rows.push(overwrite(guild.members.me.id, [view, P.SendMessages, P.ReadMessageHistory, P.ManageChannels, P.ManageRoles]));
  return rows;
}

module.exports = { roles, categories, groups, categoryOverwrites, channelOverwrites, P };
