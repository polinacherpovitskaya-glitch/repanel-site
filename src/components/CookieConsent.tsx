"use client";

import { useEffect, useState } from "react";

const I = "'Gramatika', system-ui, sans-serif";
const KEY = "repanel_cookie_consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {}
    if (!stored) {
      setShow(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setEnter(true)));
    }
  }, []);

  const close = (value: string) => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setEnter(false);
    setTimeout(() => setShow(false), 300);
  };

  if (!show) return null;

  const btn: React.CSSProperties = {
    fontFamily: I,
    fontSize: 13,
    fontWeight: 700,
    color: "#171513",
    border: "1px solid #171513",
    background: "transparent",
    padding: "9px 20px",
    cursor: "pointer",
  };

  return (
    <div
      role="dialog"
      aria-label="Согласие на использование cookies"
      style={{
        position: "fixed",
        left: 20,
        bottom: 56,
        zIndex: 70,
        width: "calc(100% - 40px)",
        maxWidth: 440,
        background: "#FFFFFF",
        border: "1px solid #171513",
        padding: "22px 24px 24px",
        fontFamily: I,
        color: "#171513",
        transform: enter ? "translateY(0)" : "translateY(20px)",
        opacity: enter ? 1 : 0,
        transition: "transform 300ms cubic-bezier(0.22,1,0.36,1), opacity 300ms",
      }}
    >
      <button
        aria-label="Закрыть"
        onClick={() => close("dismissed")}
        className="cursor-pointer hover:opacity-60 transition-opacity"
        style={{ position: "absolute", top: 12, right: 14, background: "transparent", border: "none", color: "#171513", lineHeight: 0, padding: 4 }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <line x1="1.5" y1="1.5" x2="10.5" y2="10.5" />
          <line x1="10.5" y1="1.5" x2="1.5" y2="10.5" />
        </svg>
      </button>

      <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: 0, paddingRight: 18 }}>
        Мы используем cookies, чтобы сайт работал лучше и&nbsp;удобнее. Оставаясь, вы&nbsp;соглашаетесь со&nbsp;сбором данных.{" "}
        <a href="/privacy" style={{ color: "#171513", textDecoration: "underline", textDecorationThickness: 1, textUnderlineOffset: 3 }}>
          Подробнее
        </a>
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button onClick={() => close("accepted")} className="hover:opacity-70 transition-opacity" style={{ ...btn, background: "#171513", color: "#FFFFFF" }}>
          Принять
        </button>
        <button onClick={() => close("declined")} className="hover:opacity-70 transition-opacity" style={btn}>
          Отклонить
        </button>
      </div>
    </div>
  );
}
