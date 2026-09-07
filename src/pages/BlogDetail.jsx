import { useMemo, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getArticleBySlug, getRelatedArticles } from '../data/blog';
import TableOfContents from '../components/blog/TableOfContents';
import BlogProductsBlock from '../components/blog/BlogProductsBlock';
import BlogLocationContextBlock from '../components/blog/BlogLocationContextBlock';
import BlogFAQAccordion from '../components/blog/BlogFAQAccordion';
import RelatedArticles from '../components/blog/RelatedArticles';
import { setTitle, setMetaTag, setCanonical, setRobots, setOgMeta, setTwitterMeta, setArticleMeta, injectJsonLd, removeJsonLd, SITE_URL } from '../lib/seo';
import {
  Calendar,
  Clock,
  User,
  Layers,
  ChevronRight,
  Sparkles,
  Share2,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams();

  const article = useMemo(() => getArticleBySlug(slug), [slug]);
  const relatedArticles = useMemo(() => getRelatedArticles(article, 3), [article]);

  // SEO & JSON-LD injection
  useEffect(() => {
    if (article) {
      const canonicalUrl = `${SITE_URL}/blog/${article.slug}`;
      setTitle(article.metaTitle || `${article.title} | Zohan Enterprises`);
      setMetaTag('description', article.metaDescription || article.excerpt);
      setCanonical(canonicalUrl);
      setRobots('index, follow');

      setOgMeta({
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.excerpt,
        url: canonicalUrl,
        image: article.featuredImage,
        type: 'article',
      });
      setTwitterMeta({
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.excerpt,
        image: article.featuredImage,
      });
      setArticleMeta({
        published: article.publishedAt,
        modified: article.updatedAt || article.publishedAt,
      });

      // Build structured JSON-LD schemas
      const graph = [
        // 1. Article / BlogPosting Schema
        {
          '@type': article.schemaType || 'BlogPosting',
          '@id': `${SITE_URL}/blog/${article.slug}#article`,
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            name: 'Zohan Enterprises',
            url: SITE_URL,
          },
          headline: article.title,
          description: article.metaDescription || article.excerpt,
          image: [article.featuredImage],
          datePublished: article.publishedAt,
          dateModified: article.updatedAt || article.publishedAt,
          author: {
            '@type': 'Person',
            name: article.author || 'Mohd Saif Shabbir Ansari',
            jobTitle: 'Industrial Machinery Specialist & CEO',
            worksFor: {
              '@type': 'Organization',
              name: 'Zohan Enterprises',
              url: SITE_URL,
            },
          },
          publisher: {
            '@type': 'Organization',
            name: 'Zohan Enterprises',
            url: SITE_URL,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/logo.png`,
            },
          },
          mainEntityOfPage: canonicalUrl,
          keywords: [article.primaryKeyword, ...(article.secondaryKeywords || [])].join(', '),
          articleSection: article.category,
        },
        // 2. BreadcrumbList Schema
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${SITE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: article.category, item: `${SITE_URL}/blog/category/${article.categorySlug}` },
            { '@type': 'ListItem', position: 4, name: article.title, item: canonicalUrl },
          ],
        },
      ];

      // 3. FAQPage Schema (if FAQs present)
      if (article.faqs && article.faqs.length > 0) {
        graph.push({
          '@type': 'FAQPage',
          '@id': `${SITE_URL}/blog/${article.slug}#faq`,
          mainEntity: article.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        });
      }

      // FIXED: injectJsonLd(id, data) — id first, data second
      injectJsonLd('blog-detail-schema', { '@context': 'https://schema.org', '@graph': graph });
    }

    return () => {
      removeJsonLd('blog-detail-schema');
    };
  }, [article]);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 pt-24 pb-20 transition-colors duration-200">
      {/* Article Header & Breadcrumbs */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-[#F8FAF9] to-[#F8FAF9] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb nav */}
          <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
            <Link to="/" className="hover:text-[#0D5C3A] dark:hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <Link to="/blog" className="hover:text-[#0D5C3A] dark:hover:text-white transition-colors">
              Blogs
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <Link
              to={`/blog/category/${article.categorySlug}`}
              className="hover:text-[#0D5C3A] dark:hover:text-white transition-colors"
            >
              {article.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-[#0D5C3A] dark:text-amber-400 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {article.title}
            </span>
          </nav>

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Link
              to={`/blog/category/${article.categorySlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider hover:bg-emerald-100 dark:hover:bg-amber-500/20 transition-all shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" />
              {article.category}
            </Link>
            {article.isPillar && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                Pillar Guide
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight mb-6 max-w-4xl">
            {article.title}
          </h1>

          {/* Author & Published Info */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-amber-500/20 border border-emerald-300 dark:border-amber-500/40 flex items-center justify-center text-[#0D5C3A] dark:text-amber-400 font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#0F172A] dark:text-slate-200 font-semibold block">{article.author}</span>
                <span className="text-[11px] text-slate-500">Machinery Specialist</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>{article.readTime}</span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-[#0D5C3A] dark:hover:text-amber-400 transition-colors ml-auto text-xs font-semibold py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Article
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left / Main Column (8 cols) */}
          <article className="lg:col-span-8 flex flex-col">
            {/* Hero Image */}
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-2xl mb-8">
              <img
                src={article.featuredImage}
                alt={article.heroImageAlt || article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://5.imimg.com/data5/SELLER/Default/2026/6/614518552/RT/CI/WT/118138804/ze-6mm-semi-automatic-wire-cutting-stripping-machine-500x500.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Quick Summary Box */}
            {article.quickSummary && (
              <div className="mb-10 p-6 sm:p-7 rounded-3xl bg-emerald-50/80 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border border-emerald-200 dark:border-amber-500/30 shadow-sm dark:shadow-xl relative overflow-hidden">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-amber-500/10 text-[#0D5C3A] dark:text-amber-400 flex-shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-amber-400 mb-2">
                      Key Engineering Takeaway
                    </h3>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                      {article.quickSummary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Table of Contents */}
            <div className="lg:hidden mb-8">
              <TableOfContents items={article.tableOfContents} />
            </div>

            {/* Article Sections */}
            <div className="space-y-12 text-slate-800 dark:text-slate-200">
              {article.sections &&
                article.sections.map((section, idx) => (
                  <section
                    key={section.id || idx}
                    id={section.id}
                    className="scroll-mt-28 space-y-4"
                  >
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-800 pb-3">
                      {section.title}
                    </h2>

                    {/* Section Text */}
                    {section.content && (
                      <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
                        {section.content}
                      </div>
                    )}

                    {/* Technical Table (if section contains table) */}
                    {section.table && (
                      <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-lg">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-900 text-[#0D5C3A] dark:text-amber-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              {section.table.headers.map((h, hIdx) => (
                                <th key={hIdx} className="px-4 py-3.5 font-bold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {section.table.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors even:bg-slate-50/50 dark:even:bg-slate-950/40"
                              >
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Checklist (if section contains checklist) */}
                    {section.checklist && (
                      <div className="my-6 p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-amber-400 mb-3 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          Verification Checklist:
                        </h4>
                        {section.checklist.map((item, cIdx) => (
                          <div key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
            </div>

            {/* Featured Machinery Block */}
            {article.relatedProducts && article.relatedProducts.length > 0 && (
              <BlogProductsBlock
                productSlugs={article.relatedProducts}
                title="Industrial Machinery Used in This Application"
              />
            )}

            {/* Pan-India Delivery & Locations Block */}
            {article.relatedLocations && article.relatedLocations.length > 0 && (
              <BlogLocationContextBlock
                locationSlugs={article.relatedLocations}
                primaryProductSlug={article.relatedProducts?.[0] || 'ze-6mm-semi-automatic-wire-cutting-stripping-machine'}
              />
            )}

            {/* FAQ Accordion Block */}
            {article.faqs && article.faqs.length > 0 && (
              <BlogFAQAccordion faqs={article.faqs} />
            )}

            {/* Related Articles Component */}
            <RelatedArticles
              articles={relatedArticles}
              currentCategory={article.category}
              categorySlug={article.categorySlug}
            />
          </article>

          {/* Right Column / Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Desktop Table of Contents */}
            <div className="hidden lg:block sticky top-28 space-y-8">
              <TableOfContents items={article.tableOfContents} />

              {/* Machinery Expert Contact Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-amber-950/30 border border-slate-200 dark:border-amber-500/30 shadow-md dark:shadow-xl text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-amber-400/10 border border-emerald-200 dark:border-amber-400/30 flex items-center justify-center text-[#0D5C3A] dark:text-amber-400 mx-auto mb-3.5">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-1.5">
                  Need Machinery Guidance?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Talk directly with Zohan engineers for machine sizing, wire sample testing, and quotation.
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+919220725765"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D5C3A] hover:bg-emerald-700 text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 font-bold text-xs transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call: +91-9220725765
                  </a>
                  <a
                    href="https://wa.me/919220725765?text=Hello%20Zohan%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20industrial%20wire%20machinery."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    WhatsApp Live Chat
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
