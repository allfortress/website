import {
  getServerInfo,
  getThumbnailForMap,
  getSteamPlayer,
  triggerDiscordWebhook,
} from "../../lib/shared";

export async function onRequestPost(context) {
  const auth = context.request.headers.get("Authorization");
  if (auth !== context.env.NOTIFY_SECRET) {
    return new Response("Invalid secret", { status: 403 });
  }

  const server = getServerInfo(context.params.server);
  if (!server) {
    return new Response("Unknown server", { status: 400 });
  }

  try {
    const data = await context.request.formData();
    switch (data.get("event")) {
      case "map-changed":
        await onMapChange(
          server,
          context.env.DISCORD_WEBHOOK_URL,
          data.get("map"),
          data.get("map_name"),
          data.get("players")
        );
        return new Response("OK");

      case "player-joined":
        await onPlayerJoined(
          context.env.DISCORD_WEBHOOK_URL,
          context.env.STEAM_API_KEY,
          data.get("steamid"),
          data.get("players")
        );
        return new Response("OK");
    }
  } catch (e) {
    return new Response("Error handling event data", { status: 400 });
  }

  return new Response("Unknown event", { status: 400 });
}

const onMapChange = async (server, discordWebhook, map, mapName, players) => {
  await mapChanged(discordWebhook, map, mapName, players, server);
};

const onPlayerJoined = async (
  discordWebhook,
  steamApiKey,
  steamId,
  players
) => {
  const steamPlayer = await getSteamPlayer(steamApiKey, steamId);

  await playerJoined(
    discordWebhook,
    steamPlayer.steamid,
    steamPlayer.personaname,
    steamPlayer.avatarfull,
    players
  );
};

const playerJoined = async (webhookUrl, steamId, playerName, avatar, players) =>
  triggerDiscordWebhook(webhookUrl, {
    __slack: true,
    username: playerName,
    avatar_url: avatar,
    embeds: [
      {
        color: 0x008000,
        fields: [
          {
            name: "Player Joined:",
            value: `[${playerName}](https://www.steamcommunity.com/profiles/${steamId})`,
            inline: true,
          },
          {
            name: "Players Online:",
            value: players,
            inline: true,
          },
        ],
      },
    ],
  });

const mapChanged = async (webhookUrl, map, mapName, players, server) =>
  triggerDiscordWebhook(webhookUrl, {
    __slack: true,
    username: `${server.name} Server`,
    embeds: [
      {
        color: 0xdaa520,
        thumbnail: {
          url: getThumbnailForMap(map),
        },
        fields: [
          {
            name: "Map Changed:",
            value: mapName,
            inline: true,
          },
          {
            name: "Players Online:",
            value: players,
            inline: true,
          },
          {
            name: "Join Server:",
            value: `\`connect ${server.ip}\``,
            inline: true,
          },
        ],
      },
    ],
  });
