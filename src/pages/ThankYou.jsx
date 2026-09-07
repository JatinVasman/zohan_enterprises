import { motion } from "framer-motion"
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Headset,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Breadcrumb from "../components/Breadcrumb"
import ContactActions from "../components/ContactActions"
import { aboutText, company, products, whyChooseUs } from "../data/content"
import { setTitle, setRobots, setCanonical, SITE_URL } from "../lib/seo"

const timeline = [
  { icon: ClipboardCheck, title: "We received your enquiry", text: "Your requirement has been logged into our sales system." },
  { icon: FileSearch, title: "Technical review", text: "A technical expert will review your requirement in detail." },
  { icon: Headset, title: "We contact you", text: "Expect a call or email within 2-4 business hours." },
  { icon: PackageCheck, title: "Product recommendation", text: "We suggest the right machine for your application." },
  { icon: Award, title: "Best quotation", text: "You receive a competitive, no-obligation quotation." },
]

const featureIcons = [ShieldCheck, Truck, Headset, Award]
const popularProducts = products.slice(0, 4)

export default function ThankYou() {
  const { state } = useLocation()
  const enquiredProduct = state?.product ?? null
  const enquiry = state?.enquiry ?? null

  useEffect(() => {
    setTitle('Thank You for Your Enquiry | Zohan Enterprises')
    setCanonical(`${SITE_URL}/thank-you`)
    // Prevent indexing — this is a post-form-submit confirmation page
    setRobots('noindex, follow')
    return () => {
      setRobots('index, follow')
    }
  }, [])

  return (
    <>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Thank You" }]} />

      {/* Success */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0B1120] py-20 transition-colors duration-200">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="flex justify-center"
          >
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40">
              <span className="absolute inset-0 rounded-full border border-[#A7F3D0] dark:border-emerald-800/60" />
              <span className="absolute inset-2 rounded-full border border-[#A7F3D0] dark:border-emerald-800/60" />
              <CheckCircle2 size={46} className="text-[#10B981]" />
            </span>
          </motion.div>

          <h1 className="font-display mt-7 text-3xl font-bold text-[#0F172A] dark:text-white lg:text-4xl">Thank You{enquiry?.name ? `, ${enquiry.name.split(" ")[0]}` : ""}!</h1>
          <p className="mt-3 text-base leading-relaxed text-[#475569] dark:text-slate-300">
            Your enquiry has been submitted successfully. Our team has been notified and
            will review your requirement shortly.
          </p>

          {/* Enquired product summary */}
          {enquiredProduct && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-7 mx-auto flex max-w-sm items-center gap-4 border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/90 p-4 text-left shadow-sm"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2">
                {enquiredProduct.image
                  ? <img src={enquiredProduct.image} alt={enquiredProduct.name} className="h-full w-full object-contain" />
                  : <span className="text-[10px] text-slate-400">No image</span>
                }
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-wide text-[#0D5C3A] dark:text-emerald-400 uppercase">{enquiredProduct.category}</p>
                <p className="mt-0.5 text-sm font-bold leading-snug text-[#0F172A] dark:text-white line-clamp-2">{enquiredProduct.name}</p>
                <p className="mt-1 text-sm font-bold text-[#0D5C3A] dark:text-emerald-400">{enquiredProduct.price}</p>
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="btn-lift flex items-center gap-2 rounded-sm bg-[#0D5C3A] px-6 py-3.5 text-sm font-semibold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              Back to Home <ArrowRight size={15} />
            </Link>
            <a
              href="/#our-products"
              className="btn-lift rounded-sm border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#0F172A] shadow-sm hover:border-slate-300 hover:bg-[#F8FAFC] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Explore Products
            </a>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#F8FAFC] dark:bg-slate-900/50 py-20 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] text-[#0D5C3A] dark:text-emerald-400 uppercase">What Happens Next</span>
            <h2 className="font-display mt-2 text-2xl font-bold text-[#0F172A] dark:text-white lg:text-3xl">Your Enquiry Journey</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="card-lift relative rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-card hover:border-[#10B981] hover:shadow-card-hover dark:hover:border-emerald-500/60"
                >
                  <span className="font-display text-xs font-bold text-slate-300 dark:text-slate-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-sm bg-[#0F172A] dark:bg-slate-800 text-white">
                    <Icon size={19} />
                  </span>
                  <h3 className="font-display mt-4 text-sm font-bold text-[#0F172A] dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">{step.text}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Urgent assistance */}
      <section className="bg-white dark:bg-[#0B1120] py-16 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-6 rounded-sm border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/90 p-7 shadow-card lg:flex-row lg:items-center">
            <div>
              <h2 className="font-display text-xl font-bold text-[#0F172A] dark:text-white">Need Immediate Assistance?</h2>
              <p className="mt-1.5 text-sm text-[#475569] dark:text-slate-300">
                Speak directly with our sales team for an immediate response.
              </p>
            </div>
            <ContactActions variant="light" />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white dark:bg-[#0B1120] pb-20 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-sm border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-xs font-bold tracking-wide text-[#0D5C3A] uppercase dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Building2 size={14} /> About Zohan Enterprises
              </span>
              <h2 className="font-display mt-4 text-2xl font-bold text-[#0F172A] dark:text-white lg:text-3xl">Who We Are</h2>
              <p className="mt-5 text-base leading-relaxed text-[#475569] dark:text-slate-300">{aboutText}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                Established in {company.founded} at Noida (Delhi NCR, India), we continue to serve manufacturers
                across the country with precision-engineered wire processing machinery, backed by verified GST
                and IEC registration.
              </p>
            </div>

            <div className="card-lift rounded-sm border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/90 p-7 shadow-card">
              <p className="text-xs font-bold tracking-wide text-[#0F172A] dark:text-white uppercase">Contact Details</p>
              <ul className="mt-5 space-y-4 text-sm text-[#475569] dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <Sparkles size={17} className="mt-0.5 shrink-0 text-[#10B981]" />
                  {company.address}
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck size={17} className="shrink-0 text-[#0D5C3A] dark:text-emerald-400" />
                  <span className="font-semibold text-[#0F172A] dark:text-white">GST No. {company.gstNo}</span>
                </li>
                <li className="flex items-center gap-3">
                  <ClipboardCheck size={17} className="shrink-0 text-[#0D5C3A] dark:text-emerald-400" />
                  <span className="font-semibold text-[#0F172A] dark:text-white">IEC Code {company.iec}</span>
                </li>
              </ul>
              <Link
                to="/contact"
                className="btn-lift mt-6 flex items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] shadow-sm hover:border-slate-300 hover:bg-[#F8FAFC] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Submit Another Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why customers choose us */}
      <section className="bg-[#F8FAFC] dark:bg-slate-900/50 py-20 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] text-[#0D5C3A] dark:text-emerald-400 uppercase">Trust &amp; Reliability</span>
            <h2 className="font-display mt-2 text-2xl font-bold text-[#0F172A] dark:text-white lg:text-3xl">Why Customers Choose Us</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.slice(0, 4).map((item, i) => {
              const Icon = featureIcons[i]
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="card-lift group flex flex-col rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-7 shadow-card hover:border-[#10B981] hover:shadow-card-hover dark:hover:border-emerald-500/60"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#0F172A] text-white transition-all duration-200 group-hover:bg-[#0D5C3A] group-hover:scale-105 dark:bg-slate-800 dark:group-hover:bg-emerald-700">
                    <Icon size={19} />
                  </span>
                  <h3 className="font-display mt-5 text-base font-bold text-[#0F172A] dark:text-white transition-colors group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">{item.text}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular products */}
      <section className="bg-white dark:bg-[#0B1120] py-20 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-7">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-[0.2em] text-[#0D5C3A] dark:text-emerald-400 uppercase">While You Wait</span>
              <h2 className="font-display mt-2 text-2xl font-bold text-[#0F172A] dark:text-white lg:text-3xl">Popular Products</h2>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {popularProducts.map((p, i) => {
              const [amount, unit] = p.price.split(" / ")
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="card-lift group flex flex-col rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-card hover:border-[#10B981] hover:shadow-card-hover dark:hover:border-emerald-500/60"
                >
                  <div className="flex h-44 items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/80 p-6">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="min-h-[2.6rem] text-sm leading-snug font-bold text-[#0F172A] dark:text-white transition-colors group-hover:text-[#0D5C3A] dark:group-hover:text-emerald-400">{p.name}</h3>
                    <p className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                      {amount}
                      {unit && <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">/ {unit}</span>}
                    </p>
                    <a
                      href="/#our-products"
                      className="btn-lift mt-2 flex items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white py-2.5 text-xs font-bold tracking-wide text-[#0F172A] uppercase shadow-sm hover:border-slate-300 hover:bg-[#F8FAFC] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      View Product
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
