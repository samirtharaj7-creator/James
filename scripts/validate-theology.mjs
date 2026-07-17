import { readFileSync } from "node:fs";
import {
  collectPublicText,
  collectStringLeaves,
  commentaryFor,
  loadJames
} from "./james-content-utils.mjs";

const chapters = loadJames();
const errors = [];
let reviewed = 0;
const allowPendingReview = process.argv.includes("--allow-pending-review");

for (const { content } of chapters) {
  for (const verse of content.verses) {
    if (verse.reviewStatus === "verified-seed") {
      reviewed += 1;
    } else if (!allowPendingReview || verse.reviewStatus !== "needs-source-review") {
      const expected = allowPendingReview ? "verified-seed or needs-source-review" : "verified-seed";
      errors.push(`${verse.verse}: expected reviewStatus ${expected}, found ${verse.reviewStatus}`);
    }
  }
}

const prohibitedPublicPatterns = [
  [/\bAdventist\b/i, "denominational label"],
  [/General Conference/i, "General Conference attribution"],
  [/Biblical Research Institute/i, "Biblical Research Institute attribution"],
  [/White Estate|Ellen G\.? White/i, "external denominational attribution"],
  [/\bPaul(?:['’]s)?\s+(?:writes?|says?|argues?|teaches?|declares?|commands?|warns?|urges?|explains?|presents?|describes?)\b/i, "unqualified Pauline authorship"],
  [/https?:\/\/|\bwww\./i, "public URL"],
  [/\bin this reconstruction\b/i, "reconstruction language"],
  [/according to (?:our|the) (?:source|sources|research)/i, "research-process attribution"]
];

const backgroundPath = "content/background.json";
const background = JSON.parse(readFileSync(backgroundPath, "utf8"));
const publicText = [
  ...collectPublicText(chapters),
  ...collectStringLeaves(background, backgroundPath)
];

for (const { field, value } of publicText) {
  for (const [pattern, label] of prohibitedPublicPatterns) {
    if (pattern.test(value)) errors.push(`${field}: contains ${label}`);
  }
}

const safeguards = [
  { reference: "James 1:13", patterns: [/God/is, /tempt|evil/is] },
  { reference: "James 2:17", patterns: [/dead/is, /work|action|deed/is] },
  { reference: "James 2:24", patterns: [/faith/is, /work|action|obedien/is] },
  { reference: "James 3:1", patterns: [/teach/is, /judg|account/is] },
  { reference: "James 4:15", patterns: [/Lord/is, /will|depend|provid/is] },
  { reference: "James 5:15", patterns: [/pray/is, /heal|sick|raise/is] }
];

for (const { reference, patterns } of safeguards) {
  const commentary = commentaryFor(reference, chapters);
  for (const pattern of patterns) {
    if (!pattern.test(commentary)) errors.push(`${reference}: missing theological safeguard ${pattern}`);
  }
}

if (!allowPendingReview && reviewed !== 108) {
  errors.push(`Expected 108 verified notes, found ${reviewed}`);
}

if (errors.length) {
  console.error(`Theological validation failed with ${errors.length} error(s):\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(
  allowPendingReview
    ? `Theological content validation passed: ${safeguards.length} targeted controls; review-status gate deferred.`
    : `Theological validation passed: ${reviewed} verified notes and ${safeguards.length} targeted controls.`
);
