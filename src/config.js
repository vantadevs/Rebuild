const { ChannelType, PermissionFlagsBits } = require('discord.js');

// Central source of truth for every role, category, channel and access rule.
// Role icons are intentionally not fabricated. Add original icon assets separately if supplied.

const P = PermissionFlagsBits;

const roles = [
  { key: 'ceo', name: '👑 C.E.O', color: '#F1C40F', permissions: [P.ManageGuild, P.ManageRoles, P.ManageChannels, P.ViewAuditLog, P.ManageMessages, P.ModerateMembers, P.KickMembers, P.BanMembers, P.ManageNicknames, P.ManageWebhooks, P.ManageGuildExpressions, P.ManageEvents, P.ManageThreads, P.MuteMembers, P.DeafenMembers, P.MoveMembers] },
  { key: 'seniorManager', name: '👑 Senior Manager', color: '#E74C3C', permissions: [P.ViewAuditLog, P.ManageMessages, P.ModerateMembers, P.KickMembers, P.BanMembers, P.ManageNicknames, P.ManageThreads, P.MuteMembers, P.DeafenMembers, P.MoveMembers] },
  { key: 'manager', name: '💎 Manager', color: '#3498DB', permissions: [P.ViewAuditLog, P.ManageMessages, P.ModerateMembers, P.KickMembers, P.ManageNicknames, P.ManageThreads, P.MuteMembers, P.DeafenMembers, P.MoveMembers] },
  { key: 'trialManager', name: '🛡️ Trial Manager', color: '#E67E73', permissions: [P.ViewAuditLog, P.ManageMessages, P.ModerateMembers, P.ManageThreads] },
  { key: 'developer', name: '💻 Developer', color: '#FFFFFF', permissions: [P.ManageWebhooks] },
  { key: 'backupBot', name: 'Novex Backup Bot', color: '#5865F2', permissions: [] },
  { key: 'authBot', name: 'Novex Auth', color: '#5865F2', permissions: [] },
  { key: 'bots', name: '🤖 Bots', color: '#00DDEB', permissions: [P.UseApplicationCommands] },
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
      { name: '🟢 ▫ ɢᴇᴛɴᴏᴠᴇx.xyz', type: ChannelType.GuildVoice, access: 'stats' },
      { name: '👥 ▫ ᴍᴇᴍʙᴇʀꜱ-598569', type: ChannelType.GuildVoice, access: 'stats' },
      { name: '🎯 ▫ ɢᴏᴀʟ-750000', type: ChannelType.GuildVoice, access: 'stats' }
    ]
  },
  {
    name: '✅ | Verification', access: 'public', channels: [
      { name: '📖 ▫ ᴛᴏꜱ', type: ChannelType.GuildText, access: 'readOnly' },
      { name: '✅ ▫ ᴠᴇʀɪꜰʏ', type: ChannelType.GuildText, access: 'publicWrite' },
      { name: '🎭 ▫ ʀᴏʟᴇꜱ', type: ChannelType.GuildText, access: 'publicWrite' }
    ]
  },
  {
    name: '📢 | Important', access: 'public', channels: [
      { name: '📢 ▫ ɴᴇᴡꜱ', type: ChannelType.GuildText, access: 'readOnly' },
      { name: '📜 ▫ ᴄʜᴀɴɢᴇꜱ', type: ChannelType.GuildText, access: 'readOnly' },
      { name: '🔑 ▫ ʜᴡɪᴅ-ʀᴇꜱᴇᴛ', type: ChannelType.GuildText, access: 'verifiedWrite' },
      { name: '🎁 ▫ ɢɪᴠᴇᴀᴡᴀʏꜱ', type: ChannelType.GuildText, access: 'verifiedWrite' },
      { name: '⭐ ▫ ʀᴇᴠɪᴇᴡꜱ', type: ChannelType.GuildText, access: 'verifiedWrite' },
      { name: '🛒 ▫ ʀᴇꜱᴇʟʟᴇʀ-ʟɪꜱᴛ', type: ChannelType.GuildText, access: 'readOnly' },
      { name: '📝 ▫ ꜱᴛᴀꜰꜰ-ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴꜱ', type: ChannelType.GuildText, access: 'publicWrite' }
    ]
  },
  {
    name: '❓ | Support', access: 'public', channels: [
      { name: '📩 ▫ ᴛɪᴄᴋᴇᴛꜱ', type: ChannelType.GuildText, access: 'ticket' },
      { name: '🛒 ▫ ᴘᴜʀᴄʜᴀꜱᴇ', type: ChannelType.GuildText, access: 'ticket' },
      { name: '🆘 ▫ ꜱᴜᴘᴘᴏʀᴛ', type: ChannelType.GuildForum, access: 'forum' },
      { name: '🐞 ▫ ʙᴜɢ-ʀᴇᴘᴏʀᴛ', type: ChannelType.GuildForum, access: 'forum' },
      { name: '📸 ▫ ᴍᴇᴅɪᴀ', type: ChannelType.GuildForum, access: 'forum' }
    ]
  },
  {
    name: '🔮 | Novex Hub', access: 'verified', channels: [
      { name: '📜 ▫ ɢᴇᴛ-ꜱᴄʀɪᴘᴛ', type: ChannelType.GuildText, access: 'verifiedWrite' },
      { name: '🎮 ▫ ꜱᴜᴘᴘᴏʀᴛᴇᴅ-ɢᴀᴍᴇꜱ', type: ChannelType.GuildText, access: 'readVerified' },
      { name: '👑 ▫ ᴘʀᴇᴍɪᴜᴍ', type: ChannelType.GuildText, access: 'clientWrite' },
      { name: '🔑 ▫ ɢᴇᴛ-ᴋᴇʏ', type: ChannelType.GuildText, access: 'clientWrite' }
    ]
  },
  { name: '🛒 | Resellers', access: 'reseller', channels: [ { name: '🛒 ▫ ʀᴇꜱᴇʟʟᴇʀꜱ', type: ChannelType.GuildText, access: 'resellerWrite' } ] },
  { name: '💬 | Community', access: 'verified', channels: [ { name: '💬 ▫ ᴄʜᴀᴛ', type: ChannelType.GuildText, access: 'verifiedWrite' } ] },
  {
    name: '💎 | Clients', access: 'clients', channels: [
      { name: '💎 ▫ ᴄʟɪᴇɴᴛ-ɴᴇᴡꜱ', type: ChannelType.GuildText, access: 'clientRead' },
      { name: '💬 ▫ ᴄʟɪᴇɴᴛ-ᴄʜᴀᴛ', type: ChannelType.GuildText, access: 'clientWrite' },
      { name: '🌐 ▫ ᴄʟɪᴇɴᴛ-ᴘᴀɴᴇʟ', type: ChannelType.GuildText, access: 'clientWrite' },
      { name: '🐞 ▫ ʙᴜɢꜱ', type: ChannelType.GuildForum, access: 'clientForum' }
    ]
  },
  {
    name: '📸 | Content', access: 'content', channels: [
      { name: '📣 ▫ ᴄᴄ-ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛꜱ', type: ChannelType.GuildText, access: 'contentRead' },
      { name: '💬 ▫ ᴄʜᴀᴛ', type: ChannelType.GuildText, access: 'contentWrite' },
      { name: '🎬 ▫ ʏᴏᴜᴛᴜʙᴇ', type: ChannelType.GuildText, access: 'contentWrite' },
      { name: '🎵 ▫ ᴛɪᴋᴛᴏᴋ', type: ChannelType.GuildText, access: 'contentWrite' }
    ]
  },
  {
    name: '❗ | Staff Information', access: 'staff', channels: [
      { name: '📢 ▫ ꜱᴛᴀꜰꜰ-ɴᴇᴡꜱ', type: ChannelType.GuildText, access: 'staffRead' },
      { name: '❓ ▫ ꜱᴛᴀꜰꜰ-ꜰᴀǫ', type: ChannelType.GuildText, access: 'staffWrite', starterMessage: '**Novex Staff FAQ & Guidelines**\n\n1. Treat members and colleagues respectfully.\n2. Keep internal information confidential.\n3. Handle tickets professionally and never promise outcomes you cannot deliver.\n4. Escalate serious incidents to management.\n5. Record moderation actions accurately and use the correct channels.\n6. Do not misuse staff permissions or access customer information without a work-related reason.\n7. Follow management instructions and keep staff discussions in staff channels.\n\n**Ticket standards**\n- Respond promptly and remain professional.\n- Gather the relevant order, account or error details before escalating.\n- Never request passwords, tokens or other authentication secrets.\n\n**Moderation standards**\n- Apply rules consistently and proportionately.\n- Document timeouts, bans and other significant actions.\n- Do not use moderation tools for personal disputes.' },
      { name: '⬆️ ▫ ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛɪᴠᴇ-ʟᴏɢꜱ', type: ChannelType.GuildText, access: 'adminRead' }
    ]
  },
  {
    name: '👥 | Staff', access: 'staff', channels: [
      { name: '💬 ▫ ꜱᴛᴀꜰꜰ-ᴄʜᴀᴛ', type: ChannelType.GuildText, access: 'staffWrite' },
      { name: '📜 ▫ ʜʀ-ᴄʜᴀᴛ', type: ChannelType.GuildText, access: 'managementWrite' },
      { name: '🤖 ▫ ꜱᴛᴀꜰꜰ-ʙᴏᴛꜱᴘᴀᴍ', type: ChannelType.GuildText, access: 'staffWrite' },
      { name: '📜 ▫ ᴛᴏ-ᴅᴏ', type: ChannelType.GuildText, access: 'staffWrite' },
      { name: '👥 ▫ ꜱᴛᴀꜰꜰ-ᴠᴄ', type: ChannelType.GuildVoice, access: 'staffVoice' }
    ]
  },
  {
    name: '🖊️ | Info', access: 'info', channels: [
      { name: '🖊️ ▫ ᴛɪᴍᴇᴏᴜᴛ-ɪɴꜰᴏ', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ ▫ ᴀʟʟ-ɪɴꜰᴏ', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ ▫ ʙᴀɴ-ɪɴꜰᴏ', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ ▫ ʀᴏʟᴇ-ɪɴꜰᴏ', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ ▫ ꜱᴛᴀꜰꜰ-ᴀᴘᴘꜱ', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ ▫ ᴠᴇʀɪꜰɪᴄᴀᴛɪᴏɴ-ɪɴꜰᴏ', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ ▫ ᴛʀᴀɴꜱᴄʀɪᴘᴛꜱ', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ ▫ ꜱᴛᴀꜰꜰ-ʀᴀᴛɪɴɢꜱ', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ ▫ ᴀᴜᴛᴏ-ᴍᴏᴅ-ʟᴏɢꜱ', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ ▫ ɢᴇɴᴇʀᴀᴛᴇᴅ-ᴋᴇʏꜱ', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ ▫ ᴡᴇʙꜱɪᴛᴇ-ᴅᴇᴠ-ʟᴏɢꜱ', type: ChannelType.GuildText, access: 'developerRead' },
      { name: '🖊️ ▫ ᴋᴇʏ-ɢᴇɴ', type: ChannelType.GuildText, access: 'managementRead' },
      { name: '🖊️ ▫ ᴊᴏɪɴ-ɪɴꜰᴏ', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ ▫ ᴅᴇʟᴇᴛᴇᴅ-ᴍꜱɢ-ɪɴꜰᴏ', type: ChannelType.GuildText, access: 'adminRead' },
      { name: '🖊️ ▫ ᴄʜᴀɴɴᴇʟ-ɪɴꜰᴏ', type: ChannelType.GuildText, access: 'managementRead' }
    ]
  }
];

function overwrite(id, allow = [], deny = []) {
  return { id, allow, deny };
}

// Simple category baseline requested for Novex:
// - @everyone cannot see any rebuilt category.
// - Ordinary members with the ❄️ Novex role can see non-staff categories,
//   but cannot chat, react, create threads, or use voice.
// - Staff-only categories (Staff Information, Staff, and Info) are visible
//   to Novex Studios | Staff, who can communicate in those categories.
// Individual channel overwrites can be adjusted manually after the rebuild.
const MEMBER_VIEW_ONLY_DENIES = [
  P.SendMessages,
  P.AddReactions,
  P.CreatePublicThreads,
  P.CreatePrivateThreads,
  P.SendMessagesInThreads,
  P.Connect,
  P.Speak,
  P.Stream,
  P.UseVAD
];

const STAFF_CATEGORY_ALLOW = [
  P.ViewChannel,
  P.ReadMessageHistory,
  P.SendMessages,
  P.SendMessagesInThreads,
  P.AddReactions,
  P.Connect,
  P.Speak,
  P.Stream,
  P.UseVAD
];

function categoryOverwrites(guild, roleIds, access) {
  const rows = [
    // Hide the category from @everyone and any role that has no explicit grant.
    overwrite(guild.roles.everyone.id, [], [P.ViewChannel])
  ];

  const staffOnly = ['staff', 'info'].includes(access);
  const targetRoleId = staffOnly ? roleIds.studioStaff : roleIds.novex;

  if (targetRoleId) {
    rows.push(staffOnly
      ? overwrite(targetRoleId, STAFF_CATEGORY_ALLOW)
      : overwrite(targetRoleId, [P.ViewChannel, P.ReadMessageHistory], MEMBER_VIEW_ONLY_DENIES));
  }

  // Keep the bot able to manage and inspect every category/channel it creates.
  if (guild.members.me) {
    rows.push(overwrite(guild.members.me.id, [
      P.ViewChannel,
      P.ReadMessageHistory,
      P.SendMessages,
      P.ManageChannels,
      P.ManageRoles
    ]));
  }
  return rows;
}

// Child channels receive the same simple baseline as their parent category.
// This makes the initial permissions predictable while allowing the owner to
// customise individual channels manually after the rebuild.
function channelOverwrites(guild, roleIds, categoryAccess) {
  return categoryOverwrites(guild, roleIds, categoryAccess);
}

module.exports = { roles, categories, groups, categoryOverwrites, channelOverwrites, P };
