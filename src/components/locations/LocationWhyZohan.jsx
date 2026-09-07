import { ShieldCheck, Truck, Wrench, BadgeCheck, CheckCircle2, Video } from "lucide-react"
import { company } from "../../data/content"

const whyZohanCards = [
  {
    icon: ShieldCheck,
    title: "100% Pre-Dispatch Video Tested",
    description:
      "Every machine is powered on, blade alignment checked, and wire feed tested on live video before wooden crating.",
  },
  {
    icon: Truck,
    title: "Pan-India Secure Logistics",
    description:
      "Established logistics partnerships ensure secure, insured transit to factories and workshops across all Indian states.",
  },
  {
    icon: BadgeCheck,
    title: "GST & IEC Registered Firm",
    description:
      `Fully compliant B2B invoicing with GST (${company.gstNo}) and Import Export Code (${company.iec}) validation.`,
  },
  {
    icon: Wrench,
    title: "Technical Setup & Spares Support",
    description:
      "Dedicated engineer assistance for installation, parameter tuning, crimp die maintenance, and replacement blades.",
  },
]

export default function LocationWhyZohan({ location }) {
  return (
    <section className="bg-[#F8FAF9] dark:bg-[#0B1120] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 mb-2">
            Verified Partner
          </span>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white sm:text-3xl">
            Why Choose Zohan Enterprises for {location?.name || "Your Machinery"}?
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Trusted by manufacturing businesses, harness assemblers, and panel builders across India for industrial reliability and direct trading pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyZohanCards.map((card, i) => {
            const Icon = card.icon
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#10B981]/50 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#0D5C3A] dark:text-emerald-400 mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {card.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
