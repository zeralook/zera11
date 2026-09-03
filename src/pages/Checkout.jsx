import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { formatPrice, GOVERNORATES, getDeliveryFee, WHATSAPP_NUMBER } from '../store';
import { useProducts } from '../products.jsx';
import { useCart } from '../hooks.js';
import PageHead from '../components/PageHead.jsx';

function buildMessage(customer, cart, products, paymentMethod, total) {
  let msg = `*طلب جديد من ZERA*%0A%0A`;
  msg += `👤 الاسم: ${encodeURIComponent(customer.name)}%0A`;
  msg += `📞 الهاتف: ${encodeURIComponent(customer.phone)}%0A`;
  if (customer.phone2) msg += `📞 هاتف ثانٍ: ${encodeURIComponent(customer.phone2)}%0A`;
  msg += `📍 المحافظة: ${encodeURIComponent(customer.governorateName)}%0A`;
  msg += `🏘️ المنطقة: ${encodeURIComponent(customer.area)}%0A`;
  msg += `🏠 العنوان: ${encodeURIComponent(customer.address)}%0A`;
  if (customer.notes) msg += `📝 ملاحظات: ${encodeURIComponent(customer.notes)}%0A`;
  msg += `%0A*المنتجات:*%0A`;
  cart.forEach(i => {
    const p = products.find(x => x.id === i.id);
    if (p) msg += `- ${encodeURIComponent(p.name)} × ${i.qty} — ${formatPrice(p.price * i.qty)}%0A`;
  });
  msg += `%0A🚚 التوصيل: ${formatPrice(total - cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+(p?p.price*i.qty:0)},0))}%0A`;
  msg += `💰 *المجموع الكلي: ${formatPrice(total)}*%0A`;
  msg += `💳 طريقة الدفع: ${encodeURIComponent(paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'دفع إلكتروني')}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

export default function Checkout() {
  const { products } = useProducts();
  const { cart, clearCart } = useCart();
  const [gov, setGov] = useState('');
  const [payModal, setPayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);

  const find = id => products.find(p => p.id === id);
  const total = cart.reduce((s, i) => { const p = find(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
  const fee = gov ? (gov === 'كربلاء' ? getDeliveryFee('karbala') : getDeliveryFee('other')) : 0;
  const grandTotal = total + fee;

  const finalizeOrder = () => {
    setError('');
    if (!gov) return setError('اختاري المحافظة أولاً.');
    const fd = new FormData(formRef.current);
    const customer = {
      name: String(fd.get('name') || ''),
      phone: String(fd.get('phone') || ''),
      phone2: String(fd.get('phone2') || ''),
      governorateName: gov,
      area: String(fd.get('area') || ''),
      address: String(fd.get('address') || ''),
      notes: String(fd.get('notes') || ''),
    };
    const url = buildMessage(customer, cart, products, paymentMethod, grandTotal);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    setPayModal(false);
    clearCart();
  };

  if (!cart.length && !submitted) return (
    <PageHead title="إتمام الطلب" crumb="الرئيسية / السلة / إتمام الطلب">
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <div className="empty-state">
            <div className="ic">🛍️</div>
            <h3 style={{ marginBottom: 10 }}>سلتك فارغة</h3>
            <p style={{ marginBottom: 24 }}>أضيفي منتجات قبل إتمام الطلب</p>
            <Link to="/shop" className="btn btn-navy">تصفحي المتجر</Link>
          </div>
        </div>
      </section>
    </PageHead>
  );

  if (submitted) return (
    <PageHead title="تم إرسال الطلب" crumb="الرئيسية / إتمام الطلب">
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <div className="empty-state">
            <div className="ic" style={{ fontSize: 50 }}>✓</div>
            <h3 style={{ marginBottom: 10, color: 'var(--navy)' }}>تم تجهيز طلبك بنجاح!</h3>
            <p style={{ marginBottom: 24 }}>تم فتح واتساب لإرسال تفاصيل طلبك 🎉</p>
            <Link to="/" className="btn btn-navy">العودة للرئيسية</Link>
          </div>
        </div>
      </section>
    </PageHead>
  );

  return (
    <PageHead title="إتمام الطلب" crumb="الرئيسية / السلة / إتمام الطلب">
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <div className="checkout-layout">
            <div className="form-card">
              <div className="delivery-note">🚚 التوصيل متوفر لكل محافظات العراق — 3,000 د.ع داخل كربلاء، و5,000 د.ع لبقية المحافظات.</div>
              <form ref={formRef} onSubmit={e => { e.preventDefault(); setError(''); setPayModal(true); }}>
                <div className="field"><label>الاسم الكامل</label><input type="text" name="name" required maxLength={80} placeholder="مثال: زهراء أحمد" /></div>
                <div className="field-row">
                  <div className="field"><label>رقم الهاتف الأساسي</label><input type="tel" name="phone" required placeholder="07xxxxxxxxx" /></div>
                  <div className="field"><label>رقم الهاتف الثاني (اختياري)</label><input type="tel" name="phone2" placeholder="07xxxxxxxxx" /></div>
                </div>
                <div className="field">
                  <label>المحافظة</label>
                  <select value={gov} onChange={e => setGov(e.target.value)} required>
                    <option value="" disabled>اختاري المحافظة</option>
                    {GOVERNORATES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="field"><label>المنطقة</label><input type="text" name="area" required maxLength={100} /></div>
                <div className="field"><label>العنوان بالتفصيل</label><textarea name="address" rows={3} required maxLength={300} /></div>
                <div className="field"><label>ملاحظات (اختياري)</label><textarea name="notes" rows={2} maxLength={300} /></div>
                <button type="submit" className="btn btn-navy btn-block">إتمام الطلب</button>
              </form>
              {error && <p className="review-error" style={{ marginTop: 14 }}>{error}</p>}
            </div>

            <div className="cart-summary">
              <h3>ملخص الطلب</h3>
              {cart.map((i, k) => {
                const p = find(i.id);
                if (!p) return null;
                return <div key={k} className="sum-row"><span>{p.name} × {i.qty}</span><span>{formatPrice(p.price * i.qty)}</span></div>;
              })}
              <div className="sum-row"><span>المجموع الفرعي</span><span>{formatPrice(total)}</span></div>
              <div className="sum-row"><span>التوصيل</span><span>{gov ? formatPrice(fee) : 'اختاري المحافظة'}</span></div>
              <div className="sum-row total"><span>المجموع الكلي</span><span>{formatPrice(gov ? grandTotal : total)}</span></div>
            </div>
          </div>
        </div>
      </section>

      {payModal && (
        <div className="pay-modal-overlay" onClick={() => setPayModal(false)}>
          <div className="pay-modal" onClick={e => e.stopPropagation()}>
            {!paymentMethod ? (
              <>
                <h3 style={{ marginBottom: 8, color: 'var(--navy)' }}>اختاري طريقة الدفع</h3>
                <p style={{ fontSize: 13, color: '#8a7f72', marginBottom: 24 }}>المبلغ المطلوب: {formatPrice(grandTotal)}</p>
                <div className="pay-options">
                  <button className="pay-option" onClick={() => setPaymentMethod('cod')}>
                    <div className="pay-option-icon">💵</div>
                    <div className="pay-option-text"><h4>الدفع عند الاستلام</h4><span>ادفعي نقدًا عند وصول الطلب</span></div>
                  </button>
                  <button className="pay-option" onClick={() => setPaymentMethod('electronic')}>
                    <div className="pay-option-icon">💳</div>
                    <div className="pay-option-text"><h4>الدفع الإلكتروني</h4><span>زين كاش أو ماستر كارد</span></div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: 20, color: 'var(--navy)' }}>
                  {paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'الدفع الإلكتروني'}
                </h3>
                {paymentMethod === 'electronic' && (
                  <div className="pay-accounts">
                    <div className="pay-account-card">
                      <h5>زين كاش (ZainCash)</h5>
                      <div className="pay-account-number" onClick={() => navigator.clipboard?.writeText('9647881157778')}>
                        9647881157778 <span className="pay-copy-hint">اضغطي للنسخ</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, marginTop: 12, color: '#8a7f72' }}>بعد التحويل، أرسلي صورة الوصل عبر واتساب.</p>
                  </div>
                )}
                {paymentMethod === 'cod' && (
                  <p style={{ fontSize: 14, lineHeight: 1.8 }}>سيتم إرسال تفاصيل الطلب عبر واتساب، والدفع عند استلامه.</p>
                )}
                <button type="button" className="btn btn-navy btn-block" style={{ marginTop: 20 }} onClick={finalizeOrder}>
                  تأكيد وإرسال الطلب عبر واتساب
                </button>
                <button type="button" className="btn btn-outline-navy btn-block" style={{ marginTop: 12 }} onClick={() => setPaymentMethod(null)}>
                  تغيير طريقة الدفع
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </PageHead>
  );
}
