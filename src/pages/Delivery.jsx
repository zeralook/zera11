import PageHead from "../components/PageHead.jsx";

export default function Delivery() {
  return (
    <>
      <PageHead title="التوصيل" crumb="الرئيسية / التوصيل" />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><span className="section-tag">نوصلك أينما كنتِ</span><h2>توصيل لجميع محافظات العراق</h2></div>
          </div>
          <table className="delivery-table">
            <thead><tr><th>المنطقة</th><th>أجور التوصيل</th><th>المدة التقريبية</th></tr></thead>
            <tbody>
              <tr><td>داخل كربلاء</td><td>3,000 د.ع</td><td>12 ساعة</td></tr>
              <tr><td>بقية محافظات العراق</td><td>5,000 د.ع</td><td>12 - 24 ساعة</td></tr>
            </tbody>
          </table>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: 60 }}>
            <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 12px 30px rgba(0,0,0,0.12)', textAlign: 'center', border: '1px solid rgba(245,234,215,0.8)' }}>
              <div className="ic" style={{ fontSize: '28px', marginBottom: '10px' }}>💵</div>
              <h4 style={{ color: '#0d1929' }}>الدفع عند الاستلام</h4>
              <p style={{ color: "#6b5f52", fontSize: 14, marginTop: 8 }}>ادفعي عند وصول طلبك لباب بيتك</p>
            </div>
            <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 12px 30px rgba(0,0,0,0.12)', textAlign: 'center', border: '1px solid rgba(245,234,215,0.8)' }}>
              <div className="ic" style={{ fontSize: '28px', marginBottom: '10px' }}>📦</div>
              <h4 style={{ color: '#0d1929' }}>تغليف آمن</h4>
              <p style={{ color: "#6b5f52", fontSize: 14, marginTop: 8 }}>كل طلب يُغلّف بعناية لضمان وصوله سليمًا</p>
            </div>
            <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 12px 30px rgba(0,0,0,0.12)', textAlign: 'center', border: '1px solid rgba(245,234,215,0.8)' }}>
              <div className="ic" style={{ fontSize: '28px', marginBottom: '10px' }}>🔄</div>
              <h4 style={{ color: '#0d1929' }}>إمكانية الاستبدال</h4>
              <p style={{ color: "#6b5f52", fontSize: 14, marginTop: 8 }}>تواصلي معنا خلال 48 ساعة لأي استفسار</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

