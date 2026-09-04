import { useState } from 'react';

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="star-picker" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" className="star-picker-btn"
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`${n} نجوم`}>
          <svg className="star-3d" width="28" height="28" viewBox="0 0 24 24"
            fill={n <= display ? 'var(--gold)' : 'none'}
            stroke="var(--gold)" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm({ productId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (!rating) return setError('الرجاء اختيار عدد النجوم');
    if (!name.trim()) return setError('الرجاء كتابة اسمك');
    if (!comment.trim()) return setError('الرجاء كتابة تعليق');

    try {
      const key = `zera_reviews_${productId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ rating, name: name.trim(), comment: comment.trim(), created_at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
      setSuccess(true);
      setRating(0); setName(''); setComment('');
      onSubmitted();
      setTimeout(() => setSuccess(false), 3000);
    } catch { setError('حدث خطأ، حاولي مرة أخرى'); }
  };

  return (
    <div className="review-form-card">
      <h4>أضيفي تقييمك</h4>
      {success && <div className="review-success">شكراً لتقييمك! ✓</div>}
      <form onSubmit={handleSubmit}>
        <div className="field"><label>التقييم</label><StarPicker value={rating} onChange={setRating} /></div>
        <div className="field"><label>الاسم</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="اكتبي اسمك" maxLength={50} /></div>
        <div className="field"><label>التعليق</label><textarea rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="شاركينا رأيك في المنتج..." maxLength={300} /></div>
        {error && <p className="review-error">{error}</p>}
        <button type="submit" className="btn btn-navy btn-block">نشر التقييم</button>
      </form>
    </div>
  );
}
