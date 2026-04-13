export const prerender = false;

import type { APIRoute } from "astro";

const CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;

export const GET: APIRoute = async () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: "https://cridilorenzo.com/api/auth/callback",
    scope: "repo,user",
  });

  return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
};
