// Generatore del container GTM per cridilorenzo.com (Christian Di Lorenzo).
// Produce docs/gtm/cridilorenzo-container-import.json con gli enum GTM sempre corretti.
// Uso: node docs/gtm/generate-container.mjs
//
// La conversione Google Ads e' PARAMETRICA: finche' ADS_ID/ADS_LABEL sono vuoti
// il tag conversione NON viene generato (ma resta tutto il tracciamento GA4 +
// Conversion Linker). Appena crei l'azione di conversione in Ads, riempi i 2
// valori qui sotto e rilancia lo script, poi reimporta il container (Merge).
import { writeFileSync } from "node:fs";

// ---- CONFIG (i 6 valori del setup) ----
const GTM_ID = "GTM-N3DKDVMM";
const GA4_ID = "G-J3LKPDQ6PN";
const ADS_ID = ""; // es. "11506769390" (senza il prefisso AW-)  <-- da compilare dopo
const ADS_LABEL = ""; // es. "AbC-D_efG..."                       <-- da compilare dopo

// ---- helper (enum in MAIUSCOLO, come vuole GTM) ----
const P = (type, key, value) => ({ type, key, value });
const tpl = (key, value) => P("TEMPLATE", key, value);
const bool = (key, value) => P("BOOLEAN", key, value);

const tags = [];
const triggers = [];
const variables = [];
let _t = 0;

const ALL_PAGES = "2147479553";

function ga4(name, eventName, firingTriggerId, eventParams = []) {
  const parameter = [
    tpl("eventName", eventName),
    bool("sendEcommerceData", "false"),
    tpl("measurementIdOverride", GA4_ID),
  ];
  if (eventParams.length) {
    parameter.push({
      type: "LIST", key: "eventParameters",
      list: eventParams.map(([k, v]) => ({
        type: "MAP", map: [tpl("name", k), tpl("value", v)],
      })),
    });
  }
  tags.push({
    accountId: "0", containerId: "0", tagId: String(++_t),
    name, type: "gaawe", parameter, fingerprint: "0",
    firingTriggerId, tagFiringOption: "ONCE_PER_EVENT",
    monitoringMetadata: { type: "MAP" }, consentSettings: { consentStatus: "NOT_SET" },
  });
}

function rawTag(name, type, parameter, firingTriggerId) {
  tags.push({
    accountId: "0", containerId: "0", tagId: String(++_t),
    name, type, parameter, fingerprint: "0",
    firingTriggerId, tagFiringOption: "ONCE_PER_EVENT",
    monitoringMetadata: { type: "MAP" }, consentSettings: { consentStatus: "NOT_SET" },
  });
}

const ceTrigger = (id, name, eventName) => triggers.push({
  accountId: "0", containerId: "0", triggerId: id, name, type: "CUSTOM_EVENT",
  customEventFilter: [{ type: "EQUALS", parameter: [tpl("arg0", "{{_event}}"), tpl("arg1", eventName)] }],
  fingerprint: "0",
});

const linkContains = (id, name, needle) => triggers.push({
  accountId: "0", containerId: "0", triggerId: id, name, type: "LINK_CLICK",
  filter: [{ type: "CONTAINS", parameter: [tpl("arg0", "{{Click URL}}"), tpl("arg1", needle)] }],
  fingerprint: "0",
});

const linkRegex = (id, name, regex) => triggers.push({
  accountId: "0", containerId: "0", triggerId: id, name, type: "LINK_CLICK",
  filter: [{ type: "MATCH_REGEX", parameter: [tpl("arg0", "{{Click URL}}"), tpl("arg1", regex)] }],
  fingerprint: "0",
});

const scrollTrigger = (id, name, percents) => triggers.push({
  accountId: "0", containerId: "0", triggerId: id, name, type: "SCROLL_DEPTH",
  parameter: [
    bool("verticalThresholdOn", "true"),
    tpl("verticalThresholdUnits", "PERCENT"),
    tpl("verticalThresholdsPercent", percents),
    tpl("triggerStartOption", "WINDOW_LOAD"),
    bool("horizontalThresholdOn", "false"),
  ],
  fingerprint: "0",
});

const dlv = (id, name, dlName) => variables.push({
  accountId: "0", containerId: "0", variableId: id, name, type: "v",
  parameter: [P("INTEGER", "dataLayerVersion", "2"), bool("setDefaultValue", "false"), tpl("name", dlName)],
  fingerprint: "0",
});

// Evento di visualizzazione pagina specifica: scatta sul caricamento diretto (PAGEVIEW)
// e sulla navigazione client-side (spa_page_view), filtrando per path.
function pageViewEvent(name, eventName, pathRegex, pvId, spaId) {
  triggers.push({
    accountId: "0", containerId: "0", triggerId: pvId, name: "PV - " + name, type: "PAGEVIEW",
    filter: [{ type: "MATCH_REGEX", parameter: [tpl("arg0", "{{Page Path}}"), tpl("arg1", pathRegex)] }],
    fingerprint: "0",
  });
  triggers.push({
    accountId: "0", containerId: "0", triggerId: spaId, name: "SPA - " + name, type: "CUSTOM_EVENT",
    customEventFilter: [{ type: "EQUALS", parameter: [tpl("arg0", "{{_event}}"), tpl("arg1", "spa_page_view")] }],
    filter: [{ type: "MATCH_REGEX", parameter: [tpl("arg0", "{{Page Path}}"), tpl("arg1", pathRegex)] }],
    fingerprint: "0",
  });
  ga4("GA4 - " + eventName, eventName, [pvId, spaId], [["page_path", "{{Page Path}}"]]);
}

// ---- TRIGGER ----
ceTrigger("40", "CE - generate_lead", "generate_lead");
ceTrigger("41", "CE - spa_page_view", "spa_page_view");
ceTrigger("42", "CE - form_start", "form_start");
ceTrigger("43", "CE - newsletter_signup", "newsletter_signup");
// WhatsApp CONTATTO: solo api.whatsapp.com (il pulsante flottante + footer).
// Lo "share" del blog usa wa.me/?text= e resta escluso dalle conversioni.
linkContains("50", "Link Click - WhatsApp (contatto)", "api.whatsapp.com");
linkContains("51", "Link Click - Telefono", "tel:");
linkContains("52", "Link Click - Email", "mailto:");
// Prenotazione: Google Calendar appointments.
linkContains("53", "Link Click - Prenotazione (Google Calendar)", "calendar.google.com");
// Social / share (profili social + pulsanti share del blog, incl. wa.me/?text=): NON conversioni.
linkRegex("55", "Link Click - Social/Share", "(facebook|instagram|linkedin|tiktok|youtube|twitter)\\.com|wa\\.me/\\?");
linkRegex("56", "Link Click - Download file", "\\.(pdf|zip|docx?|xlsx?|pptx?|csv)(\\?|$)");
scrollTrigger("60", "Scroll Depth 25/50/75/90", "25,50,75,90");

// ---- VARIABILI ----
dlv("30", "DLV - form_id", "form_id");
dlv("31", "DLV - lead_type", "lead_type");

// ---- TAG base ----
rawTag("Google Tag - GA4 (cridilorenzo)", "googtag", [tpl("tagId", GA4_ID)], [ALL_PAGES]);
rawTag("Google Ads - Conversion Linker", "gclidw", [bool("enableCrossDomain", "false")], [ALL_PAGES]);

// Conversione Ads: generata SOLO quando ADS_ID/ADS_LABEL sono compilati.
// Scatta sui contatti forti: lead form + whatsapp + telefono + prenotazione.
if (ADS_ID && ADS_LABEL) {
  rawTag("Google Ads - Conversione Contatto", "awct", [
    tpl("conversionId", ADS_ID), tpl("conversionLabel", ADS_LABEL), bool("enableConversionLinker", "true"),
  ], ["40", "50", "51", "53"]);
}

// ---- TAG eventi GA4 ----
ga4("GA4 - page_view (SPA)", "page_view", ["41"]);
ga4("GA4 - generate_lead", "generate_lead", ["40"], [["form_id", "{{DLV - form_id}}"], ["lead_type", "{{DLV - lead_type}}"]]);
ga4("GA4 - form_start", "form_start", ["42"], [["form_id", "{{DLV - form_id}}"]]);
ga4("GA4 - newsletter_signup", "newsletter_signup", ["43"], [["form_id", "{{DLV - form_id}}"]]);
ga4("GA4 - whatsapp_click", "whatsapp_click", ["50"], [["link_url", "{{Click URL}}"]]);
ga4("GA4 - phone_click", "phone_click", ["51"], [["link_url", "{{Click URL}}"]]);
ga4("GA4 - email_click", "email_click", ["52"], [["link_url", "{{Click URL}}"]]);
ga4("GA4 - booking_click", "booking_click", ["53"], [["link_url", "{{Click URL}}"]]);
ga4("GA4 - social_click", "social_click", ["55"], [["link_url", "{{Click URL}}"]]);
ga4("GA4 - file_download", "file_download", ["56"], [["link_url", "{{Click URL}}"]]);
ga4("GA4 - scroll_depth", "scroll_depth", ["60"], [["percent_scrolled", "{{Scroll Depth Threshold}}"]]);

// ---- eventi di visita a pagine chiave (per contare i visitatori per pagina) ----
pageViewEvent("Blog (indice)", "view_blog", "^/blog/?$", "70", "71");
pageViewEvent("Articolo blog", "view_article", "^/blog/.+", "72", "73");

// ---- built-in variables ----
const builtInVariable = [
  ["CLICK_URL", "Click URL"], ["CLICK_TEXT", "Click Text"], ["CLICK_CLASSES", "Click Classes"],
  ["CLICK_ID", "Click ID"], ["CLICK_ELEMENT", "Click Element"], ["PAGE_URL", "Page URL"],
  ["PAGE_PATH", "Page Path"], ["PAGE_HOSTNAME", "Page Hostname"],
  ["SCROLL_DEPTH_THRESHOLD", "Scroll Depth Threshold"], ["EVENT", "Event"],
].map(([type, name]) => ({ type, name }));

// ---- assembla ----
const container = {
  exportFormatVersion: 2,
  exportTime: "2026-07-18 00:00:00",
  containerVersion: {
    path: "accounts/0/containers/0/versions/0",
    accountId: "0", containerId: "0", containerVersionId: "0",
    container: {
      path: "accounts/0/containers/0", accountId: "0", containerId: "0",
      name: "cridilorenzo.com", publicId: GTM_ID, usageContext: ["WEB"], fingerprint: "0",
      tagManagerUrl: "https://tagmanager.google.com/",
    },
    tag: tags, trigger: triggers, variable: variables, builtInVariable, fingerprint: "0",
  },
};

writeFileSync(new URL("./cridilorenzo-container-import.json", import.meta.url), JSON.stringify(container, null, 2) + "\n");
console.log(`Generato: ${tags.length} tag, ${triggers.length} trigger, ${variables.length} variabili, ${builtInVariable.length} built-in`);
console.log(`Totale elementi import: ${tags.length + triggers.length + variables.length + builtInVariable.length}`);
if (!(ADS_ID && ADS_LABEL)) {
  console.log("\n⚠️  Conversione Google Ads NON generata (ADS_ID/ADS_LABEL vuoti).");
  console.log("   Compila i 2 valori in cima al file e rilancia per aggiungere il tag conversione.");
}
