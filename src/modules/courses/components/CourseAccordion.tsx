"use client";

import { useState } from "react";

export interface AccordionGroupItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionGroupProps {
  items: AccordionGroupItem[];
  defaultOpenIndex?: number;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <span
      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
        open ? "bg-[#c0a84f]/15 rotate-180" : "bg-[#0e2b49]/6 group-hover:bg-[#c0a84f]/10"
      }`}
    >
      <svg
        className={`w-3.5 h-3.5 transition-colors duration-200 ${open ? "text-[#c0a84f]" : "text-[#0e2b49] group-hover:text-[#c0a84f]"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  );
}

export function AccordionGroup({ items, defaultOpenIndex = 0 }: AccordionGroupProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="border-b border-[#E2E8F0] last:border-b-0">
            <button
              onClick={() => toggle(i)}
              aria-expanded={open}
              className="flex items-center justify-between w-full py-4 text-left gap-4 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f] focus-visible:ring-offset-1 rounded-sm"
            >
              <span
                className="font-semibold text-[#0e2b49] text-sm sm:text-[15px] group-hover:text-[#c0a84f] transition-colors duration-200"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {item.title}
              </span>
              <ChevronIcon open={open} />
            </button>

            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="pb-5 text-[#475569] text-sm leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Kept for backward compatibility (modal still references it)
interface AccordionItemProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function AccordionItem({ title, defaultOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E2E8F0] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center justify-between w-full py-4 text-left gap-4 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f] focus-visible:ring-offset-1 rounded-sm"
      >
        <span
          className="font-semibold text-[#0e2b49] text-sm sm:text-[15px] group-hover:text-[#c0a84f] transition-colors duration-200"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {title}
        </span>
        <ChevronIcon open={open} />
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-[#475569] text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
