import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function BlogFAQAccordion({ faqs = [] }) {
  const [openIdx, setOpenIdx] = useState(0); // First open by default

  if (!faqs || faqs.length === 0) return null;

  const toggle = (idx) => {
    setOpenIdx((curr) => (curr === idx ? -1 : idx));
  };

  return (
    <section
      id="faqs"
      aria-label="Frequently Asked Questions"
      className="my-10 p-6 sm:p-8 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-xl transition-colors"
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0D5C3A] dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Expert answers on machinery operation, quality standards, and technical specifications.
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-slate-50/90 dark:bg-slate-950/90 border-emerald-500/40 dark:border-amber-500/40 shadow-sm'
                  : 'bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-[#0F172A] dark:text-white hover:text-[#0D5C3A] dark:hover:text-amber-400 transition-colors gap-4"
              >
                <span className="text-sm sm:text-base leading-snug">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#0D5C3A] dark:text-amber-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3.5">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
