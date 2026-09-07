import { MapPin, Truck, Video, PhoneCall, ShieldAlert, CheckCircle2 } from "lucide-react"
import { company } from "../../data/content"

export default function LocationContext({ location, content }) {
  if (!location || !content) return null

  const isDirectOffice = ["noida", "bengaluru", "pune"].includes(location.slug)

  return (
    <section className="bg-white dark:bg-[#0B1120] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 p-8 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400 mb-2">
                Local Industrial Context
              </span>
              <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white sm:text-3xl leading-snug">
                {content.contextHeadline}
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {content.contextBody}
              </p>

              <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Truck size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
                      Direct Pan-India Supply to {location.name}, {location.state}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Secure wooden-crate transit directly to your factory gate or workshop with door-to-door tracking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Video size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
                      Live Video Testing Verification Before Dispatch
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      We calibrate machine stroke lengths and blade clearance, and share operational video proof with you before handover.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Supply Notice & Transparent Delivery Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] dark:text-emerald-400 mb-3">
                  <MapPin size={15} />
                  <span>Transparent Supply Notice</span>
                </div>

                {isDirectOffice ? (
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    Zohan Enterprises maintains regional operations for {location.name} and the {location.state} region. Contact our technical team for immediate machine inspections and dispatch schedules.
                  </p>
                ) : (
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    Zohan Enterprises supplies industrial machinery directly to businesses in <strong>{location.name}</strong> from our central hubs. Businesses in {location.name} can contact Zohan Enterprises for machinery enquiries, datasheets, video demonstrations, and instant quotation assistance.
                  </p>
                )}

                <div className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Head Office:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Noida, Uttar Pradesh</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Regional Sales:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Bangalore &amp; Pune</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Service Area:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Pan-India (28+ States)</span>
                  </div>
                </div>

                <div className="mt-5">
                  <a
                    href={`tel:${company.phone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D5C3A] py-2.5 text-xs font-bold text-white shadow-cta hover:bg-[#0a472c] dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
                  >
                    <PhoneCall size={14} />
                    <span>Call Sales Helpline: {company.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
