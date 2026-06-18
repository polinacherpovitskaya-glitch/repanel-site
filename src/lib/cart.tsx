"use client";

// Корзина RePanel — перенесена из Recycle Object (lib/cart.tsx).
// Чисто клиентская: состояние + localStorage. Серверная сверка цен — в роуте оплаты.
// Сюда же вынесено open-состояние выезжающего drawer (кнопка в шапке → openCart).
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  quantity: number;
  color?: string;
  production_time?: string | null;
  weight_grams?: number;
  custom_details?: string;
  /** Сертификат: при оплате вебхук выпустит подарочный сертификат. */
  certificate_payload?: {
    amount: number;
    recipient_name: string;
    recipient_email: string;
    message?: string;
    purchaser_name?: string;
    purchaser_email?: string;
  };
  /** Набор образцов: тариф + выбранные цвета. */
  sample_kit_payload?: {
    count: 6 | 9 | 12;
    color_ids: string[];
    colors: string[];
  };
}

/** Применённый сертификат или промокод (для checkout). */
export interface AppliedCode {
  code: string;
  type: "certificate" | "promo";
  discount_amount: number;
  display: string;
  balance?: number;
  discount_type?: "percent" | "fixed" | "free_shipping";
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string, color?: string) => void;
  updateQty: (id: string, color: string | undefined, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;

  /** Выезжающий drawer. */
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  appliedCode: AppliedCode | null;
  setAppliedCode: (code: AppliedCode | null) => void;
  clearAppliedCode: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "repanel_cart";
const APPLIED_CODE_KEY = "repanel_applied_code";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCode, setAppliedCodeState] = useState<AppliedCode | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setItems(JSON.parse(saved) as CartItem[]);
    } catch {}
    try {
      const savedCode = localStorage.getItem(APPLIED_CODE_KEY);
      if (savedCode) setAppliedCodeState(JSON.parse(savedCode) as AppliedCode);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (appliedCode) localStorage.setItem(APPLIED_CODE_KEY, JSON.stringify(appliedCode));
    else localStorage.removeItem(APPLIED_CODE_KEY);
  }, [appliedCode, hydrated]);

  // Блокируем скролл body, пока drawer открыт.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const addItem = (item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.color === item.color);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.color === item.color ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem = (id: string, color?: string) =>
    setItems((prev) => prev.filter((i) => !(i.id === id && i.color === color)));

  const updateQty = (id: string, color: string | undefined, qty: number) => {
    if (qty <= 0) {
      removeItem(id, color);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id && i.color === color ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCodeState(null);
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        total,
        count,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        appliedCode,
        setAppliedCode: setAppliedCodeState,
        clearAppliedCode: () => setAppliedCodeState(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
