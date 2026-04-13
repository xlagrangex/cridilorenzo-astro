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
      return new Response(`<html><body><h2>Errore: ${tokenData.error_description}</h2><p><a href="/admin/">Torna all'admin</a></p></body></html>`, {
        headers: { "Content-Type": "text/html" },
      });
    }

    const token = tokenData.access_token;

    const html = `<!DOCTYPE html>
<html>
<head><title>Autorizzazione...</title></head>
<body>
<script>
(function() {
  var token = "${token}";
  var provider = "github";

  function sendMessage(e) {
    var msg = "authorization:" + provider + ":success:" + JSON.stringify({ token: token, provider: provider });
    window.opener.postMessage(msg, e.origin);
    window.removeEventListener("message", sendMessage);
  }

  window.addEventListener("message", sendMessage);
  window.opener.postMessage("authorizing:" + provider, "*");
})();
</script>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    return new Response(`<html><body><h2>Errore di connessione</h2><p>${err}</p><p><a href="/admin/">Torna all'admin</a></p></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }
};
