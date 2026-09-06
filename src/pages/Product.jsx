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
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    setSelectedColor(null);
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

  const currentColor = selectedColor !== null ? product.colors?.[selectedColor] : null;
  const colorImage = currentColor ? product.colorImages?.[currentColor] : null;
  const generalImages = (product.images?.length ? product.images : product.image ? [product.image] : []).filter(Boolean);

  // الصورة الرئيسية
  const displayImage = colorImage || generalImages[activeThumb] || product.image;
  const outOfStock = product.stock <= 0;

  const prevImage = () => {
    if (colorImage) return;
    setActiveThumb(i => (i - 1 + generalImages.length) % generalImages.length);
  };

  const nextImage = () => {
    if (colorImage) return;
    setActiveThumb(i => (i + 1) % generalImages.length);
  };

  const handleColorSelect = (i) => {
    setSelectedColor(prev => prev === i ? null : i); // toggle
    setActiveThumb(0);
  };

  return (
    <PageHead title={product.name} crumb={`الرئيسية / المتجر / ${product.name}`}>
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="product-layout">

          {/* الصور */}
          <div className="product-gallery">
            <div style={{ position: 'relative' }}>
              <img src={displayImage} alt={product.name} className="product-main-img" />

              {/* أسهم يمين ويسار — تطلع بس لما ما في لون مختار وعدد الصور أكثر من واحد */}
              {!colorImage && generalImages.length > 1 && (
                <>
                  <button onClick={prevImage} style={{
                    position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                    background:'rgba(255,255,255,0.85)', border:'none', borderRadius:'50%',
                    width:40, height:40, fontSize:20, cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
                    display:'flex', alignItems:'center', justifyContent:'center'
                  }}>‹</button>
                  <button onClick={nextImage} style={{
                    position:'absolute', left:10, top:'50%', transform:'translateY(-50%)',
                    background:'rgba(255,255,255,0.85)', border:'none', borderRadius:'50%',
                    width:40, height:40, fontSize:20, cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
                    display:'flex', alignItems:'center', justifyContent:'center'
                  }}>›</button>
                </>
              )}
            </div>

            {/* نقاط الصور */}
            {!colorImage && generalImages.length > 1 && (
              <div style={{ display:'flex', gap:6, justifyContent:'center', marginTop:10 }}>
                {generalImages.map((_, i) => (
                  <button key={i} onClick={() => setActiveThumb(i)} style={{
                    width: activeThumb === i ? 20 : 8,
                    height: 8, borderRadius: 4,
                    background: activeThumb === i ? 'var(--navy)' : '#ccc',
                    border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0
                  }}/>
                ))}
              </div>
            )}

            {/* دوائر الألوان */}
            {product.colors?.length > 0 && (
              <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:14, flexWrap:'wrap' }}>
                {product.colors.map((c, i) => (
                  <button key={c + i} title={c}
                    style={{
                      background: c, width:38, height:38, borderRadius:'50%',
                      border: selectedColor === i ? '3px solid var(--navy)' : '2px solid #ccc',
                      boxShadow: selectedColor === i ? '0 0 0 2px var(--navy)' : 'none',
                      cursor:'pointer', transition:'all 0.2s', padding:0
                    }}
                    onClick={() => handleColorSelect(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* التفاصيل */}
          <div className="product-info">
            {product.brand && <p className="product-brand" style={{ fontSize:13, color:'#8a7f72', marginBottom:4 }}>{product.brand}</p>}
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
              {product.oldPrice && <span className="price-old">{formatPrice(product.oldPrice)}</span>}
            </div>

            <p className="product-desc">{product.desc}</p>
            {outOfStock && <p className="out-of-stock">نفذت الكمية</p>}

            {product.sizes?.length > 0 && (
              <div className="product-sizes">
                <p>المقاس</p>
                <div className="sizes-row">
                  {product.sizes.map((s, i) => (
                    <button key={s+i} className={`size-btn${selectedSize===i?" active":""}`} onClick={()=>setSelectedSize(i)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-qty">
              <p>الكمية</p>
              <div className="qty-row">
                <button onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
                <span>{qty}</span>
                <button onClick={()=>setQty(q=>Math.min(product.stock,q+1))} disabled={outOfStock||qty>=product.stock}>+</button>
              </div>
            </div>

            <button className="btn-primary add-to-cart" disabled={outOfStock}
              onClick={()=>addToCart(product.id,qty,(selectedColor!==null?product.colors?.[selectedColor]:null),product.sizes?.[selectedSize]||null)}>
              {outOfStock?"غير متوفر":"أضيفي إلى السلة"}
            </button>

            <Link to="/cart" className="btn-secondary">السلة</Link>
          </div>
        </div>

        <div style={{ marginTop:48 }}>
          <h2>آراء العميلات</h2>
          <ReviewsSection productId={id} />
        </div>
      </section>
    </PageHead>
  );
}
