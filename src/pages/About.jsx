import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  Award, Briefcase, Building2, Calendar, ChevronRight, Factory,
  Globe, MapPin, Package, Shield, Star, Truck, Users, Wrench,
  Zap, CheckCircle, ArrowRight, Phone, Mail, ChevronLeft,
  Cpu, Cable, Scissors, Radio, Layers, Settings
} from "lucide-react"
import { company, facts } from "../data/content"
import officeImg    from "../assets/office.jpg"
import warehouseImg from "../assets/warehouse.jpg"
import signboardImg from "../assets/signboard.jpg"
import arbazImg     from "../assets/arbaz.jpeg"
import rajnishImg   from "../assets/rajnish.jpeg"
import saifImg      from "../assets/saif.png"
import SectionNav   from "../components/SectionNav"
import { setPageSeo, injectJsonLd, removeJsonLd, SITE_URL } from "../lib/seo"

/* ─── Sidebar nav sections ─── */
const SECTIONS = [
  { id: "who-we-are",          label: "Who We Are" },
  { id: "about-the-company",   label: "Our Story" },
  { id: "industries",          label: "Industries" },
  { id: "testimonials",        label: "Reviews" },
  { id: "infrastructure",      label: "Team & Facilities" },
]

/* ─── Factsheet data ─── */
const factsheet = [
  { icon: Briefcase,  label: "Nature of Business",        value: "Wholesale Trader & Importer" },
  { icon: Users,      label: "Total Employees",            value: "11 to 25 People" },
  { icon: Calendar,   label: "GST Registration Date",      value: "24-09-2020" },
  { icon: Shield,     label: "Legal Status of Firm",       value: "Proprietorship" },
  { icon: Award,      label: "Annual Turnover",            value: "₹ 1.5 Cr – 5 Cr" },
  { icon: Globe,      label: "Import Export Code (IEC)",   value: "AFKPA1191F" },
  { icon: CheckCircle,label: "GST No.",                    value: "09AFKPA1191F1ZP" },
  { icon: Users,      label: "GST Partner Name",           value: "Mohd Saif Md Shabbir Ansari" },
  { icon: Calendar,   label: "Year of Establishment",      value: "2020" },
  { icon: MapPin,     label: "Major Market",               value: "Pan India" },
  { icon: Package,    label: "Payment Mode",               value: "Online / Bank Transfer / Cash" },
  { icon: Truck,      label: "Shipment Mode",              value: "By Road / Courier" },
]

/* ─── Industries ─── */
const industries = [
  { icon: Cable,    title: "Wire Harness Manufacturing",    desc: "Automating cutting, stripping, crimping and twisting for harness assembly lines across the automotive and electronics sectors." },
  { icon: Factory,  title: "Automotive Industry",           desc: "Supplying precision wire processing machinery for vehicle wiring systems, sensor connectors and harness production." },
  { icon: Cpu,      title: "Electronics & PCB Assembly",    desc: "Catering to wire-lead preparation, soldering and terminal insertion for electronic appliance manufacturers." },
  { icon: Scissors, title: "Cable Processing",              desc: "High-speed cutting and stripping solutions for power cables, communication cables and multi-core cable lines." },
  { icon: Layers,   title: "Textile & Industrial Machinery",desc: "Wire management and crimping solutions for textile machines that use electrical control panels and motor wiring." },
  { icon: Wrench,   title: "Appliance Manufacturing",       desc: "End-to-end wire preparation for household and commercial appliances including motors, geysers and HVAC units." },
  { icon: Radio,    title: "Telecom & Power Equipment",     desc: "Coaxial stripping, ribbon cable cutting and ferruling solutions for telecom OEMs and panel builders." },
  { icon: Settings, title: "Automation & Robotics",         desc: "Servo-driven and PLC-controlled machinery for fully automated production cells and Industry 4.0 lines." },
  { icon: Building2,title: "Electrical Panel Builders",     desc: "Ferrule crimping, thimble insertion and bolt-tightening tools for switchgear and control panel manufacturers." },
  { icon: Zap,      title: "Power & Energy Sector",         desc: "Granulating, copper recovery and scrap wire stripping solutions for cable recycling and energy units." },
  { icon: Package,  title: "Packaging Equipment",           desc: "Cable tie winding and tape dispensing machinery for finished goods packaging and bundling lines." },
  { icon: Globe,    title: "Export-Oriented Units",         desc: "IEC-registered importer supplying international-grade machinery to export manufacturers pan-India." },
]

/* ─── Testimonials ─── */
const testimonials = [
  { name: "Sibbu",          location: "Noida, Uttar Pradesh",         rating: 5, product: "Stripping Machine",                       text: "Very responsive and professional service. Machine quality is good and delivery was on time." },
  { name: "Himanshu",       location: "Bulandshahr, Uttar Pradesh",   rating: 5, product: "Terminal Crimping Machine",               text: "Excellent product. The crimping quality is very consistent. Highly recommend Zohan Enterprises." },
  { name: "Amrit Lal",      location: "Ahmedabad, Gujarat",           rating: 4, product: "Copper Wire Stripping Machine",            text: "Good machine for the price. After-sales support was helpful during installation." },
  { name: "Adilsays",       location: "Aurangabad, Maharashtra",      rating: 5, product: "Automatic Wire Stripping Machine",         text: "Quality and delivery both were excellent. I rate 5 stars." },
  { name: "Pareshbhai",     location: "Greater Noida, Uttar Pradesh", rating: 5, product: "Wire Cutting and Stripping Machine",      text: "Machine is working as described. Overall good experience with the team." },
  { name: "Rahul Sharma",   location: "New Delhi",                    rating: 5, product: "Wire Cutting And Stripping Machine",       text: "Very good product. The machine works flawlessly. Great team at Zohan Enterprises." },
  { name: "Md Sadique",     location: "Kolkata, West Bengal",         rating: 4, product: "Wire Stripping Machine",                   text: "Wire Tasting Machine performance is good. Satisfied with the purchase." },
  { name: "Manisha Minku",  location: "Kanpur, Uttar Pradesh",        rating: 5, product: "Automatic Wire Cutting and Stripping Machine", text: "Fantastic product and fast delivery. The machine runs very smoothly." },
  { name: "Vandy Tugender", location: "Hyderabad, Telangana",         rating: 5, product: "Wire Winding Machine",                    text: "Good quality product. Service team is responsive and helpful." },
  { name: "Gk Nechiarajan", location: "Chennai, Tamil Nadu",          rating: 5, product: "Wire Cutting And Stripping Machine",       text: "Prompt delivery and good packaging. Machine performance is satisfactory." },
]

const totalReviews = testimonials.length
const overallRating = Number(
  (testimonials.reduce((sum, t) => sum + t.rating, 0) / (testimonials.length || 1)).toFixed(1)
)
const satisfactionMetrics = [
  { label: "Response", value: 100 },
  { label: "Quality",  value: 98 },
  { label: "Delivery", value: 100 },
]
const starDistribution = [
  { stars: 5, count: testimonials.filter((t) => t.rating === 5).length },
  { stars: 4, count: testimonials.filter((t) => t.rating === 4).length },
]

/* ─── Helpers ─── */
function Stars({ rating, size = 14 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? "fill-[#10B981] text-[#10B981]" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}
        />
      ))}
    </span>
  )
}

/* ─── Section wrapper ─── */
function Section({ id, title, subtitle, children, className = "" }) {
  return (
    <section id={id} className={`scroll-mt-24 py-20 ${className}`}>
      <div className="mb-12">
        <p className="mb-2 text-[11px] font-bold tracking-[0.25em] text-[#0D5C3A] dark:text-emerald-400 uppercase">{subtitle}</p>
        <h2 className="font-display text-3xl font-bold text-[#0F172A] dark:text-white sm:text-4xl">{title}</h2>
        <div className="mt-4 h-0.5 w-14 bg-gradient-to-r from-[#0D5C3A] to-[#10B981] rounded-full" />
      </div>
      {children}
    </section>
  )
}

/* ─── Testimonial Carousel ─── */
const CARDS_PER_SLIDE_DESKTOP = 2

function TestimonialCarousel() {
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef(null)

  const totalSlides = Math.ceil(testimonials.length / CARDS_PER_SLIDE_DESKTOP)

  const go = useCallback((next) => {
    const bounded = (next + totalSlides) % totalSlides
    setDirection(next > page ? 1 : -1)
    setPage(bounded)
  }, [page, totalSlides])

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => go(page + 1), 5000)
    return () => clearInterval(timerRef.current)
  }, [go, page])

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  }

  const slideCards = testimonials.slice(
    page * CARDS_PER_SLIDE_DESKTOP,
    page * CARDS_PER_SLIDE_DESKTOP + CARDS_PER_SLIDE_DESKTOP
  )

  return (
    <div className="relative">
      {/* Slide viewport */}
      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {slideCards.map(({ name, location, rating, product, text }) => (
              <div
                key={name + location}
                className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-card hover:border-[#10B981]/50 hover:shadow-card-hover transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0D5C3A] to-[#0F172A] text-sm font-bold text-white">
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A] dark:text-white">{name}</p>
                      <p className="text-[11px] text-slate-400">{location}</p>
                    </div>
                  </div>
                  <Stars rating={rating} size={12} />
                </div>
                {/* Review text */}
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[#475569] dark:text-slate-300 italic">"{text}"</p>
                {/* Product tag */}
                <p className="mt-4 inline-flex items-center gap-1 self-start rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 px-3 py-1 text-[10px] font-bold text-[#0D5C3A] dark:text-emerald-300">
                  {product}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls row */}
      <div className="mt-6 flex items-center justify-between">
        {/* Prev */}
        <button
          onClick={() => go(page - 1)}
          aria-label="Previous reviews"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-sm hover:border-[#10B981] hover:bg-[#ECFDF5] dark:hover:bg-emerald-950/40 transition-colors"
        >
          <ChevronLeft size={17} />
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > page ? 1 : -1); setPage(i) }}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-200"
            >
              <span
                className={`block rounded-full transition-all duration-200 ${
                  i === page
                    ? "w-6 h-2 bg-[#10B981]"
                    : "w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => go(page + 1)}
          aria-label="Next reviews"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-sm hover:border-[#10B981] hover:bg-[#ECFDF5] dark:hover:bg-emerald-950/40 transition-colors"
        >
          <ArrowRight size={17} />
        </button>
      </div>

      {/* Slide counter */}
      <p className="mt-3 text-center text-[11px] font-semibold text-slate-400">
        {page + 1} / {totalSlides} · {testimonials.length} verified reviews
      </p>
    </div>
  )
}

/* ════════════════════════════════════════════ */
export default function About() {
  useEffect(() => {
    const title = 'About Zohan Enterprises — Industrial Machinery Trader Since 2020 | Noida';
    const description = 'Learn about Zohan Enterprises, a GST-verified wholesale trader of terminal crimping machines, wire cutting & stripping machines, and scrap wire recycling equipment. Founded 2020, based in Noida, serving pan-India.';
    const canonicalUrl = `${SITE_URL}/about`;

    setPageSeo({ title, description, canonical: canonicalUrl });

    injectJsonLd('about-schema', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': `${canonicalUrl}#page`,
          url: canonicalUrl,
          name: title,
          description,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#organization` },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'About Us', item: canonicalUrl },
            ],
          },
        },
        {
          '@type': 'LocalBusiness',
          '@id': `${SITE_URL}/#localbusiness`,
          name: company.name,
          url: SITE_URL,
          telephone: company.phone,
          email: company.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'A-279, Sector 69, Transport Nagar',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201301',
            addressCountry: 'IN',
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '09:30',
              closes: '18:30',
            },
          ],
          priceRange: '₹₹',
          currenciesAccepted: 'INR',
          paymentAccepted: 'Cash, Online Transfer',
          sameAs: [
            'https://www.instagram.com/zohanenterprisesofficial_/',
            'https://www.facebook.com/profile.php?id=61591145981253',
            'https://x.com/zohanofficial_',
          ],
        },
      ],
    });

    return () => {
      removeJsonLd('about-schema');
    };
  }, []);

  return (
    <div className="bg-white dark:bg-[#0B1120] overflow-x-hidden transition-colors duration-200">

      {/* Floating section navigator */}
      <SectionNav sections={SECTIONS} />

      {/* ── Page hero ── */}
      <div className="relative border-b border-slate-800 overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#0D2B1F] to-[#0B1120] py-20 sm:py-28">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.14) 0%, transparent 65%)" }}
        />
        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        {/* Decorative emerald circle */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} className="text-emerald-500" />
            <span className="text-emerald-400">Who We Are</span>
          </div>

          <div className="mt-6 max-w-2xl">
            <h1 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
              About Zohan<br />Enterprises
            </h1>
            <p className="mt-4 text-base text-[#94A3B8] leading-relaxed max-w-xl">
              Wholesale trader and importer of precision wire processing machinery — serving manufacturers across India since 2020.
            </p>

            {/* Stat pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-4 py-1.5 text-xs text-emerald-300 font-semibold">Est. 2020</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 border border-white/15 px-4 py-1.5 text-xs text-slate-300 font-semibold">100+ Products</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 border border-white/15 px-4 py-1.5 text-xs text-slate-300 font-semibold">28+ States</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 border border-white/15 px-4 py-1.5 text-xs text-slate-300 font-semibold">2,400+ Clients</span>
            </div>

            {/* Hero CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="btn-lift inline-flex items-center gap-2 rounded-lg bg-[#0D5C3A] px-6 py-3 text-sm font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <Mail size={15} /> Send Enquiry
              </Link>
              <Link
                to="/products"
                className="btn-lift inline-flex items-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm font-bold text-white hover:border-white/50 hover:bg-white/10 transition-colors"
              >
                View Products <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-5 lg:px-10">

        {/* ══ 1. WHO WE ARE ══ */}
        <Section id="who-we-are" title="Who We Are" subtitle="Company Profile">
          <div className="grid gap-14 lg:grid-cols-2">
            {/* Left — company narrative */}
            <div>
              <p className="text-base leading-relaxed text-[#475569] dark:text-slate-300">
                Established in <strong className="text-[#0F172A] dark:text-white">2020</strong> in <strong className="text-[#0F172A] dark:text-white">Noida, Delhi NCR, India</strong>,
                Zohan Enterprises is a registered <strong className="text-[#0F172A] dark:text-white">Wholesale Trader and Importer</strong> of
                a wide range of industrial wire processing machinery.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#475569] dark:text-slate-300">
                Our curated product range includes <span className="font-semibold text-[#0F172A] dark:text-white">Wire Cutting Stripping Machines,
                Scrap Wire Stripping Machines, Terminal Crimping Machines, Automatic &amp; Semi Automatic Soldering Machines,
                Tape Dispensers, Automatic Terminal Crimping Machines</span> and Wire Outer and Inner Stripping Machine Upto 10 Cores —
                sourced from verified manufacturers and tested before dispatch.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#475569] dark:text-slate-300">
                We serve wire harness manufacturers, automotive assembly lines, electronics OEMs and
                industrial machinery builders across <strong className="text-[#0F172A] dark:text-white">28+ states</strong> with reliable logistics,
                competitive pricing and dedicated after-sales support.
              </p>

              {/* Credential tags */}
              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  "GST Registered", "IEC Certified", "Pan India Delivery",
                  "Technical Support", "Quality Tested"
                ].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3.5 py-1.5 text-xs font-semibold text-[#0D5C3A] dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <CheckCircle size={11} /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — factsheet as clean table-style list */}
            <div>
              <p className="mb-4 text-[11px] font-bold tracking-widest text-slate-400 uppercase">Business Factsheet</p>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {factsheet.map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 px-4 py-3 text-sm ${
                      i % 2 === 0
                        ? "bg-white dark:bg-slate-900/90"
                        : "bg-[#F8FAFC] dark:bg-slate-900/50"
                    } ${i < factsheet.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#ECFDF5] dark:bg-emerald-950/50">
                      <Icon size={13} className="text-[#0D5C3A] dark:text-emerald-400" />
                    </div>
                    <span className="w-40 shrink-0 text-xs font-semibold text-[#64748B] dark:text-slate-400">{label}</span>
                    <span className="font-semibold text-[#0F172A] dark:text-white text-xs">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        {/* ══ 2. ABOUT THE COMPANY ══ */}
        <Section id="about-the-company" title="About The Company" subtitle="Our Story">
          {/* Bento stat tiles */}
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Founded",       value: "2020",   gradient: "from-[#0D5C3A] to-[#0F172A]", textColor: "text-white" },
              { label: "Products",      value: "100+",   gradient: "from-[#0F172A] to-[#1E293B]",  textColor: "text-emerald-400" },
              { label: "States Served", value: "28+",    gradient: "from-[#0F172A] to-[#1E293B]",  textColor: "text-emerald-400" },
              { label: "Happy Clients", value: "2,400+", gradient: "from-[#0D5C3A] to-[#0F172A]", textColor: "text-white" },
            ].map(({ label, value, gradient, textColor }) => (
              <div
                key={label}
                className={`card-lift relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-center shadow-lg`}
              >
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/5" />
                <p className={`font-display text-3xl font-bold ${textColor}`}>{value}</p>
                <p className="mt-1.5 text-[11px] font-semibold text-white/60 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Story text */}
            <div className="space-y-5 text-base leading-relaxed text-[#475569] dark:text-slate-300">
              <p>
                Zohan Enterprises was founded with a singular vision: to make <strong className="text-[#0F172A] dark:text-white">advanced
                wire processing automation</strong> accessible to Indian manufacturers at transparent, competitive prices.
                From our base in Noida we have built a growing network of satisfied clients spanning automotive tier-1
                suppliers, electronics OEMs, wire harness producers and cable recycling units.
              </p>
              <p>
                The <strong className="text-[#0F172A] dark:text-white">Automatic Wire Cutting and Stripping Machine</strong> segment is
                a precision-driven domain. Machinery in this space must deliver consistent cut lengths, clean strip
                windows and repeatable crimp force — every batch, every shift. Our sourcing model focuses exclusively
                on machines that meet these standards, backed by manufacturer warranties and our own pre-dispatch inspection.
              </p>
              <p>
                We stock and supply solutions across the full wire-prep workflow: cutting, stripping, twisting,
                soldering, crimping, granulating and testing. This breadth allows clients to consolidate their
                machinery procurement through a single trusted partner — simplifying vendor management and reducing
                lead times.
              </p>
              <p>
                Our future roadmap includes deeper investment in <strong className="text-[#0F172A] dark:text-white">robot welding, cable
                tying automation</strong> and lot-integrated machine health monitoring — keeping our catalogue aligned
                with Industry 4.0 requirements.
              </p>
            </div>

            {/* Quality pillars */}
            <div className="space-y-3">
              <p className="mb-5 text-[11px] font-bold tracking-widest text-slate-400 uppercase">Quality Pillars</p>
              {[
                { icon: Shield,   title: "Quality Assurance",           text: "Every machine undergoes pre-dispatch inspection for precision, durability and output consistency." },
                { icon: Truck,    title: "Pan-India Logistics",         text: "Robust logistics partnerships ensure safe, timely delivery across all 28 Indian states." },
                { icon: Wrench,   title: "After-Sales Support",         text: "Installation guidance, operator training and ongoing technical assistance post-purchase." },
                { icon: Award,    title: "Verified Manufacturer Network",text: "We partner only with manufacturers who meet our quality benchmarks — no unverified imports." },
                { icon: Globe,    title: "IEC-Certified Importer",      text: "Registered importer under DGFT — full compliance, authentic documentation and GST invoicing." },
                { icon: Zap,      title: "Automation-Ready Catalogue",  text: "From semi-auto to fully servo-driven CNC machines — every stage of production automation." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="card-lift group flex items-start gap-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/90 px-4 py-3.5 shadow-sm hover:border-[#10B981]/50 hover:shadow-card-hover transition-all duration-200">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] dark:bg-slate-800 group-hover:bg-[#0D5C3A] transition-colors duration-200">
                    <Icon size={15} className="text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A] dark:text-white">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#475569] dark:text-slate-300">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        {/* ══ 3. INDUSTRIES ══ */}
        <Section id="industries" title="Industries Catered To" subtitle="Market Coverage">
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-[#475569] dark:text-slate-300">
            Our machinery solutions serve a broad spectrum of manufacturing and processing industries across India.
            Whether you run a small wire harness shop or a large-scale automotive assembly plant, we have precision
            machines for your production line.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {industries.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (i % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="card-lift group flex items-start gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-card hover:border-[#10B981] hover:shadow-card-hover transition-all duration-200"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-slate-800 dark:to-slate-900 transition-all duration-200 group-hover:from-[#0D5C3A] group-hover:to-[#065f46]">
                  <Icon size={19} className="text-[#10B981]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white transition-colors group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-300">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        {/* ══ 4. TESTIMONIALS ══ */}
        <Section id="testimonials" title="Ratings &amp; Reviews" subtitle="What Customers Say">
          {/* Rating summary — redesigned */}
          <div className="mb-12 grid gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-[#F8FAFC] to-white dark:from-slate-900/90 dark:to-slate-900/60 p-6 shadow-card sm:grid-cols-[auto_1fr]">
            {/* Big rating display */}
            <div className="flex flex-col items-center justify-center gap-2 sm:pr-8 sm:border-r sm:border-slate-200 dark:sm:border-slate-800">
              <p className="font-display text-6xl font-bold text-[#0F172A] dark:text-white leading-none">{overallRating}</p>
              <Stars rating={overallRating} size={18} />
              <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400">{totalReviews} verified reviews</p>
            </div>

            <div className="space-y-5">
              {/* Star distribution bars */}
              <div className="space-y-2">
                {starDistribution.map(({ stars, count }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="w-6 text-right text-xs font-bold text-[#475569] dark:text-slate-400">{stars}</span>
                    <Star size={10} className="fill-[#10B981] text-[#10B981] shrink-0" />
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#0D5C3A] to-[#10B981]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(count / totalReviews) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (5 - stars) * 0.08 }}
                      />
                    </div>
                    <span className="w-7 text-xs text-[#64748B] dark:text-slate-400">{count}</span>
                  </div>
                ))}
              </div>

              {/* Satisfaction metrics */}
              <div className="flex flex-wrap gap-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                {satisfactionMetrics.map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="font-display text-xl font-bold text-[#0D5C3A] dark:text-emerald-400">{value}%</p>
                    <p className="text-[10px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial Carousel */}
          <TestimonialCarousel />
        </Section>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        {/* ══ 5. INFRASTRUCTURE & TEAM ══ */}
        <Section id="infrastructure" title="Infrastructure &amp; Team" subtitle="Our Facilities">
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-[#475569] dark:text-slate-300">
            Operating from our Noida facility, Zohan Enterprises maintains a well-organised warehouse,
            a professional office setup and a trained technical team to support clients nationally.
          </p>

          {/* Timeline strip */}
          <div className="mb-12 flex flex-wrap items-center gap-0 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/50 p-5">
            {[
              { year: "2020", label: "Est. in Noida" },
              { year: "2021", label: "First 500 units sold" },
              { year: "2022", label: "Bangalore Office" },
              { year: "2023", label: "Pune Office" },
              { year: "2024", label: "100+ Products" },
              { year: "2025+", label: "Industry 4.0 Range" },
            ].map(({ year, label }, i, arr) => (
              <div key={year} className="flex items-center">
                <div className="flex flex-col items-center gap-1 px-4">
                  <span className="text-xs font-bold text-[#0D5C3A] dark:text-emerald-400">{year}</span>
                  <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                  <span className="text-[10px] font-semibold text-[#64748B] dark:text-slate-400 whitespace-nowrap">{label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-px w-8 bg-gradient-to-r from-[#10B981] to-slate-300 dark:to-slate-700 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Team cards — 3-column grid */}
          <div className="mb-6">
            <div className="mb-6 flex items-center gap-3">
              <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Our Team</p>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {/* CEO */}
              <div className="card-lift group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-7 text-center shadow-card hover:border-[#10B981] hover:shadow-card-hover transition-all duration-200">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0D5C3A] to-[#10B981] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-[#ECFDF5] dark:border-emerald-950/50 shadow-lg">
                  <img src={saifImg} alt="Mohd Saif Shabbir Ansari" className="h-full w-full object-cover object-top" />
                </div>
                <p className="text-base font-bold text-[#0F172A] dark:text-white">Mohd Saif Shabbir Ansari</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 px-3 py-0.5 text-[11px] font-bold text-[#0D5C3A] dark:text-emerald-300">
                  CEO &amp; Founder
                </span>
                <p className="mt-2.5 flex items-center justify-center gap-1 text-[11px] text-[#64748B] dark:text-slate-400">
                  <MapPin size={11} className="text-slate-400" /> Noida, UP
                </p>
              </div>

              {/* Arbaz */}
              <div className="card-lift group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-7 text-center shadow-card hover:border-[#10B981] hover:shadow-card-hover transition-all duration-200">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0D5C3A] to-[#10B981] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-[#ECFDF5] dark:border-emerald-950/50 shadow-lg">
                  <img src={arbazImg} alt="Arbaz" className="h-full w-full object-cover object-top" />
                </div>
                <p className="text-base font-bold text-[#0F172A] dark:text-white">Arbaz</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 px-3 py-0.5 text-[11px] font-bold text-[#0D5C3A] dark:text-emerald-300">
                  Sales Representative
                </span>
                <p className="mt-2.5 flex items-center justify-center gap-1 text-[11px] text-[#64748B] dark:text-slate-400">
                  <MapPin size={11} className="text-slate-400" /> Bangalore, KA
                </p>
              </div>

              {/* Rajnish */}
              <div className="card-lift group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-7 text-center shadow-card hover:border-[#10B981] hover:shadow-card-hover transition-all duration-200">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0D5C3A] to-[#10B981] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-[#ECFDF5] dark:border-emerald-950/50 shadow-lg">
                  <img src={rajnishImg} alt="Rajnish Kumar" className="h-full w-full object-cover object-top" />
                </div>
                <p className="text-base font-bold text-[#0F172A] dark:text-white">Rajnish Kumar</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 px-3 py-0.5 text-[11px] font-bold text-[#0D5C3A] dark:text-emerald-300">
                  Sales Representative
                </span>
                <p className="mt-2.5 flex items-center justify-center gap-1 text-[11px] text-[#64748B] dark:text-slate-400">
                  <MapPin size={11} className="text-slate-400" /> Pune, MH
                </p>
              </div>
            </div>

            {/* Join Our Team — full-width CTA strip */}
            <div className="mt-5 flex flex-col items-start justify-between gap-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900/40 p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <Users size={20} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white">Join Our Team</p>
                  <p className="mt-0.5 text-xs text-[#64748B] dark:text-slate-400">We're a growing team. Reach out if you're passionate about industrial machinery.</p>
                </div>
              </div>
              <a
                href={`mailto:${company.email}`}
                className="btn-lift shrink-0 inline-flex items-center gap-2 rounded-lg bg-[#0D5C3A] px-5 py-2.5 text-xs font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <Mail size={13} /> {company.email}
              </a>
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Our Warehouse */}
            <div className="card-lift group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card hover:border-[#10B981] hover:shadow-card-hover transition-all duration-200">
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={warehouseImg} alt="Zohan Enterprises Warehouse" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />
                <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-[#0D5C3A] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  <Package size={11} /> Our Warehouse
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900/90 p-5">
                <p className="text-sm font-bold text-[#0F172A] dark:text-white">Warehouse &amp; Storage</p>
                <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-300">
                  Stocked inventory of wire processing machines — organised, secured and ready for fast dispatch across India.
                </p>
              </div>
            </div>

            {/* Our Office */}
            <div className="card-lift group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card hover:border-[#10B981] hover:shadow-card-hover transition-all duration-200">
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={officeImg} alt="Zohan Enterprises Office" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />
                <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-[#0D5C3A] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  <Building2 size={11} /> Our Office
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900/90 p-5">
                <p className="text-sm font-bold text-[#0F172A] dark:text-white">Office &amp; Operations</p>
                <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-300">
                  A professional workspace in Sector 69, Noida — where our team handles enquiries, order processing and after-sales support.
                </p>
              </div>
            </div>

            {/* Signboard */}
            <div className="card-lift group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card hover:border-[#10B981] hover:shadow-card-hover sm:col-span-2 lg:col-span-1 transition-all duration-200">
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={signboardImg} alt="Zohan Enterprises Signboard" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />
                <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-[#0D5C3A] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  <Shield size={11} /> Brand Identity
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900/90 p-5">
                <p className="text-sm font-bold text-[#0F172A] dark:text-white">Zohan Enterprises — Noida</p>
                <p className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-slate-300">
                  GST-registered, IEC-certified trader — serving wire processing machinery buyers with verified credentials since 2020.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        {/* ══ Bottom CTA ══ */}
        <section className="py-16">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0F172A] via-[#0D2B1F] to-[#0B1120] p-10 sm:p-14 text-center shadow-xl">
            <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 60%)" }} />
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#10B981] uppercase mb-4">Ready to Automate?</p>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Looking for reliable wire processing machinery?
            </h2>
            <p className="mt-3 text-sm text-[#CBD5E1] max-w-md mx-auto">
              Talk to our team today — we'll recommend the right machine for your production requirements and budget.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="btn-lift flex items-center gap-2 rounded-xl bg-[#0D5C3A] px-7 py-3.5 text-sm font-bold text-white uppercase shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <Mail size={15} /> Contact Us
              </Link>
              <Link
                to="/products"
                className="btn-lift flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-sm font-bold text-white uppercase shadow-sm transition-colors hover:border-white hover:bg-white/10"
              >
                Explore Products <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
