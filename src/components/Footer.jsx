import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="footer-brand">ZERA</span>
            <p>علامة عراقية للجنط والمنتجات النسائية الفاخرة، بتصاميم أنيقة وتوصيل لجميع المحافظات.</p>
          </div>
          <div>
            <h5>تسوقي</h5>
            <ul>
              <li><Link to="/shop?cat=جنط">جنط</Link></li>
              <li><Link to="/shop?cat=جديدنا">جديدنا</Link></li>
              <li><Link to="/shop?cat=الأكثر مبيعًا">الأكثر مبيعًا</Link></li>
              <li><Link to="/shop?cat=عروض">عروض</Link></li>
            </ul>
          </div>
          <div>
            <h5>الشركة</h5>
            <ul>
              <li><Link to="/about">من نحن</Link></li>
              <li><Link to="/delivery">التوصيل</Link></li>
              <li><Link to="/contact">تواصل معنا</Link></li>
            </ul>
          </div>
          <div>
            <h5>تابعينا</h5>
            <ul>
              <li><a href="https://instagram.com/zeralook" target="_blank" rel="noreferrer">إنستغرام</a></li>
              <li><a href="https://wa.me/9647881157778" target="_blank" rel="noreferrer">واتساب</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ZERA. جميع الحقوق محفوظة.</span>
          <span>صُنع بعناية في العراق</span>
          <Link to="/zain" aria-label="admin" style={{ color: "transparent", fontSize: 1, opacity: 0, pointerEvents: "auto" }}>·</Link>
        </div>
      </div>
    </footer>
  );
}
