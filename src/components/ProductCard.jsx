import { Link } from "react-router-dom";
import { formatPrice, bagIcon } from "../store";
import { useReviewStats } from "../useReviewStats.js";
import StarRating from "./StarRating.jsx";

export default function ProductCard({ product }) {
  const { avg, count } = useReviewStats(product.id);

  return (
    <Link to={`/product?id=${product.id}`} className="product-card">
      <div className="product-thumb">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: bagIcon("#0D1929") }} />
        )}
      </div>
      <div className="product-info">
        <h4>{product.name}</h4>
        {count > 0 && (
          <div className="product-review">
            <StarRating rating={avg} size={13} showNumber />
          </div>
        )}
        <div className="product-price">
          {formatPrice(product.price)}
          {product.oldPrice && <span className="old">{formatPrice(product.oldPrice)}</span>}
        </div>
        <div className="product-colors">
          {product.colors.map((c) => (
            <span key={c} className="dot" style={{ background: c }} />
          ))}
        </div>
      </div>
    </Link>
  );
}
