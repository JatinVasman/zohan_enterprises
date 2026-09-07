// ─────────────────────────────────────────────────────────────────────────────
// Dynamic SEO & Structured Data Helpers for Zohan Enterprises SPA
// Production domain: https://zohanenterprise.com
// ─────────────────────────────────────────────────────────────────────────────

/** Canonical production domain — single source of truth */
export const SITE_URL = "https://zohanenterprises.com"

// ─── Core meta helpers ────────────────────────────────────────────────────────

export function setTitle(title) {
  if (title) document.title = title
}

/**
 * Set or update a <meta> tag.
 * @param {string} name    - The name or property value
 * @param {string} content - The content value
 * @param {string} attr    - Attribute to match on: "name" | "property"
 */
export function setMetaTag(name, content, attr = "name") {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

export function setCanonical(url) {
  if (!url) return
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", "canonical")
    document.head.appendChild(el)
  }
  el.setAttribute("href", url)
}

export function setRobots(content = "index, follow") {
  setMetaTag("robots", content)
}

// ─── Structured data helpers ──────────────────────────────────────────────────

/**
 * Inject or update a JSON-LD <script> block.
 * IMPORTANT: Parameters are (id, data) — id first, data second.
 * @param {string} id   - Unique element ID for this script block
 * @param {object} data - The JSON-LD object to serialise
 */
export function injectJsonLd(id, data) {
  if (!data) return
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement("script")
    el.id = id
    el.type = "application/ld+json"
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function removeJsonLd(id) {
  document.getElementById(id)?.remove()
}

export function removeMetaTag(name, attr = "name") {
  document.querySelector(`meta[${attr}="${name}"]`)?.remove()
}

// ─── Open Graph helpers ───────────────────────────────────────────────────────

export function setOgMeta({ title, description, url, image, type = "website", siteName = "Zohan Enterprises" }) {
  if (title)       setMetaTag("og:title",       title,       "property")
  if (description) setMetaTag("og:description", description, "property")
  if (url)         setMetaTag("og:url",          url,         "property")
  if (image)       setMetaTag("og:image",        image,       "property")
  if (type)        setMetaTag("og:type",         type,        "property")
  if (siteName)    setMetaTag("og:site_name",    siteName,    "property")
}

export function setTwitterMeta({ title, description, image, card = "summary_large_image" }) {
  if (card)        setMetaTag("twitter:card",        card)
  if (title)       setMetaTag("twitter:title",       title)
  if (description) setMetaTag("twitter:description", description)
  if (image)       setMetaTag("twitter:image",       image)
}

// ─── Article/BlogPosting date meta ────────────────────────────────────────────

export function setArticleMeta({ published, modified }) {
  if (published) setMetaTag("article:published_time", published, "property")
  if (modified)  setMetaTag("article:modified_time",  modified,  "property")
}

// ─── Convenience: set all page SEO in one call ────────────────────────────────

/**
 * Set all common SEO metadata for a page in a single call.
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} opts.canonical       - Full canonical URL
 * @param {string} [opts.ogImage]       - OG image URL (falls back to site logo)
 * @param {string} [opts.ogType]        - OG type (default: "website")
 * @param {string} [opts.robots]        - robots directive (default: "index, follow")
 * @param {object} [opts.article]       - { published, modified } for article pages
 */
export function setPageSeo({
  title,
  description,
  canonical,
  ogImage = `${SITE_URL}/logo.png`,
  ogType = "website",
  robots = "index, follow",
  article = null,
}) {
  setTitle(title)
  if (description) setMetaTag("description", description)
  if (canonical)   setCanonical(canonical)
  setRobots(robots)

  setOgMeta({
    title,
    description,
    url: canonical,
    image: ogImage,
    type: ogType,
  })

  setTwitterMeta({
    title,
    description,
    image: ogImage,
  })

  if (article) setArticleMeta(article)
}
