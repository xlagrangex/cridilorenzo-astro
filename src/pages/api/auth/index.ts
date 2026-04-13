export const prerender = false;

import type { APIRoute } from "astro";

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
const DASHBOARD_PASSWORD = import.meta.env.DASHBOARD_PASSWORD || "cristian2026";

// POST — login con password, restituisce GitHub token
export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const password = data.password || "";

  if (password !== DASHBOARD_PASSWORD) {
    return new Response(JSON.stringify({ error: "Password errata" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ token: GITHUB_TOKEN, provider: "github" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
