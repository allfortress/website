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
                <h1 class="title">Welcome to ${server.name}!</h1>
                <p class="help">
                    Issue? Contact <a href="/contact" target="_blank">me</a>
                </p>
            </div>
        </body>
    </html>`;
};
