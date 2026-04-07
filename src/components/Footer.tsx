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

const linkClass = "font-[Montserrat] font-bold hover:opacity-60 transition-opacity text-[13px] leading-[2] text-[#171513]";

export function Footer() {
  const emailRef = useRef<HTMLInputElement>(null);

  return (
    <footer className="bg-[#FFFFFF] text-[#171513]">

      {/* ══════ MOBILE FOOTER (< lg) ══════ */}
      <div className="lg:hidden px-5 pt-6 pb-5">
        {/* Newsletter */}
        <form className="flex items-baseline gap-3 mb-2" onSubmit={(e) => e.preventDefault()}>
          <button
            type="button"
            onClick={() => emailRef.current?.focus()}
            className="font-[Montserrat] font-bold shrink-0 hover:opacity-60 transition-opacity cursor-pointer text-left text-[#171513]"
            style={{ fontSize: "clamp(20px, 5.5vw, 28px)" }}
          >
            Подпишитесь на рассылку
          </button>
          <input
            ref={emailRef}
            type="email"
            placeholder="email"
            className="bg-transparent border-none outline-none font-[Montserrat] font-bold opacity-30 flex-1 min-w-0 text-[#171513] placeholder:text-[#171513] placeholder:opacity-30"
            style={{ fontSize: "clamp(20px, 5.5vw, 28px)" }}
            onFocus={(e) => {
              const btn = e.currentTarget.previousElementSibling as HTMLElement;
              if (btn) btn.style.display = "none";
            }}
            onBlur={(e) => {
              if (!e.currentTarget.value) {
                const btn = e.currentTarget.previousElementSibling as HTMLElement;
                if (btn) btn.style.display = "";
              }
            }}
          />
          <button
            type="submit"
            className="hover:opacity-60 transition-opacity cursor-pointer shrink-0 font-[Montserrat] font-bold text-[#171513]"
            style={{ fontSize: "clamp(20px, 5.5vw, 28px)" }}
          >
            →
          </button>
        </form>

        <div className="w-full h-px mt-2 mb-4 bg-[#171513]" />

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
            <img src="/logo/repanel.svg" alt="RePanel" className="h-[48px] w-auto" style={{ filter: "brightness(0)" }} />
          </Link>
        </div>

        <p className="font-[Montserrat] font-bold text-[13px] text-[#171513]">
          &copy; {new Date().getFullYear()} RePanel.
        </p>
      </div>

      {/* ══════ DESKTOP FOOTER (>= lg) ══════ */}
      <div className="hidden lg:block px-5 pt-6 pb-5">
        {/* Newsletter */}
        <form className="flex items-baseline gap-4" onSubmit={(e) => e.preventDefault()}>
          <button
            type="button"
            onClick={() => emailRef.current?.focus()}
            className="font-[Montserrat] font-bold shrink-0 hover:opacity-60 transition-opacity cursor-pointer text-[#171513]"
            style={{ fontSize: "clamp(18px, 2.2vw, 28px)" }}
          >
            Подпишитесь на рассылку
          </button>
          <input
            ref={emailRef}
            type="email"
            placeholder="email"
            className="bg-transparent border-none outline-none font-[Montserrat] font-bold opacity-30 flex-1 min-w-0 text-[#171513] placeholder:text-[#171513] placeholder:opacity-30"
            style={{ fontSize: "clamp(18px, 2.2vw, 28px)" }}
            onFocus={(e) => {
              const btn = e.currentTarget.previousElementSibling as HTMLElement;
              if (btn) btn.style.display = "none";
            }}
            onBlur={(e) => {
              if (!e.currentTarget.value) {
                const btn = e.currentTarget.previousElementSibling as HTMLElement;
                if (btn) btn.style.display = "";
              }
            }}
          />
          <button
            type="submit"
            className="hover:opacity-60 transition-opacity cursor-pointer shrink-0 font-[Montserrat] font-bold text-[#171513]"
            style={{ fontSize: "clamp(18px, 2.2vw, 28px)" }}
          >
            Отправить
          </button>
        </form>

        <div className="w-full h-px mt-2 mb-3 bg-[#171513]" />

        {/* Grid: Logo | nav | more | social */}
        <div className="grid grid-cols-12 gap-4 items-stretch">
          {/* Logo — sized to match nav column height (material to copyright) */}
          <div className="col-span-4 flex items-start">
            <Link href="/" className="block hover:opacity-60 transition-opacity h-full">
              <img
                src="/logo/repanel.svg"
                alt="RePanel"
                className="h-full w-auto"
                style={{ filter: "brightness(0)" }}
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
          <div className="col-span-6 col-start-7 flex items-center gap-2">
            <div className="w-5 h-[2px] rounded-full flex-shrink-0 bg-[#171513]" />
            <p className="font-[Montserrat] font-bold text-[13px] text-[#171513]">
              &copy; {new Date().getFullYear()} RePanel.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
