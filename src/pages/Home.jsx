import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="hero-real">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1682745230951-8a5aa9a474a0?crop=entropy&cs=srgb&fm=jpg&q=80&w=1600"
            alt="ZERA"
            onLoad={() => setLoaded(true)}
          />
        </div>
        <div className="container">
          <div className="hero-eyebrow">جنط وأزياء نسائية فاخرة</div>
          <div className="reveal-mask in"><span className="hero-brand reveal-line">ZERA</span></div>
          <div className="hero-sub" style={{ marginTop: 18 }}>
            <div className="reveal-mask in"><h2 className="reveal-line">أناقتك تبدأ من هنا</h2></div>
            <div className="reveal-mask in"><p className="reveal-line">تشكيلة مختارة من الجنط الفاخرة بتصاميم عصرية، وتوصيل لجميع محافظات العراق.</p></div>
          </div>
          <div className="hero-actions" style={{ marginTop: 30, justifyContent: "center" }}>
            <Link to="/shop" className="btn btn-navy">تسوقي الآن</Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-strip">
        <div className="marquee-track">
          <span>ZERA <em>✦</em> تسوقي الآن <em>✦</em> أزياء فاخرة <em>✦</em> توصيل لكل المحافظات <em>✦</em> ZERA <em>✦</em> تسوقي الآن <em>✦</em> أزياء فاخرة <em>✦</em> توصيل لكل المحافظات <em>✦</em></span>
          <span aria-hidden="true">ZERA <em>✦</em> تسوقي الآن <em>✦</em> أزياء فاخرة <em>✦</em> توصيل لكل المحافظات <em>✦</em> ZERA <em>✦</em> تسوقي الآن <em>✦</em> أزياء فاخرة <em>✦</em> توصيل لكل المحافظات <em>✦</em></span>
        </div>
      </div>

      {/* Categories */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-head reveal">
            <div><span className="section-tag">تصفحي</span><h2>الأقسام</h2></div>
          </div>
          <div className="bento reveal">
            <Link to="/shop?cat=جنط" className="bento-card bento-c1">
              <img src="https://images.pexels.com/photos/7953286/pexels-photo-7953286.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="جنط" />
              <div className="bento-label"><h3>جنط</h3><span className="bento-arrow">→</span></div>
            </Link>
            <Link to="/shop?cat=جديدنا" className="bento-card bento-c2">
              <img src="https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?crop=entropy&cs=srgb&fm=jpg&q=80&w=900" alt="جديدنا" />
              <div className="bento-label"><h3>جديدنا</h3><span className="bento-arrow">→</span></div>
            </Link>
            <Link to="/shop?cat=الأكثر مبيعًا" className="bento-card bento-c3">
              <img src="https://images.unsplash.com/photo-1614179689702-355944cd0918?crop=entropy&cs=srgb&fm=jpg&q=80&w=900" alt="الأكثر مبيعًا" />
              <div className="bento-label"><h3>الأكثر مبيعًا</h3><span className="bento-arrow">→</span></div>
            </Link>
            <Link to="/shop?cat=عروض" className="bento-card bento-c4">
              <img src="https://images.unsplash.com/photo-1571513800374-df1bbe650e56?crop=entropy&cs=srgb&fm=jpg&q=80&w=900" alt="عروض" />
              <div className="bento-label"><h3>عروض</h3><span className="bento-arrow">→</span></div>
            </Link>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="section section-navy">
        <div className="container about-split">
          <div className="about-visual reveal">
            <img src="https://images.unsplash.com/photo-1571513800374-df1bbe650e56?crop=entropy&cs=srgb&fm=jpg&q=80&w=900" alt="ZERA" />
          </div>
          <div className="reveal">
            <span className="section-tag">من نحن</span>
            <h2 style={{ color: "#fff", marginBottom: 20 }}>قصة ZERA</h2>
            <p style={{ opacity: 0.8, marginBottom: 24, maxWidth: 520 }}>
              ZERA علامة عراقية متخصصة بالجنط والمنتجات النسائية الفاخرة، ولدت من شغف بالتفاصيل الأنيقة والرغبة
              بإيصال قطع مميزة لكل امرأة تبحث عن التميز في إطلالتها اليومية.
            </p>
            <Link to="/about" className="btn btn-outline">اقرأي المزيد</Link>
            <div className="stat-row">
              <div className="stat"><b style={{ color: "#fff" }}>+500</b><span style={{ color: "#F5EAD7", opacity: 0.6 }}>عميلة راضية</span></div>
              <div className="stat"><b style={{ color: "#fff" }}>18</b><span style={{ color: "#F5EAD7", opacity: 0.6 }}>محافظة نوصلها</span></div>
              <div className="stat"><b style={{ color: "#fff" }}>+40</b><span style={{ color: "#F5EAD7", opacity: 0.6 }}>موديل حصري</span></div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
