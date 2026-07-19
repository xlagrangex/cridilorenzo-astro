// Seed dei documenti Sanity (homepage + siteSettings) con il contenuto ATTUALE
// del sito, cioe' i fallback presenti in src/pages/index.astro. Serve a riempire
// i campi vuoti dello studio, cosi' chi edita vede il testo reale.
//
// Carica anche le immagini/icone dei fallback come asset Sanity, cosi' le card
// restano corrette e modificabili (senza upload, card con solo testo mostrerebbero
// tutte la stessa immagine di default).
//
// Uso:  SANITY_TOKEN=xxxxx node scripts/seed-sanity.mjs
// Il token (permesso Write) NON va nel repo: passalo via variabile d'ambiente.
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const TOKEN = process.env.SANITY_TOKEN;
if (!TOKEN) { console.error("MANCA SANITY_TOKEN (env)"); process.exit(1); }

const client = createClient({
  projectId: "v97micrw",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

const PUBLIC = path.join(process.cwd(), "public");
const CT = { ".webp": "image/webp", ".png": "image/png", ".avif": "image/avif", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

const _cache = new Map();
async function img(rel) {
  // rel es. "/images/foo.webp" -> carica una volta, ritorna oggetto image Sanity
  if (_cache.has(rel)) return _cache.get(rel);
  const abs = path.join(PUBLIC, rel.replace(/^\//, ""));
  if (!existsSync(abs)) { console.warn("  ⚠ manca:", rel); _cache.set(rel, undefined); return undefined; }
  const buf = await readFile(abs);
  const ext = path.extname(abs).toLowerCase();
  const asset = await client.assets.upload("image", buf, {
    filename: path.basename(abs),
    contentType: CT[ext] || "application/octet-stream",
  });
  const value = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  _cache.set(rel, value);
  console.log("  ✓ img:", rel);
  return value;
}

// aggiunge _key deterministici agli oggetti di un array
const keyed = (arr, prefix) => arr.map((o, i) => ({ _key: `${prefix}${i}`, ...o }));

async function build() {
  console.log("Carico immagini...");

  const homepage = {
    _id: "homepage",
    _type: "homepage",

    hero: {
      visible: true,
      headingTop: "Uno spazio",
      headingItalic: "per fermarti e fare chiarezza",
      body: "Se stai vivendo un periodo di difficoltà, cambiamento o smarrimento, possiamo lavorarci insieme. Gli incontri sono <strong>un tempo dedicato a te</strong>, per comprendere meglio ciò che accade dentro e trasformarlo in <strong>consapevolezza, benessere ed equilibrio</strong>.",
      primaryCtaLabel: "Prenota un colloquio gratuito",
      secondaryCtaLabel: "Chi sono",
      heroImage: await img("/images/christian-hero-section.webp"),
      ratingTitle: "4.9/5 Soddisfazione clienti",
      ratingDescription: "Scopri cosa raccontano le persone che hanno intrapreso questo percorso.",
    },

    chiSono: {
      visible: true,
      tags: ["Chi sono", "counselor professionista"],
      heading: "Ciao, sono Christian",
      body1: "Sono una persona che ha imparato, nel tempo, a <strong>fermarsi e ad ascoltarsi davvero</strong>. E oggi faccio questo anche con gli altri.<br><br>Sono counselor e accompagno le persone in uno <strong>spazio di ascolto</strong> e di <strong>esplorazione interiore</strong>, principalmente online.<br>Un luogo semplice, umano, dove poter portare ciò che si sente — <strong>confusione, stanchezza, emozioni che pesano, momenti di blocco</strong> — senza dover dimostrare nulla.<br><br>Il mio modo di lavorare nasce dal mio <strong>percorso personale</strong>.<br>So cosa significa sentirsi lontani da sé, non capirsi, vivere <strong>schemi che sembrano ripetersi</strong>.",
      body2: "So quanto può fare la differenza incontrare qualcuno che ti aiuta a guardarti dentro con <strong>rispetto e senza giudizio</strong>.<br><br>Uno degli strumenti che utilizzo è l'<strong>interpretazione dei sogni</strong>, perché i sogni parlano di noi in modo sincero e profondo.<br>A volte mostrano parti che durante il giorno non riusciamo a vedere, ma che hanno molto da dire sulla nostra vita, sulle nostre ferite e anche sulle nostre risorse.<br><br>Negli incontri non si tratta di \"aggiustare\" qualcosa, ma di <strong>incontrarsi</strong>, fare chiarezza, dare un nome a ciò che si muove dentro e <strong>ritrovare un po' più di spazio, respiro e libertà</strong> nel proprio modo di vivere.",
      image1: await img("/images/studio-da-councelor.webp"),
      image2: await img("/images/chi-sono_.webp"),
      ctaLabel: "Prenota un colloquio gratuito",
    },

    servizi: {
      visible: true,
      subtitle: "[ DI COSA MI OCCUPO ]",
      headingStart: "In cosa posso",
      headingItalic: "accompagnarti",
      body: "Ti accompagno quando senti che dentro qualcosa chiede attenzione, ma non sai bene da dove iniziare. Posso esserti accanto per:",
      items: keyed([
        { title: "Affrontare rapporti conflittuali", desc: "Difficoltà di coppia, in famiglia o nelle relazioni importanti.", image: await img("/images/affrontare-rapporti.webp") },
        { title: "Rompere schemi e blocchi interiori", desc: "Quei meccanismi che si ripetono e ti fanno sentire fermo o intrappolato.", image: await img("/images/rompere-schemi.webp") },
        { title: "Crescita personale", desc: "Quando senti che è il momento di capirti più a fondo e fare un passo avanti nella tua vita.", image: await img("/images/crescita-personale.webp") },
        { title: "Aumentare la consapevolezza di te", desc: "Comprendere emozioni, reazioni, bisogni e parti di te che restano spesso in secondo piano.", image: await img("/images/consapevolezza-di-se.webp") },
        { title: "Gestire ansia, stress e paure", desc: "Quando il peso emotivo diventa difficile da sostenere da soli.", image: await img("/images/ansia.webp") },
        { title: "Raggiungere nuovi obiettivi personali", desc: "Quando vuoi cambiare qualcosa ma ti senti bloccato o confuso.", image: await img("/images/goal.webp") },
        { title: "Ritrovare te stesso", desc: "Nei momenti in cui ti senti distante da ciò che sei davvero.", image: await img("/images/ritrovare-se-stessi.webp") },
        { title: "Attraversare una perdita o un distacco", desc: "La fine di una relazione, un cambiamento importante, un lutto.", image: await img("/images/attraversare-una-perdita.webp") },
      ], "srv"),
      conclusion: "Ogni percorso è uno spazio di ascolto e di comprensione, dove ciò che senti ha valore e può trovare un significato.",
      ctaLabel: "Prenota un colloquio gratuito",
    },

    comeFunziona: {
      visible: true,
      subtitle: "[ COME FUNZIONA ]",
      headingStart: "Un percorso",
      headingItalic: "chiaro e trasparente",
      body: "Dal primo contatto gratuito all'accompagnamento nel tempo, ogni passo è pensato per offrirti ascolto autentico e un sostegno costante.",
      image: await img("/images/councelor.webp"),
      stepsHeadingStart: "Il percorso",
      stepsHeadingItalic: "individuale",
      stepsIntro: "Nessun pacchetto obbligatorio. Paghi solo gli incontri che fai, senza vincoli.",
      steps: keyed([
        { label: "Passo 1", title: "Prenota il colloquio conoscitivo gratuito", price: "Gratuito", priceSuffix: "", details: "Prenota un <strong>incontro gratuito di 45 minuti</strong> per conoscerci, comprendere la tua situazione e ascoltare le tue esigenze.", bulletPoints: [], highlighted: false },
        { label: "Passo 2", title: "Ricevi una proposta per il tuo percorso", price: "Gratuita", priceSuffix: "", details: "Ti sarà inviata una <strong>sintesi</strong> di ciò che è emerso nel <strong>nostro incontro</strong>, insieme a una proposta di percorso e ai primi strumenti che potremo utilizzare.", bulletPoints: [], highlighted: false },
        { label: "Continuiamo", title: "Ogni incontro successivo", price: "70€", priceSuffix: "/ 45 min", details: "Online, con cadenza da concordare insieme.", bulletPoints: ["Ascolto, dialogo e strumenti dedicati", "Interpretazione dei sogni inclusa", "Nessun vincolo di durata minima", "Puoi interrompere in qualsiasi momento", "Riservatezza totale garantita"], highlighted: true },
      ], "step"),
      ctaLabel: "Prenota un colloquio gratuito",
    },

    perche: {
      visible: true,
      subtitle: "[ CHI SCEGLIERE ]",
      heading: "Perché scegliere me",
      body: "Scegliere qualcuno con cui intraprendere un percorso interiore è una decisione delicata. Al di là dei titoli, ci sono qualità umane e professionali fondamentali.",
      items: keyed([
        { title: "Ho attraversato il mio cammino interiore", desc: "Prima di accompagnare gli altri, ho attraversato il mio percorso personale, chiamato \"opera al nero\": anni di lavoro interiore e confronto con le mie ombre.", icon: await img("/images/icons/compass.svg") },
        { title: "Un lavoro profondo sui sogni", desc: "Integro l'interpretazione dei sogni secondo l'approccio di Gabriella Tupini, uno strumento prezioso per accedere ai contenuti inconsci.", icon: await img("/images/icons/moon-star.svg") },
        { title: "Nessuna lente ideologica", desc: "Non porto credenze religiose o filosofiche nel percorso. Lo spazio che costruisco è neutro, aperto, libero.", icon: await img("/images/icons/scale.svg") },
        { title: "Un percorso costruito insieme", desc: "Ogni cammino nasce dall'ascolto autentico e si costruisce passo dopo passo, rispettando la tua storia, le tue relazioni e il tuo tempo.", icon: await img("/images/icons/heart.svg") },
        { title: "Oltre gli schemi mentali", desc: "Ho lavorato per sciogliere condizionamenti e automatismi della mente. Questo mi consente di ascoltare davvero.", icon: await img("/images/icons/waves.svg") },
      ], "perc"),
    },

    diCosaMiOccupo: {
      visible: true,
      subtitle: "[ DI COSA MI OCCUPO ]",
      headingStart: "Ti accompagno in percorsi di",
      headingItalic: "consapevolezza e crescita personale",
      items: keyed([
        { title: "Percorso di Counseling", desc: "Uno spazio di ascolto e accompagnamento per fare chiarezza, comprendere ciò che stai vivendo e ritrovare una direzione più autentica.", image: await img("/images/Why-Chose-Img-01_1Why-Chose-Img-01.avif") },
        { title: "Interpretazione dei Sogni", desc: "I sogni come linguaggio simbolico dell'inconscio: uno strumento prezioso per esplorare parti profonde di te.", image: await img("/images/interpretazione-sogni-psicoterapia-centro-psicologia-lecco-1.png") },
        { title: "Supporto relazioni e autostima", desc: "Un accompagnamento per riconoscere schemi relazionali, rafforzare l'autostima e costruire rapporti più consapevoli.", image: await img("/images/counseling-1500x430-1.png") },
      ], "dco"),
    },

    strumenti: {
      visible: true,
      subtitle: "[ STRUMENTI ]",
      headingStart: "Gli strumenti",
      headingItalic: "del percorso",
      body: "Non esistono tecniche standard o protocolli rigidi. Ogni persona è diversa, e il lavoro nasce da ciò che porti tu, momento per momento.",
      items: keyed([
        { num: "1", title: "Interpretazione dei sogni", desc: "I sogni parlano attraverso immagini e simboli. Aiutano a comprendere emozioni profonde, parti nascoste di noi e schemi che si ripetono.", icon: await img("/images/Crescent-Moon_1Crescent-Moon.png") },
        { num: "2", title: "Genogramma", desc: "Una mappa della storia familiare che aiuta a riconoscere dinamiche e schemi relazionali che influenzano il presente.", icon: await img("/images/Puzzle_1Puzzle.png") },
        { num: "3", title: "Costellazioni familiari", desc: "Permettono di osservare le dinamiche relazionali e familiari che influenzano il presente, per ritrovare il proprio posto con più chiarezza.", icon: await img("/images/Oak-Tree_1Oak-Tree.png") },
        { num: "4", title: "Scrittura espressiva e di consapevolezza", desc: "La scrittura può diventare uno spazio di ascolto interiore, per dare forma a emozioni, immagini e vissuti.", icon: await img("/images/Autograph_1Autograph.png") },
      ], "str"),
      ctaLabel: "Prenota un colloquio gratuito",
    },

    marquee: {
      visible: true,
      items: keyed([
        { iconKey: "clock", strong: "45 min", label: "durata incontro", highlight: false },
        { iconKey: "screen", strong: "Online", label: "completamente", highlight: false },
        { iconKey: "wallet", strong: "70€", label: "a incontro", highlight: false },
        { iconKey: "shield", strong: "100%", label: "riservatezza", highlight: false },
        { iconKey: "gift", strong: "Primo colloquio", label: "gratuito", highlight: true },
      ], "mq"),
    },

    confronto: {
      visible: true,
      subtitle: "[ QUALE PERCORSO FA PER TE? ]",
      headingStart: "Due approcci diversi,",
      headingItalic: "lo stesso rispetto",
      psicologoTitle: "Psicologo",
      psicologoItems: [
        "Si occupa di diagnosi e trattamento di disturbi psicologici",
        "Lavora in ambito clinico e sanitario",
        "Utilizza strumenti terapeutici e protocolli specifici",
        "Indicato in presenza di sintomi strutturati o sofferenza clinica",
        "Percorsi regolamentati e orientati alla cura",
      ],
      counselorTitle: "Counselor",
      counselorBadge: "Il mio approccio",
      counselorItems: keyed([
        { text: 'Offre uno spazio di <strong class="text-white">ascolto e accompagnamento</strong> non clinico', detail: "Un luogo sicuro dove portare ciò che senti — confusione, stanchezza, emozioni che pesano — senza dover dimostrare nulla." },
        { text: 'Lavora su <strong class="text-white">consapevolezza</strong>, <strong class="text-white">crescita personale</strong> e orientamento', detail: "Non si tratta di 'aggiustare' qualcosa, ma di fare chiarezza, dare un nome a ciò che si muove dentro e ritrovare la propria direzione." },
        { text: 'Aiuta a <strong class="text-white">comprendere</strong> schemi e <strong class="text-white">blocchi emotivi</strong>', detail: "Schemi che si ripetono nelle relazioni, nel lavoro, nelle scelte. Insieme esploriamo da dove vengono e come trasformarli." },
        { text: 'Si rivolge a persone che desiderano conoscersi meglio', detail: "Non serve avere un problema specifico. Basta sentire che è arrivato il momento di fermarsi e guardarsi dentro con onestà." },
        { text: 'Percorsi orientati all\'equilibrio e alle scelte personali', detail: "Ogni percorso è unico, costruito passo dopo passo, rispettando la tua storia, i tuoi tempi e i tuoi bisogni." },
      ], "cou"),
      conclusion: "Non sai quale percorso fa per te? Il colloquio conoscitivo gratuito serve esattamente a capire insieme la strada giusta.",
      ctaLabel: "Prenota un colloquio gratuito",
    },

    faq: {
      visible: true,
      subtitle: "[ DOMANDE FREQUENTI ]",
      headingStart: "Hai qualche",
      headingItalic: "domanda?",
      items: [],
    },

    contatti: {
      visible: true,
      subtitle: "[ CONTATTI ]",
      headingStart: "Cerchi uno spazio di",
      headingItalic: "ascolto?",
      body: "Se senti il bisogno di fermarti, fare chiarezza o capire se questo percorso fa per te, puoi lasciarmi un messaggio. Ti risponderò con attenzione per capire insieme come iniziare.",
      ctaLabel: "Invia il messaggio",
    },
  };

  const siteSettings = {
    _id: "siteSettings",
    _type: "siteSettings",
    logoAlt: "Christian Dilorenzo — Counselor Professionista",
    calendarUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0hE4rG_WwpeS2ck-0o1mnjaoGD6FtqZjcZZgwkNXOB7dSspKlguUEIV4RFzX8DBvZz3v8NjktC",
    email: "info@cridilorenzo.com",
    phone: "+39 347 330 1278",
    whatsappUrl: "https://api.whatsapp.com/send/?phone=393473301278",
  };

  return { homepage, siteSettings };
}

const { homepage, siteSettings } = await build();
console.log("\nScrivo i documenti (createOrReplace)...");
await client.createOrReplace(homepage);
console.log("  ✓ homepage");
await client.createOrReplace(siteSettings);
console.log("  ✓ siteSettings");
console.log("\nFatto. Lo studio ora mostra i testi attuali, modificabili.");
