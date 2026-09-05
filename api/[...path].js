import express from 'express';
import helmet from 'helmet';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { put } from '@vercel/blob';

const app = express();
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '200kb' }));
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
  if(req.method==='OPTIONS') return res.sendStatus(204);
  next();
});

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if(!JWT_SECRET || JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters.');
if(!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD');
if(!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY');

const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
const buckets = new Map();

// Supabase REST helper
async function sb(table, options = {}) {
  const { method = 'GET', filter = '', body, select = '*', single = false } = options;
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}${filter}`;
  if(single) url += '&limit=1';
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': method === 'POST' ? 'return=representation' : method === 'PATCH' ? 'return=representation' : 'return=minimal'
  };
  const r = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if(r.status === 204 || r.status === 200 && method === 'DELETE') return [];
  const data = await r.json();
  if(!r.ok) throw new Error(data?.message || data?.error || 'Supabase error');
  return data;
}

function normalize(row) {
  return {
    id: row.id, name: row.name, brand: row.brand || 'ZERA',
    category: row.category, price: Number(row.price),
    oldPrice: row.old_price == null ? null : Number(row.old_price),
    badge: row.badge || null, stock: Number(row.stock ?? 0),
    colors: row.colors || [], colorImages: row.color_images || {},
    sizes: row.sizes || [], image: row.image,
    images: row.images || (row.image ? [row.image] : []),
    desc: row.description || '', featured: Boolean(row.featured)
  };
}

function rateLimit(windowMs, max) {
  return (req,res,next) => {
    const key = (req.headers['x-forwarded-for']||'unknown') + ':' + req.path;
    const now = Date.now();
    const a = (buckets.get(key)||[]).filter(t => now-t < windowMs);
    if(a.length >= max) return res.status(429).json({error:'طلبات كثيرة، حاولي لاحقاً.'});
    a.push(now); buckets.set(key,a); next();
  };
}

function auth(req,res,next) {
  const h = req.headers.authorization || '';
  if(!h.startsWith('Bearer ')) return res.status(401).json({error:'غير مصرح'});
  try { req.user = jwt.verify(h.slice(7), JWT_SECRET); next(); }
  catch { return res.status(401).json({error:'انتهت الجلسة'}); }
}

const storage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8*1024*1024 },
  fileFilter: (req,file,cb) => cb(null, ['image/jpeg','image/png','image/webp'].includes(file.mimetype))
});

// Routes
app.get('/api/health', (req,res) => res.json({ok:true}));

app.get('/api/config', (req,res) => res.json({
  whatsappNumber: process.env.WHATSAPP_NUMBER || '9647881157778',
  instagramHandle: process.env.INSTAGRAM_HANDLE || 'zeralook',
  mastercardNumber: process.env.MASTERCARD_NUMBER || ''
}));

app.get('/api/products', async (req,res) => {
  try {
    const rows = await sb('products', { filter: '&active=eq.true&order=created_at.desc' });
    res.json(rows.map(normalize));
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/admin/login', rateLimit(15*60*1000, 10), async (req,res) => {
  const {email, password} = req.body || {};
  if(typeof email !== 'string' || typeof password !== 'string')
    return res.status(400).json({error:'بيانات غير صحيحة'});
  const ok = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && await bcrypt.compare(password, passwordHash);
  if(!ok) return res.status(401).json({error:'بيانات الدخول غير صحيحة'});
  res.json({ token: jwt.sign({role:'admin', email:ADMIN_EMAIL}, JWT_SECRET, {expiresIn:'8h'}), email: ADMIN_EMAIL });
});

app.get('/api/admin/me', auth, (req,res) => res.json({email:req.user.email, role:'admin'}));

app.get('/api/admin/products', auth, async (req,res) => {
  try {
    const rows = await sb('products', { filter: '&order=created_at.desc' });
    res.json(rows.map(normalize));
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/admin/products', auth, async (req,res) => {
  try {
    const b = req.body;
    const row = {
      id: crypto.randomUUID(),
      name: b.name, brand: b.brand || 'ZERA',
      category: b.category, price: Number(b.price),
      old_price: b.oldPrice || null, badge: b.badge || null,
      stock: Number(b.stock || 0), colors: b.colors || [],
      color_images: b.colorImages || {}, sizes: b.sizes || [],
      image: b.image || (b.images && b.images[0]) || null,
      images: b.images || [], description: b.desc || '',
      featured: !!b.featured, active: true
    };
    const result = await sb('products', { method:'POST', body: row });
    res.status(201).json(normalize(result[0] || row));
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.put('/api/admin/products/:id', auth, async (req,res) => {
  try {
    const b = req.body;
    const row = {
      name: b.name, brand: b.brand || 'ZERA',
      category: b.category, price: Number(b.price),
      old_price: b.oldPrice || null, badge: b.badge || null,
      stock: Number(b.stock || 0), colors: b.colors || [],
      color_images: b.colorImages || {}, sizes: b.sizes || [],
      image: b.image || (b.images && b.images[0]) || null,
      images: b.images || [], description: b.desc || '',
      featured: !!b.featured, updated_at: new Date().toISOString()
    };
    const result = await sb('products', {
      method: 'PATCH', body: row,
      filter: `&id=eq.${req.params.id}`
    });
    res.json(normalize(result[0] || {...row, id:req.params.id}));
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.delete('/api/admin/products/:id', auth, async (req,res) => {
  try {
    await sb('products', { method:'DELETE', filter:`&id=eq.${req.params.id}` });
    res.sendStatus(204);
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/admin/upload/product', auth, storage.array('file', 10), async (req,res) => {
  const files = req.files;
  if(!files || !files.length) return res.status(400).json({error:'الصورة غير صالحة'});
  try {
    const urls = [];
    for(const file of files) {
      const ext = file.mimetype==='image/png'?'.png':file.mimetype==='image/webp'?'.webp':'.jpg';
      const blob = await put(`product-images/${crypto.randomUUID()}${ext}`, file.buffer, {
        access: 'public', contentType: file.mimetype, addRandomSuffix: false
      });
      urls.push(blob.url);
    }
    res.json({ urls, url: urls[0] });
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/admin/orders', auth, async (req,res) => {
  try {
    const rows = await sb('orders', { filter: '&order=created_at.desc' });
    res.json(rows);
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/orders', rateLimit(10*60*1000, 10), async (req,res) => {
  try {
    const {customer, items, paymentMethod, receiptUrl} = req.body || {};
    if(!customer || !Array.isArray(items) || !items.length)
      return res.status(400).json({error:'الطلب غير صحيح'});
    const products = await sb('products', { filter: '&active=eq.true' });
    let subtotal = 0; const safeItems = [];
    for(const i of items) {
      const p = products.find(x => x.id === i.id);
      const qty = Number(i.qty);
      if(!p || !Number.isInteger(qty) || qty < 1) return res.status(400).json({error:'منتج غير موجود'});
      subtotal += p.price * qty;
      safeItems.push({id:p.id, name:p.name, qty, price:p.price, color:i.color||null});
    }
    const fee = customer.governorateName === 'كربلاء' ? 3000 : 5000;
    const order = {
      id: crypto.randomUUID(), customer, items: safeItems,
      payment_method: paymentMethod === 'cod' ? 'cod' : 'electronic',
      receipt_url: receiptUrl || null, subtotal, delivery_fee: fee, total: subtotal+fee, status: 'new'
    };
    await sb('orders', { method:'POST', body: order });
    res.status(201).json({id:order.id, total:order.total});
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/reviews/:productId', rateLimit(60*1000, 120), async (req,res) => {
  try {
    const rows = await sb('reviews', {
      filter: `&product_id=eq.${req.params.productId}&status=eq.approved&order=created_at.desc`
    });
    res.json(rows);
  } catch(e) { res.status(500).json({error:e.message}); }
});

export const config = { api: { bodyParser: false } };
export default app;
