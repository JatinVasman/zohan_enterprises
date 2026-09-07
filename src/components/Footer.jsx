import { useState } from "react"
import { Clock, Mail, MapPin, Phone, ChevronDown, Compass, ArrowRight, BookOpen } from "lucide-react"
import { Link } from "react-router-dom"
import { company, footerLinks, navItems } from "../data/content"
import { offices } from "../data/offices"
import { socialLinks } from "../data/socials"
import { socialIconMap } from "./SocialIcons"
import { blogClusters } from "../data/blog/clusters"
import logo from "../assets/logo.png"

const regionalFooterLinks = {
  "Popular Hubs": [
    { name: "Mumbai", slug: "mumbai" },
    { name: "Delhi", slug: "delhi" },
    { name: "Bengaluru", slug: "bengaluru" },
    { name: "Pune", slug: "pune" },
    { name: "Ahmedabad", slug: "ahmedabad" },
    { name: "Chennai", slug: "chennai" },
    { name: "Hyderabad", slug: "hyderabad" },
    { name: "Noida", slug: "noida" },
    { name: "Faridabad", slug: "faridabad" },
    { name: "Coimbatore", slug: "coimbatore" },
    { name: "Surat", slug: "surat" },
    { name: "Indore", slug: "indore" },
  ],
  "North India": [
    { name: "Noida", slug: "noida" },
    { name: "Gurgaon", slug: "gurgaon" },
    { name: "Faridabad", slug: "faridabad" },
    { name: "Ghaziabad", slug: "ghaziabad" },
    { name: "Ludhiana", slug: "ludhiana" },
    { name: "Amritsar", slug: "amritsar" },
    { name: "Jalandhar", slug: "jalandhar" },
    { name: "Baddi", slug: "baddi" },
    { name: "Haridwar", slug: "haridwar" },
    { name: "Dehradun", slug: "dehradun" },
    { name: "Rudrapur", slug: "rudrapur" },
    { name: "Panipat", slug: "panipat" },
    { name: "Kanpur", slug: "kanpur" },
    { name: "Lucknow", slug: "lucknow" },
    { name: "Meerut", slug: "meerut" },
  ],
  "West India": [
    { name: "Mumbai", slug: "mumbai" },
    { name: "Pune", slug: "pune" },
    { name: "Chakan", slug: "chakan" },
    { name: "Thane", slug: "thane" },
    { name: "Nashik", slug: "nashik" },
    { name: "Aurangabad", slug: "aurangabad" },
    { name: "Kolhapur", slug: "kolhapur" },
    { name: "Ahmedabad", slug: "ahmedabad" },
    { name: "Sanand", slug: "sanand" },
    { name: "Surat", slug: "surat" },
    { name: "Vadodara", slug: "vadodara" },
    { name: "Rajkot", slug: "rajkot" },
    { name: "Vapi", slug: "vapi" },
    { name: "Ankleshwar", slug: "ankleshwar" },
    { name: "Jaipur", slug: "jaipur" },
    { name: "Bhiwadi", slug: "bhiwadi" },
  ],
  "South India": [
    { name: "Bengaluru", slug: "bengaluru" },
    { name: "Peenya", slug: "peenya" },
    { name: "Hosur", slug: "hosur" },
    { name: "Chennai", slug: "chennai" },
    { name: "Sriperumbudur", slug: "sriperumbudur" },
    { name: "Coimbatore", slug: "coimbatore" },
    { name: "Salem", slug: "salem" },
    { name: "Tirupur", slug: "tirupur" },
    { name: "Hyderabad", slug: "hyderabad" },
    { name: "Patancheru", slug: "patancheru" },
    { name: "Visakhapatnam", slug: "visakhapatnam" },
    { name: "Vijayawada", slug: "vijayawada" },
    { name: "Kochi", slug: "kochi" },
    { name: "Palakkad", slug: "palakkad" },
    { name: "Belagavi", slug: "belagavi" },
  ],
  "East India": [
    { name: "Kolkata", slug: "kolkata" },
    { name: "Howrah", slug: "howrah" },
    { name: "Durgapur", slug: "durgapur" },
    { name: "Asansol", slug: "asansol" },
    { name: "Bhubaneswar", slug: "bhubaneswar" },
    { name: "Cuttack", slug: "cuttack" },
    { name: "Rourkela", slug: "rourkela" },
    { name: "Jamshedpur", slug: "jamshedpur" },
    { name: "Ranchi", slug: "ranchi" },
    { name: "Dhanbad", slug: "dhanbad" },
    { name: "Patna", slug: "patna" },
    { name: "Muzaffarpur", slug: "muzaffarpur" },
  ],
  "Central & Northeast": [
    { name: "Indore", slug: "indore" },
    { name: "Pithampur", slug: "pithampur" },
    { name: "Bhopal", slug: "bhopal" },
    { name: "Mandideep", slug: "mandideep" },
    { name: "Gwalior", slug: "gwalior" },
    { name: "Raipur", slug: "raipur" },
    { name: "Bhilai", slug: "bhilai" },
    { name: "Guwahati", slug: "guwahati" },
    { name: "Silchar", slug: "silchar" },
    { name: "Shillong", slug: "shillong" },
    { name: "Agartala", slug: "agartala" },
    { name: "Silvassa", slug: "silvassa" },
    { name: "Puducherry", slug: "puducherry" },
  ],
}

const navHashFor = (item) => {
  if (item === "Contact Us") return null
  return `/#${item.toLowerCase().replace(/\s+/g, "-")}`
}

export default function Footer() {
  const [activeRegionTab, setActiveRegionTab] = useState("Popular Hubs")
  const [locationsExpanded, setLocationsExpanded] = useState(true)

  return (
    <footer className="bg-[#0F172A] dark:bg-[#080D1A] dark:border-t dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-12 lg:px-10">
        {/* Main Footer Columns */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.8fr_0.8fr_0.9fr_1fr]">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-3.5">
              <img src={logo} alt={`${company.name} logo`} className="h-12 w-12 object-contain rounded-lg" />
              <p className="font-display text-xl font-bold text-white tracking-tight">{company.name}</p>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#94A3B8]">
              Trader &amp; Retailer of Terminal Crimping Machine, Wire Cutting Stripping
              Machine and Scrap Wire Stripping Machine, based in Noida, Uttar Pradesh,
              India.
            </p>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.15em] text-[#64748B]">
              Follow Us
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              {socialLinks.map(({ id, url, ariaLabel, label }) => {
                const Icon = socialIconMap[id]
                return (
                  <a
                    key={id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ariaLabel}
                    title={label}
                    className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 bg-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <p className="border-b border-[#0D5C3A] pb-3 text-xs font-bold tracking-[0.15em] text-white uppercase">Quick Links</p>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => {
                const hash = navHashFor(item)
                return (
                  <li key={item}>
                    {hash ? (
                      <a href={hash} className="inline-block text-sm text-[#94A3B8] transition-all duration-150 hover:translate-x-1 hover:text-[#10B981]">
                        {item}
                      </a>
                    ) : (
                      <Link to="/contact" className="inline-block text-sm text-[#94A3B8] transition-all duration-150 hover:translate-x-1 hover:text-[#10B981]">
                        {item}
                      </Link>
                    )}
                  </li>
                )
              })}
              <li>
                <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 dark:text-emerald-400 hover:underline">
                  <BookOpen size={13} />
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/industrial-machinery/locations" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:underline">
                  <Compass size={13} />
                  All India Locations (1,110+)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Products */}
          <div>
            <p className="border-b border-[#0D5C3A] pb-3 text-xs font-bold tracking-[0.15em] text-white uppercase">Products</p>
            <ul className="mt-5 space-y-3">
              {footerLinks.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/products/${cat.slug}`} className="inline-block text-sm text-[#94A3B8] transition-all duration-150 hover:translate-x-1 hover:text-[#10B981]">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Our Offices */}
          <div>
            <p className="border-b border-[#0D5C3A] pb-3 text-xs font-bold tracking-[0.15em] text-white uppercase">Our Offices</p>
            <ul className="mt-5 space-y-3">
              {offices.map((office) => (
                <li key={office.id}>
                  <Link
                    to={`/contact#office-${office.id}`}
                    className="inline-block text-sm text-[#94A3B8] transition-all duration-150 hover:translate-x-1 hover:text-[#10B981]"
                  >
                    {office.city} <span className="text-slate-500">- {office.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <p className="border-b border-[#0D5C3A] pb-3 text-xs font-bold tracking-[0.15em] text-white uppercase">Contact Us</p>
            <ul className="mt-5 space-y-4 text-sm text-[#94A3B8]">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#10B981]" />
                {company.location}
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-[#10B981]" />
                <a href={`tel:${company.phone}`} className="hover:text-[#10B981]">{company.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-[#10B981]" />
                <a href={`mailto:${company.email}`} className="hover:text-[#10B981]">{company.email}</a>
              </li>
              <li className="flex items-start gap-3 border-t border-white/10 pt-4">
                <Clock size={16} className="mt-0.5 shrink-0 text-[#10B981]" />
                <span>
                  Mon - Sat: 9:30 AM - 6:30 PM
                  <br />
                  Sunday: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* India-Wide Local SEO Navigation Section */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="mt-14 border-t border-white/10 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-emerald-400" />
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Zohan Enterprises &mdash; Industrial Machinery Across India
                </h3>
              </div>
              <p className="mt-1 text-xs text-[#94A3B8]">
                Supplying precision wire crimping, cutting, stripping, and copper scrap machinery to 1,100+ Indian industrial hubs.
              </p>
            </div>

            <Link
              to="/industrial-machinery/locations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline shrink-0"
            >
              <span>Explore All 1,110 Locations</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Regional Tabs */}
          <div className="mt-4 flex flex-wrap gap-2 border-b border-white/10 pb-3">
            {Object.keys(regionalFooterLinks).map((region) => {
              const isActive = activeRegionTab === region
              return (
                <button
                  key={region}
                  onClick={() => setActiveRegionTab(region)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#0D5C3A] text-white shadow-sm"
                      : "bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {region}
                </button>
              )
            })}
          </div>

          {/* Active Region City Links */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2 text-xs text-[#94A3B8]">
            {regionalFooterLinks[activeRegionTab]?.map((city) => (
              <Link
                key={city.slug}
                to={`/industrial-machinery/${city.slug}`}
                className="truncate hover:text-emerald-400 hover:underline transition-colors py-0.5"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Copyright & Verification */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-xs text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {company.name}. All Rights Reserved.</p>
          <p>GST No. {company.gstNo} &middot; IEC {company.iec}</p>
        </div>
      </div>
    </footer>
  )
}
