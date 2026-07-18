import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, FileText } from "lucide-react";
import { jamesArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "James Articles",
  description: "Study paths and long-form articles accompanying the James commentary."
};

export default function ArticlesPage() {
  return (
    <main className="articles-page">
      <section className="articles-hero" aria-labelledby="articles-title">
        <div className="articles-hero-copy">
          <h1 id="articles-title">Articles</h1>
          <p>
            Follow James from tested faith and impartial love to disciplined speech,
            humble wisdom, patient endurance, and restoring prayer.
          </p>
        </div>
      </section>

      <section className="articles-shell" aria-label="James article library">
        <div className="articles-grid">
          <Link href="/james/1" className="article-list-card">
            <span className="article-list-icon" aria-hidden="true">
              <BookOpenText className="h-5 w-5" />
            </span>
            <span className="article-list-eyebrow">Chapter Commentary</span>
            <strong>Read James from the beginning</strong>
            <span>
              Start with James 1 and move through all five chapters with the KJV text,
              verse-by-verse exposition, cross references, and word notes.
            </span>
            <em>
              Open James 1
              <ArrowRight className="h-4 w-4" />
            </em>
          </Link>

          {jamesArticles.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="article-list-card">
              <span className="article-list-icon" aria-hidden="true">
                <FileText className="h-5 w-5" />
              </span>
              <span className="article-list-eyebrow">{article.eyebrow}</span>
              <strong>{article.title}</strong>
              <span>{article.summary}</span>
              <em>
                Read Article
                <ArrowRight className="h-4 w-4" />
              </em>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
