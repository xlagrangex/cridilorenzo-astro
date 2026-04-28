import { defineArrayMember, defineField, defineType } from "sanity";

const visibleField = defineField({
  name: "visible",
  title: "Mostra sulla home",
  type: "boolean",
  initialValue: true,
  description: "Togli la spunta per nascondere questa sezione dal sito.",
});

export const homepage = defineType({
  name: "homepage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "chiSono", title: "Chi sono" },
    { name: "servizi", title: "Servizi" },
    { name: "comeFunziona", title: "Come funziona" },
    { name: "perche", title: "Perché scegliere me" },
    { name: "diCosaMiOccupo", title: "Di cosa mi occupo" },
    { name: "strumenti", title: "Strumenti" },
    { name: "marquee", title: "Punti chiave (marquee)" },
    { name: "confronto", title: "Confronto" },
    { name: "faq", title: "FAQ" },
    { name: "contatti", title: "Contatti" },
  ],
  fields: [
    // ═══════════ HERO ═══════════
    defineField({
      name: "hero",
      title: "Hero (prima sezione)",
      type: "object",
      group: "hero",
      options: { collapsible: true, collapsed: false },
      fields: [
        visibleField,
        defineField({
          name: "headingTop",
          title: "Titolo (prima riga)",
          type: "string",
          initialValue: "Uno spazio per",
        }),
        defineField({
          name: "headingItalic",
          title: "Titolo (seconda riga, in corsivo)",
          type: "string",
          initialValue: "fermarti e fare chiarezza",
        }),
        defineField({
          name: "body",
          title: "Testo descrittivo",
          type: "text",
          rows: 4,
        }),
        defineField({
          name: "primaryCtaLabel",
          title: "Testo pulsante principale",
          type: "string",
          initialValue: "Prenota un colloquio gratuito",
        }),
        defineField({
          name: "secondaryCtaLabel",
          title: "Testo pulsante secondario",
          type: "string",
          initialValue: "Chi sono",
        }),
        defineField({
          name: "heroImage",
          title: "Foto principale (a destra)",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "ratingTitle",
          title: "Titolo card recensioni",
          type: "string",
          initialValue: "4.9/5 Soddisfazione clienti",
        }),
        defineField({
          name: "ratingDescription",
          title: "Descrizione card recensioni",
          type: "text",
          rows: 2,
        }),
      ],
    }),

    // ═══════════ CHI SONO ═══════════
    defineField({
      name: "chiSono",
      title: "Chi sono",
      type: "object",
      group: "chiSono",
      options: { collapsible: true, collapsed: true },
      fields: [
        visibleField,
        defineField({
          name: "tags",
          title: "Tag",
          type: "array",
          of: [{ type: "string" }],
          initialValue: ["Chi sono", "counselor professionista"],
        }),
        defineField({
          name: "heading",
          title: "Titolo",
          type: "string",
          initialValue: "Ciao, sono Christian",
        }),
        defineField({
          name: "body1",
          title: "Primo blocco di testo",
          type: "text",
          rows: 8,
          description: "Puoi usare HTML basilare: <strong>, <br>",
        }),
        defineField({
          name: "body2",
          title: "Secondo blocco di testo",
          type: "text",
          rows: 8,
        }),
        defineField({
          name: "image1",
          title: "Prima immagine (in alto)",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "image2",
          title: "Seconda immagine (in basso)",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "ctaLabel",
          title: "Testo pulsante",
          type: "string",
          initialValue: "Prenota un colloquio gratuito",
        }),
      ],
    }),

    // ═══════════ SERVIZI ═══════════
    defineField({
      name: "servizi",
      title: "Servizi (di cosa mi occupo)",
      type: "object",
      group: "servizi",
      options: { collapsible: true, collapsed: true },
      fields: [
        visibleField,
        defineField({ name: "subtitle", title: "Sottotitolo (in parentesi)", type: "string", initialValue: "[ DI COSA MI OCCUPO ]" }),
        defineField({ name: "headingStart", title: "Titolo (inizio)", type: "string", initialValue: "In cosa posso" }),
        defineField({ name: "headingItalic", title: "Titolo (in corsivo)", type: "string", initialValue: "accompagnarti" }),
        defineField({ name: "body", title: "Introduzione", type: "text", rows: 3 }),
        defineField({
          name: "items",
          title: "Card servizi",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Titolo", type: "string" }),
                defineField({ name: "desc", title: "Descrizione", type: "text", rows: 3 }),
                defineField({ name: "image", title: "Immagine", type: "image", options: { hotspot: true } }),
              ],
              preview: { select: { title: "title", media: "image" } },
            }),
          ],
        }),
        defineField({ name: "conclusion", title: "Frase conclusiva", type: "text", rows: 2 }),
        defineField({ name: "ctaLabel", title: "Testo pulsante", type: "string", initialValue: "Prenota un colloquio gratuito" }),
      ],
    }),

    // ═══════════ COME FUNZIONA ═══════════
    defineField({
      name: "comeFunziona",
      title: "Come funziona",
      type: "object",
      group: "comeFunziona",
      options: { collapsible: true, collapsed: true },
      fields: [
        visibleField,
        defineField({ name: "subtitle", title: "Sottotitolo", type: "string", initialValue: "[ COME FUNZIONA ]" }),
        defineField({ name: "headingStart", title: "Titolo (inizio)", type: "string", initialValue: "Un percorso" }),
        defineField({ name: "headingItalic", title: "Titolo (corsivo)", type: "string", initialValue: "chiaro e trasparente" }),
        defineField({ name: "body", title: "Introduzione", type: "text", rows: 3 }),
        defineField({ name: "image", title: "Immagine", type: "image", options: { hotspot: true } }),
        defineField({ name: "stepsHeadingStart", title: "Titolo box passi (inizio)", type: "string", initialValue: "Il" }),
        defineField({ name: "stepsHeadingItalic", title: "Titolo box passi (corsivo)", type: "string", initialValue: "percorso" }),
        defineField({ name: "stepsIntro", title: "Testo sotto titolo passi", type: "text", rows: 2 }),
        defineField({
          name: "steps",
          title: "Passi",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", title: "Etichetta (es. \"Passo 1\")", type: "string" }),
                defineField({ name: "title", title: "Titolo", type: "string" }),
                defineField({ name: "price", title: "Prezzo / \"Gratuito\"", type: "string" }),
                defineField({ name: "priceSuffix", title: "Suffisso prezzo (es. \"/ 45 min\")", type: "string" }),
                defineField({ name: "details", title: "Dettagli (HTML basilare)", type: "text", rows: 3 }),
                defineField({ name: "bulletPoints", title: "Lista puntata (solo per l'ultimo passo)", type: "array", of: [{ type: "string" }] }),
                defineField({ name: "highlighted", title: "Stile evidenziato (verde)", type: "boolean", initialValue: false }),
              ],
              preview: { select: { title: "title", subtitle: "label" } },
            }),
          ],
        }),
        defineField({ name: "ctaLabel", title: "Testo pulsante", type: "string", initialValue: "Prenota un colloquio gratuito" }),
      ],
    }),

    // ═══════════ PERCHÉ SCEGLIERE ME ═══════════
    defineField({
      name: "perche",
      title: "Perché scegliere me",
      type: "object",
      group: "perche",
      options: { collapsible: true, collapsed: true },
      fields: [
        visibleField,
        defineField({ name: "subtitle", title: "Sottotitolo", type: "string", initialValue: "[ CHI SCEGLIERE ]" }),
        defineField({ name: "heading", title: "Titolo", type: "string", initialValue: "Perché scegliere me" }),
        defineField({ name: "body", title: "Introduzione", type: "text", rows: 3 }),
        defineField({
          name: "items",
          title: "Motivi",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Titolo", type: "string" }),
                defineField({ name: "desc", title: "Descrizione", type: "text", rows: 3 }),
                defineField({ name: "icon", title: "Icona (immagine)", type: "image" }),
              ],
              preview: { select: { title: "title", media: "icon" } },
            }),
          ],
        }),
      ],
    }),

    // ═══════════ DI COSA MI OCCUPO (tabs) ═══════════
    defineField({
      name: "diCosaMiOccupo",
      title: "Di cosa mi occupo (3 card)",
      type: "object",
      group: "diCosaMiOccupo",
      options: { collapsible: true, collapsed: true },
      fields: [
        visibleField,
        defineField({ name: "subtitle", title: "Sottotitolo", type: "string", initialValue: "[ DI COSA MI OCCUPO ]" }),
        defineField({ name: "headingStart", title: "Titolo (inizio)", type: "string", initialValue: "Ti accompagno in percorsi di" }),
        defineField({ name: "headingItalic", title: "Titolo (corsivo)", type: "string", initialValue: "consapevolezza e crescita personale" }),
        defineField({
          name: "items",
          title: "Card (massimo 3)",
          type: "array",
          validation: (Rule) => Rule.max(3),
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Titolo", type: "string" }),
                defineField({ name: "desc", title: "Descrizione", type: "text", rows: 3 }),
                defineField({ name: "image", title: "Immagine di sfondo", type: "image", options: { hotspot: true } }),
              ],
              preview: { select: { title: "title", media: "image" } },
            }),
          ],
        }),
      ],
    }),

    // ═══════════ STRUMENTI ═══════════
    defineField({
      name: "strumenti",
      title: "Strumenti",
      type: "object",
      group: "strumenti",
      options: { collapsible: true, collapsed: true },
      fields: [
        visibleField,
        defineField({ name: "subtitle", title: "Sottotitolo", type: "string", initialValue: "[ STRUMENTI ]" }),
        defineField({ name: "headingStart", title: "Titolo (inizio)", type: "string", initialValue: "Gli strumenti" }),
        defineField({ name: "headingItalic", title: "Titolo (corsivo)", type: "string", initialValue: "del percorso" }),
        defineField({ name: "body", title: "Introduzione", type: "text", rows: 3 }),
        defineField({
          name: "items",
          title: "Strumenti",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "num", title: "Numero", type: "string" }),
                defineField({ name: "title", title: "Titolo", type: "string" }),
                defineField({ name: "desc", title: "Descrizione", type: "text", rows: 3 }),
                defineField({ name: "icon", title: "Icona", type: "image" }),
              ],
              preview: { select: { title: "title", subtitle: "num", media: "icon" } },
            }),
          ],
        }),
        defineField({ name: "ctaLabel", title: "Testo pulsante", type: "string", initialValue: "Prenota un colloquio gratuito" }),
      ],
    }),

    // ═══════════ MARQUEE ═══════════
    defineField({
      name: "marquee",
      title: "Punti chiave (marquee)",
      type: "object",
      group: "marquee",
      options: { collapsible: true, collapsed: true },
      fields: [
        visibleField,
        defineField({
          name: "items",
          title: "Elementi",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "strong", title: "Testo in evidenza", type: "string" }),
                defineField({ name: "label", title: "Etichetta", type: "string" }),
                defineField({
                  name: "iconKey",
                  title: "Icona",
                  type: "string",
                  options: {
                    list: [
                      { title: "Orologio (durata)", value: "clock" },
                      { title: "Schermo (online)", value: "screen" },
                      { title: "Portafoglio (prezzo)", value: "wallet" },
                      { title: "Scudo (privacy)", value: "shield" },
                      { title: "Regalo (gratis)", value: "gift" },
                    ],
                  },
                }),
                defineField({ name: "highlight", title: "Colora testo etichetta di verde", type: "boolean", initialValue: false }),
              ],
              preview: { select: { title: "strong", subtitle: "label" } },
            }),
          ],
        }),
      ],
    }),

    // ═══════════ CONFRONTO ═══════════
    defineField({
      name: "confronto",
      title: "Confronto Psicologo vs Counselor",
      type: "object",
      group: "confronto",
      options: { collapsible: true, collapsed: true },
      fields: [
        visibleField,
        defineField({ name: "subtitle", title: "Sottotitolo", type: "string", initialValue: "[ QUALE PERCORSO FA PER TE? ]" }),
        defineField({ name: "headingStart", title: "Titolo (inizio)", type: "string", initialValue: "Due approcci diversi," }),
        defineField({ name: "headingItalic", title: "Titolo (corsivo)", type: "string", initialValue: "lo stesso rispetto" }),
        defineField({ name: "psicologoTitle", title: "Titolo colonna Psicologo", type: "string", initialValue: "Psicologo" }),
        defineField({
          name: "psicologoItems",
          title: "Caratteristiche Psicologo",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "counselorTitle", title: "Titolo colonna Counselor", type: "string", initialValue: "Counselor" }),
        defineField({ name: "counselorBadge", title: "Badge Counselor", type: "string", initialValue: "Il mio approccio" }),
        defineField({
          name: "counselorItems",
          title: "Caratteristiche Counselor",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "text", title: "Testo principale (HTML basilare)", type: "text", rows: 2 }),
                defineField({ name: "detail", title: "Dettaglio (visibile al passaggio del mouse)", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "text" } },
            }),
          ],
        }),
        defineField({ name: "conclusion", title: "Frase conclusiva", type: "text", rows: 2 }),
        defineField({ name: "ctaLabel", title: "Testo pulsante", type: "string", initialValue: "Prenota un colloquio gratuito" }),
      ],
    }),

    // ═══════════ FAQ ═══════════
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      group: "faq",
      options: { collapsible: true, collapsed: true },
      fields: [
        visibleField,
        defineField({ name: "subtitle", title: "Sottotitolo", type: "string", initialValue: "[ DOMANDE FREQUENTI ]" }),
        defineField({ name: "headingStart", title: "Titolo (inizio)", type: "string", initialValue: "Hai qualche" }),
        defineField({ name: "headingItalic", title: "Titolo (corsivo)", type: "string", initialValue: "domanda?" }),
        defineField({
          name: "items",
          title: "Domande",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "question", title: "Domanda", type: "string" }),
                defineField({ name: "answer", title: "Risposta", type: "text", rows: 4 }),
              ],
              preview: { select: { title: "question" } },
            }),
          ],
        }),
      ],
    }),

    // ═══════════ CONTATTI ═══════════
    defineField({
      name: "contatti",
      title: "Contatti",
      type: "object",
      group: "contatti",
      options: { collapsible: true, collapsed: true },
      fields: [
        visibleField,
        defineField({ name: "subtitle", title: "Sottotitolo", type: "string", initialValue: "[ CONTATTI ]" }),
        defineField({ name: "headingStart", title: "Titolo (inizio)", type: "string", initialValue: "Cerchi uno spazio di" }),
        defineField({ name: "headingItalic", title: "Titolo (corsivo)", type: "string", initialValue: "ascolto?" }),
        defineField({ name: "body", title: "Testo descrittivo", type: "text", rows: 4 }),
        defineField({ name: "ctaLabel", title: "Testo pulsante", type: "string", initialValue: "Invia il messaggio" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home page" }),
  },
});
