import { useSearchParams } from "react-router-dom";
import { useProducts } from "../products.jsx";
import ProductCard from "../components/ProductCard.jsx";
import PageHead from "../components/PageHead.jsx";

const CATS = ["الكل", "جنط", "جديدنا", "الأكثر مبيعًا", "عروض"];
export default function Shop() {
  const [params, setParams] = useSearchParams();
  const { products, loading } = useProducts();
  const activeCat = params.get("cat") || "الكل";
  const searchQ = params.get("q") || "";
  let list = products;
  if (activeCat !== "الكل") list = list.filter((p) => p.category === activeCat);
  if (searchQ) { const q = searchQ.toLowerCase(); list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.desc || "").toLowerCase().includes(q)); }
  return <><PageHead title="المتجر" crumb="الرئيسية / المتجر" /><section className="section" style={{ paddingTop: 60 }}><div className="container">
    {searchQ && <p style={{ marginBottom: 24, color: "var(--navy)", fontSize: 15 }}>نتائج البحث عن: <strong>«{searchQ}»</strong><button onClick={() => { const n = {}; if (activeCat !== "الكل") n.cat = activeCat; setParams(n); }} style={{ marginRight: 12, color: "var(--gold)", fontWeight: 700, fontSize: 13, borderBottom: "1px solid var(--gold)" }}>إلغاء البحث</button></p>}
    <div className="filters">{CATS.map(cat => <button key={cat} className={`filter-btn ${cat === activeCat ? "active" : ""}`} onClick={() => { const n = {}; if (cat !== "الكل") n.cat = cat; if (searchQ) n.q = searchQ; setParams(n); }}>{cat}</button>)}</div>
    {loading && <div className="empty-state"><p>جاري تحميل المنتجات...</p></div>}
    {!loading && !list.length && <div className="empty-state" style={{ gridColumn: "1/-1" }}><div className="ic">👜</div><p>{searchQ ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد منتجات في هذا القسم حاليًا"}</p></div>}
    {!loading && !!list.length && <div className="products-grid">{list.map(p => <ProductCard key={p.id} product={p} />)}</div>}
  </div></section></>;
}
