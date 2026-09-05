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
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    setSelectedColor(0);
    setSelectedSize(0);
    setQty(1);
    setActiveThumb(0);
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
  
  // صورة اللون المختار
  const colorImage = currentColor && product.colorImages?.[currentColor];
  
  // لما في صورة للون — اعرض صورة اللون فقط
  // لما ما في صورة للون — اعرض الصور العامة
  const gallery = colorImage
    ? [colorImage]
    : (product.images?.length ? product.images : product.image ? [product.image] : []).filter(Boolean);

  const outOfStock = product.stock <= 0;

  const handleColorSelect = (i) => {
    setSelectedColor(i);
    setActiveThumb(0); // ترجع للصورة الأولى عند تغيير اللون
  };

  return (
    <PageHead title={product.name} crumb={`الرئيسية / المتجر / ${product.name}`}>
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="product-layout">

          {/* الصور */}
          <div className="product-gallery">
            <img
              src={gallery[activeThumb] || mainImage}
              alt={product.name}
              className="product-main-img"
            />
            {gallery.length > 1 && (
              <div className="product-thumbs">
                {gallery.map((src, i) => (
                  <img
                    key={src + i}
                    src={src}
                    alt=""
                    className={`product-thumb${activeThumb === i ? " active" : ""}`}
                    onClick={() => setActiveThumb(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* التفاصيل */}
          <div className="product-info">
            <p className="product-category">{product.category}</p>
            {product.brand && <p className="product-brand">{product.brand}</p>}
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

            {/* الألوان */}
            {product.colors?.length > 0 && (
              <div className="product-colors">
                <p>اللون {currentColor && (
                  <span style={{fontSize:12, color:'#8a7f72', marginRight:8}}>
                    {product.colorImages?.[currentColor] ? '✓ صورة خاصة' : ''}
                  </span>
                )}</p>
                <div className="colors-row">
                  {product.colors.map((c, i) => (
                    <button
                      key={c + i}
                      className={`color-swatch${selectedColor === i ? " active" : ""}`}
                      style={{ 
                        background: c,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: selectedColor === i ? '3px solid var(--navy)' : '2px solid transparent',
                        outline: selectedColor === i ? '2px solid var(--cream)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => handleColorSelect(i)}
                    />
                  ))}
                </div>
              </div>
            )}

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

            {/* أضيفي للسلة */}
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

        {/* التقييمات */}
        <div style={{ marginTop: 48 }}>
          <h2>آراء العميلات</h2>
          <ReviewsSection productId={id} />
        </div>
      </section>
    </PageHead>
  );
}
