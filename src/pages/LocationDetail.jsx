import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  getLocationBySlug,
  getLocalizedContent,
  getRelevantProductsForLocation,
  getNearbyLocations,
} from "../data/locations/engine"
import {
  setTitle,
  setMetaTag,
  setCanonical,
  setRobots,
  injectJsonLd,
  removeJsonLd,
} from "../lib/seo"

// Location Components
import LocationBreadcrumb from "../components/locations/LocationBreadcrumb"
import LocationHero from "../components/locations/LocationHero"
import LocationIntroduction from "../components/locations/LocationIntroduction"
import LocationMachinery from "../components/locations/LocationMachinery"
import LocationApplications from "../components/locations/LocationApplications"
import LocationIndustries from "../components/locations/LocationIndustries"
import LocationContext from "../components/locations/LocationContext"
import LocationWhyZohan from "../components/locations/LocationWhyZohan"
import LocationNearby from "../components/locations/LocationNearby"
import LocationFAQ from "../components/locations/LocationFAQ"
import LocationCTA from "../components/locations/LocationCTA"
import { MapPin, ArrowRight } from "lucide-react"

export default function LocationDetail() {
  const { citySlug } = useParams()
  const location = getLocationBySlug(citySlug)

  useEffect(() => {
    if (!location) {
      setTitle("Location Not Found | Zohan Enterprises")
      setRobots("noindex, follow")
      return
    }

    const content = getLocalizedContent(location)
    const canonical = content.canonicalUrl

    // Update document title & metadata
    setTitle(content.metaTitle)
    setMetaTag("description", content.metaDescription)
    setMetaTag("og:title", content.metaTitle, "property")
    setMetaTag("og:description", content.metaDescription, "property")
    setMetaTag("og:url", canonical, "property")
    setMetaTag("og:type", "website", "property")
    setMetaTag("twitter:title", content.metaTitle)
    setMetaTag("twitter:description", content.metaDescription)
    setCanonical(canonical)
    setRobots("index, follow")

    // Inject JSON-LD structured data
    injectJsonLd("schema-webpage", content.schemaWebPage)
    injectJsonLd("schema-breadcrumb", content.schemaBreadcrumbs)
    injectJsonLd("schema-faq", content.schemaFaq)

    // Cleanup on route leave / unmount
    return () => {
      removeJsonLd("schema-webpage")
      removeJsonLd("schema-breadcrumb")
      removeJsonLd("schema-faq")
    }
  }, [location, citySlug])

  if (!location) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#0D5C3A] dark:text-emerald-400 mb-4">
          <MapPin size={32} />
        </div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A] dark:text-white">
          Location Not Found
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The requested industrial location could not be located in our directory.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/industrial-machinery/locations"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0D5C3A] px-6 py-3 text-sm font-bold text-white hover:bg-[#0a472c] transition-colors"
          >
            <span>Browse All 1,110 Locations</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    )
  }

  const content = getLocalizedContent(location)
  const products = getRelevantProductsForLocation(location)
  const nearbyLocations = getNearbyLocations(location)

  return (
    <article className="min-h-screen">
      <LocationBreadcrumb location={location} />
      <LocationHero location={location} content={content} />
      <LocationIntroduction location={location} content={content} />
      <LocationMachinery location={location} products={products} />
      <LocationApplications location={location} applications={content.matchedApps} />
      <LocationIndustries location={location} primaryIndustry={content.industry} />
      <LocationContext location={location} content={content} />
      <LocationWhyZohan location={location} />
      <LocationNearby location={location} nearbyLocations={nearbyLocations} />
      <LocationFAQ location={location} faqs={content.faqs} />
      <LocationCTA location={location} />
    </article>
  )
}
