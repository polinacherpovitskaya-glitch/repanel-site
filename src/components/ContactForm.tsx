"use client";

import { useState } from "react";

const I = "'Gramatika', var(--font-sans), sans-serif";

interface ContactFormProps {
  compact?: boolean;
}

export function ContactForm({ compact = false }: ContactFormProps) {
  const [f, setF] = useState({
    name: "",
    company: "",
    role: "",
    contact: "",
    email: "",
    need: "",
    sizes: "",
    deadline: "",
    city: "",
    comment: "",
  });
  const ch = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setF({ ...f, [e.target.name]: e.target.value });

  const inputCls = "w-full px-4 py-3 text-[15px] focus:outline-none";
  const inputSt: React.CSSProperties = {
    border: "1px solid #000",
    background: "transparent",
    color: "#171513",
    fontFamily: I,
  };

  const labelSt: React.CSSProperties = {
    fontFamily: I,
    fontSize: 12,
    color: "#171513",
    marginBottom: 4,
    display: "block",
  };

  return (
    <form className="space-y-4">
      <div
        className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}
      >
        <div>
          <label style={labelSt}>
            имя *
          </label>
          <input
            type="text"
            name="name"
            value={f.name}
            onChange={ch}
            required
            className={inputCls}
            style={inputSt}
          />
        </div>
        <div>
          <label style={labelSt}>
            компания
          </label>
          <input
            type="text"
            name="company"
            value={f.company}
            onChange={ch}
            className={inputCls}
            style={inputSt}
          />
        </div>
      </div>

      <div
        className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}
      >
        <div>
          <label style={labelSt}>
            телефон или telegram *
          </label>
          <input
            type="text"
            name="contact"
            value={f.contact}
            onChange={ch}
            required
            className={inputCls}
            style={inputSt}
          />
        </div>
        <div>
          <label style={labelSt}>
            email
          </label>
          <input
            type="email"
            name="email"
            value={f.email}
            onChange={ch}
            className={inputCls}
            style={inputSt}
          />
        </div>
      </div>

      <div>
        <label style={labelSt}>
          что нужно *
        </label>
        <select
          name="need"
          value={f.need}
          onChange={ch}
          required
          className={inputCls}
          style={inputSt}
        >
          <option value="">выберите</option>
          <option>панели / листовой материал</option>
          <option>готовое решение под проект</option>
          <option>готовый предмет из каталога</option>
          <option>образцы</option>
          <option>консультация</option>
        </select>
      </div>

      {!compact && (
        <div>
          <label style={labelSt}>
            комментарий
          </label>
          <textarea
            name="comment"
            value={f.comment}
            onChange={ch}
            rows={3}
            className={inputCls + " resize-y"}
            style={inputSt}
          />
        </div>
      )}

      <button
        type="submit"
        className="text-[14px] font-bold px-8 py-3 rounded-pill cursor-pointer"
        style={{
          background: "#171513",
          color: "#fff",
          fontFamily: "var(--font-display)",
        }}
      >
        Отправить
      </button>
    </form>
  );
}
