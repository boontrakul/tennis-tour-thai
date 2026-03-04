import Link from "next/link";
import type { Article } from "@/lib/data";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-black/5 bg-gradient-to-br from-emerald-500/5 via-background to-background p-4 shadow-sm transition hover:border-emerald-500/40 hover:shadow-md">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
          {article.category}
        </p>
        <h2 className="mt-2 text-sm font-semibold tracking-tight text-foreground group-hover:text-emerald-700">
          {article.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-xs text-foreground/70">
          {article.excerpt}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] text-foreground/60">
        <span>
          {new Date(article.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span>{article.readTime}</span>
      </div>
      <Link
        href={article.href}
        className="mt-4 inline-flex items-center text-[11px] font-semibold text-emerald-700 underline-offset-4 hover:underline"
      >
        Read article
      </Link>
    </article>
  );
}

