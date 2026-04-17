#!/usr/bin/env node
// Genera public/guida-sogni.pdf partendo da scripts/guida-sogni/index.html
// Uso: node scripts/guida-sogni/generate.mjs
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);

// Usa il puppeteer installato da @mermaid-js/mermaid-cli (global)
// Se manca: `npm i -g @mermaid-js/mermaid-cli` oppure `npm i puppeteer` in locale
let puppeteer;
try {
  puppeteer = require("puppeteer");
} catch {
  try {
    puppeteer = require("/Users/vincenzopetrone/.nvm/versions/node/v22.17.0/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer");
  } catch (e) {
    console.error("puppeteer non trovato. Installa con: npm i -g @mermaid-js/mermaid-cli");
    process.exit(1);
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "index.html");
const outPath = path.resolve(__dirname, "../../public/guida-sogni.pdf");

(async () => {
  console.log(`Generating PDF from ${htmlPath}...`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  await browser.close();
  console.log(`PDF generato: ${outPath}`);
})();
