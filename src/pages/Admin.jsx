import {useEffect,useState,useRef} from 'react';
import {Link} from 'react-router-dom';
import {formatPrice} from '../store';
import {useProducts} from '../products.jsx';
import {api} from '../api.js';

const CATEGORIES=['جنط','جديدنا','الأكثر مبيعًا','عروض'];
const blank=()=>({name:'',brand:'ZERA',price:'',oldPrice:'',category:'جنط',badge:'',stock:'',images:[],colorImages:{},colors:[],desc:'',featured:false});

export default function Admin(){
  const {products,refresh}=useProducts();
  const [logged,setLogged]=useState(!!localStorage.getItem('zera_admin_token'));
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [err,setErr]=useState('');
  const [busy,setBusy]=useState(false);
  const [modal,setModal]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState(blank());
  const [uploading,setUploading]=useState(false);
  const fileRef=useRef();
  const colorFileRefs=useRef({});

  useEffect(()=>{
    if(!logged)return;
    api('/api/admin/me').catch(()=>{localStorage.removeItem('zera_admin_token');setLogged(false);});
  },[logged]);

  const login=async e=>{
    e.preventDefault();setBusy(true);setErr('');
    try{
      const r=await api('/api/admin/login',{method:'POST',body:JSON.stringify({email,password:pass})});
      localStorage.setItem('zera_admin_token',r.token);setLogged(true);
    }catch(e){setErr(e.message);}finally{setBusy(false);}
  };

  const logout=()=>{localStorage.removeItem('zera_admin_token');setLogged(false);};

  const openAdd=()=>{setEditId(null);setForm(blank());setModal(true);setErr('');};
  const openEdit=p=>{
    setEditId(p.id);
    setForm({
      name:p.name,brand:p.brand||'ZERA',price:p.price,oldPrice:p.oldPrice||'',
      category:p.category,badge:p.badge||'',stock:p.stock??0,
      images:Array.isArray(p.images)?[...p.images]:(p.image?[p.image]:[]),
      colorImages:p.colorImages||{},
      colors:Array.isArray(p.colors)?[...p.colors]:[],
      desc:p.desc||'',featured:!!p.featured
    });
    setModal(true);setErr('');
  };

  // رفع صور المنتج العامة
  const uploadImages=async files=>{
    if(!files||!files.length)return;
    setUploading(true);setErr('');
    try{
      const fd=new FormData();
      for(const f of files) fd.append('file',f);
      const r=await api('/api/admin/upload/product',{method:'POST',body:fd});
      const newUrls=r.urls||[r.url];
      setForm(x=>({...x,images:[...x.images,...newUrls].slice(0,12)}));
    }catch(e){setErr('فشل رفع الصور: '+e.message);}
    finally{setUploading(false);}
  };

  // رفع صورة لون معين
  const uploadColorImage=async(color,file)=>{
    if(!file)return;
    setUploading(true);setErr('');
    try{
      const fd=new FormData();
      fd.append('file',file);
      const r=await api('/api/admin/upload/product',{method:'POST',body:fd});
      const url=r.url||r.urls?.[0];
      setForm(x=>({...x,colorImages:{...x.colorImages,[color]:url}}));
    }catch(e){setErr('فشل رفع صورة اللون: '+e.message);}
    finally{setUploading(false);}
  };

  const removeImage=i=>{
    setForm(x=>{const imgs=[...x.images];imgs.splice(i,1);return{...x,images:imgs};});
  };

  // إضافة لون جديد
  const addColor=()=>{
    setForm(x=>({...x,colors:[...x.colors,'#000000']}));
  };

  // تعديل لون
  const updateColor=(i,val)=>{
    setForm(x=>{
      const colors=[...x.colors];
      const oldColor=colors[i];
      colors[i]=val;
      // انقل صورة اللون القديم للجديد
      const colorImages={...x.colorImages};
      if(colorImages[oldColor]){
        colorImages[val]=colorImages[oldColor];
        delete colorImages[oldColor];
      }
      return{...x,colors,colorImages};
    });
  };

  // حذف لون
  const removeColor=i=>{
    setForm(x=>{
      const colors=[...x.colors];
      const removed=colors.splice(i,1)[0];
      const colorImages={...x.colorImages};
      delete colorImages[removed];
      return{...x,colors,colorImages};
    });
  };

  const save=async e=>{
    e.preventDefault();setBusy(true);setErr('');
    try{
      const payload={
        name:form.name.trim(),brand:form.brand.trim()||'ZERA',
        price:Number(form.price),oldPrice:form.oldPrice?Number(form.oldPrice):null,
        category:form.category,badge:form.badge.trim()||null,
        colors:form.colors,colorImages:form.colorImages,sizes:[],
        stock:Math.max(0,Number(form.stock)||0),
        image:form.images[0]||null,images:form.images.slice(0,12),
        desc:form.desc.trim(),featured:!!form.featured
      };
      if(editId) await api(`/api/admin/products/${editId}`,{method:'PUT',body:JSON.stringify(payload)});
      else await api('/api/admin/products',{method:'POST',body:JSON.stringify(payload)});
      await refresh();setModal(false);
    }catch(e){setErr(e.message);}finally{setBusy(false);}
  };

  const remove=async id=>{
    if(!confirm('هل أنت متأكدة من حذف هذا المنتج؟'))return;
    setBusy(true);
    try{await api(`/api/admin/products/${id}`,{method:'DELETE'});await refresh();}
    catch(e){setErr(e.message);}finally{setBusy(false);}
  };

  if(!logged) return(
    <div style={{minHeight:'100vh',background:'var(--navy)',display:'grid',placeItems:'center'}}>
      <form onSubmit={login} style={{background:'var(--cream)',padding:40,width:'min(420px,90%)'}}>
        <div className="brand" style={{color:'var(--navy)',justifyContent:'center',marginBottom:10}}>
          <span className="badge" style={{borderColor:'var(--navy)',color:'var(--navy)'}}>Z</span> ZERA
        </div>
        <p style={{color:'#8a7f72',fontSize:13,marginBottom:20,textAlign:'center'}}>دخول لوحة التحكم الآمنة</p>
        <div className="field"><label>البريد الإلكتروني</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div className="field"><label>كلمة المرور</label><input type="password" required value={pass} onChange={e=>setPass(e.target.value)}/></div>
        <button className="btn btn-navy btn-block" disabled={busy}>{busy?'جاري الدخول...':'دخول'}</button>
        {err&&<p style={{color:'#b5493f',fontSize:13,marginTop:12,textAlign:'center'}}>{err}</p>}
      </form>
    </div>
  );

  return(
    <div style={{minHeight:'100vh',background:'var(--navy)'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'40px 24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:34}}>
          <div className="brand" style={{color:'var(--white)'}}><span className="badge">Z</span> لوحة تحكم ZERA</div>
          <div style={{display:'flex',gap:12}}>
            <Link to="/" className="btn btn-outline-navy btn-sm">عرض الموقع</Link>
            <button className="btn btn-navy btn-sm" onClick={logout}>تسجيل الخروج</button>
          </div>
        </div>

        {err&&<p style={{color:'#ffb4aa',marginBottom:14}}>{err}</p>}

        <div className="admin-card" style={{background:'var(--white)',padding:26,border:'1px solid var(--line)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <h3>المنتجات ({products.length})</h3>
            <button className="btn btn-navy btn-sm" onClick={openAdd}>+ إضافة منتج</button>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>{['الصورة','المنتج','القسم','السعر','المخزون',''].map((x,i)=>(
                <th key={i} style={{textAlign:'right',padding:'10px 8px',borderBottom:'2px solid var(--navy)',fontSize:13}}>{x}</th>
              ))}</tr>
            </thead>
            <tbody>
              {products.map(p=>(
                <tr key={p.id}>
                  <td style={{padding:'10px 8px',borderBottom:'1px solid var(--line)'}}>
                    {p.image&&<img src={p.image} alt="" style={{width:52,height:52,objectFit:'cover',borderRadius:6}}/>}
                  </td>
                  <td style={{padding:'10px 8px',borderBottom:'1px solid var(--line)',fontSize:14}}>{p.name}</td>
                  <td style={{padding:'10px 8px',borderBottom:'1px solid var(--line)',fontSize:14}}>{p.category}</td>
                  <td style={{padding:'10px 8px',borderBottom:'1px solid var(--line)',fontSize:14}}>{formatPrice(p.price)}</td>
                  <td style={{padding:'10px 8px',borderBottom:'1px solid var(--line)',fontSize:14}}>{p.stock}</td>
                  <td style={{padding:'10px 8px',borderBottom:'1px solid var(--line)'}}>
                    <button onClick={()=>openEdit(p)} style={{color:'var(--gold)',fontWeight:700,marginLeft:14,background:'none',border:'none',cursor:'pointer'}}>تعديل</button>
                    <button onClick={()=>remove(p.id)} style={{color:'#b5493f',fontWeight:700,background:'none',border:'none',cursor:'pointer'}}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(13,25,41,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:20}} onClick={()=>!busy&&setModal(false)}>
          <form onClick={e=>e.stopPropagation()} onSubmit={save} style={{background:'var(--white)',padding:32,maxWidth:600,width:'100%',maxHeight:'92vh',overflowY:'auto',borderRadius:4}}>
            <h3 style={{marginBottom:20}}>{editId?'تعديل المنتج':'إضافة منتج'}</h3>

            {err&&<p style={{color:'#b5493f',marginBottom:12,fontSize:13}}>{err}</p>}

            <div className="field"><label>اسم المنتج *</label><input required maxLength={120} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="field"><label>السعر (د.ع) *</label><input type="number" min="0" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
              <div className="field"><label>السعر القديم</label><input type="number" min="0" value={form.oldPrice} onChange={e=>setForm({...form,oldPrice:e.target.value})}/></div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="field"><label>القسم</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field"><label>المخزون</label><input type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></div>
            </div>

            <div className="field"><label>الوسم (اختياري)</label><input maxLength={30} placeholder="مثال: جديد" value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}/></div>
            <div className="field"><label>الوصف</label><textarea rows={3} maxLength={1000} value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})}/></div>

            {/* ===== الألوان ===== */}
            <div className="field">
              <label style={{marginBottom:10,display:'block'}}>ألوان الشنطة</label>
              <p style={{fontSize:12,color:'#8a7f72',marginBottom:12}}>لكل لون يمكنك رفع صورة خاصة — الزبونة تضغط على اللون وتشوف صورته</p>

              {form.colors.map((color,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:12,padding:12,background:'#fafaf8',borderRadius:8,border:'1px solid var(--line)'}}>
                  {/* color picker */}
                  <input
                    type="color"
                    value={color}
                    onChange={e=>updateColor(i,e.target.value)}
                    style={{width:44,height:44,border:'none',borderRadius:'50%',cursor:'pointer',padding:0}}
                  />
                  <span style={{fontSize:12,color:'#666',fontFamily:'monospace'}}>{color}</span>

                  {/* صورة اللون */}
                  <div style={{flex:1}}>
                    {form.colorImages[color]
                      ? <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <img src={form.colorImages[color]} alt="" style={{width:48,height:48,objectFit:'cover',borderRadius:6}}/>
                          <div>
                            <p style={{fontSize:11,color:'#4caf50',margin:0}}>✓ صورة محددة</p>
                            <button type="button" onClick={()=>setForm(x=>({...x,colorImages:{...x.colorImages,[color]:undefined}}))}
                              style={{fontSize:11,color:'#b5493f',background:'none',border:'none',cursor:'pointer',padding:0}}>
                              حذف الصورة
                            </button>
                          </div>
                        </div>
                      : <button type="button"
                          onClick={()=>colorFileRefs.current[i]?.click()}
                          style={{fontSize:12,color:'var(--navy)',background:'var(--cream)',border:'1px solid var(--line)',borderRadius:6,padding:'6px 12px',cursor:'pointer'}}>
                          📷 رفع صورة لهذا اللون
                        </button>
                    }
                    <input
                      ref={el=>colorFileRefs.current[i]=el}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{display:'none'}}
                      onChange={e=>uploadColorImage(color,e.target.files[0])}
                    />
                  </div>

                  {/* حذف اللون */}
                  <button type="button" onClick={()=>removeColor(i)}
                    style={{width:28,height:28,background:'#b5493f',color:'white',border:'none',borderRadius:'50%',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    ×
                  </button>
                </div>
              ))}

              <button type="button" onClick={addColor}
                style={{width:'100%',padding:'10px',border:'2px dashed var(--line)',background:'none',borderRadius:8,cursor:'pointer',color:'var(--navy)',fontSize:14}}>
                + إضافة لون
              </button>
            </div>

            {/* ===== صور المنتج العامة ===== */}
            <div className="field">
              <label>صور المنتج العامة (حتى 12 صورة)</label>
              <div
                style={{border:'2px dashed var(--line)',borderRadius:8,padding:20,textAlign:'center',cursor:'pointer',marginBottom:12,background:'#fafaf8'}}
                onClick={()=>fileRef.current.click()}
                onDragOver={e=>e.preventDefault()}
                onDrop={e=>{e.preventDefault();uploadImages([...e.dataTransfer.files]);}}
              >
                {uploading
                  ? <p style={{color:'var(--gold)'}}>جاري رفع الصور...</p>
                  : <><p style={{fontSize:15,color:'var(--navy)',fontWeight:600}}>📎 اضغطي هنا لرفع صور</p>
                     <p style={{fontSize:12,color:'#8a7f72',marginTop:4}}>JPEG، PNG، WebP — حتى 8MB للصورة</p></>
                }
                <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" style={{display:'none'}} onChange={e=>uploadImages([...e.target.files])}/>
              </div>

              {form.images.length>0&&(
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  {form.images.map((img,i)=>(
                    <div key={i} style={{position:'relative'}}>
                      <img src={img} alt="" style={{width:80,height:80,objectFit:'cover',borderRadius:8,border:i===0?'3px solid var(--navy)':'2px solid var(--line)'}}/>
                      {i===0&&<span style={{position:'absolute',bottom:4,left:4,background:'var(--navy)',color:'white',fontSize:9,padding:'2px 5px',borderRadius:4}}>رئيسية</span>}
                      <button type="button" onClick={()=>removeImage(i)} style={{position:'absolute',top:3,right:3,background:'#b5493f',color:'white',border:'none',borderRadius:'50%',width:20,height:20,cursor:'pointer',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label style={{display:'flex',gap:8,alignItems:'center',marginBottom:20}}>
              <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/>
              عرض في الصفحة الرئيسية
            </label>

            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-navy" disabled={busy||uploading}>{busy?'جاري الحفظ...':'حفظ المنتج'}</button>
              <button type="button" className="btn btn-outline-navy" onClick={()=>setModal(false)} disabled={busy}>إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
