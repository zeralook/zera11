import PageHead from "../components/PageHead.jsx";
import Icon3D from "../components/Icon3D.jsx";

export default function Contact() {
  return (
    <>
      <PageHead title="تواصل معنا" crumb="الرئيسية / تواصل معنا" />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><span className="section-tag">نحن هنا لخدمتك</span><h2>تواصلي معنا مباشرة</h2></div>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="ic"><Icon3D name="instagram" size={64} /></div>
              <h4>إنستغرام</h4>
              <p>تابعينا لآخر التشكيلات والعروض الحصرية</p>
              <a href="https://instagram.com/zeralook" target="_blank" rel="noreferrer" className="btn btn-navy btn-sm">zeralook@</a>
            </div>
            <div className="contact-card">
              <div className="ic"><Icon3D name="whatsapp" size={64} /></div>
              <h4>واتساب</h4>
              <p>للاستفسار عن المنتجات أو تتبع طلبك</p>
              <a href="https://wa.me/9647881157778" target="_blank" rel="noreferrer" className="btn btn-navy btn-sm">راسلينا الآن</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
