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
            product.colors[selectedColor] || null,
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
); }
