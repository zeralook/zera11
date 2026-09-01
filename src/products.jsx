import { useContext, createContext, useMemo, useState } from 'react';
import { DEFAULT_PRODUCTS } from './store.js';

const ProductsContext = createContext(null);

function normalize(row) {
  return {
    id: row.id, name: row.name, brand: row.brand || 'ZERA',
    category: row.category, price: Number(row.price),
    oldPrice: row.oldPrice == null ? null : Number(row.oldPrice),
    badge: row.badge || null, stock: Number(row.stock ?? 0),
    colors: Array.isArray(row.colors) ? row.colors : [],
    colorImages: row.colorImages || {},
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    image: row.image,
    images: Array.isArray(row.images) ? row.images : row.image ? [row.image] : [],
    desc: row.desc || '', featured: Boolean(row.featured)
  };
}

export function ProductsProvider({ children }) {
  const [products] = useState(() => DEFAULT_PRODUCTS.map(normalize));
  const value = useMemo(() => ({ products, loading: false, refresh: async () => products }), [products]);
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const c = useContext(ProductsContext);
  if (!c) throw new Error('useProducts must be used inside ProductsProvider');
  return c;
}

export function useProduct(id) {
  const { products, loading } = useProducts();
  return { product: products.find(p => p.id === id),
