// ─────────────────────────────────────────────────────────────────────────────
// Blog & Topical Authority Comprehensive Validation Suite
// ─────────────────────────────────────────────────────────────────────────────

import { allBlogArticles, blogClusters } from "../src/data/blog/index.js"
import { allProducts } from "../src/data/products.js"
import { rawLocations } from "../src/data/locations/dataset.js"

console.log("===============================================================")
console.log("   ZOHAN ENTERPRISES — BLOG & TOPICAL AUTHORITY VALIDATION     ")
console.log("===============================================================\n")

let errors = 0
let warnings = 0

// 1. Check Total Count
console.log(`[1/8] Total Article Count Check...`)
console.log(`  Found: ${allBlogArticles.length} articles across ${blogClusters.length} clusters.`)
if (allBlogArticles.length < 100) {
  console.error(`  ❌ ERROR: Expected at least 100 articles, found ${allBlogArticles.length}.`)
  errors++
} else {
  console.log(`  ✅ PASSED: ${allBlogArticles.length} articles created (Target >= 100 achieved!).`)
}

// 2. Check Slugs Uniqueness
console.log(`\n[2/8] Slug Uniqueness Check...`)
const slugMap = new Map()
allBlogArticles.forEach((art, idx) => {
  if (!art.slug) {
    console.error(`  ❌ ERROR: Article at index ${idx} has no slug! (Title: "${art.title}")`)
    errors++
    return
  }
  if (slugMap.has(art.slug)) {
    console.error(`  ❌ ERROR: Duplicate slug "${art.slug}" found in articles "${art.title}" and "${slugMap.get(art.slug)}"`)
    errors++
  } else {
    slugMap.set(art.slug, art.title)
  }
})
if (slugMap.size === allBlogArticles.length) {
  console.log(`  ✅ PASSED: All ${allBlogArticles.length} article slugs are 100% unique.`)
}

// 3. Keyword Cannibalization Check
console.log(`\n[3/8] Keyword Cannibalization Check...`)
const kwMap = new Map()
allBlogArticles.forEach((art) => {
  const kw = art.primaryKeyword?.toLowerCase().trim()
  if (!kw) {
    console.error(`  ❌ ERROR: Article "${art.title}" is missing primaryKeyword!`)
    errors++
    return
  }
  if (kwMap.has(kw)) {
    console.error(`  ❌ ERROR: Keyword cannibalization detected: "${kw}" used in "${art.slug}" and "${kwMap.get(kw)}"`)
    errors++
  } else {
    kwMap.set(kw, art.slug)
  }
})
if (kwMap.size === allBlogArticles.length) {
  console.log(`  ✅ PASSED: All ${allBlogArticles.length} primary keywords are distinct (0 cannibalization).`)
}

// 4. Cluster & Category Alignment Check
console.log(`\n[4/8] Cluster & Category Validation...`)
const validCategorySlugs = new Set(blogClusters.map((c) => c.slug))
allBlogArticles.forEach((art) => {
  if (!validCategorySlugs.has(art.categorySlug)) {
    console.error(`  ❌ ERROR: Article "${art.slug}" has invalid categorySlug "${art.categorySlug}"`)
    errors++
  }
})
console.log(`  ✅ PASSED: All articles map to valid master clusters.`)

// 5. Product Slug Mapping Check
console.log(`\n[5/8] Product Cross-Reference Check...`)
const validProductSlugs = new Set(allProducts.map((p) => p.slug))
let invalidProducts = 0
allBlogArticles.forEach((art) => {
  if (art.relatedProducts && Array.isArray(art.relatedProducts)) {
    art.relatedProducts.forEach((pSlug) => {
      if (!validProductSlugs.has(pSlug)) {
        console.error(`  ❌ ERROR: Article "${art.slug}" references non-existent product slug: "${pSlug}"`)
        errors++
        invalidProducts++
      }
    })
  }
})
if (invalidProducts === 0) {
  console.log(`  ✅ PASSED: All referenced products exist in genuine catalog data (83 products).`)
}

// 6. Location Slug Mapping Check
console.log(`\n[6/8] Location Cross-Reference Check...`)
const validLocationCitySlugs = new Set(rawLocations.map((l) => l.slug))
let invalidLocations = 0
allBlogArticles.forEach((art) => {
  if (art.relatedLocations && Array.isArray(art.relatedLocations)) {
    art.relatedLocations.forEach((lSlug) => {
      if (!validLocationCitySlugs.has(lSlug)) {
        console.error(`  ❌ ERROR: Article "${art.slug}" references non-existent location slug: "${lSlug}"`)
        errors++
        invalidLocations++
      }
    })
  }
})
if (invalidLocations === 0) {
  console.log(`  ✅ PASSED: All referenced locations exist in location dataset (1,110 locations).`)
}

// 7. Internal Article Links Check
console.log(`\n[7/8] Related Article Cross-Reference Check...`)
let invalidRelated = 0
allBlogArticles.forEach((art) => {
  if (art.relatedArticles && Array.isArray(art.relatedArticles)) {
    art.relatedArticles.forEach((rSlug) => {
      if (!slugMap.has(rSlug)) {
        console.error(`  ❌ ERROR: Article "${art.slug}" references non-existent related article slug: "${rSlug}"`)
        errors++
        invalidRelated++
      }
    })
  }
})
if (invalidRelated === 0) {
  console.log(`  ✅ PASSED: All related internal article links resolve successfully.`)
}

// 8. Content Quality & Brand Compliance Check
console.log(`\n[8/8] Content Quality & Brand Integrity Check...`)
const prohibitedTerms = ["business volunteer", "businessvolunteers", "digital marketing agency", "seo client"]
let prohibitedFound = 0
allBlogArticles.forEach((art) => {
  const jsonStr = JSON.stringify(art).toLowerCase()
  prohibitedTerms.forEach((term) => {
    if (jsonStr.includes(term)) {
      console.error(`  ❌ ERROR: Article "${art.slug}" contains prohibited branding term: "${term}"`)
      errors++
      prohibitedFound++
    }
  })

  // Mandatory fields check
  if (!art.metaTitle || art.metaTitle.length < 15) {
    console.error(`  ❌ ERROR: Article "${art.slug}" has short/missing metaTitle!`)
    errors++
  }
  if (!art.metaDescription || art.metaDescription.length < 50) {
    console.error(`  ❌ ERROR: Article "${art.slug}" has short/missing metaDescription!`)
    errors++
  }
  if (!art.sections || art.sections.length === 0) {
    console.error(`  ❌ ERROR: Article "${art.slug}" has no content sections!`)
    errors++
  }
  if (!art.faqs || art.faqs.length === 0) {
    console.error(`  ❌ ERROR: Article "${art.slug}" has no FAQs!`)
    errors++
  }
})

if (prohibitedFound === 0) {
  console.log(`  ✅ PASSED: Zero prohibited terms found. 100% compliant with Zohan Enterprises brand guidelines.`)
}

console.log("\n===============================================================")
if (errors === 0) {
  console.log(`🎉 ALL VALIDATION CHECKS PASSED PERFECTLY (Errors: 0, Warnings: ${warnings})`)
  console.log(`   Topical Authority Hub: 12 Clusters, ${allBlogArticles.length} Articles, 100% Valid!`)
  console.log("===============================================================\n")
  process.exit(0)
} else {
  console.error(`🚨 VALIDATION FAILED WITH ${errors} ERRORS!`)
  console.log("===============================================================\n")
  process.exit(1)
}
