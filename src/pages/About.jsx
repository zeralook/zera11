import PageHead from "../components/PageHead.jsx";

export default function About() {
  return (
    <>
      <PageHead title="من نحن" crumb="الرئيسية / من نحن" />
      <section className="section">
        <div className="container about-split">
          <div className="about-identity">
            <div className="about-identity-mono">Z</div>
            <div className="about-identity-name">ZERA</div>
            <div className="about-identity-tag">جنط نسائية فاخرة</div>
            <div className="about-identity-line" />
            <p className="about-identity-quote">
              "أناقة عراقية تُصمّم بعناية، لتصل إليكِ أينما كنتِ"
            </p>
          </div>
          <div>
            <span className="section-tag">قصتنا</span>
            <h2 style={{ marginBottom: 20 }}>ZERA — رفاهية بتوقيع عراقي</h2>
            <p style={{ color: "#4a4038", marginBottom: 18 }}>
              انطلقت ZERA من فكرة بسيطة: كل امرأة تستحق جنطة تعبّر عن ذوقها وتليق بكل مناسبة.
              نحرص على اختيار كل قطعة بعناية من حيث الخامة والتصميم، لنقدم تشكيلة تجمع بين
              الأناقة العصرية والجودة العالية بأسعار تناسب الجميع.
            </p>
            <p style={{ color: "#4a4038" }}>
              نوصل طلباتك أينما كنتِ في العراق، ونتابع كل طلب خطوة بخطوة حتى تصل الجنطة إلى بابك
              بأفضل حالة.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div className="section-head"><div><span className="section-tag">قيمنا</span><h2>لماذا ZERA؟</h2></div></div>
          <div className="value-cards">
            <div className="value-card"><div className="ic">✨</div><h4>جودة مختارة</h4><p style={{ color: "#6b5f52", fontSize: 14, marginTop: 8 }}>كل قطعة تمر بفحص دقيق قبل وصولها إليك</p></div>
            <div className="value-card"><div className="ic">🚚</div><h4>توصيل شامل</h4><p style={{ color: "#6b5f52", fontSize: 14, marginTop: 8 }}>نوصل لجميع محافظات العراق دون استثناء</p></div>
            <div className="value-card"><div className="ic">💬</div><h4>دعم مباشر</h4><p style={{ color: "#6b5f52", fontSize: 14, marginTop: 8 }}>تواصل سهل وسريع عبر واتساب وإنستغرام</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
