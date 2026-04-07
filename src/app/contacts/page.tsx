import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

const D = "'Montserrat', var(--font-display), sans-serif";
const I = "'Gramatika', var(--font-sans), sans-serif";

export const metadata: Metadata = {
  title: "Контакты RePanel — связаться с нами",
  description:
    "Расскажите о вашем проекте — мы предложим лучший формат работы.",
};

const quickLinks = [
  { label: "Каталог изделий", href: "/catalog" },
  { label: "Для архитекторов", href: "/for-architects" },
  { label: "Кейсы", href: "/projects" },
];

export default function ContactsPage() {
  return (
    <div style={{ maxWidth: 1440, margin: "0 auto" }}>
      {/* ===== HERO ===== */}
      <section style={{ padding: "80px 20px" }}>
        <h1
          style={{
            fontFamily: D,
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: -1.5,
            lineHeight: 0.92,
            color: "#171513",
            marginBottom: 20,
          }}
        >
          {"Обсудим\nваш проект".split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>
        <p
          style={{
            fontFamily: I,
            fontSize: 18,
            lineHeight: 1.5,
            color: "#171513",
          }}
        >
          Пришлите задачу, размеры, сроки и референсы
        </p>
      </section>

      {/* ===== Form + Contact Info ===== */}
      <section style={{ padding: "0 20px 60px 20px" }}>
        <div
          style={{
            display: "flex",
            gap: 60,
            flexWrap: "wrap",
          }}
        >
          {/* Left: Form */}
          <div style={{ flex: "1 1 0", minWidth: 320 }}>
            <ContactForm />
          </div>

          {/* Right: Contact info */}
          <div style={{ width: 400, flexShrink: 0 }}>
            <div style={{ position: "sticky", top: 100 }}>
              {/* Phone */}
              <div style={{ marginBottom: 28 }}>
                <p
                  style={{
                    fontFamily: I,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "#171513",
                    marginBottom: 8,
                  }}
                >
                  Телефон
                </p>
                <a
                  href="tel:+79661534597"
                  style={{
                    fontFamily: I,
                    fontSize: 16,
                    color: "#171513",
                    textDecoration: "none",
                  }}
                >
                  +7 (966) 153-45-97
                </a>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 28 }}>
                <p
                  style={{
                    fontFamily: I,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "#171513",
                    marginBottom: 8,
                  }}
                >
                  Email
                </p>
                <a
                  href="mailto:info@repanel.ru"
                  style={{
                    fontFamily: I,
                    fontSize: 16,
                    color: "#171513",
                    textDecoration: "none",
                  }}
                >
                  info@repanel.ru
                </a>
              </div>

              {/* Telegram */}
              <div style={{ marginBottom: 28 }}>
                <p
                  style={{
                    fontFamily: I,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "#171513",
                    marginBottom: 8,
                  }}
                >
                  Telegram
                </p>
                <a
                  href="https://t.me/repanel"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: I,
                    fontSize: 16,
                    color: "#171513",
                    textDecoration: "none",
                  }}
                >
                  @repanel
                </a>
              </div>

              {/* Address */}
              <div>
                <p
                  style={{
                    fontFamily: I,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "#171513",
                    marginBottom: 8,
                  }}
                >
                  Адрес
                </p>
                <p
                  style={{
                    fontFamily: I,
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: "#171513",
                  }}
                >
                  Москва, ул. Промышленная ул. 32,
                  <br />
                  Борис Федоров, д. 21 корп.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Как нас найти ===== */}
      <section style={{ padding: "60px 20px" }}>
        <div style={{ borderTop: "1px solid #000", paddingTop: 40 }}>
          <h3
            style={{
              fontFamily: D,
              fontSize: 36,
              fontWeight: 700,
              color: "#171513",
              marginBottom: 24,
            }}
          >
            Как нас найти
          </h3>

          {/* Map placeholder */}
          <div
            style={{
              width: "100%",
              height: 300,
              background: "#E8E8E8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <p style={{ fontFamily: I, fontSize: 14, color: "#999" }}>
              Карта
            </p>
          </div>

          <p
            style={{
              fontFamily: I,
              fontSize: 16,
              color: "#171513",
            }}
          >
            Дмитров, ул. Промышленная, 10
          </p>
        </div>
      </section>

      {/* ===== Быстрые ссылки ===== */}
      <section style={{ padding: "40px 20px" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                border: "1px solid #000",
                textDecoration: "none",
                color: "#171513",
                fontFamily: D,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {link.label}
              <span style={{ fontSize: 20 }}>&rarr;</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
