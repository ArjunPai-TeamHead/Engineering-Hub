import { useEffect, useState, useCallback } from "react";

const CART_KEY = "enginexus_cart";
const SAVED_KEY = "enginexus_saved_for_later";

type CartMap = Record<string, number>;

function read(key: string): CartMap {
  try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; }
}
function write(key: string, data: CartMap) {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: { key } }));
}

export function useCart() {
  const [cart, setCart] = useState<CartMap>(() => read(CART_KEY));
  const [saved, setSaved] = useState<CartMap>(() => read(SAVED_KEY));

  useEffect(() => {
    const sync = () => { setCart(read(CART_KEY)); setSaved(read(SAVED_KEY)); };
    window.addEventListener("cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addToCart = useCallback((id: string, qty = 1) => {
    const next = { ...read(CART_KEY) };
    next[id] = (next[id] || 0) + qty;
    write(CART_KEY, next);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const next = { ...read(CART_KEY) };
    if (qty <= 0) delete next[id]; else next[id] = qty;
    write(CART_KEY, next);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const next = { ...read(CART_KEY) };
    delete next[id];
    write(CART_KEY, next);
  }, []);

  const clearCart = useCallback(() => write(CART_KEY, {}), []);

  const saveForLater = useCallback((id: string) => {
    const c = { ...read(CART_KEY) };
    const s = { ...read(SAVED_KEY) };
    s[id] = c[id] || 1;
    delete c[id];
    write(CART_KEY, c);
    write(SAVED_KEY, s);
  }, []);

  const moveToCart = useCallback((id: string) => {
    const c = { ...read(CART_KEY) };
    const s = { ...read(SAVED_KEY) };
    c[id] = s[id] || 1;
    delete s[id];
    write(CART_KEY, c);
    write(SAVED_KEY, s);
  }, []);

  const removeSaved = useCallback((id: string) => {
    const s = { ...read(SAVED_KEY) };
    delete s[id];
    write(SAVED_KEY, s);
  }, []);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return { cart, saved, cartCount, addToCart, setQty, removeFromCart, clearCart, saveForLater, moveToCart, removeSaved };
}
