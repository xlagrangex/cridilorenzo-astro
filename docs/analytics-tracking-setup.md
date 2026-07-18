# Tracciamento — GTM · GA4 · Google Ads (cridilorenzo.com)

Stack **GTM-first**: sul sito è installato **solo** lo snippet GTM. GA4 e Google Ads
vivono dentro GTM come tag (container generato da script e importato). Il consenso è
gestito dal cookie banner via **Google Consent Mode v2** (i tag partono solo dopo
l'accettazione — GDPR).

```
SITO ──► [ GTM ] ──► GA4          (statistiche + eventi)
                 ──► Google Ads   (conversioni + remarketing)
```

## ID del progetto

| Cosa | Valore |
|---|---|
| GTM Container | `GTM-N3DKDVMM` |
| GA4 Measurement ID | `G-J3LKPDQ6PN` |
| Google Ads — ID cliente | `610-844-4151` |
| Google Ads — ID conversione | ⏳ da creare (`AW-…`) |
| Google Ads — Etichetta conversione | ⏳ da creare |
| Account Google proprietario | `1989dilorenzo@gmail.com` |

> **Stato:** conversione Ads non ancora creata. Tutto il resto (GA4 + Conversion Linker
> + eventi) è attivo. Appena l'azione di conversione esiste in Ads, vedi
> [Aggiungere la conversione Ads](#aggiungere-la-conversione-ads).

## Architettura nel codice

| Pezzo | File | Cosa fa |
|---|---|---|
| Snippet GTM + Consent Mode v2 | `src/components/GoogleTagManager.astro` | default denied, ri-legge il consenso salvato, carica `gtm.js`, push `spa_page_view` e `form_start` |
| Include nel `<head>` + `<noscript>` | `src/layouts/Layout.astro` | monta il componente il più in alto possibile |
| Stato consenso | `src/lib/consent.ts` | salva `cc_consent_v1`, chiama `gtag('consent','update', …)` |
| Cookie banner | `src/components/react/CookieBanner.tsx` | UI accetta/rifiuta/personalizza |
| Generatore container | `docs/gtm/generate-container.mjs` | produce il JSON da importare in GTM |
| Container da importare | `docs/gtm/cridilorenzo-container-import.json` | Amministra → Importa container → **Merge** → Pubblica |
| Pubblici retargeting GA4 | `docs/ga4/create-audiences.mjs` | crea i pubblici via GA4 Admin API |

## Eventi tracciati (dataLayer → GTM → GA4)

| Evento | Origine | Tipo | Conversione Ads |
|---|---|---|---|
| `page_view` (SPA) | `spa_page_view` su `astro:after-swap` | pageview | — |
| `form_start` | primo focus in un `<form>` | micro | — |
| `generate_lead` | successo `#contact-form` (`tipo=Contatto`) | 🔥 HARD lead | ✅ |
| `newsletter_signup` | successo `#newsletter-form` (`tipo=Newsletter`) | soft lead | — |
| `whatsapp_click` | click su `api.whatsapp.com` | 🔥 HARD | ✅ |
| `phone_click` | click `tel:` | 🔥 HARD | ✅ |
| `booking_click` | click su `calendar.google.com` (appointments) | 🔥 HARD | ✅ |
| `email_click` | click `mailto:` | medio | — |
| `social_click` | profili social + share blog (incl. `wa.me/?text=`) | — | — |
| `file_download` | click su `.pdf/.zip/.docx…` | — | — |
| `scroll_depth` | 25/50/75/90% | engagement | — |
| `view_blog` / `view_article` | visita `/blog` e `/blog/*` | pagina chiave | — |

> **Nota WhatsApp:** la conversione matcha solo `api.whatsapp.com` (pulsante flottante +
> footer). Lo share del blog usa `wa.me/?text=` ed è classificato come `social_click`,
> **non** come lead.

## Mappa delle dipendenze di tracciamento

Ogni gancio → file → cosa lo rompe → tag GTM impattato.

| Gancio | File | Cosa lo rompe | Impatto GTM |
|---|---|---|---|
| `generate_lead` | `src/pages/index.astro` (submit `#contact-form`) | rimuovere/rinominare `#contact-form`, togliere il `dataLayer.push`, cambiare il flusso di successo | conversione Ads + `GA4 - generate_lead` |
| `newsletter_signup` | `src/components/Footer.astro` (submit `#newsletter-form`) | rimuovere il form o il `dataLayer.push` | `GA4 - newsletter_signup` + pubblico newsletter |
| `form_start` | `src/components/GoogleTagManager.astro` (listener `focusin`) | rimuovere il componente o l'hook | `GA4 - form_start` + pubblico "form iniziato" |
| `spa_page_view` | `src/components/GoogleTagManager.astro` (`astro:after-swap`) | rimuovere l'hook o cambiare router | `GA4 - page_view (SPA)` + tutti i `view_*` SPA |
| WhatsApp (contatto) | `src/layouts/Layout.astro` (btn flottante), `src/components/Footer.astro` | cambiare l'URL da `api.whatsapp.com/send` ad altro dominio | trigger 50 → `whatsapp_click` + conversione Ads |
| Telefono | `src/components/Footer.astro`, `src/pages/index.astro` | togliere i link `tel:` | trigger 51 → `phone_click` + conversione Ads |
| Prenotazione | `src/components/Navbar.astro`, `HamburgerMenu.tsx`, `Layout.astro`, `src/pages/blog/[slug].astro`, `src/pages/index.astro` | cambiare dominio del calendario (non più `calendar.google.com`) | trigger 53 → `booking_click` + conversione Ads |
| Email | `src/components/Footer.astro`, `src/pages/index.astro` | togliere i link `mailto:` | trigger 52 → `email_click` |
| Blog | `src/pages/blog/[slug].astro`, `src/pages/blog/index.astro` | cambiare lo schema URL `/blog/*` | `view_blog` / `view_article` + pubblico blog |

## Regola operativa ⚠️

**Ad ogni modifica del sito che tocca un gancio di conversione** (form, link forti
WhatsApp/tel/mailto/calendario, schema URL del blog, router/View Transitions,
componente GTM): verificare l'impatto e segnalare cosa aggiornare, in quest'ordine:

1. **dataLayer** — l'evento viene ancora pushato dopo il successo reale?
2. **Container GTM** — se cambiano URL/pattern/eventi, aggiornare
   `docs/gtm/generate-container.mjs`, rigenerare, **reimportare (Merge) e ripubblicare**.
3. **GA4 / Ads** — se cambiano gli eventi chiave, riallineare eventi chiave GA4 e
   conversioni importate in Ads, e i pubblici in `docs/ga4/create-audiences.mjs`.

Il sito statico **non si aggiorna da solo**: ogni gancio = azione esplicita.

## Procedure

### Generare/aggiornare il container GTM
```bash
node docs/gtm/generate-container.mjs
# -> docs/gtm/cridilorenzo-container-import.json
```
In GTM: **Amministra → Importa container** → scegli il file → workspace **Default** →
opzione **Merge** → **Conferma** → poi **Invia/Pubblica**.

### Aggiungere la conversione Ads
1. In Google Ads (`610-844-4151`): **Obiettivi → Conversioni → Nuova azione →
   Sito web → "Invio modulo per i lead"**. Ottieni **ID conversione** (`AW-…`) ed
   **Etichetta**.
2. In `docs/gtm/generate-container.mjs` compila `ADS_ID` (solo il numero, senza `AW-`)
   e `ADS_LABEL`.
3. `node docs/gtm/generate-container.mjs` → reimporta (Merge) → **pubblica**.
4. Aggiorna la tabella ID in cima a questo file.

### Collegare GA4 ↔ Google Ads (manuale, in GA4)
GA4 → **Amministra → Collegamenti ai prodotti → Google Ads → Collega** → account
`610-844-4151` → lascia ON "Personalizzazione annunci" e "Tagging automatico" →
Avanti → Invia. Poi GA4 → **Eventi chiave** (marca `generate_lead`, `whatsapp_click`,
`phone_click`, `booking_click`) → in Ads **Importa** come conversioni.
**Regola d'oro:** una sola conversione **Primaria** (il tag Ads "Contatto"), le
importate GA4 come **Secondarie** (niente doppio conteggio).

### Creare i pubblici di retargeting (quando GA4 ha dati)
Token: OAuth Playground → scope `https://www.googleapis.com/auth/analytics.edit` →
autorizza con `1989dilorenzo@gmail.com` → "Exchange authorization code" → copia
l'access token (validità ~1h).
```bash
GA4_TOKEN=ya29.xxxxx node docs/ga4/create-audiences.mjs
```
Nessun segreto nel repo: il token è temporaneo; `docs/ga4/ga4_token.txt` è gitignorato.
