import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ArticleBlock, JamesArticle } from "@/lib/articles";

export function ArticleDetail({ article }: { article: JamesArticle }) {
  return (
    <main className="article-page">
      <article>
        <header className="article-hero">
          <div className="article-hero-copy">
            <Link href="/articles" className="article-back-link">
              <ArrowLeft className="h-4 w-4" />
              Articles
            </Link>
            <p className="articles-kicker">{article.eyebrow}</p>
            <h1>{article.title}</h1>
            <p>{article.description}</p>
          </div>
        </header>

        <div className="article-shell">
          <aside className="article-toc" aria-label="Article sections">
            <p>In this article</p>
            <nav>
              {article.sections.map((section) => (
                <a key={section.title} href={`#${slugify(section.title)}`}>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="article-body">
            {article.sections.map((section) => (
              <section key={section.title} id={slugify(section.title)}>
                <h2>{section.title}</h2>
                {section.blocks.map((block, index) => (
                  <ArticleBlockView key={`${section.title}-${index}`} block={block} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  if (block.type === "paragraph") return <p>{block.text}</p>;
  return (
    <p>
      <strong>{block.title}</strong>{" "}
      {block.text}
    </p>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
