import { readFile, writeFile } from "node:fs/promises";

const now = new Date();
const months = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre"
];
const monthYear = `${months[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
const isoDate = now.toISOString().slice(0, 10);
const dateLabel = `${now.getUTCDate()} ${monthYear}`;
const files = [
  "offers.js",
  "index.html",
  "sitemap.xml",
  "code-lucya-cnp/index.html",
  "code-parrainage-boursorama/index.html",
  "code-parrainage-fortuneo/index.html"
];

for (const file of files) {
  const path = new URL(`../${file}`, import.meta.url);
  const original = await readFile(path, "utf8");
  const updated = original
    .replace(/\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) \d{4}\b/gi, monthYear)
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, isoDate)
    .replace(/>\d{1,2} [^<]+<\/time>/g, `>${dateLabel}</time>`);

  if (updated !== original) {
    await writeFile(path, updated, "utf8");
    console.log(`Updated ${file}`);
  }
}