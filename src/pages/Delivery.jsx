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
              <tr><td>بقية محافظات العراق</td><td>5,000 د.ع</td><td>24 - 12 ساعة</td></tr>
            </tbody>
          </table>

          <div className="value-cards" style={{ marginTop: 60 }}>
            <div className="value-card"><div className="ic">💵</div><h4>الدفع عند الاستلام</h4><p style={{ color: "#6b5f52", fontSize: 14, marginTop: 8 }}>ادفعي عند وصول طلبك لباب بيتك</p></div>
            <div className="value-card"><div className="ic">📦</div><h4>تغليف آمن</h4><p style={{ color: "#6b5f52", fontSize: 14, marginTop: 8 }}>كل طلب يُغلّف بعناية لضمان وصوله سليمًا</p></div>
            <div className="value-card"><div className="ic">🔄</div><h4>إمكانية الاستبدال</h4><p style={{ color: "#6b5f52", fontSize: 14, marginTop: 8 }}>تواصلي معنا خلال 48 ساعة لأي استفسار</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
