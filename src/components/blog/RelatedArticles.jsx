import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import { Compass, ArrowRight } from 'lucide-react';

export default function RelatedArticles({ articles = [], currentCategory = "Industrial Guides", categorySlug = "" }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section
      id="related-articles"
      aria-label="Related Industrial Guides"
      className="my-12 pt-8 border-t border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0D5C3A] dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Related Engineering & Machinery Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Continue exploring technical guides in {currentCategory}.
            </p>
          </div>
        </div>

        {categorySlug && (
          <Link
            to={`/blog/category/${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D5C3A] dark:text-amber-400 hover:text-emerald-700 dark:hover:text-amber-300 transition-colors self-start sm:self-auto"
          >
            All {currentCategory} Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((art) => (
          <BlogCard key={art.id} article={art} compact={true} />
        ))}
      </div>
    </section>
  );
}
