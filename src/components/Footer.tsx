"use client";

import Link from "next/link";
import { useRef } from "react";

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
  { label: "телеграм", href: "https://t.me/repanel", ext: true },
  { label: "вконтакте", href: "https://vk.com/repanel", ext: true },
  { label: "политика конфиденциальности", href: "/privacy" },
];

const linkClass = "font-[Gramatika] font-bold hover:opacity-60 transition-opacity text-[13px] leading-[18.66px] text-[#171513]";

export function Footer() {
  const emailRef = useRef<HTMLInputElement>(null);

  return (
    <footer className="bg-[#FFFFFF] text-[#171513]">

      {/* ══════ MOBILE FOOTER (< lg) ══════ */}
      <div className="lg:hidden px-5 pt-6 pb-10">
        {/* Newsletter */}
        <form className="mb-8" onSubmit={(e) => e.preventDefault()}>
          <div className="border-b border-[#171513] pb-[21px]">
            <input
              ref={emailRef}
              type="email"
              placeholder="Подпишитесь на рассылку"
              className="bg-transparent border-none w-full font-[Gramatika] font-bold text-[#171513] placeholder:text-[#171513] placeholder:opacity-50"
              style={{ fontSize: "22px", lineHeight: "29.33px", outline: "none" }}
            />
          </div>
          <button
            type="submit"
            className="mt-2 font-[Gramatika] font-bold text-[#171513] hover:opacity-60 transition-opacity cursor-pointer"
            style={{ fontSize: "22px", lineHeight: "29.33px" }}
          >
            Отправить
          </button>
        </form>

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

        <p className="font-[Gramatika] font-bold text-[13px] text-[#171513]">
          &copy; {new Date().getFullYear()} RePanel.
        </p>
      </div>

      {/* ══════ DESKTOP FOOTER (>= lg) ══════ */}
      <div className="hidden lg:block px-5 pt-5 pb-14">
        {/* Newsletter */}
        <form className="flex items-center gap-4 border-b border-[#171513] pb-3 mb-5" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Подпишитесь на рассылку"
            className="bg-transparent border-none flex-1 min-w-0 font-[Gramatika] font-bold text-[#171513] placeholder:text-[#171513] placeholder:opacity-50"
            style={{ fontSize: "clamp(28px, 2.5vw, 32px)", lineHeight: "1.2", outline: "none" }}
          />
          <button
            type="submit"
            className="shrink-0 font-[Gramatika] font-bold text-[#171513] hover:opacity-60 transition-opacity cursor-pointer"
            style={{ fontSize: "clamp(28px, 2.5vw, 32px)", lineHeight: "1.2" }}
          >
            Отправить
          </button>
        </form>

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
            <p className="font-[Gramatika] font-bold text-[13px] leading-[18.66px] text-[#171513]">
              &copy; {new Date().getFullYear()} RePanel.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
