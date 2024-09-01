const servers = {
  prophunt: {
    name: "Prophunt",
    ip: "138.68.145.172:27015",
  },
};

export const getServerInfo = (server) => servers[server] ?? null;
