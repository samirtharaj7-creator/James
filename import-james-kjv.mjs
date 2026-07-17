import { readFileSync, writeFileSync } from "node:fs";

const sourcePath = process.argv[2];
if (!sourcePath) {
  throw new Error("Usage: node import-james-kjv.mjs /path/to/kjv-verses.json");
}

const expectedCounts = [27, 26, 18, 17, 20];
const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const verses = new Map();

for (const [reference, rawText] of Object.entries(source)) {
  const match = reference.match(/^James (\d+):(\d+)$/);
  if (!match || typeof rawText !== "string") continue;
  const chapter = Number(match[1]);
  const verse = Number(match[2]);
  if (chapter < 1 || chapter > 5) continue;
  const normalized = rawText.replace(/\[(.*?)\]/g, "$1").replace(/\s+/g, " ").trim();
  verses.set(`${chapter}:${verse}`, normalized);
}

const expectedTotal = expectedCounts.reduce((sum, count) => sum + count, 0);
if (verses.size !== expectedTotal) {
  throw new Error(`Parsed ${verses.size} James verses; expected ${expectedTotal}.`);
}

expectedCounts.forEach((verseCount, index) => {
  const chapter = index + 1;
  const file = `content/james/chapter-${String(chapter).padStart(2, "0")}.json`;
  const content = JSON.parse(readFileSync(file, "utf8"));
  if (content.chapterNumber !== chapter || content.verses.length !== verseCount) {
    throw new Error(`${file} does not match the James intake structure.`);
  }

  content.verses.forEach((entry, verseIndex) => {
    const verse = verseIndex + 1;
    const expectedReference = `James ${chapter}:${verse}`;
    if (entry.verse !== expectedReference) {
      throw new Error(`${file} contains ${entry.verse}; expected ${expectedReference}.`);
    }
    const text = verses.get(`${chapter}:${verse}`);
    if (!text) throw new Error(`Missing KJV text for ${expectedReference}.`);
    entry.bibleText = text;
  });

  writeFileSync(file, `${JSON.stringify(content, null, 2)}\n`);
});

console.log(`Imported ${verses.size} KJV verses into James 1–5.`);
