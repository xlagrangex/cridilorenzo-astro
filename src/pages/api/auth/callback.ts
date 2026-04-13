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

  // Exchange code for token
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

  // Send token back to Decap CMS via postMessage
  const content = `
    <html><body><script>
      (function() {
        function recieveMessage(e) {
          console.log("recieveMessage %o", e);
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: "github" })}',
            e.origin
          );
          window.removeEventListener("message", recieveMessage, false);
        }
        window.addEventListener("message", recieveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script></body></html>
  `;

  return new Response(content, {
    headers: { "Content-Type": "text/html" },
  });
};
