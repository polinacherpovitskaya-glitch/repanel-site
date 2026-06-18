"use client";

// Выезжающая корзина — перенесена из Recycle Object (Navbar drawer), шрифты RePanel.
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";

const BODY = "'Gramatika', sans-serif";

type Upsell = { id: string; title: string; price: number; image_url?: string | null };

export function CartDrawer() {
  const { items, total, isOpen, closeCart, updateQty, removeItem, addItem } = useCart();
  const [isMobile, setIsMobile] = useState(false);
  const [upsell, setUpsell] = useState<Upsell[]>([]);
  const [upsellIdx, setUpsellIdx] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  // Апселл «вам также может понравиться» — из опубликованных товаров.
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const cartIds = items.map((i) => i.id);
      const { data } = await supabase
        .from("products")
        .select("id, title, price, image_url")
        .eq("is_published", true)
        .limit(30);
      if (!data || data.length === 0) {
        setUpsell([]);
        return;
      }
      const filtered = (data as Upsell[]).filter((p) => !cartIds.includes(p.id));
      setUpsell(filtered.sort(() => 0.5 - Math.random()).slice(0, 3));
      setUpsellIdx(0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;
  const PHOTO = isMobile ? 140 : 190;
  const UPSELL = isMobile ? 110 : 130;

  return (
    <div className="fixed inset-0 z-[999]" onClick={closeCart} style={{ fontFamily: BODY }}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="absolute top-0 right-0 h-full flex flex-col bg-white border-l border-[#171513] cart-drawer-animate"
        style={{ width: isMobile ? "100vw" : "min(560px, 95vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeCart}
          className="absolute z-10 text-[14px] font-bold text-[#171513] cursor-pointer hover:opacity-50 transition-opacity"
          style={{ top: 24, right: 24, fontFamily: BODY }}
        >
          Закрыть
        </button>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#171513" strokeWidth="1.5" opacity={0.15}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-[14px] text-[#171513]/40 text-center" style={{ fontFamily: BODY }}>Корзина пуста</p>
            <Link
              href="/catalog"
              onClick={closeCart}
              className="text-[13px] font-bold text-[#171513] underline underline-offset-4 hover:opacity-60 transition-opacity"
              style={{ fontFamily: BODY }}
            >
              Перейти в магазин →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div style={{ height: 56 }} />

              {items.map((item, idx) => (
                <div key={item.id + (item.color ?? "")}>
                  {idx > 0 && <div className="mx-6 border-t border-[#171513]/10" />}
                  <div className="flex gap-5 px-6 py-4">
                    <div className="flex-shrink-0 bg-[#F5F5F3] overflow-hidden" style={{ width: PHOTO, height: PHOTO }}>
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden" style={{ height: PHOTO }}>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-bold text-[#171513] leading-snug line-clamp-2" style={{ fontFamily: BODY }}>
                            {item.title}
                          </p>
                          <p className="text-[14px] text-[#171513] mt-0.5" style={{ fontFamily: BODY }}>
                            {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <button
                            onClick={() => updateQty(item.id, item.color, item.quantity - 1)}
                            className="text-[15px] text-[#171513] cursor-pointer hover:opacity-40 transition-opacity w-4 text-center leading-none"
                          >
                            −
                          </button>
                          <span className="text-[14px] text-[#171513] min-w-[16px] text-center" style={{ fontFamily: BODY }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.color, item.quantity + 1)}
                            className="text-[15px] text-[#171513] cursor-pointer hover:opacity-40 transition-opacity w-4 text-center leading-none"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-end justify-between gap-2">
                        <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
                          {item.color && (
                            <span className="text-[13px] font-bold text-[#171513]/40 line-clamp-2" style={{ fontFamily: BODY }}>
                              {item.color}
                            </span>
                          )}
                          {item.production_time && (
                            <span className="text-[12px] text-[#171513]/40 truncate" style={{ fontFamily: BODY }}>
                              {item.production_time}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.color)}
                          className="text-[13px] font-bold text-[#171513]/40 underline underline-offset-2 cursor-pointer hover:text-[#171513] transition-colors flex-shrink-0"
                          style={{ fontFamily: BODY }}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ height: 12 }} />
              <div className="mx-6 border-b border-[#171513]" />

              {upsell.length > 0 &&
                (() => {
                  const u = upsell[upsellIdx];
                  return (
                    <div className="px-6 py-5">
                      <p className="text-[15px] font-bold text-[#171513] mb-4" style={{ fontFamily: BODY }}>
                        Вам также может понравиться
                      </p>
                      <div className="flex gap-4" style={{ minHeight: UPSELL }}>
                        <div className="flex-1 flex flex-col justify-center min-w-0 gap-1">
                          <p className="text-[14px] font-bold text-[#171513] leading-snug line-clamp-2" style={{ fontFamily: BODY }}>
                            {u.title}
                          </p>
                          <p className="text-[13px] text-[#171513]" style={{ fontFamily: BODY }}>
                            {u.price.toLocaleString("ru-RU")} ₽
                          </p>
                          <div className="flex flex-col gap-2 mt-2">
                            <button
                              onClick={() => addItem({ id: u.id, title: u.title, price: u.price, image_url: u.image_url ?? null })}
                              className="cart-pill px-3 py-1.5 bg-[#171513] text-white font-bold text-[11px] cursor-pointer hover:bg-[#2c2a28] transition-colors whitespace-nowrap self-start"
                              style={{ fontFamily: BODY }}
                            >
                              Добавить в корзину
                            </button>
                            <Link
                              href={`/catalog/${u.id}`}
                              onClick={closeCart}
                              className="text-[12px] font-bold text-[#171513] cursor-pointer hover:opacity-60 transition-opacity whitespace-nowrap self-start"
                              style={{ fontFamily: BODY }}
                            >
                              Узнать ещё
                            </Link>
                          </div>
                        </div>
                        <div className="flex-shrink-0 bg-[#F5F5F3] overflow-hidden" style={{ width: UPSELL, height: UPSELL }}>
                          {u.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.image_url} alt={u.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full" />
                          )}
                        </div>
                      </div>
                      <div className="border-b border-[#171513] mt-5" />
                      {upsell.length > 1 && (
                        <div className="flex justify-center gap-3 mt-5">
                          {upsell.map((_, i) => (
                            <button key={i} onClick={() => setUpsellIdx(i)} className="cursor-pointer flex items-center justify-center" aria-label={`Товар ${i + 1}`}>
                              <div
                                className="cart-dot"
                                style={{
                                  width: 11,
                                  height: 11,
                                  border: "1.5px solid #171513",
                                  backgroundColor: i === upsellIdx ? "#171513" : "transparent",
                                  transition: "background-color 0.2s",
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
            </div>

            <div className="flex-shrink-0 px-5 pb-6 pt-4">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="cart-pill flex items-center justify-center gap-3 w-full py-[11px] bg-[#171513] text-white hover:bg-[#2c2a28] transition-colors"
                style={{ fontFamily: BODY }}
              >
                <span className="text-[14px] font-bold">Перейти к оформлению</span>
                <span className="text-[14px]">{total.toLocaleString("ru-RU")} ₽</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
