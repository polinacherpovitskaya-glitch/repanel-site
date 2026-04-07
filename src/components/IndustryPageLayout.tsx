import Link from "next/link";
import { FAQ } from "./FAQ";

const D = "'Montserrat', var(--font-display), sans-serif";

interface IndustryPageLayoutProps {
  title: string;
  subtitle: string;
  problem: string;
  whatWeDo: string[];
  benefits: string[];
  ctaText: string;
  ctaHref?: string;
  audiences?: string[];
  faq?: { question: string; answer: string }[];
}

export function IndustryPageLayout({
  title,
  subtitle,
  problem,
  whatWeDo,
  benefits,
  ctaText,
  ctaHref = "/contacts",
  audiences,
  faq,
}: IndustryPageLayoutProps) {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: "60px 20px 80px" }}>
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-[800px] pt-10">
            <h1
              className="font-bold mb-7"
              style={{ fontFamily: D, fontSize: "clamp(34px, 4.5vw, 64px)", letterSpacing: "-2px", lineHeight: 0.95 }}
            >
              {title}
            </h1>
            <p className="text-[17px] md:text-[20px] leading-[1.55] max-w-[680px] mb-10" style={{ opacity: 0.55 }}>
              {subtitle}
            </p>
            <Link
              href={ctaHref}
              className="rounded-pill inline-block text-[15px] font-bold px-8 py-3"
              style={{ border: "2px solid #171513", fontFamily: D }}
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section style={{ padding: "60px 20px", borderTop: "1px solid #171513" }}>
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-[700px]">
            <h2
              className="font-bold mb-6"
              style={{ fontFamily: D, fontSize: "clamp(28px, 3vw, 42px)", letterSpacing: "-1px" }}
            >
              Задача
            </h2>
            <p className="text-[16px] md:text-[18px] leading-[1.6]" style={{ opacity: 0.6 }}>
              {problem}
            </p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section style={{ padding: "60px 20px", borderTop: "1px solid rgba(23,21,19,0.15)" }}>
        <div className="mx-auto max-w-[1440px]">
          <h2
            className="font-bold mb-8"
            style={{ fontFamily: D, fontSize: "clamp(28px, 3vw, 42px)", letterSpacing: "-1px" }}
          >
            Что мы делаем
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whatWeDo.map((item, i) => (
              <div key={i} className="p-5 md:p-6" style={{ background: "#F5F5F5" }}>
                <p className="text-[15px] leading-[1.5]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "60px 20px", borderTop: "1px solid rgba(23,21,19,0.15)" }}>
        <div className="mx-auto max-w-[1440px]">
          <h2
            className="font-bold mb-8"
            style={{ fontFamily: D, fontSize: "clamp(28px, 3vw, 42px)", letterSpacing: "-1px" }}
          >
            Почему удобно
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-[5px] h-[5px] rounded-full-override mt-2.5 shrink-0" style={{ background: "#171513" }} />
                <p className="text-[15px] leading-[1.6]" style={{ opacity: 0.7 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences */}
      {audiences && audiences.length > 0 && (
        <section style={{ padding: "60px 20px", borderTop: "1px solid rgba(23,21,19,0.15)" }}>
          <div className="mx-auto max-w-[1440px]">
            <h2
              className="font-bold mb-8"
              style={{ fontFamily: D, fontSize: "clamp(28px, 3vw, 42px)", letterSpacing: "-1px" }}
            >
              Для кого
            </h2>
            <div className="flex flex-wrap gap-3">
              {audiences.map((a, i) => (
                <span key={i} className="text-[13px] px-5 py-2.5" style={{ border: "1px solid rgba(23,21,19,0.2)" }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <section style={{ padding: "60px 20px", borderTop: "1px solid rgba(23,21,19,0.15)" }}>
          <div className="mx-auto max-w-[1440px]">
            <FAQ items={faq} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "80px 20px", background: "#171513", color: "#fff" }}>
        <div className="mx-auto max-w-[1440px] text-center">
          <h2
            className="font-bold mb-5"
            style={{ fontFamily: D, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-1px", color: "#fff" }}
          >
            Обсудим ваш проект
          </h2>
          <p className="text-[16px] mb-10 max-w-lg mx-auto" style={{ opacity: 0.5, color: "#fff" }}>
            Пришлите задачу — предложим формат материала и вариант реализации.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={ctaHref}
              className="rounded-pill inline-block text-[15px] font-bold px-8 py-3"
              style={{ background: "#fff", color: "#171513", fontFamily: D }}
            >
              {ctaText}
            </Link>
            <Link
              href="/contacts"
              className="rounded-pill inline-block text-[15px] font-bold px-8 py-3"
              style={{ border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", fontFamily: D }}
            >
              Написать в Telegram
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
