export interface WorkerEnv {
  NOTIFY_SECRET: string;
  NOTIFICATION_QUEUE: Queue;
  DISCORD_WEBHOOK_URL: string;
  STEAM_API_KEY: string;
}

type ServerId = string;

export interface ServerDetails {
  name: string;
  ip: string;
}

interface SteamPlayer {
  steamid: string;
  personaname: string;
  avatarfull: string;
}

const servers: Record<ServerId, ServerDetails> = {
  prophunt: {
    name: "Prophunt",
    ip: "138.68.145.172:27015",
  },
};

export const getServerInfo = (server: ServerId): ServerDetails | null =>
  servers[server] ?? null;

export const getSteamPlayer = async (
  apiKey: string,
  steamId: string
): Promise<SteamPlayer> => {
  const res = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
  );
  const json: any = await res.json();
  return json.response.players[0] as SteamPlayer;
};

const getThumbnailForMap = (map: string): string =>
  `https://fastdl.allfortress.com/map_thumbnails/${encodeURIComponent(
    map
  )}.jpg`;

const discordWebhook = async (webhookUrl: string, data: any) =>
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const discordSendPlayerJoined = async (
  webhookUrl: string,
  player: SteamPlayer,
  playerCount: string
) =>
  discordWebhook(webhookUrl, {
    __slack: true,
    username: player.personaname,
    avatar_url: player.avatarfull,
    embeds: [
      {
        color: 0x008000,
        fields: [
          {
            name: "Player Joined:",
            value: `[${player.personaname}](https://www.steamcommunity.com/profiles/${player.steamid})`,
            inline: true,
          },
          {
            name: "Players Online:",
            value: playerCount,
            inline: true,
          },
        ],
      },
    ],
  });

export const discordSendMapChanged = async (
  webhookUrl: string,
  server: ServerDetails,
  map: string,
  mapName: string,
  playerCount: string
) =>
  discordWebhook(webhookUrl, {
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
            value: playerCount,
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
