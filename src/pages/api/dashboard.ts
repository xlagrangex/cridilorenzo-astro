export const prerender = false;

import type { APIRoute } from "astro";

const DASHBOARD_PASSWORD = import.meta.env.DASHBOARD_PASSWORD || "cristian2026";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVCTO8-26euAFdlv_cC2ZD4IW2EgHYjsBzFXkzmHUPhHkBii3FMpAMui8YN8AmHFt6/exec";

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
  let password = "";
  const ct = request.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const json = await request.json();
    password = json.password || "";
  } else {
    const data = await request.formData();
    password = data.get("password")?.toString() || "";
  }

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
