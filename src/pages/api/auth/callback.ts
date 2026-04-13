export const prerender = false;

import type { APIRoute } from "astro";

const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return new Response(errorPage(tokenData.error_description), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response(successPage(tokenData.access_token), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    return new Response(errorPage(String(err)), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
};

function successPage(token: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Autorizzazione completata</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f4f2ee; }
    .card { background: white; padding: 40px; border-radius: 16px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    h2 { color: #2a9d8f; margin-bottom: 8px; }
    p { color: #3e3e3e; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Autorizzazione completata</h2>
    <p>Chiusura in corso...</p>
  </div>
  <script>
    (function() {
      var token = decodeURIComponent("${encodeURIComponent(token)}");
      var provider = "github";
      var message = "authorization:" + provider + ":success:" + JSON.stringify({token: token, provider: provider});

      if (window.opener) {
        // Prova a mandare il messaggio all'opener
        window.opener.postMessage(message, "*");
        setTimeout(function() { window.close(); }, 1000);
      } else {
        // Se non c'è opener (popup bloccata), mostra il token
        document.querySelector('.card').innerHTML = '<h2>Autorizzazione completata</h2><p>Torna alla pagina admin e ricarica.</p><p><a href="/admin/" style="color:#2a9d8f;">Vai all\\'admin</a></p>';
      }
    })();
  </script>
</body>
</html>`;
}

function errorPage(error: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Errore</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f4f2ee; }
    .card { background: white; padding: 40px; border-radius: 16px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    h2 { color: #e53e3e; margin-bottom: 8px; }
    a { color: #2a9d8f; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Errore di autorizzazione</h2>
    <p>${error}</p>
    <p><a href="/admin/">Torna all'admin</a></p>
  </div>
</body>
</html>`;
}
