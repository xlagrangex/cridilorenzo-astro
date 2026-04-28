# Sanity Studio — Cri Dilorenzo

Studio CMS per gestire la home page, le impostazioni del sito e il blog.

## Prima installazione (una tantum)

Dalla cartella `studio/`:

```bash
npm install
```

## Avvio in locale

```bash
npm run dev
```

Studio disponibile su http://localhost:3333

## Pubblicazione dello studio online (per Chris)

```bash
npm run deploy
```

Al primo deploy Sanity chiede un nome per il sottodominio (es. `cridilorenzo`). Da quel momento lo studio sarà accessibile a:

```
https://<nome-scelto>.sanity.studio
```

Chris accede con le sue credenziali Sanity.

## Cosa può gestire Chris

- **Impostazioni sito** — logo, email, telefono, URL calendario, WhatsApp
- **Home page** — per ogni sezione:
  - interruttore "Mostra sulla home" (per nasconderla)
  - testi (titoli, corpo, pulsanti)
  - immagini e liste (servizi, strumenti, FAQ, ecc.)
- **Blog** — articoli (come già prima)

## Come funziona il fallback

Ogni campo lasciato vuoto nel CMS ricade automaticamente sul testo/immagine originale del sito. Non si può "rompere" la home svuotando un campo.

## Dopo le modifiche: rebuild del sito

Le modifiche appaiono sul sito al prossimo build/deploy. Se il sito è su Vercel/Netlify, basta triggerare una nuova build (oppure attivare un webhook da Sanity → Deploy).
