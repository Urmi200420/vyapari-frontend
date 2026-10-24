import { useNavigate } from "react-router-dom";
import { formatPrice } from "../data.js";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // Guests can look but need an account to buy
  const requireLogin = () => navigate("/login?next=cart");

  return (
    <article className="card">
      {/* phone-frame look, like the mockups in the inspo */}
      <div className="phone">
        <div className="phone-screen">{product.emoji}</div>
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <div className="meta">
          <span className="price">{formatPrice(product.price)}</span>
          <span className="rating">
            <span className="stars">★</span> {product.rating.toFixed(1)}
          </span>
        </div>
        <button className="btn btn-solid block" onClick={requireLogin}>
          Add to cart
        </button>
      </div>
    </article>
  );
}