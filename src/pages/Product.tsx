import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatPrice } from "../store";
import { useProduct } from "../products.jsx";
import { useCart } from "../hooks.js";
import { useReviewStats } from "../useReviewStats.js";
import PageHead from "../components/PageHead.jsx";
import StarRating from "../components/StarRating.jsx";
import ReviewsSection from "../components/ReviewsSection.jsx";

export default function Product() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const { product, loading } = useProduct(id);
  const { addToCart } = useCart();
  const { avg, count } = useReviewStats(id);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setSelectedColor(0);
    setSelectedSize(0);
    setQty(1);
  }, [id]);

  if (loading && !product) return (
    <PageHead title="جاري التحميل" crumb="الرئيسية / المتجر / ...">
      <section className="section" style={{ paddingTop: 60 }}>
        <p style={{ textAlign: "center" }}>جاري تحميل المنتج...</p>
      </section>
    </PageHead>
  );

  if (!product) return (
    <PageHead title="المنتج غير موجود" crumb="الرئيسية / المتجر / غير موجود">
      <section className="section" style={{ paddingTop: 60 }}>
        <p style={{ textAlign: "center" }}>👜 لم يتم العثور على هذا المنتج</p>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/shop">العودة للمتجر</Link>
        </div>
      </section>
    </PageHead>
  );

  const currentColor = product.colors?.[selectedColor];
  const colorImage = currentColor && product.colorImages?.[currentColor];
  
  // الصورة الرئيسية = صورة اللون المختار إذا موجودة، وإلا الصورة الأولى
  const displayImage = colorImage || product.image;
  const outOfStock = product.stock <= 0;

  return (
    <PageHead title={product.name} crumb={`الرئيسية / المتجر / ${product.name}`}>
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="product-layout">

          {/* الصورة الرئيسية */}
          <div className="product-gallery">
            <img src={displayImage} alt={product.name} className="product-main-img" />

            {/* دوائر الألوان تحت الصورة الكبيرة */}
            {product.colors?.length > 0 && (
              <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:12, flexWrap:'wrap' }}>
                {product.colors.map((c, i) => (
                  <button
                    key={c + i}
                    title={c}
                    style={{
                      background: c,
                      width: 38, height: 38,
                      borderRadius: '50%',
                      border: selectedColor === i ? '3px solid var(--navy)' : '2px solid #ccc',
                      boxShadow: selectedColor === i ? '0 0 0 2px var(--navy)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      padding: 0
                    }}
                    onClick={() => setSelectedColor(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* التفاصيل */}
          <div className="product-info">

            {/* اسم الشركة */}
            {product.brand && (
              <p className="product-brand" style={{ fontSize: 13, color: '#8a7f72', marginBottom: 4 }}>
                {product.brand}
              </p>
            )}

            <p className="product-category">{product.category}</p>
            <h1 className="product-name">{product.name}</h1>

            {count > 0 && (
              <div className="product-rating">
                <StarRating value={avg} />
                <span>({count} تقييم)</span>
              </div>
            )}

            <div className="product-price">
              <span className="price-main">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="price-old">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            <p className="product-desc">{product.desc}</p>

            {outOfStock && <p className="out-of-stock">نفذت الكمية</p>}

            {/* المقاسات */}
            {product.sizes?.length > 0 && (
              <div className="product-sizes">
                <p>المقاس</p>
                <div className="sizes-row">
                  {product.sizes.map((s, i) => (
                    <button
                      key={s + i}
                      className={`size-btn${selectedSize === i ? " active" : ""}`}
                      onClick={() => setSelectedSize(i)}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* الكمية */}
            <div className="product-qty">
              <p>الكمية</p>
              <div className="qty-row">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  disabled={outOfStock || qty >= product.stock}
                >+</button>
              </div>
            </div>

            <button
              className="btn-primary add-to-cart"
              disabled={outOfStock}
              onClick={() => addToCart(
                product.id, qty,
                product.colors?.[selectedColor] || null,
                product.sizes?.[selectedSize] || null
              )}
            >
              {outOfStock ? "غير متوفر" : "أضيفي إلى السلة"}
            </button>

            <Link to="/cart" className="btn-secondary">السلة</Link>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <h2>آراء العميلات</h2>
          <ReviewsSection productId={id} />
        </div>
      </section>
    </PageHead>
  );
}
