import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/shop", label: "المتجر" },
  { to: "/about", label: "من نحن" },
  { to: "/delivery", label: "التوصيل" },
  { to: "/contact", label: "تواصل معنا" },
];

export default function Navbar({ cartCount }) {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ("");
    }
  };

  return (
    <>
      <nav className={`nav ${solid ? "solid" : ""}`}>
        <div className="container nav-grid">
          {/* أقصى اليسار: البحث */}
          <div className="nav-left">
            <button className="nav-icon-btn" onClick={() => setSearchOpen((v) => !v)} aria-label="بحث">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          {/* المنتصف: اسم المتجر */}
          <Link to="/" className="brand-center">
            ZERA
          </Link>

          {/* أقصى اليمين: السلة + القائمة */}
          <div className="nav-right">
            <Link to="/cart" className="nav-icon-btn nav-cart" aria-label="السلة">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <button className="nav-icon-btn nav-burger" onClick={() => setMenuOpen((v) => !v)} aria-label="القائمة">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </div>

        {/* روابط سطح المكتب */}
        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* قائمة الجوال المنسدلة */}
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-inner" onClick={(e) => e.stopPropagation()}>
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link>
            ))}
          </div>
        </div>
      )}

      {/* شريط البحث المنبثق */}
      {searchOpen && (
        <div className="search-bar">
          <div className="container">
            <form onSubmit={submitSearch} className="search-form">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-form-ic">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="ابحثي عن منتج..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} autoFocus />
              <button type="button" onClick={() => setSearchOpen(false)}>✕</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
