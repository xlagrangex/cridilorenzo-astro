export const prerender = false;

import type { APIRoute } from "astro";

const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE = "app1W24KL1T1OBoK6";
const AIRTABLE_TABLE = "tblD8AjpEaZM17vgC";
const DASHBOARD_PASSWORD = import.meta.env.DASHBOARD_PASSWORD || "cristian2026";

// GET — fetch records
export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("dash_auth=ok")) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const url = new URL(request.url);
  const tipo = url.searchParams.get("tipo") || "";
  const formula = tipo ? `&filterByFormula={Tipo}="${tipo}"` : "";

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?sort[0][field]=Data&sort[0][direction]=desc${formula}`,
    { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
  );

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// POST — login
export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const password = data.get("password")?.toString() || "";

  if (password === DASHBOARD_PASSWORD) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": "dash_auth=ok; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400",
      },
    });
  }

  return new Response(JSON.stringify({ success: false }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
};
