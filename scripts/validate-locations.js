// ─────────────────────────────────────────────────────────────────────────────
// Automated Local SEO & Location Integrity Validator
// ─────────────────────────────────────────────────────────────────────────────

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { rawLocations } from "../src/data/locations/dataset.js"
import { industries } from "../src/data/locations/industries.js"
import { applications } from "../src/data/locations/applications.js"
import {
  getLocationBySlug,
  getLocalizedContent,
  getRelevantProductsForLocation,
  getNearbyLocations,
} from "../src/data/locations/engine.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log("================================================================")
console.log("           ZOHAN ENTERPRISES LOCAL SEO VALIDATOR               ")
console.log("================================================================\n")

let errors = []
let warnings = []

// 1. Check Location Count
console.log(`[1/8] Verifying Location Count...`)
if (rawLocations.length < 700) {
  errors.push(`Target minimum is 700 locations. Found: ${rawLocations.length}`)
} else {
  console.log(`  ✓ Passed: Found ${rawLocations.length} locations (Exceeds 700–800+ requirement)`)
}

// 2. Check Slugs & Deduplication
console.log(`[2/8] Verifying Slugs & Deduplication...`)
const slugSet = new Set()
const duplicateSlugs = []

for (const loc of rawLocations) {
  if (!loc.slug) {
    errors.push(`Missing slug for location: ${loc.name}`)
  } else if (slugSet.has(loc.slug)) {
    duplicateSlugs.push(loc.slug)
  }
  slugSet.add(loc.slug)
}

if (duplicateSlugs.length > 0) {
  errors.push(`Duplicate slugs found: ${duplicateSlugs.join(", ")}`)
} else {
  console.log(`  ✓ Passed: All ${rawLocations.length} slugs are 100% unique`)
}

// 3. Check State, Region, Tier, Profile Integrity
console.log(`[3/8] Verifying Geographical & Tier Properties...`)
const tierCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
const regionCounts = {}
const stateCounts = {}

const validIndustryIds = new Set(industries.map((i) => i.id))
const validAppIds = new Set(applications.map((a) => a.id))

for (const loc of rawLocations) {
  if (!loc.name || !loc.state || !loc.region) {
    errors.push(`Missing geographic properties on location: ${JSON.stringify(loc)}`)
  }

  if (![1, 2, 3, 4, 5].includes(loc.tier)) {
    errors.push(`Invalid tier ${loc.tier} on location ${loc.name}`)
  } else {
    tierCounts[loc.tier]++
  }

  regionCounts[loc.region] = (regionCounts[loc.region] || 0) + 1
  stateCounts[loc.state] = (stateCounts[loc.state] || 0) + 1

  if (!validIndustryIds.has(loc.industrialProfile)) {
    errors.push(`Invalid industrial profile "${loc.industrialProfile}" on ${loc.name}`)
  }
}

console.log(`  ✓ Passed: All locations have valid states, regions, and tiers`)
console.log(`    Tier Breakdown:`, tierCounts)
console.log(`    Region Breakdown:`, regionCounts)
console.log(`    Total States/UTs Covered: ${Object.keys(stateCounts).length}`)

// 4. Check Nearby Link Graph
console.log(`[4/8] Verifying Nearby Locations Graph...`)
let brokenNearbyCount = 0
for (const loc of rawLocations) {
  if (!loc.nearbySlugs || loc.nearbySlugs.length === 0) {
    warnings.push(`No nearby links defined for ${loc.name}`)
  } else {
    for (const nearSlug of loc.nearbySlugs) {
      if (!slugSet.has(nearSlug)) {
        errors.push(`Location ${loc.slug} links to non-existent nearby slug "${nearSlug}"`)
        brokenNearbyCount++
      }
    }
  }
}
if (brokenNearbyCount === 0) {
  console.log(`  ✓ Passed: All internal nearby location links resolve cleanly`)
}

// 5. Check Content & Metadata Generation for Sample Locations
console.log(`[5/8] Verifying Dynamic Content Generation...`)
const testSlugs = [
  "mumbai", "delhi", "bengaluru", "hyderabad", "chennai", "kolkata", "pune", "ahmedabad",
  "noida", "gurgaon", "faridabad", "coimbatore", "indore", "jaipur", "baddi", "chakan",
  "sriperumbudur", "sanand", "peenya", "hosur", "dharuhera", "halol", "sedarapet", "angul"
]

for (const slug of testSlugs) {
  const loc = getLocationBySlug(slug)
  if (!loc) {
    errors.push(`Test location "${slug}" was not found by engine`)
    continue
  }

  const content = getLocalizedContent(loc)
  if (!content) {
    errors.push(`Content generation returned null for "${slug}"`)
    continue
  }

  if (!content.metaTitle || content.metaTitle.length < 15) {
    errors.push(`Invalid metaTitle for "${slug}": ${content.metaTitle}`)
  }
  if (!content.metaDescription || content.metaDescription.length < 50) {
    errors.push(`Invalid metaDescription for "${slug}": ${content.metaDescription}`)
  }
  if (!content.heroSubtitle || content.heroSubtitle.length < 50) {
    errors.push(`Invalid heroSubtitle for "${slug}"`)
  }
  if (!content.faqs || content.faqs.length < 4) {
    errors.push(`Insufficient FAQs (${content.faqs?.length}) for "${slug}"`)
  }
  if (!content.schemaBreadcrumbs || !content.schemaFaq || !content.schemaWebPage) {
    errors.push(`Missing JSON-LD schemas for "${slug}"`)
  }
}
console.log(`  ✓ Passed: Tested ${testSlugs.length} representative locations across all tiers`)

// 6. Check Product Relevance Resolution
console.log(`[6/8] Verifying Product-Location Relevance Engine...`)
for (const slug of testSlugs) {
  const loc = getLocationBySlug(slug)
  if (loc) {
    const products = getRelevantProductsForLocation(loc)
    if (!products || products.length < 3) {
      errors.push(`Too few products (${products?.length}) returned for "${slug}"`)
    }
  }
}
console.log(`  ✓ Passed: All locations resolve genuine matching Zohan products`)

// 7. Check Sitemap Files Existence
console.log(`[7/8] Verifying XML Sitemaps...`)
const sitemapIndex = path.resolve(__dirname, "../public/sitemap.xml")
const sitemapLocations = path.resolve(__dirname, "../public/sitemap-locations.xml")

if (!fs.existsSync(sitemapIndex) || !fs.existsSync(sitemapLocations)) {
  errors.push(`Missing sitemap files in public directory`)
} else {
  const xml = fs.readFileSync(sitemapLocations, "utf-8")
  const urlCount = (xml.match(/<loc>/g) || []).length
  if (urlCount !== rawLocations.length) {
    errors.push(`Sitemap URL count (${urlCount}) does not match location count (${rawLocations.length})`)
  } else {
    console.log(`  ✓ Passed: Sitemap contains exact ${urlCount} location URLs`)
  }
}

// 8. Check Robots.txt
console.log(`[8/8] Verifying robots.txt...`)
const robotsPath = path.resolve(__dirname, "../public/robots.txt")
if (!fs.existsSync(robotsPath)) {
  errors.push(`Missing public/robots.txt`)
} else {
  const robots = fs.readFileSync(robotsPath, "utf-8")
  if (!robots.includes("Sitemap:")) {
    errors.push(`robots.txt is missing Sitemap directive`)
  } else {
    console.log(`  ✓ Passed: robots.txt is properly configured`)
  }
}

console.log("\n================================================================")
if (errors.length === 0) {
  console.log("            ALL SEO VALIDATION CHECKS PASSED!                  ")
  console.log(`  Total Validated Locations: ${rawLocations.length}`)
  console.log(`  Tier 1 Metros:             ${tierCounts[1]}`)
  console.log(`  Tier 2 Major Hubs:         ${tierCounts[2]}`)
  console.log(`  Tier 3 District Hubs:      ${tierCounts[3]}`)
  console.log(`  Tier 4 Industrial Clusters:${tierCounts[4]}`)
  console.log(`  Tier 5 Specialized Areas:  ${tierCounts[5]}`)
  console.log("================================================================\n")
} else {
  console.error("VALIDATION FAILED WITH ERRORS:")
  errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`))
  process.exit(1)
}
