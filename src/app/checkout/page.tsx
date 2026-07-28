"use client";

// Checkout по образцу Recycle Object: контакты + доставка (СДЭК ПВЗ/курьер/самовывоз)
// + промокод/сертификат + сводка заказа. Шрифты RePanel. Корзина — из CartProvider.
import { useState, useEffect, useRef, useCallback, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { LEGAL } from "@/lib/legal";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

type DeliveryMethod = "cdek_pickup" | "cdek_courier" | "pickup";
const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  cdek_pickup: "СДЭК — до пункта выдачи",
  cdek_courier: "СДЭК — курьером до двери",
  pickup: "Самовывоз из Москвы",
};

const INPUT =
  "w-full border-0 border-b border-[#171513] bg-transparent pt-6 pb-2.5 text-[16px] text-[#171513] outline-none placeholder:text-[#171513]/40 transition-colors";

type Pvz = { code: string; name: string; address: string; workTime: string; lat: number | null; lng: number | null };
type City = { code: number; city: string; region: string };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, clearCart, appliedCode, setAppliedCode, clearAppliedCode } = useCart();

  const [delivery, setDelivery] = useState<DeliveryMethod>("cdek_pickup");
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", email: "", city: "", address: "", comment: "" });
  const [discountCode, setDiscountCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [validatingCode, setValidatingCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [personalDataConsent, setPersonalDataConsent] = useState(false);

  const [cdekCityCode, setCdekCityCode] = useState<number | null>(null);
  const [cdekCities, setCdekCities] = useState<City[]>([]);
  const [showCities, setShowCities] = useState(false);
  const [cdekPrices, setCdekPrices] = useState<{ pickup: number | null; courier: number | null; pickupDays: string; courierDays: string }>({ pickup: null, courier: null, pickupDays: "", courierDays: "" });
  const [loadingPrice, setLoadingPrice] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  const [pvzList, setPvzList] = useState<Pvz[]>([]);
  const [pvzSearch, setPvzSearch] = useState("");
  const [showPvz, setShowPvz] = useState(false);
  const [selectedPvz, setSelectedPvz] = useState<{ code: string; address: string } | null>(null);
  const pvzRef = useRef<HTMLDivElement>(null);

  const weightOf = useCallback(
    () => items.reduce((s, i) => s + i.quantity * (Number(i.weight_grams) > 0 ? Number(i.weight_grams) : 500), 0) || 500,
    [items],
  );

  // поиск городов СДЭК
  useEffect(() => {
    if (form.city.length < 2 || cdekCityCode) { setCdekCities([]); setShowCities(false); return; }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/cdek/cities?q=${encodeURIComponent(form.city)}`);
        const d = await r.json();
        if (Array.isArray(d) && d.length) { setCdekCities(d); setShowCities(true); }
        else { setCdekCities([]); setShowCities(false); }
      } catch { setCdekCities([]); setShowCities(false); }
    }, 250);
    return () => clearTimeout(t);
  }, [form.city, cdekCityCode]);

  // ПВЗ + расчёт цены при выбранном городе
  useEffect(() => {
    if (!cdekCityCode) { setPvzList([]); return; }
    fetch(`/api/cdek/pvz?city_code=${cdekCityCode}`).then((r) => r.json()).then((d) => { if (Array.isArray(d)) setPvzList(d); }).catch(() => setPvzList([]));
    (async () => {
      setLoadingPrice(true);
      const weight = weightOf();
      try {
        const [p, c] = await Promise.all([
          fetch("/api/cdek/calculate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toCityCode: cdekCityCode, weight, tariffCode: 136 }) }).then((r) => r.json()),
          fetch("/api/cdek/calculate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toCityCode: cdekCityCode, weight, tariffCode: 137 }) }).then((r) => r.json()),
        ]);
        setCdekPrices({ pickup: p.price ?? null, courier: c.price ?? null, pickupDays: p.deliveryDays ?? "", courierDays: c.deliveryDays ?? "" });
      } catch { setCdekPrices({ pickup: null, courier: null, pickupDays: "", courierDays: "" }); }
      setLoadingPrice(false);
    })();
  }, [cdekCityCode, weightOf]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCities(false);
      if (pvzRef.current && !pvzRef.current.contains(e.target as Node)) setShowPvz(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selectCity = (c: City) => {
    setForm((f) => ({ ...f, city: c.city, address: "" }));
    setShowCities(false);
    setSelectedPvz(null);
    setPvzSearch("");
    setCdekCityCode(c.code);
  };

  const filteredPvz = pvzSearch
    ? pvzList.filter((p) => p.address.toLowerCase().includes(pvzSearch.toLowerCase()) || p.name.toLowerCase().includes(pvzSearch.toLowerCase()))
    : pvzList;

  const deliveryPrice = delivery === "pickup" ? 0 : delivery === "cdek_pickup" ? cdekPrices.pickup ?? 0 : cdekPrices.courier ?? 0;
  const isFreeShipping = appliedCode?.type === "promo" && appliedCode.discount_type === "free_shipping";
  const effectiveDelivery = isFreeShipping ? 0 : deliveryPrice;
  const discountAmount = appliedCode && !isFreeShipping ? appliedCode.discount_amount : 0;
  const grandTotal = Math.max(0, total + effectiveDelivery - discountAmount);

  const applyCode = async () => {
    const code = discountCode.trim();
    if (!code) return;
    setValidatingCode(true);
    setCodeError(null);
    try {
      const r = await fetch("/api/codes/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, itemsTotal: total, shipping: deliveryPrice }) });
      const j = await r.json();
      if (!j.valid) { setCodeError(j.message ?? "Код не найден"); return; }
      setAppliedCode({ code: j.code, type: j.type, discount_amount: j.discount_amount, display: j.display, balance: j.balance, discount_type: j.discount_type });
      setDiscountCode("");
    } catch { setCodeError("Не удалось проверить код"); }
    finally { setValidatingCode(false); }
  };

  const set = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const isValid =
    form.first_name.trim() && form.last_name.trim() && form.phone.trim() && form.email.trim() &&
    personalDataConsent &&
    (delivery === "pickup" || (delivery === "cdek_pickup" && cdekCityCode && selectedPvz) || (delivery === "cdek_courier" && form.city.trim() && form.address.trim()));

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError("");
    try {
      const fullName = `${form.last_name} ${form.first_name}`.trim();
      const r = await fetch("/api/tochka-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items, total,
          delivery_method: DELIVERY_LABELS[delivery],
          delivery_key: delivery,
          carrier: delivery.startsWith("cdek") ? "cdek" : "self_pickup",
          delivery_price: deliveryPrice,
          grand_total: grandTotal,
          cdek_city_code: cdekCityCode ?? null,
          pvz_code: selectedPvz?.code ?? null,
          name: fullName, first_name: form.first_name, last_name: form.last_name,
          phone: form.phone, email: form.email,
          city: delivery === "pickup" ? "" : form.city,
          address: delivery === "pickup" ? "" : form.address,
          comment: form.comment,
          submitted_at: new Date().toISOString(),
          applied_code: appliedCode?.code ?? null,
          applied_code_type: appliedCode?.type ?? null,
          discount_amount: discountAmount,
          personal_data_consent: true,
          personal_data_consent_version: LEGAL.consentVersion,
          privacy_policy_version: LEGAL.policyVersion,
        }),
      });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.error ?? "Ошибка создания платежа");
      clearCart();
      if (j.paymentUrl) window.location.href = j.paymentUrl;
      else router.push(`/checkout/success?order=${j.orderId ?? ""}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка. Попробуйте ещё раз.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-5">
        <p className="text-[20px] font-bold text-[#171513]" style={{ fontFamily: BODY }}>Корзина пуста</p>
        <Link href="/catalog" className="text-[15px] font-bold text-[#171513] underline underline-offset-4" style={{ fontFamily: BODY }}>В магазин →</Link>
      </div>
    );
  }

  return (
    <section className="px-[var(--site-margins)] py-10 lg:py-14" style={{ fontFamily: BODY }}>
      <div className="mx-auto flex flex-col lg:flex-row gap-10 lg:gap-0" style={{ maxWidth: 1100 }}>
        {/* ── ЛЕВО: форма ── */}
        <div className="flex-1 lg:pr-14">
          <div className="w-full max-w-[520px]">
            <h2 className="text-[22px] font-bold text-[#171513] mb-1">Контакт</h2>
            <input type="text" placeholder="Имя *" value={form.first_name} onChange={set("first_name")} className={INPUT} style={{ fontFamily: BODY }} />
            <input type="text" placeholder="Фамилия *" value={form.last_name} onChange={set("last_name")} className={INPUT} style={{ fontFamily: BODY }} />
            <input type="tel" placeholder="Телефон *" value={form.phone} onChange={set("phone")} className={INPUT} style={{ fontFamily: BODY }} />
            <input type="email" placeholder="Email *" value={form.email} onChange={set("email")} className={INPUT} style={{ fontFamily: BODY }} />

            <h2 className="text-[22px] font-bold text-[#171513] mt-10 mb-4">Доставка</h2>
            <div className="flex flex-col gap-2">
              {(Object.keys(DELIVERY_LABELS) as DeliveryMethod[]).map((m) => {
                const price = m === "pickup" ? 0 : m === "cdek_pickup" ? cdekPrices.pickup : cdekPrices.courier;
                const days = m === "cdek_pickup" ? cdekPrices.pickupDays : m === "cdek_courier" ? cdekPrices.courierDays : "По договорённости";
                return (
                  <button key={m} onClick={() => setDelivery(m)} className="checkout-option flex items-center justify-between p-4 border text-left cursor-pointer transition-all" style={{ borderColor: delivery === m ? "#171513" : "rgba(23,21,19,0.15)" }}>
                    <div className="flex items-center gap-3">
                      <div className="checkout-radio w-4 h-4 flex-shrink-0 flex items-center justify-center border-2" style={{ borderColor: delivery === m ? "#171513" : "rgba(23,21,19,0.3)" }}>
                        {delivery === m && <div className="checkout-radio" style={{ width: 7, height: 7, backgroundColor: "#171513" }} />}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#171513]">{DELIVERY_LABELS[m]}</p>
                        <p className="text-[12px] text-[#171513]/45 mt-0.5">{days || (m.startsWith("cdek") && !cdekCityCode ? "Укажите город" : loadingPrice ? "Считаем…" : "")}</p>
                      </div>
                    </div>
                    <span className="text-[13px] font-bold text-[#171513] ml-4">
                      {m === "pickup" ? "Бесплатно" : price != null ? `${price.toLocaleString("ru-RU")} ₽` : m.startsWith("cdek") && !cdekCityCode ? "—" : loadingPrice ? "…" : "по тарифу"}
                    </span>
                  </button>
                );
              })}
            </div>

            {delivery !== "pickup" && (
              <div className="mt-1">
                <div ref={cityRef} className="relative">
                  <input type="text" placeholder="Город *" value={form.city} autoComplete="off"
                    onChange={(e) => { setForm((f) => ({ ...f, city: e.target.value, address: "" })); setCdekCityCode(null); setSelectedPvz(null); setCdekPrices({ pickup: null, courier: null, pickupDays: "", courierDays: "" }); }}
                    onFocus={() => { if (cdekCities.length && !cdekCityCode) setShowCities(true); }} className={INPUT} style={{ fontFamily: BODY }} />
                  {showCities && cdekCities.length > 0 && (
                    <div className="absolute left-0 right-0 top-full bg-white border border-[#EBEBEB] z-50 max-h-[200px] overflow-y-auto">
                      {cdekCities.map((c, i) => (
                        <button key={`${c.code}-${i}`} onClick={() => selectCity(c)} className="w-full text-left px-4 py-3 text-[14px] text-[#171513] hover:bg-[#F5F5F3] border-b border-[#EBEBEB] last:border-none cursor-pointer">
                          {c.city}<span className="text-[#171513]/40 ml-2">{c.region}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {delivery === "cdek_pickup" && cdekCityCode ? (
                  <div ref={pvzRef} className="relative">
                    <input type="text" placeholder={selectedPvz ? selectedPvz.address : "Поиск пункта выдачи…"} value={pvzSearch} autoComplete="off"
                      onChange={(e) => { setPvzSearch(e.target.value); setShowPvz(true); }} onFocus={() => setShowPvz(true)} className={INPUT} style={{ fontFamily: BODY }} />
                    {selectedPvz && !pvzSearch && <div className="text-[13px] text-[#171513] mt-1">{selectedPvz.address}</div>}
                    {showPvz && filteredPvz.length > 0 && (
                      <div className="absolute left-0 right-0 top-full bg-white border border-[#EBEBEB] z-50 max-h-[280px] overflow-y-auto">
                        {filteredPvz.slice(0, 40).map((p) => (
                          <button key={p.code} onClick={() => { setSelectedPvz({ code: p.code, address: p.address }); setForm((f) => ({ ...f, address: p.address })); setPvzSearch(""); setShowPvz(false); }} className="w-full text-left px-4 py-3 border-b border-[#EBEBEB] last:border-none cursor-pointer hover:bg-[#F5F5F3]">
                            <div className="text-[14px] text-[#171513]">{p.address}</div>
                            <div className="text-[12px] text-[#171513]/40 mt-0.5">{p.name}{p.workTime ? ` · ${p.workTime}` : ""}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : delivery === "cdek_pickup" && !cdekCityCode ? (
                  <div className="text-[13px] text-[#171513]/40 mt-2">Выберите город, чтобы увидеть пункты выдачи</div>
                ) : (
                  <input type="text" placeholder="Улица, дом, квартира *" value={form.address} onChange={set("address")} className={INPUT} style={{ fontFamily: BODY }} autoComplete="off" />
                )}
              </div>
            )}
            {delivery === "pickup" && (
              <p className="mt-3 text-[13px] text-[#171513]/50 leading-relaxed">Москва, по предварительной договорённости. Менеджер свяжется после заказа.</p>
            )}

            <h2 className="text-[22px] font-bold text-[#171513] mt-10 mb-4">Комментарий</h2>
            <textarea placeholder="Пожелания к заказу…" rows={4} value={form.comment} onChange={set("comment")} className="w-full border border-[#171513] p-3 text-[16px] bg-transparent outline-none resize-none placeholder:text-[#171513]/40" style={{ fontFamily: BODY }} />

            {error && <p className="text-[#b00020] text-[13px] mt-4 leading-relaxed">{error}</p>}

            <div className="mt-8">
              <label className="mb-5 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={personalDataConsent}
                  onChange={(e) => setPersonalDataConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0"
                  style={{ accentColor: "#171513" }}
                />
                <span className="text-[12px] leading-[1.5] text-[#171513]/65">
                  Я даю отдельное{" "}
                  <Link className="underline underline-offset-2" href="/personal-data-consent" target="_blank">
                    согласие на обработку персональных данных
                  </Link>{" "}
                  и ознакомился с{" "}
                  <Link className="underline underline-offset-2" href="/privacy" target="_blank">
                    Политикой
                  </Link>
                  .
                </span>
              </label>
              <button onClick={handleSubmit} disabled={!isValid || submitting} className="cart-pill w-full py-[14px] bg-[#171513] text-white font-bold text-[15px] cursor-pointer hover:bg-[#2c2a28] transition-colors disabled:opacity-35 disabled:cursor-not-allowed">
                {submitting ? "Создаём заказ…" : `Оплатить · ${grandTotal.toLocaleString("ru-RU")} ₽`}
              </button>
              <p className="text-center text-[12px] text-[#171513]/35 mt-3">Точка Банк · Карта или СБП</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-px bg-[#171513] self-stretch flex-shrink-0" />

        {/* ── ПРАВО: сводка ── */}
        <div className="flex-1 lg:pl-14 border-t border-[#171513] lg:border-t-0 pt-10 lg:pt-0">
          <div className="w-full max-w-[420px]">
            <div className="flex flex-col gap-5 mb-7">
              {items.map((item) => (
                <div key={item.id + (item.color ?? "")} className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="checkout-photo w-[62px] h-[62px] bg-[#F5F5F3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {item.image_url ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                    </div>
                    <div className="checkout-badge absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#171513] text-white text-[10px] font-bold flex items-center justify-center">{item.quantity}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#171513] leading-snug line-clamp-2">{item.title}</p>
                    {item.color && <p className="text-[12px] text-[#171513]/50 mt-0.5">{item.color}</p>}
                  </div>
                  <p className="text-[14px] text-[#171513] flex-shrink-0">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</p>
                </div>
              ))}
            </div>

            {appliedCode ? (
              <div className="mb-7 flex items-start gap-3 border border-[#171513] px-4 py-3">
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-[#171513] leading-tight">{appliedCode.display}</p>
                  {appliedCode.type === "certificate" && typeof appliedCode.balance === "number" && (
                    <p className="text-[11px] text-[#171513] opacity-60 mt-1">Баланс сертификата: {appliedCode.balance.toLocaleString("ru-RU")} ₽</p>
                  )}
                </div>
                <button type="button" onClick={() => { clearAppliedCode(); setCodeError(null); }} className="text-[12px] text-[#171513] opacity-60 hover:opacity-100">Убрать</button>
              </div>
            ) : (
              <div className="mb-7">
                <div className="flex gap-3">
                  <input type="text" placeholder="Код сертификата или промо" value={discountCode} onChange={(e) => { setDiscountCode(e.target.value); setCodeError(null); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void applyCode(); } }} className="checkout-apply flex-1 border border-[#171513]/30 bg-transparent px-4 py-3 text-[14px] text-[#171513] outline-none placeholder:text-[#171513]/30" style={{ fontFamily: BODY }} />
                  <button type="button" onClick={() => void applyCode()} disabled={validatingCode || !discountCode.trim()} className="checkout-apply px-5 py-3 bg-[#F0F0F0] text-[13px] font-bold text-[#171513] cursor-pointer hover:bg-[#E5E5E5] flex-shrink-0 disabled:opacity-50">{validatingCode ? "Проверяем…" : "Применить"}</button>
                </div>
                {codeError && <p className="text-[12px] text-[#C72A00] mt-2">{codeError}</p>}
              </div>
            )}

            <div className="flex flex-col gap-2.5 mb-5">
              <div className="flex justify-between"><span className="text-[13px] text-[#171513]">Товары ({count} шт)</span><span className="text-[13px] text-[#171513]">{total.toLocaleString("ru-RU")} ₽</span></div>
              <div className="flex justify-between"><span className="text-[13px] text-[#171513]">Доставка</span>
                <span className="text-[13px] text-[#171513]">{delivery === "pickup" ? "Бесплатно" : isFreeShipping && deliveryPrice > 0 ? <><span className="line-through opacity-40 mr-1">{deliveryPrice.toLocaleString("ru-RU")} ₽</span><span>0 ₽</span></> : deliveryPrice > 0 ? `${deliveryPrice.toLocaleString("ru-RU")} ₽` : loadingPrice ? "…" : "—"}</span>
              </div>
              {appliedCode && discountAmount > 0 && (
                <div className="flex justify-between"><span className="text-[13px] text-[#171513]">{appliedCode.display}</span><span className="text-[13px] text-[#171513]">−{discountAmount.toLocaleString("ru-RU")} ₽</span></div>
              )}
            </div>

            <div className="flex justify-between items-baseline mt-5 border-t border-[#171513] pt-5">
              <span className="text-[20px] font-bold text-[#171513]" style={{ fontFamily: DISPLAY }}>Итого</span>
              <span className="text-[22px] font-bold text-[#171513]" style={{ fontFamily: DISPLAY }}>{grandTotal.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
