import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen, Layers } from 'lucide-react';

export default function BlogCard({ article, compact = false }) {
  if (!article) return null;

  return (
    <article
      id={`blog-card-${article.slug}`}
      className={`group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-amber-500/5 transition-all duration-300 hover:border-emerald-500/40 dark:hover:border-amber-500/40 hover:-translate-y-1 ${
        compact ? 'h-full' : ''
      }`}
    >
      {/* Article Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={article.featuredImage}
          alt={article.heroImageAlt || article.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://5.imimg.com/data5/SELLER/Default/2026/6/614518552/RT/CI/WT/118138804/ze-6mm-semi-automatic-wire-cutting-stripping-machine-500x500.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-white/95 border border-emerald-200/80 dark:text-amber-300 dark:bg-slate-900/90 dark:border-amber-500/40 rounded-full backdrop-blur-md shadow-sm">
            <Layers className="w-3 h-3 text-emerald-600 dark:text-amber-400" />
            {article.category}
          </span>
          {article.isPillar && (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 border border-emerald-300 dark:text-emerald-300 dark:bg-emerald-950/80 dark:border-emerald-500/40 rounded-full backdrop-blur-md">
              Pillar Guide
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
        <div>
          {/* Metadata Bar */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              {article.readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white group-hover:text-[#0D5C3A] dark:group-hover:text-amber-400 transition-colors line-clamp-2 mb-2.5 leading-snug">
            <Link to={`/blog/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#0D5C3A] dark:text-amber-400" />
            Industrial Blog
          </span>
          <Link
            to={`/blog/${article.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#0D5C3A] dark:text-amber-400 hover:text-emerald-700 dark:hover:text-amber-300 transition-colors group/btn"
          >
            Read Article
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
