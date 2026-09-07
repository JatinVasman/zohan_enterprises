import { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

export default function TableOfContents({ items = [] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  const handleClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  return (
    <nav
      id="table-of-contents"
      aria-label="Table of Contents"
      className="p-5 sm:p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl backdrop-blur-md transition-colors"
    >
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <List className="w-5 h-5 text-[#0D5C3A] dark:text-amber-400" />
        <h2 className="text-xs font-bold tracking-wider uppercase text-[#0F172A] dark:text-white">
          Table of Contents
        </h2>
      </div>

      <ul className="space-y-1.5 text-sm">
        {items.map((item, idx) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id || idx}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`group flex items-start gap-2 py-1.5 px-2.5 rounded-lg transition-all text-xs sm:text-sm ${
                  isActive
                    ? 'text-[#0D5C3A] bg-emerald-50 dark:text-amber-400 dark:bg-amber-500/10 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <ChevronRight
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-transform ${
                    isActive
                      ? 'text-[#0D5C3A] dark:text-amber-400 translate-x-0.5'
                      : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                  }`}
                />
                <span className="line-clamp-2 leading-snug">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
