# CLAUDE.md — cridilorenzo-astro

Sito Astro di Christian Di Lorenzo (counseling). Stack: Astro 5 + React 19 +
Tailwind 4 + Sanity (blog) + Brevo (CRM/email) + Vercel.

## Tracciamento (GTM · GA4 · Google Ads) — Regola operativa ⚠️

Lo stack di tracciamento è **GTM-first** ed è documentato in
`docs/analytics-tracking-setup.md` (source of truth: ID, architettura, mappa
dipendenze, procedure). GTM `GTM-N3DKDVMM`, GA4 `G-J3LKPDQ6PN`.

**Ad ogni modifica che tocca un gancio di conversione** — form (`#contact-form`,
`#newsletter-form`), link forti (`api.whatsapp.com`, `tel:`, `mailto:`,
`calendar.google.com`), schema URL `/blog/*`, router/View Transitions, o
`src/components/GoogleTagManager.astro` — **verifica l'impatto e segnala cosa
aggiornare**, in quest'ordine:

1. **dataLayer** — l'evento viene ancora pushato dopo il successo reale?
2. **Container GTM** — se cambiano URL/pattern/eventi: aggiorna
   `docs/gtm/generate-container.mjs`, rigenera, **reimporta (Merge) e ripubblica**.
3. **GA4 / Ads** — riallinea eventi chiave GA4, conversioni importate in Ads e i
   pubblici in `docs/ga4/create-audiences.mjs`.

Il sito statico non si aggiorna da solo: ogni gancio = azione esplicita.

## Git workflow

Dopo ogni commit, `git push` immediato; conferma branch + esito.
