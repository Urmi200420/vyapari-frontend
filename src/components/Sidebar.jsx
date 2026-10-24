import { Link } from "react-router-dom";
import { categories } from "../data.js";

export default function Sidebar({ active, onSelect, counts, open, onClose }) {
  return (
    <>
      <div className={"scrim" + (open ? " show" : "")} onClick={onClose} />
      <aside className={"sidebar" + (open ? " open" : "")}>
        <div className="side-head">
          <span className="logo">Vyapari</span>
          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <p className="side-label">Shop by category</p>
        <nav className="cat-list">
          {categories.map((c) => (
            <button
              key={c.id}
              className={"cat" + (active === c.id ? " active" : "")}
              onClick={() => {
                onSelect(c.id);
                onClose();
              }}
            >
              <span className="cat-icon">{c.icon}</span>
              <span className="cat-name">{c.label}</span>
              <span className="cat-count">{counts[c.id] ?? 0}</span>
            </button>
          ))}
        </nav>

        <div className="side-foot">
          <p className="guest-tag">👤 Browsing as guest</p>
          <Link to="/login" className="btn btn-solid block">
            Log in
          </Link>
          <Link to="/login?mode=signup" className="btn btn-ghost block">
            Create account
          </Link>
        </div>

        

        

      </aside>
    </>
  );
}