import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookChapterStrip } from "@/components/book-chapter-strip";
import { ChapterStudy, type PublicChapterContent } from "@/components/verse-accordion";
import { JAMES, getJamesChapter, getJamesChapterAdjacency, getJamesStaticParams } from "@/lib/james";
import { getReferencePreviewsForChapter } from "@/lib/reference-previews";
import type { ChapterContent } from "@/lib/schemas";

export function generateStaticParams() {
  return getJamesStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter } = await params;
  const content = getJamesChapter(chapter);
  if (!content) notFound();
  return { title: `James ${content.chapterNumber}`, description: `James ${content.chapterNumber} with the King James text and verse-by-verse commentary.` };
}

export default async function JamesChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const content = getJamesChapter(chapter);
  const adjacency = getJamesChapterAdjacency(chapter);
  if (!content || !adjacency) notFound();
  const publicContent = withoutAuditSources(content);
  const referencePreviews = getReferencePreviewsForChapter(content);
  return (
    <main className="reader-page">
      <BookChapterStrip
        activeChapter={content.chapterNumber}
        bookSlug={JAMES.slug}
        bookName={JAMES.name}
        chapterCount={JAMES.chapterCount}
        verseCounts={JAMES.verseCounts}
      />
      <ChapterStudy
        chapter={publicContent}
        bookName={JAMES.name}
        referencePreviews={referencePreviews}
      />
      <nav className="reader-chapter-nav no-print" aria-label="James adjacent chapters">
        {adjacency.previous ? <Link href={`/james/${adjacency.previous}`}><ChevronLeft className="h-4 w-4" />James {adjacency.previous}</Link> : <span />}
        {adjacency.next ? <Link href={`/james/${adjacency.next}`}>James {adjacency.next}<ChevronRight className="h-4 w-4" /></Link> : null}
      </nav>
    </main>
  );
}

function withoutAuditSources(chapter: ChapterContent): PublicChapterContent {
  return JSON.parse(JSON.stringify(chapter, (key, value) => key === "sources" || key === "sourceAudit" ? undefined : value)) as PublicChapterContent;
}
