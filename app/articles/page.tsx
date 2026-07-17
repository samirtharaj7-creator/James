import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { jamesArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "James Articles",
  description: "A growing library of long-form studies on the book of James."
};

export default function ArticlesPage() {
  return (
    <main className="articles-page">
      <section className="articles-hero" aria-labelledby="articles-title">
        <div className="articles-hero-copy">
          <h1 id="articles-title">Articles</h1>
          <p>
            Long-form studies on the book of James will be added here as they are prepared.
          </p>
        </div>
      </section>

      <section className="articles-shell" aria-label="James article library">
        {jamesArticles.length > 0 ? (
          <div className="articles-grid">
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
        ) : (
          <div className="articles-empty-state">
            <span className="articles-empty-icon" aria-hidden="true">
              <FileText className="h-6 w-6" />
            </span>
            <p className="articles-empty-eyebrow">Article Library</p>
            <h2>New articles are coming</h2>
            <p>The first study will appear here when it is ready.</p>
          </div>
        )}
      </section>
    </main>
  );
}
