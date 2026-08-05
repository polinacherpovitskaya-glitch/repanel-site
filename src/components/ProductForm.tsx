"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product, ProductColor } from "@/lib/shop-types";

const BODY = "'Gramatika', sans-serif";
const HAIRLINE = "rgba(23,21,19,0.15)";
const INK = "#171513";

const inputCls = "w-full border px-3 py-2 text-[14px] focus:outline-none focus:border-[#171513] transition-colors";
const inputStyle = { borderColor: HAIRLINE, color: INK, background: "#FFFFFF" };
const labelCls = "block text-[13px] mb-1";
const labelStyle = { color: "rgba(23,21,19,0.7)" };
const sectionCls = "border-t pt-5";
const sectionStyle = { borderColor: HAIRLINE };

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Ошибка загрузки");
  return data.url as string;
}

/* Одна картинка: drag-drop / клик, превью, удаление. value="" → всегда зона загрузки (для «добавить»). */
function ImageDrop({
  value,
  onChange,
  onBusy,
  size = 140,
  keepZone = false,
}: {
  value: string;
  onChange: (url: string) => void;
  onBusy?: (b: boolean) => void;
  size?: number;
  keepZone?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = async (file?: File | null) => {
    if (!file) return;
    setErr("");
    setBusy(true);
    onBusy?.(true);
    try {
      onChange(await uploadFile(file));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
      onBusy?.(false);
    }
  };

  if (value && !keepZone) {
    return (
      <div className="relative inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="" className="object-cover border" style={{ height: size, width: size, borderColor: HAIRLINE }} />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute -top-2 -right-2 flex items-center justify-center text-white"
          style={{ width: 22, height: 22, borderRadius: 9999, background: INK, fontSize: 15, lineHeight: 1, cursor: "pointer" }}
          aria-label="Убрать"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); void handle(e.dataTransfer.files?.[0]); }}
        className="flex items-center justify-center text-center border border-dashed transition-colors cursor-pointer px-2"
        style={{ height: size, width: size, borderColor: drag ? INK : HAIRLINE, background: drag ? "rgba(23,21,19,0.03)" : "#FFFFFF", color: "rgba(23,21,19,0.5)", fontSize: 12, lineHeight: 1.3 }}
      >
        {busy ? "Загрузка…" : keepZone ? "+ фото" : "Перетащите\nили выберите"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => { void handle(e.target.files?.[0]); if (inputRef.current) inputRef.current.value = ""; }}
      />
      {err && <p className="mt-1 text-[12px]" style={{ color: "#c72a00" }}>{err}</p>}
    </div>
  );
}

type Props =
  | { mode: "create"; product?: undefined }
  | { mode: "edit"; product: Product };

export function ProductForm(props: Props) {
  const router = useRouter();
  const p = props.product;

  const [title, setTitle] = useState(p?.title ?? "");
  const [price, setPrice] = useState(p ? String(p.price) : "");
  const [category, setCategory] = useState(p?.category ?? "");
  const [slug, setSlug] = useState(p?.slug ?? "");
  const [description, setDescription] = useState(p?.description ?? "");
  const [imageUrl, setImageUrl] = useState(p?.image_url ?? "");
  const [gallery, setGallery] = useState<string[]>(p?.gallery_urls ?? []);
  const [colors, setColors] = useState<ProductColor[]>(p?.colors ?? []);
  const [lengthCm, setLengthCm] = useState(p?.length_cm != null ? String(p.length_cm) : "");
  const [widthCm, setWidthCm] = useState(p?.width_cm != null ? String(p.width_cm) : "");
  const [heightCm, setHeightCm] = useState(p?.height_cm != null ? String(p.height_cm) : "");
  const [weightGrams, setWeightGrams] = useState(p?.weight_grams != null ? String(p.weight_grams) : "");
  const [sortOrder, setSortOrder] = useState(p ? String(p.sort_order ?? 0) : "0");
  const [isPublished, setIsPublished] = useState(p?.is_published ?? true);

  const [uploads, setUploads] = useState(0);
  const onBusy = (b: boolean) => setUploads((n) => Math.max(0, n + (b ? 1 : -1)));
  const busy = uploads > 0;

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const addColor = () => setColors((cs) => [...cs, { name: "", hex: "#B5651D", image: null }]);
  const patchColor = (i: number, patch: Partial<ProductColor>) =>
    setColors((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const removeColor = (i: number) => setColors((cs) => cs.filter((_, j) => j !== i));

  const payload = () => ({
    title: title.trim(),
    price,
    category: category.trim(),
    slug: slug.trim(),
    description,
    image_url: imageUrl.trim(),
    gallery_urls: gallery,
    colors: colors
      .filter((c) => c.name.trim() || c.image)
      .map((c) => ({ name: c.name.trim(), hex: c.hex, image: c.image || null })),
    length_cm: lengthCm,
    width_cm: widthCm,
    height_cm: heightCm,
    weight_grams: weightGrams,
    sort_order: sortOrder,
    is_published: isPublished,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = props.mode === "create" ? "/api/admin/products" : `/api/admin/products/${p!.id}`;
      const method = props.mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Ошибка сохранения");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (props.mode !== "edit") return;
    if (!window.confirm(`Удалить «${p!.title}»?`)) return;
    setError("");
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${p!.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Ошибка удаления");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setDeleting(false);
    }
  };

  return (
    <div style={{ fontFamily: BODY, maxWidth: 680 }}>
      <div className="mb-5">
        <Link href="/admin/products" className="text-[13px] transition-opacity hover:opacity-100" style={{ color: "rgba(23,21,19,0.55)" }}>
          ← Назад к товарам
        </Link>
      </div>

      <h1 className="text-[26px] font-bold mb-6" style={{ color: INK }}>
        {props.mode === "create" ? "Новый товар" : "Редактировать товар"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Название */}
        <div>
          <label htmlFor="title" className={labelCls} style={labelStyle}>Название *</label>
          <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} style={inputStyle} placeholder="Название товара" />
        </div>

        {/* Цена / Категория */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className={labelCls} style={labelStyle}>Цена, ₽ *</label>
            <input id="price" type="number" required min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label htmlFor="category" className={labelCls} style={labelStyle}>Категория</label>
            <input id="category" type="text" list="category-options" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} style={inputStyle} placeholder="Мебель, Аксессуары, Дети" />
            <datalist id="category-options">
              <option value="Мебель" />
              <option value="Аксессуары" />
              <option value="Дети" />
              <option value="Образцы" />
            </datalist>
          </div>
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className={labelCls} style={labelStyle}>Slug <span style={{ color: "rgba(23,21,19,0.4)" }}>(необязательно)</span></label>
          <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} style={inputStyle} placeholder="сгенерируется из названия" />
        </div>

        {/* Описание */}
        <div>
          <label htmlFor="description" className={labelCls} style={labelStyle}>Описание</label>
          <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} style={inputStyle} placeholder="Описание товара — видно в карточке" />
        </div>

        {/* Главное фото */}
        <div className={sectionCls} style={sectionStyle}>
          <label className={labelCls} style={labelStyle}>Главное фото <span style={{ color: "rgba(23,21,19,0.4)" }}>— в сетке каталога</span></label>
          <ImageDrop value={imageUrl} onChange={setImageUrl} onBusy={onBusy} size={150} />
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={`${inputCls} mt-2`} style={inputStyle} placeholder="…или вставьте ссылку (/images/shop/….png)" />
        </div>

        {/* Галерея */}
        <div className={sectionCls} style={sectionStyle}>
          <label className={labelCls} style={labelStyle}>Галерея <span style={{ color: "rgba(23,21,19,0.4)" }}>— доп. фото внутри карточки</span></label>
          <div className="flex flex-wrap gap-2.5">
            {gallery.map((g, i) => (
              <div key={g + i} className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g} alt="" className="object-cover border" style={{ height: 96, width: 96, borderColor: HAIRLINE }} />
                <button type="button" onClick={() => setGallery((arr) => arr.filter((_, j) => j !== i))} className="absolute -top-2 -right-2 flex items-center justify-center text-white" style={{ width: 20, height: 20, borderRadius: 9999, background: INK, fontSize: 13, lineHeight: 1, cursor: "pointer" }} aria-label="Убрать">×</button>
              </div>
            ))}
            <ImageDrop value="" keepZone onChange={(url) => url && setGallery((arr) => [...arr, url])} onBusy={onBusy} size={96} />
          </div>
        </div>

        {/* Размеры / Вес */}
        <div className={sectionCls} style={sectionStyle}>
          <label className={labelCls} style={labelStyle}>Размеры и вес</label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: "len", lbl: "Длина, см", v: lengthCm, set: setLengthCm },
              { id: "wid", lbl: "Ширина, см", v: widthCm, set: setWidthCm },
              { id: "hei", lbl: "Высота, см", v: heightCm, set: setHeightCm },
              { id: "wei", lbl: "Вес, г", v: weightGrams, set: setWeightGrams },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="block text-[12px] mb-1" style={{ color: "rgba(23,21,19,0.5)" }}>{f.lbl}</label>
                <input id={f.id} type="number" min="0" step="1" value={f.v} onChange={(e) => f.set(e.target.value)} className={inputCls} style={inputStyle} placeholder="—" />
              </div>
            ))}
          </div>
        </div>

        {/* Варианты цвета */}
        <div className={sectionCls} style={sectionStyle}>
          <label className={labelCls} style={labelStyle}>Варианты цвета <span style={{ color: "rgba(23,21,19,0.4)" }}>— название + цвет + фото</span></label>
          <div className="space-y-3">
            {colors.map((c, i) => (
              <div key={i} className="flex items-start gap-3 border p-3" style={{ borderColor: HAIRLINE }}>
                <ImageDrop value={c.image ?? ""} onChange={(url) => patchColor(i, { image: url || null })} onBusy={onBusy} size={70} />
                <div className="flex-1 space-y-2">
                  <input type="text" value={c.name} onChange={(e) => patchColor(i, { name: e.target.value })} className={inputCls} style={inputStyle} placeholder="Название цвета (напр. Терракота)" />
                  <div className="flex items-center gap-2">
                    <input type="color" value={c.hex} onChange={(e) => patchColor(i, { hex: e.target.value })} className="h-9 w-12 border cursor-pointer" style={{ borderColor: HAIRLINE, padding: 2, background: "#fff" }} aria-label="Цвет свотча" />
                    <input type="text" value={c.hex} onChange={(e) => patchColor(i, { hex: e.target.value })} className={inputCls} style={{ ...inputStyle, maxWidth: 120 }} placeholder="#B5651D" />
                    <button type="button" onClick={() => removeColor(i)} className="ml-auto text-[13px] transition-opacity hover:opacity-70" style={{ color: "#c72a00", cursor: "pointer" }}>Убрать</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addColor} className="mt-3 text-[13px] font-bold transition-opacity hover:opacity-70" style={{ color: INK, cursor: "pointer" }}>
            + Добавить цвет
          </button>
        </div>

        {/* Порядок / Опубликован */}
        <div className={`${sectionCls} flex items-end gap-6`} style={sectionStyle}>
          <div>
            <label htmlFor="sort_order" className={labelCls} style={labelStyle}>Порядок</label>
            <input id="sort_order" type="number" step="1" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputCls} style={{ ...inputStyle, width: 110 }} placeholder="0" />
          </div>
          <label className="flex items-center gap-2 pb-2.5 cursor-pointer">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4" style={{ accentColor: INK }} />
            <span className="text-[14px]" style={{ color: INK }}>Опубликован</span>
          </label>
        </div>

        {error && (
          <p className="px-3 py-2 text-[13px]" style={{ background: "rgba(199,42,0,0.08)", color: "#c72a00" }}>{error}</p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button type="submit" disabled={saving || deleting || busy} className="cart-pill px-6 py-2.5 text-[14px] text-white transition-colors disabled:opacity-50" style={{ background: INK, cursor: saving || busy ? "default" : "pointer" }}>
            {saving ? "Сохранение…" : busy ? "Загрузка фото…" : "Сохранить"}
          </button>
          <Link href="/admin/products" className="cart-pill px-6 py-2.5 text-[14px] border transition-colors" style={{ borderColor: HAIRLINE, color: INK }}>Отмена</Link>
          {props.mode === "edit" && (
            <button type="button" onClick={handleDelete} disabled={saving || deleting} className="cart-pill ml-auto px-5 py-2.5 text-[14px] border transition-colors disabled:opacity-50" style={{ borderColor: "rgba(199,42,0,0.4)", color: "#c72a00", cursor: "pointer" }}>
              {deleting ? "Удаление…" : "Удалить"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
