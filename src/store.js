// ZERA — منطق المتجر (منتجات، سلة، توصيل، طلب واتساب)

export const WHATSAPP_NUMBER = "9647881157778";
export const INSTAGRAM_HANDLE = "zeralook";

export const DELIVERY = { karbala: 3000, other: 5000 };

export const GOVERNORATES = [
  "بغداد", "البصرة", "نينوى", "أربيل", "النجف", "كربلاء", "ذي قار", "الأنبار", "ديالى",
  "كركوك", "بابل", "واسط", "صلاح الدين", "ميسان", "القادسية", "المثنى", "دهوك", "السليمانية",
];

const STOCK_IMAGES = {
  bag1: "https://images.unsplash.com/photo-1614179689702-355944cd0918?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
  bag2: "https://images.pexels.com/photos/7953286/pexels-photo-7953286.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  bag3: "https://images.unsplash.com/photo-1682745230951-8a5aa9a474a0?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
  fashion1: "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
  fashion2: "https://images.unsplash.com/photo-1571513800374-df1bbe650e56?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
};

export const DEFAULT_PRODUCTS = [
  { id: "p1", name: "جنطة نافارا الكلاسيكية", brand: "ZERA", category: "جديدنا", price: 65000, oldPrice: null, badge: "جديد", stock: 10,
    colors: ["#0D1929", "#B8935F", "#7A6A58"], colorImages: {}, sizes: [], image: STOCK_IMAGES.bag1,
    desc: "جنطة يد فاخرة بخامة جلد صناعي عالي الجودة، تصميم أنيق يناسب الاستخدام اليومي والمناسبات.", featured: true },
  { id: "p2", name: "جنطة أوليفيا الكروس", brand: "ZERA", category: "الأكثر مبيعًا", price: 48000, oldPrice: 58000, badge: "الأكثر مبيعًا", stock: 8,
    colors: ["#1A1410", "#D9C29A"], colorImages: {}, sizes: [], image: STOCK_IMAGES.bag2,
    desc: "تصميم عملي بحزام قابل للتعديل، مثالية للخروجات اليومية مع لمسة عصرية.", featured: true },
  { id: "p3", name: "جنطة إيلوز الذهبية", brand: "ZERA", category: "عروض", price: 39000, oldPrice: 52000, badge: "عرض خاص", stock: 5,
    colors: ["#B8935F"], colorImages: {}, sizes: [], image: STOCK_IMAGES.bag3,
    desc: "جنطة صغيرة أنيقة بتفاصيل ذهبية، خيار مثالي للمناسبات المسائية.", featured: true },
  { id: "p4", name: "جنطة فيرونا الكبيرة", brand: "ZERA", category: "جنط", price: 72000, oldPrice: null, badge: null, stock: 6,
    colors: ["#0D1929", "#7A6A58", "#1A1410"], colorImages: {}, sizes: [], image: STOCK_IMAGES.bag1,
    desc: "جنطة كبيرة تتسع لكل مستلزماتك، بتصميم هيكلي راقي.", featured: false },
  { id: "p5", name: "جنطة لوسيا اليدوية", brand: "ZERA", category: "جديدنا", price: 55000, oldPrice: null, badge: "جديد", stock: 12,
    colors: ["#D9C29A", "#0D1929"], colorImages: {}, sizes: [], image: STOCK_IMAGES.fashion1,
    desc: "لمسة كلاسيكية عصرية بمقبض علوي أنيق وتفاصيل خياطة دقيقة.", featured: true },
  { id: "p6", name: "جنطة ميلانو الصغيرة", brand: "ZERA", category: "الأكثر مبيعًا", price: 42000, oldPrice: null, badge: "الأكثر مبيعًا", stock: 0,
    colors: ["#1A1410", "#B8935F", "#F5EAD7"], colorImages: {}, sizes: [], image: STOCK_IMAGES.bag2,
    desc: "جنطة صغيرة عملية، مثالية للاستخدام اليومي الخفيف.", featured: false },
  { id: "p7", name: "جنطة روزيتا بحزام سلسلة", brand: "ZERA", category: "عروض", price: 36000, oldPrice: 45000, badge: "عرض خاص", stock: 3,
    colors: ["#0D1929"], colorImages: {}, sizes: [], image: STOCK_IMAGES.fashion2,
    desc: "تفصيلة سلسلة ذهبية أنيقة تضيف لمسة فخامة لإطلالتك.", featured: false },
  { id: "p8", name: "جنطة كابري الجلدية", brand: "ZERA", category: "جنط", price: 68000, oldPrice: null, badge: null, stock: 7,
    colors: ["#7A6A58", "#1A1410", "#B8935F"], colorImages: {}, sizes: [], image: STOCK_IMAGES.bag3,
    desc: "خامة جلد فاخرة بتصميم بسيط وأنيق يناسب كل الإطلالات.", featured: true },
];

const PRODUCTS_KEY = "zera_products";
const CART_KEY = "zera_cart";

export function getProducts() {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS;
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === id);
}

export function formatPrice(n) {
  return Number(n).toLocaleString("en-US") + " د.ع";
}

export function getDeliveryFee(governorate) {
  return governorate === "karbala" ? DELIVERY.karbala : DELIVERY.other;
}

export function bagIcon(color = "#0D1929") {
  return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 38 L30 28 Q30 14 50 14 Q70 14 70 28 L70 38" stroke="${color}" stroke-width="3.5" fill="none"/>
    <rect x="18" y="38" width="64" height="50" rx="3" stroke="${color}" stroke-width="3.5" fill="none"/>
    <line x1="18" y1="54" x2="82" y2="54" stroke="${color}" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"/>
    <circle cx="50" cy="64" r="3" fill="${color}"/>
  </svg>`;
}

export function buildWhatsAppOrder(customer, cart) {
  const fee = getDeliveryFee(customer.governorate);
  const total = cart.reduce((sum, item) => {
    const p = getProductById(item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
  let msg = `*طلب جديد من ZERA*%0A%0A`;
  msg += `👤 الاسم: ${customer.name}%0A`;
  msg += `📞 الهاتف: ${customer.phone}%0A`;
  if (customer.phone2) msg += `📞 هاتف ثانٍ: ${customer.phone2}%0A`;
  msg += `📍 المحافظة: ${customer.governorateName}%0A`;
  msg += `🏘️ المنطقة: ${customer.area}%0A`;
  msg += `🏠 العنوان: ${customer.address}%0A`;
  if (customer.notes) msg += `📝 ملاحظات: ${customer.notes}%0A`;
  msg += `%0A*المنتجات:*%0A`;
  cart.forEach((item) => {
    const p = getProductById(item.id);
    if (!p) return;
    msg += `- ${p.name} × ${item.qty}`;
    if (item.color) msg += ` (لون محدد)`;
    msg += ` — ${formatPrice(p.price * item.qty)}%0A`;
  });
  msg += `%0A🚚 أجور التوصيل: ${formatPrice(fee)}%0A`;
  msg += `💰 *المجموع الكلي: ${formatPrice(total + fee)}*`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}
