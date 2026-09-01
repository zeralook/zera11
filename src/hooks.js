import { useState, useEffect, useCallback, useRef } from "react";

const CART_KEY = "zera_cart";
const CART_EVENT = "zera_cart_change";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useCart() {
  const [cart, setCart] = useState(readCart);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const sync = () => setCart(readCart());
    window.addEventListener("storage", sync);
    window.addEventListener(CART_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CART_EVENT, sync);
    };
  }, []);

  const persist = useCallback((next) => {
    setCart(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CART_EVENT));
  }, []);

  const showToast = useCallback((text) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addToCart = useCallback((productId, qty = 1, color = null, size = null) => {
    const current = readCart();
    const existing = current.find(
      (i) => i.id === productId && i.color === color && i.size === size
    );
    if (existing) {
      existing.qty += qty;
    } else {
      current.push({ id: productId, qty, color, size });
    }
    persist(current);
    showToast("تمت إضافة المنتج إلى السلة ✓");
  }, [persist, showToast]);

  const removeFromCart = useCallback((index) => {
    const current = readCart();
    current.splice(index, 1);
    persist(current);
  }, [persist]);

  const updateCartQty = useCallback((index, qty) => {
    if (qty < 1) return;
    const current = readCart();
    current[index].qty = qty;
    persist(current);
  }, [persist]);

  const clearCart = useCallback(() => persist([]), [persist]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return { cart, cartCount, addToCart, removeFromCart, updateCartQty, clearCart, toast, showToast };
}

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-mask");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}
