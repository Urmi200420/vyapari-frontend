import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { categories, products } from "../data.js";

// If an image file is missing, hide the broken icon and show the label instead
const hideBroken = (e) => {
  e.currentTarget.style.display = "none";
};

export default function Home() {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const counts = useMemo(() => {
    const c = { all: products.length };
    products.forEach((p) => (c[p.category] = (c[p.category] || 0) + 1));
    return c;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (active === "all" || p.category === active) &&
        (!q || p.name.toLowerCase().includes(q))
    );
  }, [active, query]);

  const activeLabel = categories.find((c) => c.id === active)?.label;
  const circleCats = categories.filter((c) => c.id !== "all");

  const jumpToShop = () =>
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="shell">
      <Sidebar
        active={active}
        onSelect={setActive}
        counts={counts}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="main">
        {/* top bar tile */}
        <header className="topbar panel">
          <button className="menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            ☰
          </button>
          <input
            className="search"
            type="search"
            placeholder="Search products, brands and more"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ color: "#0F2A1D" }}
          />
          <nav className="top-links">
            
            <Link to="/seller">Sell on Vyapari</Link>
            
            <Link to="/login" className="btn btn-solid">
              Log in
            </Link>
          </nav>
        </header>

        {/* hero tile */}
        <section className="hero panel">
          <div className="hero-copy">
            <p className="eyebrow">Buy anything · Sell everything</p>
            <h1>
              <em>Everything you love </em>
              <strong>Vyapari</strong>
            </h1>
            <p className="hero-sub">
              Fresh produce, electronics, fashion and more from sellers you can trust. Look around
              freely and log in when you are ready.
            </p>
            <div className="hero-actions">
              <button className="btn btn-solid" onClick={jumpToShop}>
                Start browsing
              </button>
              <Link to="/seller" className="btn btn-ghost">
                Become a seller
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <b>{products.length}+</b>
                <span>Items</span>
              </div>
              <div>
                <b>{categories.length - 1}</b>
                <span>Categories</span>
              </div>
              <div>
                <b>1</b>
                <span>Marketplace</span>
              </div>
            </div>
          </div>

          <div className="stage" aria-hidden="true">
            <div className="stage-phone">
              <div className="stage-tilt">
                <div className="phone">
                  <div className="phone-screen">
                    <span className="ph-label">screen.jpg</span>
                    <img src="/stage/screen.jpg" alt="" onError={hideBroken} />
                  </div>
                </div>
              </div>
            </div>

            {[1, 2, 3, 4].map((n) => (
              <div key={n} className={"layer l" + n}>
                <div className="layer-card">
                  <span className="ph-label">{"layer" + n + ".jpg"}</span>
                  <img src={"/stage/layer" + n + ".jpg"} alt="" onError={hideBroken} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* category circles tile */}
        <section className="circles panel">
          <p className="eyebrow">Browse by category</p>
          <div className="circle-row">
            {circleCats.map((c) => (
              <button
                key={c.id}
                className={"circle" + (active === c.id ? " on" : "")}
                onClick={() => {
                  setActive(c.id);
                  jumpToShop();
                }}
              >
                <span className="circle-icon">{c.icon}</span>
                <span className="circle-name">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* products tile */}
        <section className="shop panel" id="shop">
          <div className="shop-head">
            <h2 className="stack-title">
              <em>Now showing</em>
              <strong>{activeLabel}</strong>
            </h2>
            <span className="pill">{visible.length} items</span>
          </div>

          {visible.length === 0 ? (
            <p className="empty">Nothing matches your search yet.</p>
          ) : (
            <div className="grid">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}