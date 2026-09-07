import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Search, MapPin, Building2, Factory, ChevronRight,
  Sparkles, Compass, CheckCircle2, ArrowUpRight, X
} from "lucide-react"
import { getAllLocations, getLocationsHierarchy } from "../data/locations/engine"
import { setTitle, setMetaTag, setCanonical, setRobots } from "../lib/seo"
import Breadcrumb from "../components/Breadcrumb"

const REGIONS = [
  "All Regions",
  "North India",
  "West India",
  "South India",
  "East India",
  "Central India",
  "Northeast India",
  "Union Territories",
]

export default function LocationDirectory() {
  const [query, setQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [selectedState, setSelectedState] = useState("all")

  const allLocations = useMemo(() => getAllLocations(), [])
  const hierarchy = useMemo(() => getLocationsHierarchy(), [])

  useEffect(() => {
    setTitle("Industrial Machinery Across India — 1,110 Locations Directory | Zohan Enterprises")
    setMetaTag(
      "description",
      "Explore Zohan Enterprises' India-wide industrial machinery supply directory. Serving 1,110 manufacturing hubs and industrial clusters across India with precision wire processing equipment."
    )
    setCanonical("https://zohanenterprises.com/industrial-machinery/locations")
    setRobots("index, follow")
  }, [])

  // Extract all unique state names for filter
  const allStates = useMemo(() => {
    const s = new Set()
    allLocations.forEach((l) => s.add(l.state))
    return Array.from(s).sort()
  }, [allLocations])

  // Filtered locations
  const filteredLocations = useMemo(() => {
    let result = allLocations
    const q = query.trim().toLowerCase()

    if (q) {
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.state.toLowerCase().includes(q) ||
          l.region.toLowerCase().includes(q) ||
          (l.keyClusters && l.keyClusters.toLowerCase().includes(q))
      )
    }

    if (selectedRegion !== "All Regions") {
      result = result.filter((l) => l.region === selectedRegion)
    }

    if (selectedState !== "all") {
      result = result.filter((l) => l.state === selectedState)
    }

    return result
  }, [allLocations, query, selectedRegion, selectedState])

  // Group filtered results by state
  const groupedByState = useMemo(() => {
    const map = new Map()
    for (const loc of filteredLocations) {
      if (!map.has(loc.state)) {
        map.set(loc.state, {
          state: loc.state,
          region: loc.region,
          cities: [],
        })
      }
      map.get(loc.state).cities.push(loc)
    }
    return Array.from(map.values()).sort((a, b) => a.state.localeCompare(b.state))
  }, [filteredLocations])

  // Featured top hubs (first 16 prominent hubs)
  const topHubs = useMemo(() => {
    return allLocations.slice(0, 16)
  }, [allLocations])

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0B1120] transition-colors duration-200">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Industrial Machinery Across India" },
        ]}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#0F172A] dark:bg-[#080D1A] py-14 sm:py-18 text-white transition-colors duration-200">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold text-emerald-400 mb-4">
            <Compass size={14} />
            India-Wide Local Industrial Directory
          </span>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
            Industrial Machinery Supply Across India
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Zohan Enterprises delivers precision terminal crimping machines, automatic wire cutting &amp; stripping equipment, and copper scrap granulators to manufacturing businesses across <strong>1,110 Indian cities and industrial estates</strong>.
          </p>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400">1,110</p>
              <p className="text-xs text-slate-300 mt-0.5">Cities &amp; Industrial Hubs</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400">35+</p>
              <p className="text-xs text-slate-300 mt-0.5">States &amp; UTs Covered</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
              <p className="text-xs text-slate-300 mt-0.5">Pre-Dispatch Video Tested</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400">Pan-India</p>
              <p className="text-xs text-slate-300 mt-0.5">Direct Freight Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        {/* Popular Top Hubs Quick Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <h2 className="font-display text-lg font-bold text-[#0F172A] dark:text-white">
                Major Industrial &amp; Manufacturing Hubs
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">Key Manufacturing Centres</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {topHubs.map((hub) => (
              <Link
                key={hub.slug}
                to={`/industrial-machinery/${hub.slug}`}
                className="group flex flex-col justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-[#10B981] hover:shadow-sm"
              >
                <span className="text-xs font-bold text-[#0F172A] dark:text-white group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400 transition-colors truncate">
                  {hub.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 truncate">{hub.state}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm mb-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city, state, or industrial area (e.g. Pune, Peenya, Manesar, Chakan)..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 py-3 pl-11 pr-10 text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* State Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="state-select" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                State:
              </label>
              <select
                id="state-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 px-3.5 py-2.5 text-xs font-medium text-[#0F172A] dark:text-white focus:border-[#10B981] focus:outline-none"
              >
                <option value="all">All States &amp; UTs</option>
                {allStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Region Tabs */}
          <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                Region:
              </span>
              {REGIONS.map((region) => {
                const isActive = selectedRegion === region
                return (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0D5C3A] text-white dark:bg-emerald-600 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {region}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Matched Count & Reset */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>
              Showing <strong>{filteredLocations.length}</strong> of {allLocations.length} locations
            </span>
            {(query || selectedRegion !== "All Regions" || selectedState !== "all") && (
              <button
                onClick={() => {
                  setQuery("")
                  setSelectedRegion("All Regions")
                  setSelectedState("all")
                }}
                className="font-bold text-[#0D5C3A] dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Grouped Location Results by State */}
        {groupedByState.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No locations match your search criteria.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try adjusting your search terms or clearing the filters above.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedByState.map((group) => (
              <div
                key={group.state}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
              >
                {/* State Header */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Building2 size={18} className="text-[#0D5C3A] dark:text-emerald-400" />
                    <h2 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                      {group.state}
                    </h2>
                    <span className="text-xs text-slate-400">({group.region})</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-[#0D5C3A] dark:text-emerald-400">
                    {group.cities.length} {group.cities.length === 1 ? "Location" : "Locations"}
                  </span>
                </div>

                {/* Cities Grid */}
                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {group.cities.map((city) => (
                    <Link
                      key={city.slug}
                      to={`/industrial-machinery/${city.slug}`}
                      className="group flex flex-col justify-between rounded-xl border border-slate-100 dark:border-slate-800/80 bg-[#F8FAFC] dark:bg-slate-900/60 p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#10B981]/50 hover:bg-white dark:hover:bg-slate-800/90"
                    >
                      <div>
                        <h3 className="text-xs font-bold text-[#0F172A] dark:text-white group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400 transition-colors truncate">
                          {city.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {city.keyClusters ? city.keyClusters.split(",")[0] : city.state}
                        </p>
                      </div>
                      <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-[#0D5C3A] dark:text-emerald-400 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                        <span>View Machinery</span>
                        <ArrowUpRight size={11} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
