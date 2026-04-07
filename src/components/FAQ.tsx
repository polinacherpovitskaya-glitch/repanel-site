"use client";

import { useState } from "react";

const D = "'Montserrat', var(--font-display), sans-serif";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ({ items, title = "Частые вопросы" }: { items: FAQItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {title && (
        <h2
          className="font-bold leading-[0.92] mb-8"
          style={{ fontFamily: D, fontSize: "clamp(32px, 3.6vw, 52px)", letterSpacing: "-1.5px" }}
        >
          {title}
        </h2>
      )}

      <div>
        {items.map((item, i) => (
          <div key={i} style={{ borderTop: "1px solid #171513" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex justify-between items-center w-full py-5 text-left cursor-pointer"
              style={{ fontFamily: D }}
            >
              <span className="text-[clamp(16px,1.4vw,20px)] font-bold pr-8">{item.question}</span>
              <span
                className="text-[24px] font-light shrink-0"
                style={{
                  transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>

            <div
              className="overflow-hidden"
              style={{
                maxHeight: open === i ? 400 : 0,
                opacity: open === i ? 1 : 0,
                transition: "max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s",
              }}
            >
              <p className="text-[16px] leading-[1.6] pb-6 pr-12" style={{ opacity: 0.7 }}>
                {item.answer}
              </p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #171513" }} />
      </div>
    </div>
  );
}
