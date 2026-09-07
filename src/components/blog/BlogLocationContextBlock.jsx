import { Link } from 'react-router-dom';
import { MapPin, Truck, Video, CheckCircle2, ArrowRight } from 'lucide-react';
import { getLocationBySlug } from '../../data/locations/engine';

export default function BlogLocationContextBlock({ locationSlugs = [], primaryProductSlug = "ze-6mm-semi-automatic-wire-cutting-stripping-machine" }) {
  if (!locationSlugs || locationSlugs.length === 0) return null;

  // Find matching location objects from location engine
  const matchedLocations = locationSlugs
    .map((slug) => getLocationBySlug(slug))
    .filter(Boolean);

  if (matchedLocations.length === 0) return null;

  return (
    <section
      id="pan-india-availability-block"
      aria-label="Pan-India Industrial Machinery Supply"
      className="my-10 p-6 sm:p-8 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl relative overflow-hidden transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            Pan-India Supply & Dispatch
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Industrial Machinery Delivery & Support Across India
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Zohan Enterprises provides factory-direct dispatch, 100% pre-dispatch video testing, and on-call engineering support to major manufacturing corridors nationwide.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 self-start md:self-auto">
          <Video className="w-8 h-8 text-[#0D5C3A] dark:text-amber-400 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-[#0F172A] dark:text-white">Live Video PDI Testing</p>
            <p className="text-slate-500 dark:text-slate-400">Sample tested before dispatch</p>
          </div>
        </div>
      </div>

      {/* Location badges grid */}
      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#0D5C3A] dark:text-amber-400" />
          Explore Machinery Available in Key Industrial Hubs:
        </p>
        <div className="flex flex-wrap gap-2.5">
          {matchedLocations.map((loc) => (
            <Link
              key={loc.id}
              to={`/industrial-machinery/${loc.slug}`}
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-amber-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-xs text-slate-700 dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:text-[#0D5C3A] dark:group-hover:text-amber-400 transition-colors" />
              <span className="font-semibold">{loc.name}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">({loc.state})</span>
            </Link>
          ))}
          <Link
            to="/industrial-machinery/locations"
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-amber-500/10 border border-emerald-200 dark:border-amber-500/30 hover:bg-emerald-100 dark:hover:bg-amber-500/20 text-xs font-bold text-[#0D5C3A] dark:text-amber-400 transition-all shadow-sm"
          >
            All 1,110+ Locations
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
