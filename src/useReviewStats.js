import { useState, useEffect } from 'react';

export function useReviewStats(productId) {
  const [stats, setStats] = useState({ avg: 0, count: 0 });

  useEffect(() => {
    try {
      const key = `zera_reviews_${productId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const reviews = JSON.parse(stored);
        if (reviews.length > 0) {
          const avg = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
          setStats({ avg: Math.round(avg * 10) / 10, count: reviews.length });
        }
      }
    } catch (e) {}
  }, [productId]);

  return stats;
}
