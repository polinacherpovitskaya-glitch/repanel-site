"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

const D = "'Gramatika', system-ui, sans-serif";

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
        { label: "Прайс-лист", href: "/prices" },
        { label: "Производство", href: "/production" },
      ],
    },
    right: {
      heading: "Архитекторам и дизайнерам",
      links: [
        { label: "Характеристики и обработка", href: "/for-architects" },
        { label: "Цвета и карты материалов", href: "/for-architects#colors" },
        { label: "3D / BIM-модели и документы", href: "/for-architects#downloads" },
        { label: "Заказать образцы", href: "/samples" },
      ],
    },
    footer: {
      hint: "Заложить RePanel в проект?",
      cta: { label: "Запросить расчёт →", href: "/contacts" },
    },
  },
  "Применение": {
    left: {
      heading: "",
      links: [
        { label: "Интерьеры", href: "/applications#interiors" },
        { label: "HoReCa", href: "/applications#horeca" },
        { label: "Ритейл", href: "/applications#retail" },
        { label: "Офис", href: "/applications#office" },
        { label: "Городская среда", href: "/applications#urban" },
      ],
    },
    right: { heading: "", links: [] },
    footer: {
      hint: "3D-модели и образцы под проект",
      cta: { label: "Обсудить проект →", href: "/contacts" },
    },
  },
};

/* ── Nav items for top bar ── */
const navItems: { label: string; href: string; hasPanel: boolean; left: string; center?: boolean }[] = [
  { label: "Материал", href: "/material", hasPanel: true, left: "22%", center: true },
  { label: "Применение", href: "/applications", hasPanel: true, left: "52%" },
  { label: "Магазин", href: "/catalog", hasPanel: false, left: "62%" },
  { label: "Проекты", href: "/projects", hasPanel: false, left: "70%" },
  { label: "Контакты", href: "/contacts", hasPanel: false, left: "78%" },
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
        label: "",
        children: [
          { label: "О материале", href: "/material" },
          { label: "Прайс-лист", href: "/prices" },
          { label: "Производство", href: "/production" },
        ],
      },
      {
        label: "Архитекторам и дизайнерам",
        children: [
          { label: "Характеристики и обработка", href: "/for-architects" },
          { label: "Цвета и карты материалов", href: "/for-architects#colors" },
          { label: "3D / BIM-модели и документы", href: "/for-architects#downloads" },
          { label: "Заказать образцы", href: "/samples" },
        ],
      },
    ],
  },
  {
    label: "Применение",
    hasSubmenu: true,
    submenu: [
      {
        label: "",
        children: [
          { label: "Интерьеры", href: "/applications#interiors" },
          { label: "HoReCa", href: "/applications#horeca" },
          { label: "Ритейл", href: "/applications#retail" },
          { label: "Офис", href: "/applications#office" },
          { label: "Городская среда", href: "/applications#urban" },
        ],
      },
    ],
  },
  { label: "Магазин", href: "/catalog", hasSubmenu: false },
  { label: "Проекты", href: "/projects", hasSubmenu: false },
  { label: "Контакты", href: "/contacts", hasSubmenu: false },
];

export function Header() {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  /* Homepage: transparent over hero, solid after scrolling past it */
  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const hoverActive = isHovered || !!openPanel || searchOpen;
  // White text only over the hero photos; everywhere else (incl. hover) milky bg + ink text
  const overHero = isHome && !scrolled && !mobileOpen && !hoverActive;
  const fg = overHero ? "#FFFFFF" : "#171513";
  const bg = overHero ? "transparent" : "#FFFFFF";
  const panelBg = "#FFFFFF";
  const panelText = "#171513";

  const toggle = useCallback((key: string) => {
    setSearchOpen(false);
    setOpenPanel((prev) => (prev === key ? null : key));
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setMobileSubmenu(null);
  }, []);

  const closeAll = useCallback(() => {
    setOpenPanel(null);
    setSearchOpen(false);
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
        setSearchOpen(false);
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

  /* Focus the search field when the search drawer opens */
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const panel = openPanel ? panels[openPanel] : null;

  return (
    <header
      ref={headerRef}
      className={`${isHome ? "fixed top-0 left-0 right-0" : "sticky top-0"} ${mobileOpen ? "z-[90]" : hoverActive ? "z-[70]" : "z-[50]"}`}
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
        className="relative z-10 flex items-center h-[54px] transition-all duration-300"
        style={{
          backgroundColor: bg,
          borderBottom: (overHero || mobileOpen)
            ? "1px solid transparent"
            : "1px solid #171513",
          textShadow: overHero ? "0 1px 16px rgba(0,0,0,0.45)" : "none",
          padding: "0 var(--site-margins)",
        }}
      >
        {/* ─── MOBILE top bar (< lg) ─── */}
        <div className="flex items-center w-full lg:hidden">
          {/* Left: Menu / Close */}
          <button
            className="text-[14px] font-bold cursor-pointer shrink-0"
            style={{ color: fg, fontFamily: D }}
            onClick={() => {
              if (mobileOpen) closeMobileMenu();
              else { setMobileOpen(true); setOpenPanel(null); setSearchOpen(false); }
            }}
          >
            {mobileOpen ? "Закрыть" : "Меню"}
          </button>

          {/* Center: Logo — appears only when not over the hero (menu open / scrolled) */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 transition-opacity duration-300"
            style={{ opacity: overHero ? 0 : 1, pointerEvents: overHero ? "none" : "auto" }}
            onClick={closeMobileMenu}
          >
            <img src="/logo/repanel.svg" alt="RePanel" style={{ height: 20, width: "auto" }} />
          </Link>

          {/* Right: Поиск + Корзина */}
          <div className="ml-auto flex items-center gap-4 shrink-0" style={{ fontFamily: D, color: fg }}>
            <button
              aria-label="Поиск"
              onClick={() => { setMobileOpen(false); setOpenPanel(null); setSearchOpen((s) => !s); }}
              className="flex items-center cursor-pointer"
              style={{ color: fg }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <Link href="/catalog" aria-label="Корзина" className="flex items-center gap-1 cursor-pointer" style={{ color: fg }} onClick={closeMobileMenu}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8h14l-1 12H6L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <span style={{ color: fg, fontSize: 13, fontWeight: 700 }}>(0)</span>
            </Link>
          </div>
        </div>

        {/* ─── DESKTOP (>= lg) — items absolutely positioned to nest in the gaps of the giant logo ─── */}
        {/* Logo (far left) — hidden over hero, giant hero logo serves there */}
        <Link
          href="/"
          className="hidden lg:flex items-center absolute top-1/2 -translate-y-1/2 transition-all duration-300"
          style={{ left: "var(--site-margins)", opacity: overHero ? 0 : 1, pointerEvents: overHero ? "none" : "auto" }}
          onClick={closeAll}
        >
          <img src="/logo/repanel.svg" alt="RePanel" style={{ height: 22, width: "auto" }} />
        </Link>

        {navItems.map((item) =>
          item.hasPanel ? (
            <button
              key={item.label}
              onClick={() => toggle(item.label)}
              className="hidden lg:block absolute top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity cursor-pointer whitespace-nowrap"
              style={{ left: item.left, translate: item.center ? "-50% -50%" : undefined, fontFamily: D, color: fg, fontWeight: 700, fontSize: 14 }}
            >
              {item.label} {openPanel === item.label ? "×" : "+"}
            </button>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="hidden lg:block absolute top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity whitespace-nowrap"
              style={{ left: item.left, translate: item.center ? "-50% -50%" : undefined, fontFamily: D, color: fg, fontWeight: 700, fontSize: 14 }}
              onClick={() => setOpenPanel(null)}
            >
              {item.label}
            </Link>
          ),
        )}

        {/* Поиск */}
        <button
          aria-label="Поиск"
          onClick={() => { setOpenPanel(null); setSearchOpen((s) => !s); }}
          className="hidden lg:flex items-center gap-2 absolute top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-60 transition-opacity"
          style={{ left: "85%", fontFamily: D, color: fg, fontWeight: 700, fontSize: 14 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ color: fg }}>Поиск</span>
        </button>

        {/* Корзина (иконка + счётчик) */}
        <Link
          href="/catalog"
          aria-label="Корзина"
          className="hidden lg:flex items-center gap-1 absolute top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity"
          style={{ left: "92%", color: fg }}
          onClick={closeAll}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8h14l-1 12H6L5 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          <span style={{ fontFamily: D, fontWeight: 700, fontSize: 13, color: fg }}>(0)</span>
        </Link>
      </nav>

      {/* ── Search drawer: drops below the header, milky + ink ── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: searchOpen ? "100px" : "0px", opacity: searchOpen ? 1 : 0 }}
      >
        <div style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #171513" }}>
          <div className="flex items-center" style={{ gap: 16, padding: "0 var(--site-margins)", height: 84 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#171513" strokeWidth="2.7" strokeLinecap="round" className="shrink-0">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Поиск"
              className="flex-1 min-w-0 bg-transparent border-none [&::placeholder]:opacity-40"
              style={{ fontFamily: D, fontWeight: 700, fontSize: "clamp(22px, 2vw, 30px)", letterSpacing: "-0.02em", color: "#171513", outline: "none", boxShadow: "none" }}
              onKeyDown={(e) => { if (e.key === "Enter") setSearchOpen(false); }}
            />
            <span className="shrink-0" style={{ fontFamily: D, fontSize: 14, fontWeight: 700, color: "#171513", opacity: 0.45, whiteSpace: "nowrap" }}>
              Нажмите «enter» для поиска
            </span>
          </div>
        </div>
      </div>

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
                      className="text-[clamp(24px,2.5vw,36px)] font-bold font-[Gramatika] hover:opacity-70 transition-opacity leading-[1.25]"
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
          style={{ backgroundColor: "#FFFFFF", top: 54 }}
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
                        style={{ padding: "16px 0" }}
                        onClick={() => setMobileSubmenu(idx)}
                      >
                        <span
                          className="font-bold font-[Gramatika] transition-opacity duration-200 group-hover:opacity-70"
                          style={{ color: "#171513", fontSize: "clamp(32px, 8vw, 48px)" }}
                        >
                          {item.label}
                        </span>
                        <span className="transition-opacity duration-200 group-hover:opacity-70 shrink-0 flex items-center" style={{ color: "#171513" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={item.href!}
                        className="block font-bold font-[Gramatika] transition-opacity duration-200 hover:opacity-70"
                        style={{ color: "#171513", fontSize: "clamp(32px, 8vw, 48px)", padding: "16px 0" }}
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
                  className="text-[17px] font-bold font-[Gramatika] transition-opacity duration-200 hover:opacity-70"
                  style={{ color: "#171513" }}
                  onClick={closeMobileMenu}
                >
                  Запросить расчёт →
                </Link>
                <a
                  href="https://t.me/panelpanelre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[17px] font-bold font-[Gramatika] transition-opacity duration-200 hover:opacity-70 text-left"
                  style={{ color: "rgba(23,21,19,0.4)" }}
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
                    className="flex items-center gap-2 text-[15px] font-bold font-[Gramatika] cursor-pointer transition-opacity duration-200 hover:opacity-70 self-start mt-4 mb-8"
                    style={{ color: "rgba(23,21,19,0.4)" }}
                    onClick={() => setMobileSubmenu(null)}
                  >
                    ← Назад
                  </button>

                  {/* Section title */}
                  <h2
                    className="font-bold font-[Gramatika] mb-8"
                    style={{ color: "#171513", fontSize: "clamp(28px, 7vw, 40px)", lineHeight: 1 }}
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
                          style={{ color: "rgba(23,21,19,0.35)" }}
                        >
                          {group.label}
                        </span>
                        {/* Links */}
                        <div className="flex flex-col gap-2">
                          {group.children.map((child) => (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              className="text-[17px] font-bold font-[Gramatika] transition-opacity duration-200 hover:opacity-70 leading-[1.35]"
                              style={{ color: "#171513" }}
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
                      className="text-[17px] font-bold font-[Gramatika] transition-opacity duration-200 hover:opacity-70"
                      style={{ color: "rgba(23,21,19,0.4)" }}
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
