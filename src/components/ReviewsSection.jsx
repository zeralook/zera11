import { useState, useEffect, useCallback } from 'react';
import StarRating from './StarRating.jsx';
import ReviewForm from './ReviewForm.jsx';

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);

  const loadReviews = useCallback(() => {
    try {
      const key = `zera_reviews_${productId}`;
      const stored = localStorage.getItem(key);
      if (stored) setReviews(JSON.parse(stored));
      else setReviews([]);
    } catch { setReviews([]); }
  }, [productId]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const formatDate = d => new Date(d).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' });
  const dist = [5, 4, 3, 2, 1].map(star => ({ star, count: reviews.filter(r => r.rating === star).length }));

  return (
    <div className="reviews-section">
      <div className="reviews-summary">
        <div className="reviews-summary-main">
          <span className="reviews-avg">{avg.toFixed(1)}</span>
          <StarRating rating={avg} size={22} />
          <span className="reviews-total">بناءً على {reviews.length} تقييم</span>
        </div>
        <div className="reviews-dist">
          {dist.map(d => (
            <div key={d.star} className="dist-row">
              <span className="dist-star">{d.star} ★</span>
              <div className="dist-bar">
                <div className="dist-bar-fill" style={{ width: reviews.length ? `${d.count / reviews.length * 100}%` : '0%' }} />
              </div>
              <span className="dist-count">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="reviews-list">
        {!reviews.length
          ? <p className="reviews-empty">لا توجد تقييمات بعد. كوني أول من يقيّم هذا المنتج!</p>
          : reviews.map((r, i) => (
            <div key={i} className="review-item">
              <div className="review-item-head">
                <div className="review-avatar">{r.name.charAt(0)}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <StarRating rating={r.rating} size={14} />
                </div>
                <span className="review-date">{formatDate(r.created_at)}</span>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
      </div>
      <ReviewForm productId={productId} onSubmitted={loadReviews} />
    </div>
  );
}
