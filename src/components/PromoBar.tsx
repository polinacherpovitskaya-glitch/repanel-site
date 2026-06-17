"use client";

import { useEffect, useState } from "react";

const BAR_H = 40;
const TG = "https://t.me/panelpanelre";

/* Текст можно свободно менять */
const MESSAGE = "Нужно срочно посчитать ваш проект?";
const LINK_TEXT = "Свяжитесь с нами в Telegram";

const I = "'Gramatika', system-ui, sans-serif";

function Segment() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        paddingRight: 64,
        fontSize: 12.7,
        lineHeight: "17px",
        color: "#FFFFFF",
        whiteSpace: "nowrap",
      }}
    >
      {MESSAGE}{" "}
      <a
        href={TG}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#FFFFFF",
          textDecoration: "underline",
          textDecorationColor: "#FFFFFF",
          textDecorationThickness: 1,
          textUnderlineOffset: 3,
        }}
      >
        {LINK_TEXT}
      </a>
    </span>
  );
}

export function PromoBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("repanel_promo_hidden") === "1") setHidden(true);
    } catch {}
  }, []);

  useEffect(() => {
    document.body.style.paddingBottom = hidden ? "" : `${BAR_H}px`;
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [hidden]);

  if (hidden) return null;

  const hide = () => {
    setHidden(true);
    try {
      localStorage.setItem("repanel_promo_hidden", "1");
    } catch {}
  };

  const unit = Array.from({ length: 4 });

  return (
    <div
      role="region"
      aria-label="Срочный расчёт"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: BAR_H,
        zIndex: 60,
        background: "#171513",
        color: "#FFFFFF",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        fontFamily: I,
        borderTop: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* Бегущая строка */}
      <div style={{ display: "flex", width: "max-content", animation: "marquee 38s linear infinite" }}>
        <div style={{ display: "flex" }}>{unit.map((_, i) => <Segment key={`a${i}`} />)}</div>
        <div style={{ display: "flex" }}>{unit.map((_, i) => <Segment key={`b${i}`} />)}</div>
      </div>

      {/* Левая полутень */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 48,
          background: "linear-gradient(to right, #171513, rgba(23,21,19,0))",
          pointerEvents: "none",
        }}
      />

      {/* Правая полутень + крестик */}
      <button
        onClick={hide}
        aria-label="Скрыть строку"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 84,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 22,
          background: "linear-gradient(to right, rgba(23,21,19,0), #171513 58%)",
          color: "#FFFFFF",
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="1.5" y1="1.5" x2="10.5" y2="10.5" />
          <line x1="10.5" y1="1.5" x2="1.5" y2="10.5" />
        </svg>
      </button>
    </div>
  );
}
