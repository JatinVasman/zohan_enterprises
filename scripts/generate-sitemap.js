// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Sitemap Generator for Zohan Enterprises (Local SEO & Blog Authority)
// Canonical domain: https://zohanenterprises.com
// ─────────────────────────────────────────────────────────────────────────────

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { rawLocations } from "../src/data/locations/dataset.js"
import { allBlogArticles, blogClusters } from "../src/data/blog/index.js"
import { allProducts, categoryMeta } from "../src/data/products.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE_URL = "https://zohanenterprises.com"
const TODAY = new Date().toISOString().split("T")[0]

console.log(`Generating sitemaps for ${rawLocations.length} locations, ${allBlogArticles.length} blog articles, and ${allProducts.length} products...`)

// 1. Static & Core Pages
const corePages = [
  { url: `${BASE_URL}/`,                                    priority: "1.0", changefreq: "daily"   },
  { url: `${BASE_URL}/products`,                            priority: "0.9", changefreq: "weekly"  },
  { url: `${BASE_URL}/industrial-machinery/locations`,      priority: "0.9", changefreq: "weekly"  },
  { url: `${BASE_URL}/blog`,                                priority: "0.9", changefreq: "daily"   },
  { url: `${BASE_URL}/about`,                               priority: "0.7", changefreq: "monthly" },
  { url: `${BASE_URL}/contact`,                             priority: "0.8", changefreq: "monthly" },
]

// 2. Product category pages
const productCategoryPages = categoryMeta.map((cat) => ({
  url: `${BASE_URL}/products/${cat.slug}`,
  priority: "0.85",
  changefreq: "weekly",
}))

// 3. Individual product pages
const productPages = allProducts.map((p) => ({
  url: `${BASE_URL}/product/${p.slug}`,
  priority: "0.8",
  changefreq: "monthly",
}))

// Combine into sitemap-main.xml
const allMainPages = [...corePages, ...productCategoryPages, ...productPages]

function urlEntry(url, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

// 4. Generate sitemap-main.xml
const sitemapMainXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allMainPages
  .map((p) => urlEntry(p.url, TODAY, p.changefreq, p.priority))
  .join("\n")}
</urlset>`

const sitemapMainPath = path.resolve(__dirname, "../public/sitemap-main.xml")
fs.writeFileSync(sitemapMainPath, sitemapMainXml, "utf-8")
console.log(`Generated public/sitemap-main.xml with ${allMainPages.length} URLs (${corePages.length} core + ${productCategoryPages.length} categories + ${productPages.length} products)`)

// 5. Generate sitemap-locations.xml
const tierPriorities = {
  1: { priority: "0.9", changefreq: "weekly" },
  2: { priority: "0.8", changefreq: "weekly" },
  3: { priority: "0.7", changefreq: "monthly" },
  4: { priority: "0.6", changefreq: "monthly" },
  5: { priority: "0.5", changefreq: "monthly" },
}

const locationUrlsXml = rawLocations
  .map((loc) => {
    const config = tierPriorities[loc.tier] || { priority: "0.6", changefreq: "monthly" }
    const url = `${BASE_URL}/industrial-machinery/${loc.slug}`
    return urlEntry(url, TODAY, config.changefreq, config.priority)
  })
  .join("\n")

const sitemapLocationsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locationUrlsXml}
</urlset>`

const sitemapLocationsPath = path.resolve(__dirname, "../public/sitemap-locations.xml")
fs.writeFileSync(sitemapLocationsPath, sitemapLocationsXml, "utf-8")
console.log(`Generated public/sitemap-locations.xml with ${rawLocations.length} locations`)

// 6. Generate sitemap-blog.xml
const blogCategoryUrls = blogClusters.map((cluster) => ({
  url: `${BASE_URL}/blog/category/${cluster.slug}`,
  lastmod: TODAY,
  changefreq: "weekly",
  priority: "0.85",
}))

const blogArticleUrls = allBlogArticles.map((art) => ({
  url: `${BASE_URL}/blog/${art.slug}`,
  lastmod: art.updatedAt || art.publishedAt || TODAY,
  changefreq: "weekly",
  priority: art.isPillar ? "0.85" : "0.75",
}))

const allBlogUrls = [
  { url: `${BASE_URL}/blog`, lastmod: TODAY, changefreq: "daily", priority: "0.9" },
  ...blogCategoryUrls,
  ...blogArticleUrls,
]

const sitemapBlogXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allBlogUrls
  .map((p) => urlEntry(p.url, p.lastmod, p.changefreq, p.priority))
  .join("\n")}
</urlset>`

const sitemapBlogPath = path.resolve(__dirname, "../public/sitemap-blog.xml")
fs.writeFileSync(sitemapBlogPath, sitemapBlogXml, "utf-8")
console.log(`Generated public/sitemap-blog.xml with ${allBlogUrls.length} blog URLs (${allBlogArticles.length} articles, ${blogClusters.length} clusters, 1 hub)`)

// 7. Generate sitemap index in public/sitemap.xml
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-main.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-locations.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-blog.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`

const sitemapIndexPath = path.resolve(__dirname, "../public/sitemap.xml")
fs.writeFileSync(sitemapIndexPath, sitemapIndexXml, "utf-8")
console.log(`Generated public/sitemap.xml (Sitemap Index containing 3 sitemaps)`)

