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
  return `<!DOCTYPE HTML>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Prophunt</title>
            <link href="/css/style.css" rel="stylesheet">
        </head>
        <body>
            <div class="container">
                <h1 class="title">Welcome to ${name}!</h1>
                <p class="help">
                    Issue? Contact <a href="/contact" target="_blank">me</a>
                </p>
            </div>
        </body>
    </html>`;
}
