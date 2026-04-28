export const prerender = false;

import type { APIRoute } from "astro";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVCTO8-26euAFdlv_cC2ZD4IW2EgHYjsBzFXkzmHUPhHkBii3FMpAMui8YN8AmHFt6/exec";
const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
const CHRISTIAN_EMAIL = "info@cridilorenzo.com";
const LOGO_URL = "https://cridilorenzo.com/images/logo-dilorenzo.png";
const CALENDAR_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0hE4rG_WwpeS2ck-0o1mnjaoGD6FtqZjcZZgwkNXOB7dSspKlguUEIV4RFzX8DBvZz3v8NjktC";
const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=393473301278&text=Ciao%2C+vorrei+maggiori+informazioni";

function emailWrapper(content: string, recipientEmail?: string) {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <!-- Header con logo -->
      <div style="text-align: center; padding: 32px 24px 24px; border-bottom: 2px solid #f4f2ee;">
        <img src="${LOGO_URL}" alt="Christian Dilorenzo" style="height: 64px; width: auto; max-width: 100%;" />
      </div>

      <!-- Contenuto -->
      <div style="padding: 32px 24px; text-align: center;">
        ${content}
      </div>

      <!-- Footer email -->
      <div style="padding: 24px; background: #f4f2ee; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="margin: 0 0 12px; font-size: 13px; color: #3e3e3e;">
          <strong>Christian Dilorenzo</strong> — Counselor Professionista
        </p>
        <p style="margin: 0 0 16px; font-size: 12px; color: #929292;">
          info@cridilorenzo.com · +39 347 330 1278 · Milano
        </p>
        <div style="margin-bottom: 8px;">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${WHATSAPP_URL}" style="height:36px;v-text-anchor:middle;width:200px;" arcsize="50%" fillcolor="#25d366"><center style="color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:600;">Scrivimi su WhatsApp</center></v:roundrect><![endif]-->
          <a href="${WHATSAPP_URL}" target="_blank" style="background: #25d366; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 18px; height: 18px; filter: brightness(0) invert(1);" />
            Scrivimi su WhatsApp
          </a>
        </div>
        <p style="margin: 12px 0 0; font-size: 10px; color: #c0c0c0;">
          <a href="https://cridilorenzo.com" style="color: #c0c0c0; text-decoration: none;">cridilorenzo.com</a>
        </p>
        ${recipientEmail ? `
        <p style="margin: 8px 0 0; font-size: 10px;">
          <a href="https://cridilorenzo.com/api/unsubscribe?email=${encodeURIComponent(recipientEmail)}" style="color: #c0c0c0; text-decoration: underline;">Cancellati dalla newsletter</a>
        </p>
        ` : ""}
      </div>
    </div>
  `;
}

const BREVO_LIST_CONTATTI = 3;
const BREVO_LIST_NEWSLETTER = 4;

async function upsertBrevoContact(params: {
  email: string;
  name?: string;
  phone?: string;
  message?: string;
  tipo: string;
}) {
  if (!BREVO_API_KEY || !params.email) return;
  const [firstname, ...rest] = (params.name || "").trim().split(/\s+/);
  const lastname = rest.join(" ");
  const isContatto = params.tipo === "Contatto";
  const listId = isContatto ? BREVO_LIST_CONTATTI : BREVO_LIST_NEWSLETTER;

  const attributes: Record<string, string> = {
    DATA_LEAD: new Date().toISOString().split("T")[0],
    TIPO_LEAD: isContatto ? "Contatto" : "Newsletter",
    SORGENTE: isContatto ? "Form contatti sito" : "Iscrizione guida sogni",
  };
  if (firstname) attributes.NOME = firstname;
  if (lastname) attributes.COGNOME = lastname;
  if (params.phone) attributes.LANDLINE_NUMBER = params.phone;
  if (params.message) attributes.MESSAGGIO = params.message;

  return fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      attributes,
      listIds: [listId],
      updateEnabled: true,
    }),
  });
}

async function sendBrevoEmail(to: string, subject: string, htmlContent: string, replyTo?: string) {
  return fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Christian Dilorenzo", email: "info@cridilorenzo.com" },
      to: [{ email: to }],
      subject,
      htmlContent,
      ...(replyTo && { replyTo: { email: replyTo } }),
    }),
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    let name = "", email = "", phone = "", message = "", tipo = "Contatto";

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await request.json();
      name = json.name || "";
      email = json.email || "";
      phone = json.phone || "";
      message = json.message || "";
      tipo = json.tipo || "Contatto";
    } else {
      const data = await request.formData();
      name = data.get("name")?.toString() || "";
      email = data.get("email")?.toString() || "";
      phone = data.get("phone")?.toString() || "";
      message = data.get("message")?.toString() || "";
      tipo = data.get("tipo")?.toString() || "Contatto";
    }

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
          `📩 Nuovo contatto: ${name}`,
          emailWrapper(`
            <h2 style="color: #2a9d8f; margin: 0 0 20px; font-size: 22px;">Nuovo messaggio dal sito</h2>
            <table style="width: 100%; border-collapse: collapse; text-align: left; margin: 0 auto; max-width: 400px;">
              <tr><td style="padding: 10px 0; color: #999; width: 100px; font-size: 14px;">Nome</td><td style="padding: 10px 0; font-size: 14px;"><strong>${name}</strong></td></tr>
              <tr><td style="padding: 10px 0; color: #999; font-size: 14px;">Email</td><td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #2a9d8f;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 10px 0; color: #999; font-size: 14px;">Telefono</td><td style="padding: 10px 0; font-size: 14px;"><a href="tel:${phone}" style="color: #2a9d8f;">${phone}</a></td></tr>` : ""}
            </table>
            <div style="margin: 24px auto 0; padding: 20px; background: #f4f2ee; border-radius: 10px; text-align: left; max-width: 400px;">
              <p style="margin: 0; color: #3e3e3e; font-size: 14px; line-height: 170%;">${message.replace(/\n/g, "<br>")}</p>
            </div>
            <p style="margin-top: 20px; font-size: 13px; color: #999;">Rispondi direttamente a questa email per contattare ${name}.</p>
          `),
          email
        );
      } else {
        notifyPromise = sendBrevoEmail(
          CHRISTIAN_EMAIL,
          `📬 Nuova iscrizione newsletter: ${email}`,
          emailWrapper(`
            <h2 style="color: #2a9d8f; margin: 0 0 16px; font-size: 22px;">Nuova iscrizione alla newsletter</h2>
            <p style="font-size: 16px; color: #3e3e3e; margin: 0 0 8px;"><strong>${email}</strong></p>
            <p style="font-size: 14px; color: #929292; margin: 0;">Si è iscritto alla newsletter e ha richiesto la guida gratuita.</p>
          `)
        );
      }
    }

    // 3. Email al cliente (conferma)
    let confirmPromise: Promise<Response> | null = null;
    if (BREVO_API_KEY && email) {
      if (tipo === "Contatto") {
        confirmPromise = sendBrevoEmail(
          email,
          "Ho ricevuto il tuo messaggio — Christian Dilorenzo",
          emailWrapper(`
            <h2 style="color: #2a9d8f; margin: 0 0 16px; font-size: 22px;">Grazie per avermi scritto${name && name !== "—" ? `, ${name}` : ""}!</h2>
            <p style="font-size: 15px; color: #3e3e3e; line-height: 170%; margin: 0 0 8px;">
              Ho ricevuto il tuo messaggio e ti risponderò personalmente il prima possibile, solitamente <strong>entro 24 ore</strong>.
            </p>
            <p style="font-size: 15px; color: #3e3e3e; line-height: 170%; margin: 0 0 24px;">
              Nel frattempo, se preferisci, puoi prenotare direttamente un <strong>colloquio conoscitivo gratuito di 45 minuti</strong> — oppure scrivermi su WhatsApp per qualsiasi domanda.
            </p>
            <div style="margin: 0 0 16px;">
              <a href="${CALENDAR_URL}" target="_blank" style="background: #2a9d8f; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block;">
                Prenota il colloquio gratuito
              </a>
            </div>
          `, email)
        );
      } else {
        confirmPromise = sendBrevoEmail(
          email,
          "Benvenuto! Ecco la tua guida gratuita — Christian Dilorenzo",
          emailWrapper(`
            <h2 style="color: #2a9d8f; margin: 0 0 16px; font-size: 22px;">Grazie per esserti iscritto!</h2>
            <p style="font-size: 15px; color: #3e3e3e; line-height: 170%; margin: 0 0 8px;">
              Ecco la tua <strong>mini-guida gratuita all'interpretazione dei sogni</strong>.
            </p>
            <p style="font-size: 15px; color: #3e3e3e; line-height: 170%; margin: 0 0 24px;">
              I sogni sono una delle porte più dirette verso il nostro mondo interiore. In questa guida scoprirai come iniziare ad ascoltarli e cosa possono dirti sulla tua vita.
            </p>
            <div style="margin: 0 0 24px;">
              <a href="https://cridilorenzo.com/guida-sogni.pdf" target="_blank" style="background: #2a9d8f; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block;">
                Scarica la guida (PDF)
              </a>
            </div>
            <p style="font-size: 15px; color: #3e3e3e; line-height: 170%; margin: 0 0 8px;">
              Da oggi riceverai anche la mia newsletter con riflessioni su counseling, crescita personale e interpretazione dei sogni.
            </p>
          `, email)
        );
      }
    }

    // 4. Upsert contatto su Brevo CRM (lista in base al tipo)
    const brevoContactPromise = upsertBrevoContact({ email, name, phone, message, tipo });

    // Esegui tutto in parallelo
    const results = await Promise.allSettled([sheetPromise, notifyPromise, confirmPromise, brevoContactPromise].filter(Boolean));

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
