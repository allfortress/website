import {
  discordSendMapChanged,
  discordSendPlayerJoined,
  getServerInfo,
  getSteamPlayer,
  ServerDetails,
  WorkerEnv,
} from "../../lib/shared";

export const onRequestPost: PagesFunction<WorkerEnv> = async ({
  request,
  params,
  env,
}) => {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== env.NOTIFY_SECRET) {
    return new Response("Invalid secret", { status: 403 });
  }

  const server = getServerInfo(params.server as string);
  if (!server) {
    return new Response("Unknown server", { status: 400 });
  }

  try {
    const data = await request.formData();
    switch (data.get("event")) {
      case "map-changed":
        return await onMapChange({
          queue: env.NOTIFICATION_QUEUE,
          discordWebookUrl: env.DISCORD_WEBHOOK_URL,
          server: server,
          map: data.get("map"),
          mapName: data.get("map_name"),
          playerCount: data.get("players"),
        });

      case "player-joined":
        return await onPlayerJoined({
          queue: env.NOTIFICATION_QUEUE,
          discordWebookUrl: env.DISCORD_WEBHOOK_URL,
          steamApiKey: env.STEAM_API_KEY,
          server: server,
          steamId: data.get("steamid"),
          playerCount: data.get("players"),
        });
    }
  } catch (e) {
    return new Response("Error handling event data", { status: 400 });
  }

  return new Response("Unknown event", { status: 400 });
};

interface MapChangeDetails {
  queue: Queue;
  discordWebookUrl: string;
  server: ServerDetails;
  map: string;
  mapName: string;
  playerCount: string;
}

const onMapChange = async ({
  queue,
  discordWebookUrl,
  server,
  map,
  mapName,
  playerCount,
}: MapChangeDetails) => {
  await queue.send({
    event: "map-changed",
    server: server,
    map: map,
    mapName: mapName,
    playerCount: playerCount,
  });

  discordSendMapChanged(discordWebookUrl, server, map, mapName, playerCount);

  return new Response("OK");
};

interface PlayerJoinedDetails {
  queue: Queue;
  discordWebookUrl: string;
  steamApiKey: string;
  server: ServerDetails;
  steamId: string;
  playerCount: string;
}

const onPlayerJoined = async ({
  queue,
  discordWebookUrl,
  steamApiKey,
  server,
  steamId,
  playerCount,
}: PlayerJoinedDetails) => {
  await queue.send({
    event: "player-joined",
    server: server,
    steamId: steamId,
    playerCount: playerCount,
  });

  const steamPlayer = await getSteamPlayer(steamApiKey, steamId);
  await discordSendPlayerJoined(discordWebookUrl, steamPlayer, playerCount);

  return new Response("OK");
};
