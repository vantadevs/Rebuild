# Novex Server Rebuild Bot

A Discord.js v14 bot that deletes the existing guild channels/categories and all deletable (non-managed) roles, then recreates the Novex layout from `src/config.js`.

## Important behaviour

- Keeps the actual server owner and every server member in the guild.
- Does not kick or ban members.
- Deletes all existing channels and categories.
- Deletes all non-managed roles except `@everyone`.
- Preserves Discord-managed integration/bot roles because Discord does not allow bots to delete them.
- Creates the configured roles, categories, text/voice/forum channels and permission overwrites.
- Gives newly joining members the `❄️ Novex` role once it exists.
- Posts a staff FAQ and guidelines resource in `❓ | Staff Information` → `❓ | staff-faq`.
- Does not fabricate custom role icons. Role colours are configurable in `src/config.js`.
- Uses `/rebuild`, restricted to the actual server owner or `BOT_OWNER_ID`, with a destructive confirmation button.

**Role assignment warning:** deleting old roles removes those role assignments from existing members. The bot does not mass-assign the new Novex role to all existing members; that is intentionally not attempted automatically because very large guilds can require extensive member fetching and API operations. Existing members remain in the server. New members receive Novex automatically.

## 1. Create the Discord application

1. Open https://discord.com/developers/applications and create an application.
2. Add a Bot under the application.
3. Copy the bot token privately. Never post it in chat or commit it to GitHub.
4. Under **Bot → Privileged Gateway Intents**, enable **Server Members Intent**.
5. Invite the bot with the `bot` and `applications.commands` scopes. Grant these permissions:
   - Manage Channels
   - Manage Roles
   - View Channels
   - Send Messages
   - Read Message History
   - Embed Links
   - Manage Threads
   - View Audit Log (optional)
6. Place the bot's own role above every role it needs to manage. The bot cannot move or delete roles above its highest role, and cannot delete managed integration roles.

For the cleanest rebuild, invite/configure the bot before running the command and check its role position first.

## 2. Configure environment variables

Copy `.env.example` to `.env` for local use and set:

- `DISCORD_TOKEN` — bot token
- `CLIENT_ID` — application ID
- `GUILD_ID` — target server ID
- `BOT_OWNER_ID` — optional extra authorised user ID; the server owner is always authorised

Do not upload `.env` to GitHub. It is excluded by `.gitignore`.

## 3. Run locally

```bash
npm install
npm start
```

Then run `/rebuild` in the configured server and press **Delete and rebuild**.

## 4. Deploy on Railway

This project is compatible with Railway:

1. Push the project to a private GitHub repository.
2. Create a Railway project and deploy from that repository.
3. Add the four environment variables in Railway's Variables panel.
4. Railway runs `npm start` automatically using the package start script.
5. Keep the service running; use the Discord slash command to trigger the rebuild.

## 5. Customise

All role names, colours, permissions, categories, channels, channel types and channel access labels are in `src/config.js`. The rebuild engine is modularised in `src/rebuild.js`.

## Limitations to understand

- Discord may reject actions if the bot lacks permissions or its role is too low. Failures are reported in the command result and console logs.
- Managed bot/integration roles cannot be deleted or reliably repositioned by this bot. Existing managed roles are preserved; if their names differ from the requested Novex names, they may remain alongside the newly created roles.
- Existing members' old role assignments are lost when those roles are deleted. The server membership itself is preserved.
- Existing channel messages, forum posts, attachments, channel settings and category/channel IDs are permanently deleted with the old channels.
- Voice statistics names are static placeholders as specified; live member counts are not calculated.
- Ticket channels are configured as public ticket-entry channels with staff access. A separate ticket-management bot is still needed to create private ticket rooms and manage ticket transcripts.
