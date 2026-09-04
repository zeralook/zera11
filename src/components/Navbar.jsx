import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Icon3D from "./Icon3D.jsx";

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
              <Icon3D name="search" size={42} />
            </button>
          </div>

          {/* المنتصف: اسم المتجر */}
          <Link to="/" className="brand-center">
            ZERA
          </Link>

          {/* أقصى اليمين: السلة + القائمة */}
          <div className="nav-right">
            <Link to="/cart" className="nav-icon-btn nav-cart" aria-label="السلة">
              <Icon3D name="bag" size={42} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <button className="nav-icon-btn nav-burger" onClick={() => setMenuOpen((v) => !v)} aria-label="القائمة">
              <Icon3D name={menuOpen ? "close" : "menu"} size={42} />
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
              <Icon3D name="search" size={38} className="search-form-ic" />
              <input type="text" placeholder="ابحثي عن منتج..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} autoFocus />
              <button type="button" className="search-close-3d" onClick={() => setSearchOpen(false)} aria-label="إغلاق البحث"><Icon3D name="close" size={36} /></button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
