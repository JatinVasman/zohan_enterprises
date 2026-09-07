// ─────────────────────────────────────────────────────────────────────────────
// High-Performance Query & Contextual Content Engine for Local SEO
// Zohan Enterprises India-wide Local SEO Engine
// ─────────────────────────────────────────────────────────────────────────────

import { rawLocations } from "./dataset.js"
import { industries, getIndustryById } from "./industries.js"
import { applications, getApplicationById } from "./applications.js"
import { allProducts } from "../products.js"
import { company } from "../content.js"

// Fast O(1) lookup Map by slug
const locationMap = new Map()
rawLocations.forEach((loc) => {
  locationMap.set(loc.slug, loc)
})

export const getAllLocations = () => rawLocations

export const getLocationBySlug = (slug) => {
  if (!slug) return null
  return locationMap.get(slug.toLowerCase()) || null
}

export const getLocationsByState = (stateSlug) => {
  return rawLocations.filter((l) => l.stateSlug === stateSlug)
}

export const getLocationsByRegion = (regionSlug) => {
  return rawLocations.filter((l) => l.regionSlug === regionSlug)
}

export const getLocationsByTier = (tier) => {
  return rawLocations.filter((l) => l.tier === Number(tier))
}

export const getTopLocations = (limit = 12) => {
  return rawLocations.filter((l) => l.tier === 1 || l.tier === 2).slice(0, limit)
}

export const searchLocations = (query) => {
  const q = query.trim().toLowerCase()
  if (!q || q.length < 2) return []

  return rawLocations
    .filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q) ||
        (l.keyClusters && l.keyClusters.toLowerCase().includes(q))
    )
    .slice(0, 15)
}

// Group locations by region and state for directory & navigation
export const getLocationsHierarchy = () => {
  const regions = {}
  for (const loc of rawLocations) {
    if (!regions[loc.region]) {
      regions[loc.region] = {
        name: loc.region,
        slug: loc.regionSlug,
        states: {},
      }
    }
    if (!regions[loc.region].states[loc.state]) {
      regions[loc.region].states[loc.state] = {
        name: loc.state,
        slug: loc.stateSlug,
        cities: [],
      }
    }
    regions[loc.region].states[loc.state].cities.push(loc)
  }
  return regions
}

// Resolve nearby location records
export const getNearbyLocations = (location) => {
  if (!location || !location.nearbySlugs) return []
  return location.nearbySlugs
    .map((slug) => locationMap.get(slug))
    .filter(Boolean)
}

// Resolve matched real Zohan products for a city
export const getRelevantProductsForLocation = (location) => {
  if (!location) return allProducts.slice(0, 6)

  const industry = getIndustryById(location.industrialProfile)
  const matchedApps = (location.primaryApplications || []).map(getApplicationById).filter(Boolean)

  const relevantSlugs = new Set()
  matchedApps.forEach((app) => {
    (app.targetProducts || []).forEach((slug) => relevantSlugs.add(slug))
  })

  let matched = allProducts.filter((p) => relevantSlugs.has(p.slug))

  // Fallback to industry recommended categories if needed
  if (matched.length < 4 && industry && industry.recommendedCategories) {
    const categoryMatches = allProducts.filter((p) =>
      industry.recommendedCategories.includes(p.categorySlug)
    )
    categoryMatches.forEach((p) => {
      if (!matched.some((m) => m.id === p.id)) matched.push(p)
    })
  }

  // Ensure at least 4 to 8 products are shown
  if (matched.length < 4) {
    const bestSellers = allProducts.filter((p) => p.isBestSeller)
    bestSellers.forEach((p) => {
      if (!matched.some((m) => m.id === p.id)) matched.push(p)
    })
  }

  return matched.slice(0, 8)
}

// ─────────────────────────────────────────────────────────────────────────────
// Contextual Content & SEO Metadata Generator
// ─────────────────────────────────────────────────────────────────────────────
export const getLocalizedContent = (location) => {
  if (!location) return null

  const industry = getIndustryById(location.industrialProfile) || industries[0]
  const matchedApps = (location.primaryApplications || []).map(getApplicationById).filter(Boolean)
  const isDirectOffice = ["noida", "bengaluru", "pune"].includes(location.slug)

  // Meta Title variations based on Tier & Industry
  let metaTitle = `Industrial Machinery & Equipment in ${location.name} | Zohan Enterprises`
  if (location.tier === 1) {
    metaTitle = `Industrial Machinery & Wire Processing Equipment in ${location.name} | Zohan Enterprises`
  } else if (location.industrialProfile === "automotive-harness") {
    metaTitle = `Wire Harness & Crimping Machinery Supplier in ${location.name} | Zohan Enterprises`
  } else if (location.industrialProfile === "scrap-copper-recycling") {
    metaTitle = `Scrap Wire Stripping & Copper Granulator Machinery in ${location.name} | Zohan`
  } else if (location.tier === 2) {
    metaTitle = `Industrial Machinery Supplier in ${location.name}, ${location.state} | Zohan Enterprises`
  }

  // Meta Description (<160 chars)
  const metaDescription = `Explore high-precision industrial wire crimping, cutting, stripping & scrap recovery machinery for manufacturing units in ${location.name}, ${location.state}. Direct dispatch with 100% pre-testing.`.slice(0, 160)

  // Localized Hero Description
  const heroDescription = isDirectOffice
    ? `Zohan Enterprises operates dedicated facilities and supplies heavy-duty wire crimping, cutting, stripping, soldering, and scrap processing machinery directly to manufacturing businesses across ${location.name} and the ${location.state} industrial corridor.`
    : `Zohan Enterprises supplies heavy-duty wire crimping, automatic cutting & stripping, precision soldering, and copper scrap recovery machinery directly to manufacturing units, workshops, and contractors in ${location.name}, ${location.state}. Every machine is 100% video-tested before dispatch.`

  // Localized Introduction
  const introParagraph1 = `${location.name}, a prominent economic hub in ${location.state} (${location.region}), is home to dynamic manufacturing enterprises across key industrial clusters including ${location.keyClusters || `${location.name} Industrial Area`}. To meet high-volume production schedules and stringent quality benchmarks, local manufacturers rely on precision wire processing equipment that guarantees zero-defect wire termination and continuous operating reliability.`

  const introParagraph2 = `Zohan Enterprises supports industrial units in ${location.name} with advanced semi-automatic and fully automatic wire harness machinery, bench-top terminal crimpers, multi-core cable peelers, and copper granulators. With verified Pan-India dispatch from our central hubs, transparent direct pricing, and dedicated video inspection before every shipment, businesses in ${location.name} achieve peak assembly productivity with lower operational downtime.`

  // Local Industrial Context
  const contextHeadline = `Machinery Solutions Tailored for ${location.name}'s Industrial Ecosystem`
  const contextBody = `${location.name}'s industrial growth is fueled by expanding sectors including ${industry.name}, general MSME fabrication, and assembly workshops. Typical manufacturing operations in the region demand high-throughput terminal crimping (from 1.5 tons up to 6 tons), accurate single and multi-core wire cutting without strand loss, and high-efficiency scrap cable recovery. Zohan Enterprises provides specialized tooling, OTP feed applicators, and tungsten carbide blades engineered specifically to handle high-capacity daily production cycles across ${location.state}.`

  // 5-6 Unique Localized FAQs
  const faqs = [
    {
      question: `What types of industrial machinery does Zohan Enterprises supply in ${location.name}?`,
      answer: `In ${location.name} and across ${location.state}, Zohan Enterprises supplies terminal crimping machines (1.5T to 6T automatic & semi-automatic), programmable wire cutting and stripping machines (0.1 to 16 sqmm), scrap wire stripping & copper granulators, pneumatic short-wire strippers, multi-core cable peelers, and automatic soldering systems.`,
    },
    {
      question: `How can businesses in ${location.name} request a machinery quote and technical specifications?`,
      answer: `You can request an instant quotation by clicking 'Get Latest Price' on any product card, calling our sales desk at ${company.phone}, or reaching out via WhatsApp at +${company.whatsapp}. Our technical team provides complete specification datasheets, video demonstrations, and competitive factory-direct pricing tailored for your production requirement in ${location.name}.`,
    },
    {
      question: `How are machines dispatched and delivered to ${location.name}, ${location.state}?`,
      answer: `All machinery is securely wooden-crated and dispatched via trusted national logistics partners directly to your factory or workshop address in ${location.name}. We conduct a thorough 100% pre-dispatch inspection and share a live operational test video with you before shipment to ensure complete quality assurance.`,
    },
    {
      question: `Which wire processing machines are most suitable for wire harness units in ${location.name}?`,
      answer: `For wire harness assembly in ${location.name}, our most popular models are the ZE-6T Automatic Wire Crimping Machine for heavy terminal presses, the ZE-6mm Semi-Automatic Wire Cutting Stripping Machine for high-speed lead preparation, and the ZE-515T for simultaneous cutting, stripping, and wire core twisting.`,
    },
    {
      question: `Does Zohan Enterprises provide installation guidance and after-sales support in ${location.name}?`,
      answer: `Yes. Every machine includes a detailed operational manual and video setup guide. Our technical engineering team provides video-assisted commissioning, parameter calibration guidance, and prompt spare parts dispatch (such as replacement blades, crimping dies, and feed rollers) to ensure zero downtime for your operations in ${location.name}.`,
    },
  ]

  if (location.industrialProfile === "scrap-copper-recycling") {
    faqs.push({
      question: `Which scrap stripping machine is recommended for copper wire recycling in ${location.name}?`,
      answer: `For copper recycling yards in ${location.name}, the ZE-038 and ZE-KOF Automatic Scrap Wire Stripping Machines are highly recommended. They process wire diameters from 1mm to 120mm with dual-blade cutting channels, delivering 100% clean copper core recovery without manual peeling.`,
    })
  } else {
    faqs.push({
      question: `Are spare parts, blades, and crimp applicators readily available for clients in ${location.name}?`,
      answer: `Yes. Zohan Enterprises maintains a ready inventory of tungsten carbide cutting blades, stripping wheels, OTP side-feed and rear-feed applicators, and pneumatic cylinders for fast courier dispatch to ${location.name}, ${location.state}.`,
    })
  }

  // Structured Data (JSON-LD)
  const canonicalUrl = `https://zohanenterprises.com/industrial-machinery/${location.slug}`

  const schemaBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://zohanenterprises.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Industrial Machinery",
        item: "https://zohanenterprises.com/industrial-machinery/locations",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${location.name}, ${location.state}`,
        item: canonicalUrl,
      },
    ],
  }

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  }

  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTitle,
    description: metaDescription,
    url: canonicalUrl,
    breadcrumb: schemaBreadcrumbs,
    publisher: {
      "@type": "Organization",
      name: company.name,
      url: "https://zohanenterprises.com",
      logo: "https://zohanenterprises.com/favicon.svg",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: company.phone,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    },
  }

  return {
    metaTitle,
    metaDescription,
    canonicalUrl,
    heroTitle: `Industrial Machinery & Equipment in ${location.name}`,
    heroSubtitle: heroDescription,
    introParagraph1,
    introParagraph2,
    contextHeadline,
    contextBody,
    industry,
    matchedApps,
    faqs,
    schemaWebPage,
    schemaBreadcrumbs,
    schemaFaq,
  }
}
