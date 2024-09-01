import { getServerInfo } from "../../lib/shared";

export function onRequestGet(context) {
  const server = getServerInfo(context.params.server);
  if (!server) {
    return new Response("Unknown server", { status: 400 });
  }

  return new Response(getHtml(server), {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  });
}

function getHtml({ name, ip }) {
  const connectUrl = `steam://connect/${ip}`;
  return `<!DOCTYPE HTML>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>allfortress.com</title>
            <link href="/css/style.css" rel="stylesheet">
        </head>
        <body>
            <div class="container">
                <h1 class="title">Connecting to ${name}...</h1>
                <p><code>connect ${ip}</code></p>
                <script>
                setTimeout(function () {
                    window.location = ${JSON.stringify(connectUrl)};
                }, 500);
                </script>
            </div>
        </body>
    </html>`;
}
