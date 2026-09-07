// ─────────────────────────────────────────────────────────────────────────────
// Master Blog Data Aggregation & Helper Functions
// 662 Articles across 12 Industrial Clusters
// ─────────────────────────────────────────────────────────────────────────────

import { blogClusters } from "./clusters.js";
import { wireProcessingArticles } from "./articles/wireProcessing.js";
import { crimpingArticles } from "./articles/crimping.js";
import { cuttingStrippingArticles } from "./articles/cuttingStripping.js";
import { solderingArticles } from "./articles/soldering.js";
import { scrapProcessingArticles } from "./articles/scrapProcessing.js";
import { cableHarnessArticles } from "./articles/cableHarness.js";
import { industrialAutomationArticles } from "./articles/industrialAutomation.js";
import { manufacturingEngineeringArticles } from "./articles/manufacturingEngineering.js";
import { buyingGuidesArticles } from "./articles/buyingGuides.js";
import { maintenanceTroubleshootingArticles } from "./articles/maintenanceTroubleshooting.js";
import { industryApplicationsArticles } from "./articles/industryApplications.js";
import { technologyTrendsArticles } from "./articles/technologyTrends.js";

// Combine all articles into a single master array
export const allBlogArticles = [
  ...wireProcessingArticles,
  ...crimpingArticles,
  ...cuttingStrippingArticles,
  ...solderingArticles,
  ...scrapProcessingArticles,
  ...cableHarnessArticles,
  ...industrialAutomationArticles,
  ...manufacturingEngineeringArticles,
  ...buyingGuidesArticles,
  ...maintenanceTroubleshootingArticles,
  ...industryApplicationsArticles,
  ...technologyTrendsArticles,
];

// Export clusters
export { blogClusters };

// Get all articles sorted by date descending
export function getAllArticles() {
  return [...allBlogArticles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

// Get single article by slug
export function getArticleBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.trim().toLowerCase();
  return allBlogArticles.find((art) => art.slug.toLowerCase() === cleanSlug) || null;
}

// Get articles by category slug
export function getArticlesByCategory(categorySlug) {
  if (!categorySlug) return [];
  const cleanSlug = categorySlug.trim().toLowerCase();
  return allBlogArticles
    .filter((art) => art.categorySlug.toLowerCase() === cleanSlug)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

// Get cluster metadata by category slug
export function getClusterBySlug(categorySlug) {
  if (!categorySlug) return null;
  const cleanSlug = categorySlug.trim().toLowerCase();
  return blogClusters.find((c) => c.slug.toLowerCase() === cleanSlug) || null;
}

// Get all pillar articles (12 pillars)
export function getPillarArticles() {
  return allBlogArticles.filter((art) => art.isPillar);
}

// Get related articles for a given article
export function getRelatedArticles(article, limit = 4) {
  if (!article) return [];
  
  // 1. Explicitly mapped related slugs
  if (article.relatedArticles && article.relatedArticles.length > 0) {
    const mapped = article.relatedArticles
      .map((slug) => getArticleBySlug(slug))
      .filter(Boolean);
    if (mapped.length >= limit) {
      return mapped.slice(0, limit);
    }
  }

  // 2. Same category articles
  const sameCategory = allBlogArticles
    .filter((art) => art.id !== article.id && art.categorySlug === article.categorySlug)
    .sort((a, b) => (b.isPillar ? 1 : 0) - (a.isPillar ? 1 : 0));

  // 3. Fallback to any recent articles
  const pool = [...sameCategory, ...allBlogArticles.filter((art) => art.id !== article.id)];
  const unique = Array.from(new Set(pool));
  return unique.slice(0, limit);
}

// Search articles by text query
export function searchArticles(query) {
  if (!query || typeof query !== "string") return [];
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  return allBlogArticles.filter((art) => {
    return (
      art.title.toLowerCase().includes(q) ||
      art.excerpt.toLowerCase().includes(q) ||
      art.primaryKeyword.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      (art.secondaryKeywords && art.secondaryKeywords.some((k) => k.toLowerCase().includes(q)))
    );
  });
}

// Get total count of articles
export function getTotalArticleCount() {
  return allBlogArticles.length;
}
