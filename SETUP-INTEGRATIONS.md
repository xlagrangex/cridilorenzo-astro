# Setup Integrazioni Google — cridilorenzo.com

Checklist condivisa con Claude Code per integrare GTM, GA4 e Google Ads. Aggiorniamola a 4 mani man mano.

## Legenda
- `[ ]` da fare · `[~]` in corso · `[x]` fatto
- 🔑 = serve input da te (mi mandi un ID/codice)
- ⏱ = tempo stimato
- 💾 = azione mia sul repo

## Stato generale

- [x] Search Console (già fatto)
- [ ] Fase 1 — Google Tag Manager
- [ ] Fase 2 — GA4 dentro GTM *(opzionale, ma consigliato)*
- [ ] Fase 3 — Google Ads

## Codici & ID (da riempire strada facendo)

| Elemento | Valore | Note |
|---|---|---|
| GTM Container ID | `GTM-__________` | formato `GTM-XXXXXXX` |
| GA4 Measurement ID | `G-____________` | formato `G-XXXXXXXXXX` |
| Google Ads Customer ID | `___-___-____` | |
| Ads Conversion ID | `AW-__________` | |
| Ads Conversion Label | `______________` | |

---

## FASE 1 — Google Tag Manager

Obiettivo: installare GTM sul sito, testarlo, preparare i trigger per CTA/form.

- [ ] **1.1 Crea account + container GTM** · ⏱ 3 min
  - https://tagmanager.google.com → `Crea account`
  - Nome account: `Cridilorenzo`
  - Paese: Italia
  - Container: `sito web`, nome `cridilorenzo.com`
  - `Crea` → accetta Termini

- [ ] **1.2 Dammi il Container ID** · ⏱ 1 min · 🔑 💾
  - Dopo "Crea" compare finestra con gli snippet
  - **Non chiuderla**
  - Mandami il **Container ID** (`GTM-XXXXXXX`)
  - 💾 io installo entrambi gli snippet in `Layout.astro` (head + body) rispettando il Consent Mode v2 già attivo → commit + push + deploy Vercel
  - Ti dirò "deployed" quando live

- [ ] **1.3 Preview mode — verifica connessione** · ⏱ 5 min
  - Container GTM → `Anteprima` (bottone alto-dx)
  - URL: `https://www.cridilorenzo.com`
  - `Connect`
  - Sul sito devi vedere il banner Tag Assistant
  - Nella schermata GTM preview deve comparire "Tag Manager Fired / container loaded"
  - Conferma: "connected"

- [ ] **1.4 Attiva variabili built-in** · ⏱ 3 min
  - GTM → `Variabili` → `Configura` (sezione "Variabili incorporate")
  - Attiva tutti i **Clicks** (Click Element, Classes, ID, Target, URL, Text)
  - Attiva tutti i **Forms** (Form Element, Classes, ID, Target, URL, Text)
  - Salva

- [ ] **1.5 Crea 4 Attivatori (Trigger)** · ⏱ 10 min

  | Nome trigger | Tipo | Configurazione |
  |---|---|---|
  | `CTA Prenota Click` | Solo clic — link | Alcuni clic sui link · Click URL · contiene · `calendar.google.com` |
  | `Form Contatti Submit` | Invio modulo | Alcuni invii · Form ID · uguale a · `contact-form` |
  | `Newsletter Submit` | Invio modulo | Alcuni invii · Form ID · uguale a · `newsletter-form` |
  | `WhatsApp Click` | Solo clic — link | Alcuni clic sui link · Click URL · contiene · `wa.me` |

  Conferma: "triggers pronti"

---

## FASE 2 — GA4 dentro GTM *(opzionale)*

Obiettivo: invio eventi a Google Analytics 4 tramite GTM.
Se NON vuoi GA4, salta direttamente a FASE 3.

- [ ] **2.1 Crea proprietà GA4** · ⏱ 4 min
  - https://analytics.google.com → `Amministrazione` → `Crea` → `Account`
  - Nome account: `Cridilorenzo`
  - Avanti → Proprietà:
    - Nome: `cridilorenzo.com`
    - Fuso orario: `Europe/Rome`
    - Valuta: `EUR`
  - Avanti → Categoria: `Servizi professionali`, dimensione 1-10
  - Intento: `Genera lead`
  - `Crea` + accetta Termini

- [ ] **2.2 Aggiungi stream di dati — dammi il Measurement ID** · ⏱ 2 min · 🔑
  - Nel wizard post-creazione → `Aggiungi uno stream di dati` → Web
  - URL: `https://www.cridilorenzo.com`
  - Nome stream: `Sito principale`
  - `Crea stream`
  - Google mostra il **Measurement ID** (`G-XXXXXXXXXX`)
  - Mandamelo (lo segno nella tabella ID sopra)

- [ ] **2.3 Tag GA4 Config in GTM** · ⏱ 3 min
  - GTM → `Tag` → `Nuovo` → Tipo: `Google Analytics: Configurazione GA4`
  - Measurement ID = `G-…`
  - Trigger: `Tutte le pagine` (All Pages)
  - Nome tag: `GA4 — Config`
  - Salva

- [ ] **2.4 Tag eventi GA4** · ⏱ 10 min

  Per ogni trigger crea un tag evento GA4. Tipo sempre `Google Analytics: Evento GA4`, Tag config = `GA4 — Config`.

  | Nome tag | Nome evento | Trigger |
  |---|---|---|
  | `GA4 — Click Prenota` | `click_prenota` | `CTA Prenota Click` |
  | `GA4 — Submit Contatti` | `form_contact` | `Form Contatti Submit` |
  | `GA4 — Submit Newsletter` | `newsletter_signup` | `Newsletter Submit` |
  | `GA4 — Click WhatsApp` | `click_whatsapp` | `WhatsApp Click` |

- [ ] **2.5 Test in DebugView** · ⏱ 3 min
  - GA4 → `Amministrazione` → `DebugView`
  - In parallelo GTM → `Anteprima` attivo su www.cridilorenzo.com
  - Clicca il pulsante "Prenota colloquio" sulla hero → in DebugView entro 10s deve comparire evento `click_prenota`
  - Conferma: "events OK"

- [ ] **2.6 Pubblica versione GTM** · ⏱ 1 min
  - GTM → `Invia` (alto-dx)
  - Nome versione: `v1 — GA4 base`
  - `Pubblica`

---

## FASE 3 — Google Ads

Obiettivo: tracking conversione "Prenotazione colloquio" + pixel remarketing.

- [ ] **3.1 Crea account Ads + billing** · ⏱ 10-20 min (può gonfiarsi se Google chiede verifica identità)
  - https://ads.google.com → `Inizia`
  - **IMPORTANTE**: quando ti chiede di creare una campagna, in alto cerca "Passa alla modalità Esperto" / "Switch to Expert mode" → `Crea un account senza una campagna`
  - Billing: P.IVA 14452680961, indirizzo, metodo pagamento, conferma

- [ ] **3.2 Dammi il Customer ID** · ⏱ 1 min · 🔑
  - Menu conto (alto-dx) → trovi `Customer ID` formato `XXX-XXX-XXXX`
  - Mandamelo (per tracciamento interno)

- [ ] **3.3 Crea azione di conversione "Prenotazione colloquio"** · ⏱ 5 min
  - Menu sinistro → `Obiettivi` → `Riepilogo` → `+ Nuova azione di conversione`
  - Scegli **Sito web** → URL `https://www.cridilorenzo.com` → `Analizza`
  - In basso → `+ Aggiungi manualmente un'azione di conversione`
  - Configurazione:
    - Categoria: `Prenota`
    - Nome azione: `Prenotazione colloquio`
    - Valore: `70 EUR` (oppure "Non usare un valore" se preferisci tracciare solo eventi)
    - Conteggio: `Una`
    - Finestra di conversione clic: 30 giorni
    - Modello attribuzione: `Basato sui dati`
  - `Fine` → `Salva e continua`

- [ ] **3.4 Dammi Conversion ID + Label** · ⏱ 1 min · 🔑
  - Google mostra 3 opzioni di installazione: scegli **"Usa Google Tag Manager"**
  - Ti mostra:
    - **Conversion ID**: `AW-XXXXXXXXX`
    - **Conversion Label**: stringa alfanumerica tipo `AbC-D_efGHijKL`
  - Mandami **entrambi**

- [ ] **3.5 Tag conversione in GTM** · ⏱ 3 min
  - GTM → `Tag` → `Nuovo` → Tipo: `Monitoraggio conversioni Google Ads`
  - Conversion ID: `AW-…`
  - Conversion Label: `…`
  - Trigger: `CTA Prenota Click`
  - Nome tag: `Ads — Prenotazione`
  - Salva

- [ ] **3.6 Tag remarketing globale in GTM** · ⏱ 2 min
  - GTM → `Tag` → `Nuovo` → Tipo: `Remarketing Google Ads`
  - Conversion ID: `AW-…` (stesso del tag 3.5)
  - Trigger: `Tutte le pagine` (All Pages)
  - Nome tag: `Ads — Remarketing`
  - Salva

- [ ] **3.7 Test conversion tracking** · ⏱ 3 min
  - GTM → `Anteprima` → clicca "Prenota colloquio" sul sito
  - In GTM preview verifica che risultino **fired**:
    - `Ads — Prenotazione`
    - `Ads — Remarketing`
  - In Ads → `Obiettivi` → Azioni di conversione: stato iniziale "Nessuna conversione recente", diventa "OK" entro 1-24h dopo un click reale

- [ ] **3.8 Pubblica versione finale GTM** · ⏱ 1 min
  - GTM → `Invia`
  - Nome versione: `v2 — Ads conversion + remarketing`
  - `Pubblica`

---

## Completamento

- [ ] 💾 Ultimo commit con stato finale di questo file (`chore: integrations setup completed`)
- [ ] Screenshot / conferma tag fired in production
- [ ] (Opzionale) First campaign Google Ads → daremo priorità keyword in sessione dedicata

## Note & blockers

<!-- Usa questa sezione per annotare problemi durante il processo. Es:
- 3.1: Google ha chiesto verifica identità via SMS — aspetto OTP
- 2.5: DebugView vuoto, ho ricontrollato Consent Mode → risolto dopo accetta cookie
-->

_Nessuna nota ancora._
