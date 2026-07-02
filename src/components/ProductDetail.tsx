"use client";

// Клиентская карточка товара: галерея (главное фото + доп. фото + фото цветов),
// свотчи вариантов цвета (выбор меняет главное фото), «В корзину» с выбранным цветом.
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/supabase";

const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const BODY = "'Gramatika', sans-serif";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const colors = product.colors ?? [];
  const gallery = [product.image_url, ...(product.gallery_urls ?? [])].filter(Boolean) as string[];
  const colorImgs = colors.map((c) => c.image).filter(Boolean) as string[];
  const thumbs = Array.from(new Set([...gallery, ...colorImgs]));

  const [mainImg, setMainImg] = useState<string>(gallery[0] ?? colorImgs[0] ?? "");
  const [activeColor, setActiveColor] = useState<number | null>(null);

  const pickColor = (i: number) => {
    setActiveColor(i);
    const img = colors[i]?.image;
    if (img) setMainImg(img);
  };

  const dims = [product.length_cm, product.width_cm, product.height_cm];
  const sizeStr = dims.every((v) => v != null)
    ? `${dims[0]} × ${dims[1]} × ${dims[2]} см`
    : dims.some((v) => v != null)
      ? `${dims.filter((v) => v != null).join(" × ")} см`
      : null;

  const specs: [string, string][] = [];
  if (sizeStr) specs.push(["Размеры", sizeStr]);
  if (product.weight_grams != null) specs.push(["Вес", `${product.weight_grams} г`]);
  if (product.category) specs.push(["Категория", product.category]);

  const priceStr = `${product.price.toLocaleString("ru-RU")} ₽`;

  const add = () => {
    const colorName = activeColor != null ? colors[activeColor]?.name || undefined : undefined;
    addItem({ id: product.id, title: product.title, price: product.price, image_url: mainImg || product.image_url, color: colorName });
    openCart();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
      {/* Галерея */}
      <div>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1", background: "#EAEAE7", border: "1px solid rgba(23,21,19,0.1)" }}>
          {mainImg ? (
            <Image src={mainImg} alt={product.title} fill sizes="(min-width:768px) 45vw, 100vw" quality={95} className="object-contain" priority />
          ) : (
            <div className="flex items-center justify-center h-full" style={{ fontFamily: BODY, fontSize: 13, opacity: 0.3 }}>Фото изделия</div>
          )}
        </div>
        {thumbs.length > 1 && (
          <div className="grid grid-cols-5 gap-2 mt-2">
            {thumbs.map((t) => (
              <button
                key={t}
                onClick={() => setMainImg(t)}
                className="relative overflow-hidden cursor-pointer"
                style={{ aspectRatio: "1", border: mainImg === t ? "1.5px solid #171513" : "1px solid rgba(23,21,19,0.1)", background: "#EAEAE7" }}
                aria-label="Показать фото"
              >
                <Image src={t} alt="" fill sizes="120px" className="object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Инфо */}
      <div>
        <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px, 3.5vw, 52px)", letterSpacing: "-0.02em", lineHeight: 1.0 }}>{product.title}</h1>
        {product.category && <p className="mt-3 text-[#171513]" style={{ fontFamily: BODY, fontSize: "13px", opacity: 0.45 }}>{product.category}</p>}
        <p className="mt-4 font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(24px, 2.4vw, 34px)", letterSpacing: "-0.5px" }}>{priceStr}</p>
        {product.description && (
          <p className="mt-6 text-[#171513] max-w-[480px]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "20px", opacity: 0.8 }}>{product.description}</p>
        )}

        {/* Варианты цвета */}
        {colors.length > 0 && (
          <div className="mt-7">
            <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "13px" }}>
              <span style={{ opacity: 0.5 }}>Цвет</span>
              {activeColor != null && colors[activeColor]?.name && <span className="font-bold"> · {colors[activeColor].name}</span>}
            </p>
            <div className="flex flex-wrap gap-2.5 mt-2.5">
              {colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => pickColor(i)}
                  title={c.name}
                  className="cursor-pointer transition-transform hover:scale-110"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9999,
                    background: c.hex,
                    border: activeColor === i ? "2px solid #171513" : "1px solid rgba(23,21,19,0.25)",
                    boxShadow: activeColor === i ? "inset 0 0 0 2px #fff" : "none",
                  }}
                  aria-label={c.name || "Цвет"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Характеристики */}
        {specs.length > 0 && (
          <div className="mt-8">
            {specs.map(([label, val]) => (
              <div key={label} className="flex justify-between gap-4 border-t border-[#171513]/15 py-3" style={{ fontFamily: BODY, fontSize: "14px" }}>
                <span className="text-[#171513]" style={{ opacity: 0.5 }}>{label}</span>
                <span className="font-bold text-[#171513] text-right">{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button onClick={add} className="px-7 py-3.5 text-center transition-opacity hover:opacity-90 cursor-pointer" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "15px", background: "#171513", color: "#FFFFFF" }}>
            В корзину · {priceStr}
          </button>
          <Link href="/contacts" className="px-7 py-3.5 text-center transition-colors hover:bg-[#171513]/[0.04]" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "15px", border: "1px solid rgba(23,21,19,0.25)", color: "#171513" }}>
            Заказать партию →
          </Link>
        </div>
      </div>
    </div>
  );
}
