import type { ReactNode } from "react";

const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const BODY = "'Gramatika', sans-serif";

export function LegalDocument({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <article className="px-[var(--site-margins)] pt-24 pb-20 lg:pt-32 lg:pb-32">
      <div className="mx-auto" style={{ maxWidth: 1160 }}>
        <header className="max-w-[960px] border-b border-[#171513] pb-8 lg:pb-12">
          <h1
            className="font-bold text-[#171513]"
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(34px, 6vw, 76px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              overflowWrap: "break-word",
            }}
          >
            {title}
          </h1>
          <p
            className="mt-5 max-w-[760px] text-[#171513]/65"
            style={{ fontFamily: BODY, fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: 1.55 }}
          >
            {subtitle}
          </p>
        </header>
        <div className="legal-document mt-10 lg:mt-14">{children}</div>
      </div>
    </article>
  );
}

export function LegalSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 gap-3 border-t border-[#171513]/20 py-8 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-8 lg:py-10">
      <p className="text-[13px] font-bold text-[#171513]/45 lg:col-span-1">{number}</p>
      <div className="lg:col-span-9">
        <h2 className="text-[22px] font-bold leading-tight text-[#171513] lg:text-[28px]">{title}</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-[1.65] text-[#171513] lg:text-[16px]">
          {children}
        </div>
      </div>
    </section>
  );
}

