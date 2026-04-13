export const prerender = false;

import type { APIRoute } from "astro";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVCTO8-26euAFdlv_cC2ZD4IW2EgHYjsBzFXkzmHUPhHkBii3FMpAMui8YN8AmHFt6/exec";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";

  if (!email) {
    return new Response(html("Email non valida", false), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    // Salva la cancellazione nel Google Sheet
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: new Date().toISOString(),
        tipo: "Cancellazione",
        nome: "—",
        email,
        telefono: "",
        messaggio: "Cancellazione dalla newsletter",
      }),
    });

    return new Response(html(email, true), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return new Response(html("Errore", false), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
};

function html(email: string, success: boolean) {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${success ? "Cancellazione confermata" : "Errore"}</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f4f2ee; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; color: #3e3e3e; }
    .card { background: white; border-radius: 20px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    h1 { color: #15141a; font-size: 24px; margin-bottom: 12px; }
    p { font-size: 15px; line-height: 160%; margin-bottom: 24px; }
    a { display: inline-block; background: #2a9d8f; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; }
    a:hover { background: #238b7f; }
    .icon { font-size: 48px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="card">
    ${success ? `
      <div class="icon">✓</div>
      <h1>Cancellazione confermata</h1>
      <p><strong>${email}</strong> è stato rimosso dalla newsletter.<br>Non riceverai più email da parte nostra.</p>
      <p style="font-size: 13px; color: #929292;">Se cambi idea, puoi iscriverti di nuovo dal sito.</p>
      <a href="https://cridilorenzo.com">Torna al sito</a>
    ` : `
      <div class="icon">✗</div>
      <h1>Si è verificato un errore</h1>
      <p>Non siamo riusciti a completare la cancellazione. Contattaci direttamente a <a href="mailto:info@cridilorenzo.com" style="background:none;color:#2a9d8f;padding:0;display:inline;">info@cridilorenzo.com</a></p>
      <a href="https://cridilorenzo.com">Torna al sito</a>
    `}
  </div>
</body>
</html>`;
}
