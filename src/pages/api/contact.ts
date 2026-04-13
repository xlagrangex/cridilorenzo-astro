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

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`;
    const headers = {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    };

    // Campi base
    const fields: Record<string, any> = {
      Nome: name,
      Email: email,
      Data: new Date().toISOString().split("T")[0],
    };
    if (phone) fields.Telefono = phone;
    if (message) fields.Messaggio = message;

    // Primo tentativo con Tipo e Letto
    let body: any = { records: [{ fields: { ...fields, Tipo: tipo, Letto: false } }] };
    let res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });

    // Se campo sconosciuto, riprova solo con i campi base
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (err?.error?.type === "UNKNOWN_FIELD_NAME") {
        body = { records: [{ fields }] };
        res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
      }
    }

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
