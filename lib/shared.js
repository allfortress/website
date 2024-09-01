const servers = {
  prophunt: {
    name: "Prophunt",
    ip: "138.68.145.172:27015",
  },
};

export const getServerInfo = (server) => servers[server] ?? null;

export const getThumbnailForMap = (map) =>
  `https://fastdl.allfortress.com/map_thumbnails/${encodeURIComponent(
    map
  )}.jpg`;

export const getSteamPlayer = async (apiKey, steamId) => {
  const res = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
  );
  const json = await res.json();
  return json.response.players[0];
};

export const triggerDiscordWebhook = async (webhookUrl, data) =>
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
