import express from 'express';
import helmet from 'helmet';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { put, list } from '@vercel/blob';


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

const env=(k,d='')=>process.env[k]??d;
const JWT_SECRET=env('JWT_SECRET');
const ADMIN_EMAIL=env('ADMIN_EMAIL');
const ADMIN_PASSWORD=env('ADMIN_PASSWORD');
if(!JWT_SECRET || JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters.');
if(!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars).');
const passwordHash=bcrypt.hashSync(ADMIN_PASSWORD,12);
const DB_KEY='data/db.json';
let dbCache=null;
const buckets=new Map();

function rateLimit(windowMs,max){
  return (req,res,next)=>{
    const key=(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown')+':'+req.path;
    const now=Date.now();
    const a=(buckets.get(key)||[]).filter(t=>now-t<windowMs);
    if(a.length>=max) return res.status(429).json({error:'طلبات كثيرة، حاولي لاحقاً.'});
    a.push(now);buckets.set(key,a);next();
  };
}

function auth(req,res,next){
  const h=req.headers.authorization||'';
  if(!h.startsWith('Bearer ')) return res.status(401).json({error:'غير مصرح'});
  try{req.user=jwt.verify(h.slice(7),JWT_SECRET);next();}
  catch{return res.status(401).json({error:'انتهت الجلسة'});}
}

function uid(){return crypto.randomUUID();}

function seed(){
  const now=new Date().toISOString();
  return {
    products:[
      {id:'p1',name:'جنطة نافارا الكلاسيكية',brand:'ZERA',category:'جديدنا',price:65000,oldPrice:null,badge:'جديد',stock:10,colors:['#0D1929','#B8935F','#7A6A58'],colorImages:{},sizes:[],image:'https://images.unsplash.com/photo-1614179689702-355944cd0918?crop=entropy&cs=srgb&fm=jpg&q=80&w=900',images:['https://images.unsplash.com/photo-1614179689702-355944cd0918?crop=entropy&cs=srgb&fm=jpg&q=80&w=900'],desc:'جنطة يد فاخرة بخامة جلد صناعي عالي الجودة.',featured:true,active:true,createdAt:now,updatedAt:now},
      {id:'p2',name:'جنطة أوليفيا الكروس',brand:'ZERA',category:'الأكثر مبيعًا',price:48000,oldPrice:58000,badge:'الأكثر مبيعًا',stock:8,colors:['#1A1410','#D9C29A'],colorImages:{},sizes:[],image:'https://images.pexels.com/photos/7953286/pexels-photo-7953286.jpeg',images:['https://images.pexels.com/photos/7953286/pexels-photo-7953286.jpeg'],desc:'تصميم عملي بحزام قابل للتعديل.',featured:true,active:true,createdAt:now,updatedAt:now}
    ],
    reviews:[],
    orders:[]
  };
}

async function loadDb(){
  if(dbCache) return dbCache;
  try {
    const {blobs} = await list({prefix: DB_KEY});
    if(blobs && blobs.length > 0) {
      const r = await fetch(blobs[0].url);
      if(r.ok){
        dbCache = await r.json();
        return dbCache;
      }
    }
  } catch(e){}
  dbCache = seed();
  await saveDb();
  return dbCache;
}

async function saveDb(){
  await put(DB_KEY, JSON.stringify(dbCache,null,2), {
    access:'public',
    contentType:'application/json',
    allowOverwrite:true
  });
}

function cleanProduct(p){
  const imgs=Array.isArray(p.images)&&p.images.length?p.images:(p.image?[p.image]:[]);
  return {id:p.id,name:p.name,brand:p.brand||'ZERA',category:p.category,price:Number(p.price),oldPrice:p.oldPrice==null?null:Number(p.oldPrice),badge:p.badge||null,stock:Number(p.stock||0),colors:Array.isArray(p.colors)?p.colors:[],colorImages:p.colorImages||{},sizes:Array.isArray(p.sizes)?p.sizes:[],image:p.image||imgs[0]||null,images:imgs,desc:p.desc||'',featured:!!p.featured,active:p.active!==false,createdAt:p.createdAt,updatedAt:p.updatedAt};
}

function validProduct(p){
  return typeof p.name==='string' && p.name.trim().length<=120 &&
    Number.isFinite(Number(p.price)) && Number(p.price)>=0 && Number(p.price)<=100000000 &&
    Number.isInteger(Number(p.stock)) && Number(p.stock)>=0 && Number(p.stock)<=100000 &&
    ['جنط','جديدنا','الأكثر مبيعًا','عروض'].includes(p.category) &&
    typeof p.desc==='string' && p.desc.length<=1000 &&
    Array.isArray(p.images) && p.images.length<=12;
}

const storage=multer({
  storage:multer.memoryStorage(),
  limits:{fileSize:8*1024*1024},
  fileFilter:(req,file,cb)=>cb(null,['image/jpeg','image/png','image/webp'].includes(file.mimetype))
});

// Routes
app.get('/api/health',(req,res)=>res.json({ok:true}));
app.get('/api/config',(req,res)=>res.json({whatsappNumber:env('WHATSAPP_NUMBER','9647881157778'),instagramHandle:env('INSTAGRAM_HANDLE','zeralook'),mastercardNumber:env('MASTERCARD_NUMBER','')}));

app.get('/api/products',async(req,res)=>{
  const db=await loadDb();
  res.json(db.products.filter(p=>p.active!==false).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(cleanProduct));
});

app.post('/api/admin/login',rateLimit(15*60*1000,10),async(req,res)=>{
  const {email,password}=req.body||{};
  if(typeof email!=='string'||typeof password!=='string') return res.status(400).json({error:'بيانات غير صحيحة'});
  const ok=email.trim().toLowerCase()===ADMIN_EMAIL.toLowerCase()&&await bcrypt.compare(password,passwordHash);
  if(!ok) return res.status(401).json({error:'بيانات الدخول غير صحيحة'});
  res.json({token:jwt.sign({role:'admin',email:ADMIN_EMAIL},JWT_SECRET,{expiresIn:'8h'}),email:ADMIN_EMAIL});
});

app.get('/api/admin/me',auth,(req,res)=>res.json({email:req.user.email,role:'admin'}));

app.get('/api/admin/products',auth,async(req,res)=>{
  const db=await loadDb();
  res.json(db.products.map(cleanProduct));
});

app.post('/api/admin/products',auth,async(req,res)=>{
  const db=await loadDb();
  const p={...req.body,id:uid(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),active:true};
  if(!validProduct(p)) return res.status(400).json({error:'بيانات المنتج غير صحيحة'});
  db.products.push(p);dbCache=db;await saveDb();
  res.status(201).json(cleanProduct(p));
});

app.put('/api/admin/products/:id',auth,async(req,res)=>{
  const db=await loadDb();
  const i=db.products.findIndex(p=>p.id===req.params.id);
  if(i<0) return res.sendStatus(404);
  const p={...db.products[i],...req.body,id:req.params.id,updatedAt:new Date().toISOString()};
  if(!validProduct(p)) return res.status(400).json({error:'بيانات المنتج غير صحيحة'});
  db.products[i]=p;dbCache=db;await saveDb();
  res.json(cleanProduct(p));
});

app.delete('/api/admin/products/:id',auth,async(req,res)=>{
  const db=await loadDb();
  const idx=db.products.findIndex(x=>x.id===req.params.id);
  if(idx<0) return res.sendStatus(404);
  db.products.splice(idx,1);
  dbCache=db;await saveDb();
  res.sendStatus(204);
});

// Upload image — stores publicly, returns direct URL
app.post('/api/admin/upload/product',auth,storage.array('file',10),async(req,res)=>{
  const files=req.files;
  if(!files||!files.length) return res.status(400).json({error:'الصورة غير صالحة أو أكبر من 8MB'});
  const urls=[];
  for(const file of files){
    const ext=file.mimetype==='image/png'?'.png':file.mimetype==='image/webp'?'.webp':'.jpg';
    const blob=await put(`product-images/${uid()}${ext}`,file.buffer,{access:'public',contentType:file.mimetype,addRandomSuffix:false});
    urls.push(blob.url);
  }
  res.json({urls, url:urls[0]});
});

app.get('/api/reviews/:productId',rateLimit(60*1000,120),async(req,res)=>{
  const db=await loadDb();
  res.json(db.reviews.filter(r=>r.productId===req.params.productId&&r.status==='approved').sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(({id,rating,name,comment,createdAt})=>({id,rating,name,comment,created_at:createdAt})));
});

app.get('/api/review-stats/:productId',rateLimit(60*1000,120),async(req,res)=>{
  const db=await loadDb();
  const rs=db.reviews.filter(r=>r.productId===req.params.productId&&r.status==='approved');
  res.json({avg:rs.length?rs.reduce((s,r)=>s+r.rating,0)/rs.length:0,count:rs.length});
});

app.post('/api/reviews',rateLimit(10*60*1000,5),async(req,res)=>{
  const db=await loadDb();
  const {product_id,rating,name,comment}=req.body||{};
  if(!db.products.some(p=>p.id===product_id&&p.active!==false)) return res.status(400).json({error:'المنتج غير موجود'});
  if(!Number.isInteger(rating)||rating<1||rating>5||typeof name!=='string'||name.trim().length<1||name.trim().length>50||typeof comment!=='string'||comment.trim().length<1||comment.trim().length>300) return res.status(400).json({error:'التقييم غير صحيح'});
  db.reviews.push({id:uid(),productId:product_id,rating,name:name.trim(),comment:comment.trim(),status:'pending',createdAt:new Date().toISOString()});
  dbCache=db;await saveDb();
  res.status(201).json({ok:true});
});

app.get('/api/admin/reviews',auth,async(req,res)=>{
  const db=await loadDb();
  res.json(db.reviews.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
});

app.put('/api/admin/reviews/:id',auth,async(req,res)=>{
  const db=await loadDb();
  const r=db.reviews.find(x=>x.id===req.params.id);
  if(!r) return res.sendStatus(404);
  if(!['approved','rejected','pending'].includes(req.body?.status)) return res.status(400).json({error:'حالة غير صحيحة'});
  r.status=req.body.status;dbCache=db;await saveDb();
  res.json(r);
});

app.post('/api/orders',rateLimit(10*60*1000,10),async(req,res)=>{
  const db=await loadDb();
  const {customer,items,paymentMethod,receiptUrl}=req.body||{};
  if(!customer||!Array.isArray(items)||!items.length) return res.status(400).json({error:'الطلب غير صحيح'});
  let subtotal=0;const safeItems=[];
  for(const i of items){
    const p=db.products.find(x=>x.id===i.id&&x.active!==false);
    const qty=Number(i.qty);
    if(!p||!Number.isInteger(qty)||qty<1||qty>100||qty>p.stock) return res.status(400).json({error:`الكمية غير متوفرة للمنتج ${p?.name||''}`});
    subtotal+=p.price*qty;
    safeItems.push({id:p.id,name:p.name,qty,price:p.price,color:i.color||null});
  }
  const fee=customer.governorateName==='كربلاء'?3000:5000;
  const order={id:uid(),customer:{name:String(customer.name||'').trim().slice(0,100),phone:String(customer.phone||'').trim().slice(0,30),phone2:String(customer.phone2||'').trim().slice(0,30),governorateName:String(customer.governorateName||'').slice(0,50),area:String(customer.area||'').trim().slice(0,120),address:String(customer.address||'').trim().slice(0,300),notes:String(customer.notes||'').trim().slice(0,500)},items:safeItems,paymentMethod:paymentMethod==='cod'?'cod':'electronic',receiptUrl:typeof receiptUrl==='string'?receiptUrl.slice(0,1000):null,subtotal,deliveryFee:fee,total:subtotal+fee,status:'new',createdAt:new Date().toISOString()};
  db.orders.push(order);
  for(const i of safeItems){const p=db.products.find(x=>x.id===i.id);p.stock-=i.qty;}
  dbCache=db;await saveDb();
  res.status(201).json({id:order.id,total:order.total});
});

app.get('/api/admin/orders',auth,async(req,res)=>{
  const db=await loadDb();
  res.json(db.orders.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
});

export const config={api:{bodyParser:false}};
export default app;
