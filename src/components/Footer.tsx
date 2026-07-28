import Link from "next/link";
import { LEGAL } from "@/lib/legal";

const navLinks = [
  { label: "материал", href: "/material" },
  { label: "решения", href: "/solutions" },
  { label: "каталог", href: "/catalog" },
  { label: "проекты", href: "/projects" },
];

const moreLinks = [
  { label: "архитекторам", href: "/for-architects" },
  { label: "производство", href: "/production" },
  { label: "о компании", href: "/about" },
  { label: "контакты", href: "/contacts" },
];

const socialLinks: { label: string; href: string; ext?: boolean }[] = [
  { label: "телеграм", href: "https://t.me/panelpanelre", ext: true },
  { label: "обработка персональных данных", href: "/privacy" },
  { label: "согласие на обработку данных", href: "/personal-data-consent" },
];

const linkClass = "font-[Gramatika] font-bold hover:opacity-60 transition-opacity text-[13px] leading-[18.66px] text-[#171513]";

export function Footer() {
  return (
    <footer className="bg-[#FFFFFF] text-[#171513]">

      {/* ══════ MOBILE FOOTER (< lg) ══════ */}
      <div className="lg:hidden px-5 pt-6 pb-10">
        <a
          className="mb-8 block border-b border-[#171513] pb-[21px] font-[Gramatika] font-bold text-[#171513] hover:opacity-60"
          href="mailto:panels@recycleobject.com"
          style={{ fontSize: "22px", lineHeight: "29.33px" }}
        >
          panels@recycleobject.com
        </a>

        <ul className="flex flex-col gap-0 mb-6">
          {[...navLinks, ...moreLinks].map((item) => (
            <li key={item.label}><Link href={item.href} className={linkClass}>{item.label}</Link></li>
          ))}
        </ul>

        <ul className="flex flex-col gap-0 mb-6">
          {socialLinks.map((item) => (
            <li key={item.label}>
              {item.ext ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{item.label}</a>
              ) : (
                <Link href={item.href} className={linkClass}>{item.label}</Link>
              )}
            </li>
          ))}
        </ul>

        <div className="mb-6">
          <Link href="/" className="block hover:opacity-60 transition-opacity">
            <img src="/logo/repanel-mark.svg" alt="RePanel" className="w-auto" style={{ height: "115px" }} />
          </Link>
        </div>

        <div className="space-y-1 font-[Gramatika] font-bold text-[13px] text-[#171513]">
          <p>&copy; {new Date().getFullYear()} RePanel.</p>
          <p>{LEGAL.operatorShortName}</p>
          <p>ИНН {LEGAL.inn} · ОГРНИП {LEGAL.ogrnip}</p>
        </div>
      </div>

      {/* ══════ DESKTOP FOOTER (>= lg) ══════ */}
      <div className="hidden lg:block px-5 pt-5 pb-14">
        <a
          className="mb-5 flex items-center border-b border-[#171513] pb-3 font-[Gramatika] font-bold text-[#171513] hover:opacity-60"
          href="mailto:panels@recycleobject.com"
          style={{ fontSize: "clamp(28px, 2.5vw, 32px)", lineHeight: "1.2" }}
        >
          panels@recycleobject.com
        </a>

        {/* Grid: Logo | nav | more | social */}
        <div className="grid grid-cols-12 gap-4 items-stretch">
          {/* Logo — sized to match nav column height (material to copyright) */}
          <div className="col-span-4 flex items-start">
            <Link href="/" className="block hover:opacity-60 transition-opacity h-full">
              <img
                src="/logo/repanel-mark.svg"
                alt="RePanel"
                className="w-auto"
                style={{ height: "142px" }}
              />
            </Link>
          </div>

          {/* Nav */}
          <div className="col-span-2 col-start-7">
            <ul className="flex flex-col gap-0">
              {navLinks.map((item) => (
                <li key={item.label}><Link href={item.href} className={linkClass}>{item.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div className="col-span-2">
            <ul className="flex flex-col gap-0">
              {moreLinks.map((item) => (
                <li key={item.label}><Link href={item.href} className={linkClass}>{item.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-2">
            <ul className="flex flex-col gap-0">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  {item.ext ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{item.label}</a>
                  ) : (
                    <Link href={item.href} className={linkClass}>{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="grid grid-cols-12 gap-4 mt-3">
          <div className="col-span-6 col-start-7">
            <div className="font-[Gramatika] font-bold text-[13px] leading-[18.66px] text-[#171513]">
              <p>&copy; {new Date().getFullYear()} RePanel.</p>
              <p>{LEGAL.operatorShortName} · ИНН {LEGAL.inn} · ОГРНИП {LEGAL.ogrnip}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
