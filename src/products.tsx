import { useContext, createContext, useMemo, useState, useEffect, useCallback } from 'react';
import { api } from './api.js';

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const token = localStorage.getItem('zera_admin_token');
      const endpoint = token ? '/api/admin/products' : '/api/products';
      const data = await api(endpoint);
      setProducts(Array.isArray(data) ? data.map(normalize) : []);
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo(() => ({ products, loading, refresh }), [products, loading, refresh]);
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const c = useContext(ProductsContext);
  if (!c) throw new Error('useProducts must be used inside ProductsProvider');
  return c;
}

export function useProduct(id) {
  const { products, loading } = useProducts();
  return { product: products.find(p => p.id === id), loading };
}
