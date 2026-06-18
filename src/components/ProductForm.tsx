"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/lib/supabase";

const BODY = "'Gramatika', sans-serif";

const HAIRLINE = "rgba(23,21,19,0.15)";
const INK = "#171513";

const inputCls =
  "w-full border px-3 py-2 text-[14px] focus:outline-none focus:border-[#171513] transition-colors";
const inputStyle = { borderColor: HAIRLINE, color: INK, background: "#FFFFFF" };
const labelCls = "block text-[13px] mb-1";
const labelStyle = { color: "rgba(23,21,19,0.7)" };

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
  const [isPublished, setIsPublished] = useState(p?.is_published ?? true);
  const [weightGrams, setWeightGrams] = useState(
    p?.weight_grams != null ? String(p.weight_grams) : ""
  );
  const [sortOrder, setSortOrder] = useState(p ? String(p.sort_order ?? 0) : "0");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const payload = () => ({
    title: title.trim(),
    price,
    category: category.trim(),
    slug: slug.trim(),
    description,
    image_url: imageUrl.trim(),
    is_published: isPublished,
    weight_grams: weightGrams,
    sort_order: sortOrder,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url =
        props.mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${p!.id}`;
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
    <div style={{ fontFamily: BODY, maxWidth: 640 }}>
      <div className="mb-5">
        <Link
          href="/admin/products"
          className="text-[13px] transition-opacity hover:opacity-100"
          style={{ color: "rgba(23,21,19,0.55)" }}
        >
          ← Назад к товарам
        </Link>
      </div>

      <h1 className="text-[26px] font-bold mb-6" style={{ color: INK }}>
        {props.mode === "create" ? "Новый товар" : "Редактировать товар"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Название */}
        <div>
          <label htmlFor="title" className={labelCls} style={labelStyle}>
            Название *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="Название товара"
          />
        </div>

        {/* Цена */}
        <div>
          <label htmlFor="price" className={labelCls} style={labelStyle}>
            Цена, ₽ * <span style={{ color: "rgba(23,21,19,0.4)" }}>(целые рубли)</span>
          </label>
          <input
            id="price"
            type="number"
            required
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="0"
          />
        </div>

        {/* Категория */}
        <div>
          <label htmlFor="category" className={labelCls} style={labelStyle}>
            Категория
          </label>
          <input
            id="category"
            type="text"
            list="category-options"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="Мебель, Аксессуары, Дети, Образцы"
          />
          <datalist id="category-options">
            <option value="Мебель" />
            <option value="Аксессуары" />
            <option value="Дети" />
            <option value="Образцы" />
          </datalist>
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className={labelCls} style={labelStyle}>
            Slug <span style={{ color: "rgba(23,21,19,0.4)" }}>(необязательно)</span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="сгенерируется из названия"
          />
        </div>

        {/* Описание */}
        <div>
          <label htmlFor="description" className={labelCls} style={labelStyle}>
            Описание
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="Описание товара"
          />
        </div>

        {/* Фото */}
        <div>
          <label htmlFor="image_url" className={labelCls} style={labelStyle}>
            Ссылка на фото
          </label>
          <input
            id="image_url"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="/images/shop/shop-stolik.png"
          />
          {imageUrl.trim() && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl.trim()}
              alt=""
              className="mt-3 object-cover border"
              style={{ height: 96, width: 96, borderColor: HAIRLINE }}
            />
          )}
        </div>

        {/* Вес / Порядок */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="weight_grams" className={labelCls} style={labelStyle}>
              Вес, г
            </label>
            <input
              id="weight_grams"
              type="number"
              min="0"
              step="1"
              value={weightGrams}
              onChange={(e) => setWeightGrams(e.target.value)}
              className={inputCls}
              style={inputStyle}
              placeholder="—"
            />
          </div>
          <div>
            <label htmlFor="sort_order" className={labelCls} style={labelStyle}>
              Порядок
            </label>
            <input
              id="sort_order"
              type="number"
              step="1"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={inputCls}
              style={inputStyle}
              placeholder="0"
            />
          </div>
        </div>

        {/* Опубликован */}
        <div className="flex items-center gap-2">
          <input
            id="is_published"
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4"
            style={{ accentColor: INK }}
          />
          <label htmlFor="is_published" className="text-[14px]" style={{ color: INK }}>
            Опубликован
          </label>
        </div>

        {error && (
          <p
            className="px-3 py-2 text-[13px]"
            style={{ background: "rgba(199,42,0,0.08)", color: "#c72a00" }}
          >
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving || deleting}
            className="cart-pill px-6 py-2.5 text-[14px] text-white transition-colors disabled:opacity-50"
            style={{ background: INK, cursor: saving ? "default" : "pointer" }}
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
          <Link
            href="/admin/products"
            className="cart-pill px-6 py-2.5 text-[14px] border transition-colors"
            style={{ borderColor: HAIRLINE, color: INK }}
          >
            Отмена
          </Link>

          {props.mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="cart-pill ml-auto px-5 py-2.5 text-[14px] border transition-colors disabled:opacity-50"
              style={{ borderColor: "rgba(199,42,0,0.4)", color: "#c72a00", cursor: "pointer" }}
            >
              {deleting ? "Удаление…" : "Удалить"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
