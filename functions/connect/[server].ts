import { getServerInfo, ServerDetails } from "../../lib/shared";

export const onRequestGet: PagesFunction = ({ params }) => {
  const server = getServerInfo(params.server as string);
  if (!server) {
    return new Response("Unknown server", { status: 400 });
  }

  return new Response(getHtml(server), {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  });
};

const getHtml = (server: ServerDetails) => {
  const connectUrl = `steam://connect/${server.ip}`;
  return `<!DOCTYPE HTML>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>allfortress.com</title>
            <link href="/css/style.css" rel="stylesheet">
            <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
            <link rel="icon" type="image/png" href="/images/favicon.png">
        </head>
        <body>
            <div class="container">
                <img src="/images/logo.svg" width="140" height="140">
                <h1 class="title">Connecting to ${server.name}...</h1>
                <p><code>connect ${server.ip}</code></p>
                <script>
                setTimeout(function () {
                    window.location = ${JSON.stringify(connectUrl)};
                }, 500);
                </script>
            </div>
        </body>
    </html>`;
};
