export const prerender = false;

import type { APIRoute } from "astro";

const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE = "app1W24KL1T1OBoK6";
const AIRTABLE_TABLE = "tblD8AjpEaZM17vgC";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get("name")?.toString() || "";
    const email = data.get("email")?.toString() || "";
    const phone = data.get("phone")?.toString() || "";
    const message = data.get("message")?.toString() || "";
    const tipo = data.get("tipo")?.toString() || "Contatto";

    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{
          fields: {
            Nome: name,
            Email: email,
            Telefono: phone,
            Messaggio: message,
            Tipo: tipo,
            Data: new Date().toISOString(),
            Letto: false,
          },
        }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ success: false, error: err }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
