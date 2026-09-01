import { useContext, createContext, useEffect, useMemo, useState } from 'react';
import { api, assetUrl } from './api.js';
import { DEFAULT_PRODUCTS } from './store.js';
const ProductsContext=createContext(null);
function normalize(row){return {id:row.id,name:row.name,brand:row.brand||'ZERA',category:row.category,price:Number(row.price),oldPrice:row.oldPrice==null?null:Number(row.oldPrice),badge:row.badge||null,stock:Number(row.stock??0),colors:Array.isArray(row.colors)?row.colors:[],colorImages:row.colorImages||{},sizes:Array.isArray(row.sizes)?row.sizes:[],image:assetUrl(row.image),images:(Array.isArray(row.images)?row.images:row.image?[row.image]:[]).map(assetUrl),desc:row.desc||'',featured:Boolean(row.featured)}}
export function ProductsProvider({children}){const [products,setProducts]=useState(DEFAULT_PRODUCTS);const [loading,setLoading]=useState(true);const refresh=async()=>{const data=await api('/api/products');const next=data.map(normalize);setProducts(next);return next};useEffect(()=>{refresh().catch(()=>{}).finally(()=>setLoading(false))},[]);const value=useMemo(()=>({products,loading,refresh}),[products,loading]);return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>}
export function useProducts(){const c=useContext(ProductsContext);if(!c)throw new Error('useProducts must be used inside ProductsProvider');return c}
export function useProduct(id){const {products,loading}=useProducts();return {product:products.find(p=>p.id===id),loading}}
