// Crea i pubblici di retargeting GA4 per cridilorenzo.com via GA4 Admin API.
// Auth: access token temporaneo (1h) da OAuth Playground con scope
//   https://www.googleapis.com/auth/analytics.edit
// Uso:
//   GA4_TOKEN=ya29.xxx node docs/ga4/create-audiences.mjs
//   (oppure metti il token in docs/ga4/ga4_token.txt — NON committarlo)
// La property GA4 (properties/NNN) viene ricavata da accountSummaries.
import fs from "node:fs";

// --- token ---
const SD = new URL(".", import.meta.url).pathname;
let TOKEN = process.env.GA4_TOKEN || "";
if (!TOKEN) { try { TOKEN = fs.readFileSync(SD + "ga4_token.txt", "utf8").trim(); } catch {} }
if (!TOKEN) { console.error("MANCA IL TOKEN (env GA4_TOKEN o file ga4_token.txt)"); process.exit(1); }
const H = { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" };
const ADMIN = "https://analyticsadmin.googleapis.com";

// --- filtri ---
const scope = "AUDIENCE_FILTER_SCOPE_ACROSS_ALL_SESSIONS";
const ev = (e) => ({ eventFilter: { eventName: e } });
// GA4 richiede: top-level andGroup -> orGroup -> leaf
const wrap = (exprs) => ({ andGroup: { filterExpressions: [{ orGroup: { filterExpressions: exprs } }] } });
const inc = (e) => ({ clauseType: "INCLUDE", simpleFilter: { scope, filterExpression: wrap([ev(e)]) } });
const exc = (e) => ({ clauseType: "EXCLUDE", simpleFilter: { scope, filterExpression: wrap([ev(e)]) } });
const incOr = (arr) => ({ clauseType: "INCLUDE", simpleFilter: { scope, filterExpression: wrap(arr.map(ev)) } });

// --- pubblici di retargeting: base (365gg, senza suffisso) + scala temporale ESAUSTIVA ---
// La membershipDurationDays E' la finestra di recency: es. 7gg = "ha fatto X negli ultimi 7 giorni".
// Bande per categoria: caldo 7/14/30/90 · interesse 30/60/90/180 · broad 7/30/90.
// L'esclusione-convertiti resta 540gg (max GA4). Limite GA4: 100 audiences/property.
const BASE_DAYS = 365;
const BANDS = {
  hot: [7, 14, 30, 90], // intenti caldi non convertiti
  interest: [30, 60, 90, 180], // interesse più morbido
  broad: [7, 30, 90], // cima del funnel
};

const CONCEPTS = [
  { n: "Tutti i visitatori", d: "Chiunque ha aperto una pagina del sito", cat: "broad", c: [inc("page_view")] },
  { n: "Engaged (scroll significativo)", d: "Ha scrollato oltre il 25% di una pagina", cat: "interest", c: [inc("scroll_depth")] },
  { n: "Form iniziato, non inviato", d: "Ha iniziato a compilare un form ma non ha inviato il contatto", cat: "hot", c: [inc("form_start"), exc("generate_lead")] },
  { n: "WhatsApp click, non convertito", d: "Ha cliccato WhatsApp ma non ha lasciato un lead", cat: "hot", c: [inc("whatsapp_click"), exc("generate_lead")] },
  { n: "Telefono click, non convertito", d: "Ha cliccato il numero di telefono ma non ha convertito", cat: "hot", c: [inc("phone_click"), exc("generate_lead")] },
  { n: "Prenotazione aperta, non convertito", d: "Ha aperto il calendario di prenotazione ma non ha lasciato un contatto", cat: "hot", c: [inc("booking_click"), exc("generate_lead")] },
  { n: "Iscritti newsletter, non contattati", d: "Si e' iscritto alla newsletter/guida ma non ha richiesto un colloquio", cat: "interest", c: [inc("newsletter_signup"), exc("generate_lead")] },
  { n: "Lettori del blog, non convertiti", d: "Ha letto un articolo del blog ma non ha convertito", cat: "interest", c: [inc("view_article"), exc("generate_lead")] },
  { n: "Convertiti (esclusione + seed simili)", d: "Ha lasciato un lead di contatto: escludere dalle campagne e usare come seed", cat: "convert", days: 540, c: [inc("generate_lead")] },
];

// Espansione: base (365 o 540) + una variante per ogni banda di recency della categoria.
const AUD = [];
for (const k of CONCEPTS) {
  const baseDays = k.days || BASE_DAYS;
  AUD.push({ n: k.n, d: k.d, days: baseDays, c: k.c });
  for (const b of (BANDS[k.cat] || [])) {
    AUD.push({ n: `${k.n} — ${b}gg`, d: `${k.d} (finestra ${b} giorni)`, days: b, c: k.c });
  }
}

// --- trova la property GA4 ---
async function findProperties() {
  const r = await fetch(ADMIN + "/v1beta/accountSummaries?pageSize=200", { headers: H });
  const j = await r.json();
  if (j.error) { console.error("ERRORE accountSummaries:", JSON.stringify(j.error)); process.exit(1); }
  const props = [];
  for (const a of j.accountSummaries || [])
    for (const p of a.propertySummaries || [])
      props.push({ id: p.property, name: p.displayName, account: a.displayName });
  return props;
}

const props = await findProperties();
console.log("Property trovate:");
props.forEach(p => console.log("  " + p.id + "  " + p.name + "  (account: " + p.account + ")"));

let PID = process.env.PROPERTY_ID || "";
if (!PID) {
  if (props.length === 1) PID = props[0].id;
  else {
    const match = props.filter(p => /dilorenzo|cristian|cridi/i.test(p.name) || /dilorenzo|cristian|cridi/i.test(p.account));
    if (match.length === 1) PID = match[0].id;
  }
}
if (!PID) { console.error("\nPROPERTY AMBIGUA: passa PROPERTY_ID=properties/NNN"); process.exit(2); }
if (!PID.startsWith("properties/")) PID = "properties/" + PID;
console.log("\n>>> Uso property: " + PID + "\n");

// --- pubblici gia' esistenti (per non duplicare) ---
const existRes = await fetch(ADMIN + "/v1alpha/" + PID + "/audiences?pageSize=200", { headers: H });
const existJson = await existRes.json();
if (existJson.error) { console.error("ERRORE lista audiences:", JSON.stringify(existJson.error)); process.exit(1); }
const existing = new Set((existJson.audiences || []).map(a => a.displayName));

// --- crea ---
let ok = 0, skip = 0, fail = 0;
for (const a of AUD) {
  if (existing.has(a.n)) { console.log("· SKIP (esiste): " + a.n); skip++; continue; }
  const body = { displayName: a.n, description: a.d, membershipDurationDays: a.days, adsPersonalizationEnabled: true, filterClauses: a.c };
  const r = await fetch(ADMIN + "/v1alpha/" + PID + "/audiences", { method: "POST", headers: H, body: JSON.stringify(body) });
  const j = await r.json();
  if (j.error) { console.log("✗ FAIL: " + a.n + " -> " + (j.error.message || JSON.stringify(j.error))); fail++; }
  else { console.log("✓ CREATO: " + a.n + " (" + a.days + "gg)"); ok++; }
}
console.log("\nRISULTATO: " + ok + " creati, " + skip + " gia' esistenti, " + fail + " falliti su " + AUD.length);
