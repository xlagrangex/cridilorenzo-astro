export const prerender = false;

import type { APIRoute } from "astro";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVCTO8-26euAFdlv_cC2ZD4IW2EgHYjsBzFXkzmHUPhHkBii3FMpAMui8YN8AmHFt6/exec";
const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
const CHRISTIAN_EMAIL = "info@cridilorenzo.com";

async function sendBrevoEmail(to: string, subject: string, htmlContent: string, replyTo?: string) {
  return fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Christian Di Lorenzo", email: "info@cridilorenzo.com" },
      to: [{ email: to }],
      subject,
      htmlContent,
      ...(replyTo && { replyTo: { email: replyTo } }),
    }),
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get("name")?.toString() || "";
    const email = data.get("email")?.toString() || "";
    const phone = data.get("phone")?.toString() || "";
    const message = data.get("message")?.toString() || "";
    const tipo = data.get("tipo")?.toString() || "Contatto";

    // 1. Salva su Google Sheet
    const sheetPromise = fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: new Date().toISOString(),
        tipo,
        nome: name,
        email,
        telefono: phone,
        messaggio: message,
      }),
    });

    // 2. Email a Christian (notifica)
    let notifyPromise: Promise<Response> | null = null;
    if (BREVO_API_KEY) {
      if (tipo === "Contatto") {
        notifyPromise = sendBrevoEmail(
          CHRISTIAN_EMAIL,
          `Nuovo contatto: ${name}`,
          `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2 style="color: #2a9d8f;">Nuovo messaggio dal sito</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #999; width: 100px;">Nome</td><td style="padding: 8px 0;"><strong>${name}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding: 8px 0; color: #999;">Telefono</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>` : ""}
              </table>
              <div style="margin-top: 16px; padding: 16px; background: #f4f2ee; border-radius: 10px;">
                <p style="margin: 0; color: #3e3e3e;">${message.replace(/\n/g, "<br>")}</p>
              </div>
              <p style="margin-top: 16px; font-size: 12px; color: #999;">Rispondi direttamente a questa email per contattare ${name}.</p>
            </div>
          `,
          email
        );
      } else {
        notifyPromise = sendBrevoEmail(
          CHRISTIAN_EMAIL,
          `Nuova iscrizione newsletter: ${email}`,
          `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2 style="color: #2a9d8f;">Nuova iscrizione alla newsletter</h2>
              <p><strong>${email}</strong> si è iscritto alla newsletter e ha richiesto la guida gratuita.</p>
            </div>
          `
        );
      }
    }

    // 3. Email al cliente (conferma)
    let confirmPromise: Promise<Response> | null = null;
    if (BREVO_API_KEY && email) {
      if (tipo === "Contatto") {
        confirmPromise = sendBrevoEmail(
          email,
          "Ho ricevuto il tuo messaggio — Christian Di Lorenzo",
          `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2 style="color: #2a9d8f;">Grazie per avermi scritto, ${name}!</h2>
              <p>Ho ricevuto il tuo messaggio e ti risponderò il prima possibile, solitamente entro 24 ore.</p>
              <p>Nel frattempo, se vuoi, puoi prenotare direttamente un <strong>colloquio conoscitivo gratuito</strong>:</p>
              <p style="margin: 24px 0;">
                <a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0hE4rG_WwpeS2ck-0o1mnjaoGD6FtqZjcZZgwkNXOB7dSspKlguUEIV4RFzX8DBvZz3v8NjktC"
                   style="background: #2a9d8f; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600;">
                  Prenota il colloquio gratuito
                </a>
              </p>
              <p style="color: #999; font-size: 13px;">A presto,<br><strong>Christian Di Lorenzo</strong><br>Counselor Professionista</p>
            </div>
          `
        );
      } else {
        confirmPromise = sendBrevoEmail(
          email,
          "Benvenuto! Ecco la tua guida — Christian Di Lorenzo",
          `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2 style="color: #2a9d8f;">Grazie per esserti iscritto!</h2>
              <p>Ecco la tua <strong>mini-guida gratuita all'interpretazione dei sogni</strong>.</p>
              <p>I sogni sono una delle porte più dirette verso il nostro mondo interiore. In questa guida scoprirai come iniziare ad ascoltarli.</p>
              <p style="margin: 24px 0;">
                <a href="https://cridilorenzo.com/guida-sogni.pdf"
                   style="background: #2a9d8f; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600;">
                  Scarica la guida (PDF)
                </a>
              </p>
              <p>Da oggi riceverai anche la mia newsletter con riflessioni su counseling, crescita personale e interpretazione dei sogni.</p>
              <p style="color: #999; font-size: 13px;">A presto,<br><strong>Christian Di Lorenzo</strong><br>Counselor Professionista</p>
              <p style="color: #ccc; font-size: 11px; margin-top: 24px;">Se non desideri più ricevere email, rispondi a questo messaggio con "cancellami".</p>
            </div>
          `
        );
      }
    }

    // Esegui tutto in parallelo
    const results = await Promise.allSettled([sheetPromise, notifyPromise, confirmPromise].filter(Boolean));

    // Log errori per debug
    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => r.reason?.toString());

    if (errors.length > 0) {
      console.error("Contact API errors:", errors);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Contact API crash:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
