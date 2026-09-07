import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllArticles,
  blogClusters,
  getPillarArticles,
  getTotalArticleCount,
} from '../data/blog';
import BlogCard from '../components/blog/BlogCard';
import { setTitle, setMetaTag, setCanonical, injectJsonLd, removeJsonLd, SITE_URL } from '../lib/seo';
import {
  Search,
  BookOpen,
  Filter,
  Layers,
  Sparkles,
  ChevronRight,
  Award,
} from 'lucide-react';

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const allArticles = useMemo(() => getAllArticles(), []);
  const pillarArticles = useMemo(() => getPillarArticles(), []);
  const totalCount = useMemo(() => getTotalArticleCount(), []);

  // SEO
  useEffect(() => {
    const title = 'Industrial Machinery Blogs & Technical Guides | Zohan Enterprises';
    const description = `Explore ${totalCount}+ in-depth industrial blogs on wire cutting, stripping, terminal crimping, soldering, scrap wire copper recovery, and manufacturing engineering by Zohan Enterprises.`;
    const canonicalUrl = `${SITE_URL}/blog`;

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
    injectJsonLd('blog-index-schema', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${SITE_URL}/blog#page`,
          url: `${SITE_URL}/blog`,
          name: 'Zohan Enterprises Industrial Blogs',
          description:
            'Comprehensive technical guides, buying guides, troubleshooting, and quality engineering standards for wire and cable processing machinery.',
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
          ],
        },
      ],
    });

    return () => {
      removeJsonLd('blog-index-schema');
    };
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    let result = allArticles;

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((art) => art.categorySlug === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.excerpt.toLowerCase().includes(q) ||
          art.primaryKeyword.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allArticles, selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage, itemsPerPage]);

  const handleCategoryClick = (catSlug) => {
    setSelectedCategory(catSlug);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Featured Pillar
  const featuredPillar = pillarArticles[0] || allArticles[0];

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 pt-24 pb-20 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-[#F8FAF9] to-[#F8FAF9] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 py-16 sm:py-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="w-4 h-4" />
              Industrial Machinery Blogs & Technical Insights
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-tight mb-5">
              Expert Engineering Blogs for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D5C3A] to-emerald-600 dark:from-amber-400 dark:to-amber-200">
                Wire & Cable Processing
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
              Explore {totalCount}+ technical blogs, IPC/WHMA standards, machine buying checklists,
              maintenance procedures, and industry applications written by Zohan Enterprises
              machinery specialists.
            </p>

            {/* Live Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="blog-search-input"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={`Search across ${totalCount}+ blogs (e.g. 'crimp height', 'scrap copper', 'ZE-6mm', 'OEE')...`}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0D5C3A] dark:focus:border-amber-500 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-amber-500/20 shadow-md dark:shadow-2xl transition-all text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pillar Article Hero (If on all and no search) */}
      {selectedCategory === 'all' && !searchQuery && featuredPillar && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-16">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl dark:shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-400" />
                      Featured Pillar Article
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {featuredPillar.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight mb-4 leading-tight">
                    <Link
                      to={`/blog/${featuredPillar.slug}`}
                      className="hover:text-[#0D5C3A] dark:hover:text-amber-400 transition-colors"
                    >
                      {featuredPillar.title}
                    </Link>
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {featuredPillar.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    to={`/blog/${featuredPillar.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D5C3A] hover:bg-emerald-700 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-slate-950 font-bold text-sm transition-all shadow-md hover:shadow-lg"
                  >
                    Read Full Master Guide
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                <img
                  src={featuredPillar.featuredImage}
                  alt={featuredPillar.heroImageAlt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://5.imimg.com/data5/SELLER/Default/2026/6/614518552/RT/CI/WT/118138804/ze-6mm-semi-automatic-wire-cutting-stripping-machine-500x500.png";
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0D5C3A] dark:text-amber-400" />
              {selectedCategory === 'all'
                ? 'All Industrial Machinery Articles'
                : blogClusters.find((c) => c.slug === selectedCategory)?.name || 'Articles'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Showing <span className="font-semibold text-[#0F172A] dark:text-white">{filteredArticles.length}</span> blogs found
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="blog-category-select" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Filter by Topic:
              </label>
              <select
                id="blog-category-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryClick(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:border-[#0D5C3A] dark:focus:border-amber-400"
              >
                <option value="all">All Topics ({totalCount})</option>
                {blogClusters.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory !== 'all' && (
              <Link
                to={`/blog/category/${selectedCategory}`}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#0D5C3A] dark:text-amber-400 hover:underline"
              >
                View Category Page
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {paginatedArticles.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <Filter className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">No blogs found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              We couldn't find any articles matching "{searchQuery}". Try searching with different
              keywords or explore all categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0D5C3A] hover:bg-emerald-700 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === page
                    ? 'bg-[#0D5C3A] text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
