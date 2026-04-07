"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

const D = "'Montserrat', var(--font-display), sans-serif";

/* ── Panel configs (RO-style fullwidth dropdowns) ── */

type PanelConfig = {
  left: { heading: string; links: { label: string; href: string }[] };
  right: { heading: string; links: { label: string; href: string }[] };
  footer: { hint: string; cta: { label: string; href: string } };
};

const panels: Record<string, PanelConfig> = {
  "Материал": {
    left: {
      heading: "",
      links: [
        { label: "О материале", href: "/material" },
        { label: "Производство", href: "/production" },
        { label: "Для архитекторов", href: "/for-architects" },
      ],
    },
    right: { heading: "", links: [] },
    footer: {
      hint: "Хотите увидеть материал вживую?",
      cta: { label: "Заказать образцы →", href: "/contacts" },
    },
  },
  "Решения": {
    left: {
      heading: "По направлению",
      links: [
        { label: "Все решения", href: "/solutions" },
        { label: "Ритейл", href: "/solutions/retail" },
        { label: "HoReCa", href: "/solutions/horeca" },
        { label: "Девелопмент", href: "/solutions/public" },
        { label: "Мебель и объекты", href: "/solutions/furniture-objects" },
      ],
    },
    right: {
      heading: "По задаче",
      links: [
        { label: "Стойки и ресепшен", href: "/solutions" },
        { label: "Стеновые панели", href: "/solutions" },
        { label: "Столешницы", href: "/solutions" },
        { label: "Городская среда", href: "/solutions" },
      ],
    },
    footer: {
      hint: "",
      cta: { label: "Получить расчёт →", href: "/contacts" },
    },
  },
  "Каталог": {
    left: {
      heading: "",
      links: [
        { label: "Все изделия", href: "/catalog" },
        { label: "На заказ", href: "/custom" },
        { label: "Магазин", href: "/ready-made" },
      ],
    },
    right: { heading: "", links: [] },
    footer: {
      hint: "Нужна помощь с выбором?",
      cta: { label: "Связаться с менеджером →", href: "/contacts" },
    },
  },
  "О нас": {
    left: {
      heading: "",
      links: [
        { label: "О бренде", href: "/about" },
        { label: "Производство", href: "/production" },
      ],
    },
    right: { heading: "", links: [] },
    footer: {
      hint: "",
      cta: { label: "Контакты →", href: "/contacts" },
    },
  },
};

/* ── Nav items for top bar ── */
const navItems: { label: string; href: string; hasPanel: boolean }[] = [
  { label: "Материал", href: "/material", hasPanel: true },
  { label: "Решения", href: "/solutions", hasPanel: true },
  { label: "Каталог", href: "/catalog", hasPanel: true },
  { label: "Проекты", href: "/projects", hasPanel: false },
  { label: "Архитекторам", href: "/for-architects", hasPanel: false },
  { label: "О нас", href: "/about", hasPanel: true },
  { label: "Контакты", href: "/contacts", hasPanel: false },
];

/* ── Mobile menu structure ── */
type MobileMenuItem = {
  label: string;
  href?: string;
  hasSubmenu: boolean;
  submenu?: { label: string; children: { label: string; href: string }[] }[];
};

const mobileMenuItems: MobileMenuItem[] = [
  {
    label: "Материал",
    hasSubmenu: true,
    submenu: [
      {
        label: "Материал",
        children: [
          { label: "О материале", href: "/material" },
          { label: "Производство", href: "/production" },
          { label: "Для архитекторов", href: "/for-architects" },
        ],
      },
    ],
  },
  {
    label: "Решения",
    hasSubmenu: true,
    submenu: [
      {
        label: "По направлению",
        children: [
          { label: "Все решения", href: "/solutions" },
          { label: "Ритейл", href: "/solutions/retail" },
          { label: "HoReCa", href: "/solutions/horeca" },
          { label: "Девелопмент", href: "/solutions/public" },
          { label: "Мебель и объекты", href: "/solutions/furniture-objects" },
        ],
      },
      {
        label: "По задаче",
        children: [
          { label: "Стойки и ресепшен", href: "/solutions" },
          { label: "Стеновые панели", href: "/solutions" },
          { label: "Столешницы", href: "/solutions" },
          { label: "Городская среда", href: "/solutions" },
        ],
      },
    ],
  },
  {
    label: "Каталог",
    hasSubmenu: true,
    submenu: [
      {
        label: "Каталог",
        children: [
          { label: "Все изделия", href: "/catalog" },
          { label: "На заказ", href: "/custom" },
          { label: "Магазин", href: "/ready-made" },
        ],
      },
    ],
  },
  { label: "Проекты", href: "/projects", hasSubmenu: false },
  { label: "Архитекторам", href: "/for-architects", hasSubmenu: false },
  {
    label: "О нас",
    hasSubmenu: true,
    submenu: [
      {
        label: "О компании",
        children: [
          { label: "О бренде", href: "/about" },
          { label: "Производство", href: "/production" },
        ],
      },
    ],
  },
  { label: "Контакты", href: "/contacts", hasSubmenu: false },
];

export function Header() {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const headerRef = useRef<HTMLElement>(null);

  const hoverActive = isHovered || !!openPanel;
  const fg = hoverActive ? "#fff" : "#000";
  const bg = hoverActive ? "#171513" : "#fff";
  const panelBg = "#171513";
  const panelText = "#fff";

  const toggle = useCallback((key: string) => {
    setOpenPanel((prev) => (prev === key ? null : key));
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setMobileSubmenu(null);
  }, []);

  const closeAll = useCallback(() => {
    setOpenPanel(null);
    closeMobileMenu();
  }, [closeMobileMenu]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll]);

  /* Close on outside click */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* Resize handler */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) closeMobileMenu();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [closeMobileMenu]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const panel = openPanel ? panels[openPanel] : null;

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 ${mobileOpen ? "z-[90]" : hoverActive ? "z-[70]" : "z-[50]"}`}
      onMouseEnter={() => {
        if (hoverLeaveTimer.current) clearTimeout(hoverLeaveTimer.current);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        hoverLeaveTimer.current = setTimeout(() => setIsHovered(false), 150);
      }}
    >
      {/* ── Top nav bar ── */}
      <nav
        className="relative z-10 flex items-center h-[64px] transition-all duration-300"
        style={{
          backgroundColor: mobileOpen ? "#171513" : bg,
          borderBottom: hoverActive
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid rgba(0,0,0,0.1)",
          padding: "0 var(--site-margins)",
        }}
      >
        {/* ─── MOBILE top bar (< lg) ─── */}
        <div className="flex items-center w-full lg:hidden">
          {/* Left: Menu / Close */}
          <button
            className="text-[15px] font-bold transition-colors duration-300 cursor-pointer shrink-0"
            style={{ color: mobileOpen ? "#fff" : fg, fontFamily: D }}
            onClick={() => {
              if (mobileOpen) closeMobileMenu();
              else { setMobileOpen(true); setOpenPanel(null); }
            }}
          >
            {mobileOpen ? "Закрыть" : "Меню"}
          </button>

          {/* Center: Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-300"
            onClick={closeMobileMenu}
          >
            <img
              src="/logo/repanel.svg"
              alt="RePanel"
              style={{
                height: 20,
                width: "auto",
                filter: mobileOpen ? "invert(1)" : fg === "#fff" ? "invert(1)" : "none",
                transition: "filter 0.3s",
              }}
            />
          </Link>

          {/* Right: CTA */}
          <Link
            href="/contacts"
            className="ml-auto text-[13px] font-bold shrink-0 transition-colors duration-300"
            style={{
              color: mobileOpen ? "#fff" : fg,
              border: `1.5px solid ${mobileOpen ? "#fff" : fg}`,
              padding: "5px 12px",
              borderRadius: 9999,
              fontFamily: D,
            }}
            onClick={closeMobileMenu}
          >
            Расчёт
          </Link>
        </div>

        {/* ─── DESKTOP top bar (>= lg) ─── */}
        {/* Logo */}
        <Link
          href="/"
          className="hidden lg:block shrink-0 transition-all duration-300"
          onClick={closeAll}
        >
          <img
            src="/logo/repanel.svg"
            alt="RePanel"
            style={{
              height: 20,
              width: "auto",
              filter: fg === "#fff" ? "invert(1)" : "none",
              transition: "filter 0.3s",
            }}
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-7 lg:flex ml-12" style={{ fontFamily: D }}>
          {navItems.map((item) =>
            item.hasPanel ? (
              <button
                key={item.label}
                onClick={() => toggle(item.label)}
                className="text-[15px] font-bold hover:opacity-70 transition-all duration-300 cursor-pointer whitespace-nowrap"
                style={{ color: fg }}
              >
                {item.label} {openPanel === item.label ? "×" : "+"}
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-[15px] font-bold hover:opacity-70 transition-all duration-300 whitespace-nowrap"
                style={{ color: fg }}
                onClick={() => setOpenPanel(null)}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        {/* Desktop right — CTA */}
        <div className="hidden items-center gap-5 lg:flex ml-auto" style={{ fontFamily: D }}>
          <Link
            href="/contacts"
            style={{
              fontSize: 13,
              fontWeight: 700,
              padding: "6px 16px",
              border: `1.5px solid ${fg}`,
              borderRadius: 9999,
              color: fg,
              transition: "color 0.3s, border-color 0.3s",
            }}
            onClick={closeAll}
          >
            Запросить расчёт
          </Link>
        </div>
      </nav>

      {/* ── Desktop fullwidth dropdown panel (RO-style) ── */}
      <div
        className="hidden lg:block overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: panel ? "600px" : "0px",
          opacity: panel ? 1 : 0,
        }}
      >
        {panel && (
          <div style={{ backgroundColor: panelBg, color: panelText }}>
            <div className="flex">
              {/* ── Left sidebar zone ── */}
              <div
                className="flex flex-col justify-end shrink-0"
                style={{ width: "17vw", padding: "40px 20px 28px var(--site-margins)" }}
              >
                <div className="mt-auto">
                  {panel.footer.hint && (
                    <span
                      className="text-[14px] font-bold block mb-1"
                      style={{ opacity: 0.4, fontFamily: D }}
                    >
                      {panel.footer.hint}
                    </span>
                  )}
                  <Link
                    href={panel.footer.cta.href}
                    className="text-[14px] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity"
                    style={{ color: panelText, fontFamily: D }}
                    onClick={closeAll}
                  >
                    {panel.footer.cta.label}
                  </Link>
                </div>
              </div>

              {/* ── Vertical divider ── */}
              <div className="shrink-0" style={{ paddingTop: 28, paddingBottom: 28 }}>
                <div className="w-px h-full" style={{ backgroundColor: panelText }} />
              </div>

              {/* ── Main column: big links ── */}
              <div className="flex flex-col" style={{ width: panel.right.links.length > 0 ? "48%" : "78%", padding: "40px 40px 28px 40px" }}>
                {panel.left.heading && (
                  <span className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ opacity: 0.4, fontFamily: D }}>
                    {panel.left.heading}
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  {panel.left.links.map((link) => (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className="text-[clamp(24px,2.5vw,36px)] font-bold font-[Montserrat] hover:opacity-70 transition-opacity leading-[1.25]"
                      style={{ color: panelText }}
                      onClick={closeAll}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                {/* Secondary CTA below big links — when right column exists */}
                {panel.footer.hint === "" && panel.right.links.length > 0 && (
                  <div className="mt-auto pt-6">
                    <Link
                      href={panel.footer.cta.href}
                      className="text-[14px] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity"
                      style={{ color: panelText, fontFamily: D }}
                      onClick={closeAll}
                    >
                      {panel.footer.cta.label}
                    </Link>
                  </div>
                )}
              </div>

              {/* ── Vertical divider + Right column (only if right links exist) ── */}
              {panel.right.links.length > 0 && (
                <>
                  <div className="shrink-0" style={{ paddingTop: 28, paddingBottom: 28 }}>
                    <div className="w-px h-full" style={{ backgroundColor: panelText }} />
                  </div>
                  <div className="flex flex-col" style={{ width: "30%", padding: "40px 40px 28px 60px" }}>
                    {panel.right.heading && (
                      <span className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ opacity: 0.4, fontFamily: D }}>
                        {panel.right.heading}
                      </span>
                    )}
                    <div className="flex flex-col gap-4">
                      {panel.right.links.map((link) => (
                        <Link
                          key={link.href + link.label}
                          href={link.href}
                          className="text-[16px] font-bold hover:opacity-70 transition-opacity"
                          style={{ color: panelText, fontFamily: D }}
                          onClick={closeAll}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Scrim behind panel ── */}
      {openPanel && (
        <div
          className="fixed inset-0 z-[-1] bg-black/30 transition-opacity duration-300"
          onClick={() => setOpenPanel(null)}
        />
      )}

      {/* ═══ MOBILE FULLSCREEN MENU (RO-style sliding panels) ═══ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[80] lg:hidden flex flex-col overflow-hidden"
          style={{ backgroundColor: "#171513", top: 64 }}
        >
          {/* Sliding container — two panels side by side */}
          <div
            className="flex flex-1 transition-transform duration-300 ease-in-out"
            style={{
              width: "200%",
              transform: mobileSubmenu !== null ? "translateX(-50%)" : "translateX(0)",
            }}
          >
            {/* ── Panel 1: Main menu ── */}
            <div
              className="w-1/2 flex flex-col overflow-y-auto"
              style={{ padding: "20px var(--site-margins) 40px" }}
            >
              <div className="flex flex-col gap-0 mt-8">
                {mobileMenuItems.map((item, idx) => (
                  <div key={item.label}>
                    {item.hasSubmenu ? (
                      <button
                        className="flex items-center justify-between w-full text-left cursor-pointer group"
                        style={{ padding: "8px 0" }}
                        onClick={() => setMobileSubmenu(idx)}
                      >
                        <span
                          className="font-bold font-[Montserrat] transition-opacity duration-200 group-hover:opacity-70"
                          style={{ color: "#fff", fontSize: "clamp(32px, 8vw, 48px)" }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="font-[Montserrat] transition-opacity duration-200 group-hover:opacity-70"
                          style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(24px, 6vw, 36px)" }}
                        >
                          →
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={item.href!}
                        className="block font-bold font-[Montserrat] transition-opacity duration-200 hover:opacity-70"
                        style={{ color: "#fff", fontSize: "clamp(32px, 8vw, 48px)", padding: "8px 0" }}
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom links */}
              <div className="mt-auto pt-10 flex flex-col gap-4">
                <Link
                  href="/contacts"
                  className="text-[17px] font-bold font-[Montserrat] transition-opacity duration-200 hover:opacity-70"
                  style={{ color: "#fff" }}
                  onClick={closeMobileMenu}
                >
                  Запросить расчёт →
                </Link>
                <a
                  href="https://t.me/repanel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[17px] font-bold font-[Montserrat] transition-opacity duration-200 hover:opacity-70 text-left"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Telegram →
                </a>
              </div>
            </div>

            {/* ── Panel 2: Submenu — flat list ── */}
            <div
              className="w-1/2 flex flex-col overflow-y-auto"
              style={{ padding: "20px var(--site-margins) 40px" }}
            >
              {mobileSubmenu !== null && mobileMenuItems[mobileSubmenu]?.submenu && (
                <>
                  {/* Back button */}
                  <button
                    className="flex items-center gap-2 text-[15px] font-bold font-[Montserrat] cursor-pointer transition-opacity duration-200 hover:opacity-70 self-start mt-4 mb-8"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    onClick={() => setMobileSubmenu(null)}
                  >
                    ← Назад
                  </button>

                  {/* Section title */}
                  <h2
                    className="font-bold font-[Montserrat] mb-8"
                    style={{ color: "#fff", fontSize: "clamp(28px, 7vw, 40px)", lineHeight: 1 }}
                  >
                    {mobileMenuItems[mobileSubmenu].label}
                  </h2>

                  {/* All groups + links */}
                  <div className="flex flex-col gap-7">
                    {mobileMenuItems[mobileSubmenu].submenu!.map((group) => (
                      <div key={group.label} className="flex flex-col gap-2">
                        {/* Group label */}
                        <span
                          className="text-[11px] font-bold uppercase tracking-widest"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {group.label}
                        </span>
                        {/* Links */}
                        <div className="flex flex-col gap-2">
                          {group.children.map((child) => (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              className="text-[17px] font-bold font-[Montserrat] transition-opacity duration-200 hover:opacity-70 leading-[1.35]"
                              style={{ color: "#fff" }}
                              onClick={closeMobileMenu}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA in submenu */}
                  <div className="mt-auto pt-10">
                    <Link
                      href="/contacts"
                      className="text-[17px] font-bold font-[Montserrat] transition-opacity duration-200 hover:opacity-70"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      onClick={closeMobileMenu}
                    >
                      Запросить расчёт →
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
