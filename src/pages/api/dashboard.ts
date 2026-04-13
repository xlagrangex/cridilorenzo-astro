export const prerender = false;

import type { APIRoute } from "astro";

const DASHBOARD_PASSWORD = import.meta.env.DASHBOARD_PASSWORD || "cristian2026";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx5XCFjYE7L1sjDyUSdiAN_Iup0f-ApwyGUa1W0UZB3XNwdN8To2Z8gro18gxakCAWh/exec";

// GET — fetch records from Google Sheet
export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("dash_auth=ok")) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const res = await fetch(GOOGLE_SCRIPT_URL);
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
