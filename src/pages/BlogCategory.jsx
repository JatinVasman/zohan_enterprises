import { useMemo, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getClusterBySlug, getArticlesByCategory, blogClusters } from '../data/blog';
import BlogCard from '../components/blog/BlogCard';
import BlogProductsBlock from '../components/blog/BlogProductsBlock';
import { setTitle, setMetaTag, setCanonical, injectJsonLd, removeJsonLd, SITE_URL } from '../lib/seo';
import {
  Layers,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function BlogCategory() {
  const { categorySlug } = useParams();

  const cluster = useMemo(() => getClusterBySlug(categorySlug), [categorySlug]);
  const articles = useMemo(() => getArticlesByCategory(categorySlug), [categorySlug]);

  // SEO
  useEffect(() => {
    if (cluster) {
      const title = `${cluster.title} Blogs & Technical Insights | Zohan Enterprises`;
      const description = cluster.description;
      const canonicalUrl = `${SITE_URL}/blog/category/${cluster.slug}`;

      setTitle(title);
      setMetaTag('description', description);
      setCanonical(canonicalUrl);
      setMetaTag('og:title', title, 'property');
      setMetaTag('og:description', description, 'property');
      setMetaTag('og:url', canonicalUrl, 'property');
      setMetaTag('og:type', 'website', 'property');
      setMetaTag('twitter:title', title);
      setMetaTag('twitter:description', description);

      // FIXED: injectJsonLd(id, data) — id first, data second
      injectJsonLd('blog-category-schema', {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': `${SITE_URL}/blog/category/${cluster.slug}#page`,
            url: `${SITE_URL}/blog/category/${cluster.slug}`,
            name: `${cluster.title} - Industrial Blogs`,
            description: cluster.description,
            publisher: {
              '@type': 'Organization',
              name: 'Zohan Enterprises',
              url: SITE_URL,
            },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${SITE_URL}/blog` },
              { '@type': 'ListItem', position: 3, name: cluster.title, item: canonicalUrl },
            ],
          },
        ],
      });
    }

    return () => {
      removeJsonLd('blog-category-schema');
    };
  }, [cluster]);

  if (!cluster) {
    return <Navigate to="/blog" replace />;
  }

  const pillarArticle = articles.find((art) => art.isPillar) || articles[0];
  const supportingArticles = articles.filter((art) => art.id !== pillarArticle?.id);

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 pt-24 pb-20 transition-colors duration-200">
      {/* Category Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-[#F8FAF9] to-[#F8FAF9] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
            <Link to="/" className="hover:text-[#0D5C3A] dark:hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <Link to="/blog" className="hover:text-[#0D5C3A] dark:hover:text-white transition-colors">
              Blogs
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-[#0D5C3A] dark:text-amber-400 font-semibold">{cluster.title}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Layers className="w-4 h-4" />
              Topic Category ({articles.length} Articles)
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight mb-4">
              {cluster.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {cluster.description}
            </p>

            {/* Sub-topics keywords */}
            {cluster.subTopics && cluster.subTopics.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {cluster.subTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-amber-400" />
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Cluster Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pillar Article Showcase */}
        {pillarArticle && (
          <section className="mb-14 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-amber-950/20 border border-slate-200 dark:border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-md dark:shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/80 dark:border-emerald-500/40 rounded-full mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Pillar Guide
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white mb-3 hover:text-[#0D5C3A] dark:hover:text-amber-400 transition-colors">
                  <Link to={`/blog/${pillarArticle.slug}`}>{pillarArticle.title}</Link>
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                  {pillarArticle.excerpt}
                </p>
                <Link
                  to={`/blog/${pillarArticle.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D5C3A] hover:bg-emerald-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-slate-950 font-bold text-sm transition-all shadow-md"
                >
                  Read Comprehensive Pillar Guide
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                <img
                  src={pillarArticle.featuredImage}
                  alt={pillarArticle.heroImageAlt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://5.imimg.com/data5/SELLER/Default/2026/6/614518552/RT/CI/WT/118138804/ze-6mm-semi-automatic-wire-cutting-stripping-machine-500x500.png";
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Supporting Articles Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-[#0D5C3A] dark:text-amber-400" />
            Specialized Guides in {cluster.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {supportingArticles.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Featured Machines for this Cluster */}
        {cluster.targetProducts && cluster.targetProducts.length > 0 && (
          <BlogProductsBlock
            productSlugs={cluster.targetProducts}
            title={`Recommended ${cluster.title} Machinery`}
          />
        )}

        {/* Other Clusters Navigation */}
        <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-6">Explore Other Blog Topics</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {blogClusters
              .filter((c) => c.slug !== cluster.slug)
              .map((c) => (
                <Link
                  key={c.id}
                  to={`/blog/category/${c.slug}`}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-amber-500/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white flex items-center justify-between shadow-sm"
                >
                  <span className="truncate">{c.title}</span>
                  <span className="text-[10px] text-[#0D5C3A] dark:text-amber-400 bg-emerald-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">
                    {c.articleCount}
                  </span>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
