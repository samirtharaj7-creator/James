export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "emphasis"; title: string; text: string };

export type ArticleSection = {
  title: string;
  blocks: ArticleBlock[];
};

export type JamesArticle = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  sections: ArticleSection[];
};

// Add future articles here. The listing reads from this collection; connect
// ArticleDetail to a static route when the first article is ready to publish.
export const jamesArticles: JamesArticle[] = [];

export function getArticle(slug: string) {
  return jamesArticles.find((article) => article.slug === slug) ?? null;
}
