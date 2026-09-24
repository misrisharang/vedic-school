import React from 'react';

export interface TocItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  activeId: string | null;
  sectionProgress: number; // 0 to 1
  onItemClick: (id: string) => void;
  isMobile?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  activeId,
  sectionProgress,
  onItemClick,
  isMobile = false,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={
        isMobile
          ? 'py-4 border-y border-stone-200/80 my-4'
          : 'space-y-3'
      }
    >
      {/*
        Intentionally not a heading: this is a UI label for the nav widget, and the
        widget's accessible name already comes from `aria-label` above. Using a real
        heading here would create a "Table of Contents" H2 that sits alongside the
        article's own content headings (the mobile variant renders inside <article>),
        which is exactly the duplicate/misplaced heading this label must avoid.
      */}
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400 font-sans mb-3 select-none">
        Table of Contents
      </p>
      <ul className={`space-y-2.5 ${isMobile ? '' : 'max-h-[min(48vh,380px)] overflow-y-auto pr-1.5 overscroll-contain'}`}>
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          const numberStr = String(index + 1).padStart(2, '0');
          const progressPercent = Math.min(Math.max(Math.round(sectionProgress * 100), 0), 100);

          return (
            <li key={item.id} className="relative group">
              <button
                type="button"
                onClick={() => onItemClick(item.id)}
                className={`w-full text-left transition-colors flex items-start gap-2.5 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]/40 rounded-sm cursor-pointer ${
                  isActive
                    ? 'text-stone-950 font-medium'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                aria-current={isActive ? 'location' : undefined}
              >
                <span
                  className={`font-mono text-[11px] shrink-0 pt-0.5 select-none transition-colors ${
                    isActive
                      ? 'text-[hsl(var(--primary))] font-semibold'
                      : 'text-stone-400 group-hover:text-stone-600'
                  }`}
                  aria-hidden="true"
                >
                  {numberStr}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-[13px] leading-snug block">
                    {item.title}
                  </span>
                  {/* Section Reading Progress Bar — ONLY shown for the active section */}
                  {isActive && (
                    <div
                      className="h-1 bg-stone-100 rounded-full overflow-hidden mt-1.5 w-full"
                      role="progressbar"
                      aria-valuenow={progressPercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${item.title} reading progress`}
                    >
                      <div
                        className="h-full bg-[hsl(var(--primary))] rounded-full transition-all duration-75 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
