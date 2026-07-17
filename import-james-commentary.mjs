import { readFileSync, writeFileSync } from "node:fs";

const sourcePath = process.argv[2];
if (!sourcePath) {
  throw new Error("Usage: node import-james-commentary.mjs /path/to/james-commentary.json");
}

const expectedCounts = [27, 26, 18, 17, 20];
const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const entries = Array.isArray(source)
  ? Object.fromEntries(source.map((entry) => [entry.verse, entry]))
  : source;
let imported = 0;

expectedCounts.forEach((verseCount, index) => {
  const chapter = index + 1;
  const file = `content/james/chapter-${String(chapter).padStart(2, "0")}.json`;
  const content = JSON.parse(readFileSync(file, "utf8"));

  if (content.chapterNumber !== chapter || content.verses.length !== verseCount) {
    throw new Error(`${file} does not match the James content structure.`);
  }

  for (const verse of content.verses) {
    const incoming = entries[verse.verse];
    if (!incoming) continue;
    const detailedExplanation = typeof incoming === "string"
      ? incoming
      : incoming.detailedExplanation ?? incoming.commentary?.detailedExplanation;
    if (typeof detailedExplanation !== "string" || !detailedExplanation.trim()) {
      throw new Error(`${verse.verse} is missing detailedExplanation.`);
    }

    verse.commentary.detailedExplanation = detailedExplanation.trim();
    if (Array.isArray(incoming.crossReferences)) verse.crossReferences = incoming.crossReferences;
    if (Array.isArray(incoming.wordNotes)) verse.wordNotes = incoming.wordNotes;
    verse.reviewStatus = incoming.reviewStatus ?? "needs-source-review";
    imported += 1;
  }

  writeFileSync(file, `${JSON.stringify(content, null, 2)}\n`);
});

console.log(`Imported commentary for ${imported} James verse records.`);
