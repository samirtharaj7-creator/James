import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ChapterContentSchema, type ChapterContent } from "@/lib/schemas";
import { padChapter } from "@/lib/utils";

export const JAMES = {
  slug: "james",
  name: "James",
  chapterCount: 5,
  verseCounts: [27, 26, 18, 17, 20]
} as const;

export type ChapterAdjacency = { previous: number | null; next: number | null };

export function getJamesStaticParams() {
  return Array.from({ length: JAMES.chapterCount }, (_, index) => ({ chapter: String(index + 1) }));
}

export function parseJamesChapterNumber(chapter: number | string): number | null {
  const rawChapter = String(chapter);
  if (!/^[1-9]\d*$/.test(rawChapter)) return null;
  const chapterNumber = Number(rawChapter);
  if (!Number.isSafeInteger(chapterNumber) || chapterNumber > JAMES.chapterCount) return null;
  return chapterNumber;
}

export function getJamesChapter(chapter: number | string): ChapterContent | null {
  const chapterNumber = parseJamesChapterNumber(chapter);
  if (chapterNumber === null) return null;
  const path = join(process.cwd(), "content", JAMES.slug, `chapter-${padChapter(chapterNumber)}.json`);
  if (!existsSync(path)) return null;
  const parsed = ChapterContentSchema.parse(JSON.parse(readFileSync(path, "utf8")));
  const expectedVerseCount = JAMES.verseCounts[chapterNumber - 1];
  if (parsed.chapterNumber !== chapterNumber || parsed.verses.length !== expectedVerseCount) {
    throw new Error(`James ${chapterNumber} content structure is invalid.`);
  }
  parsed.verses.forEach((verse, index) => {
    if (verse.verse !== `James ${chapterNumber}:${index + 1}`) {
      throw new Error(`James ${chapterNumber} contains an invalid verse slot.`);
    }
  });
  return parsed;
}

export function getJamesChapterAdjacency(chapter: number | string): ChapterAdjacency | null {
  const chapterNumber = parseJamesChapterNumber(chapter);
  if (chapterNumber === null) return null;
  return {
    previous: chapterNumber > 1 ? chapterNumber - 1 : null,
    next: chapterNumber < JAMES.chapterCount ? chapterNumber + 1 : null
  };
}
