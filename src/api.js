const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function api(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };
  const token = localStorage.getItem('zera_admin_token');
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const r = await fetch(`${API_BASE}${path}`, { ...options, headers });
  
  // handle 204 No Content
  if (r.status === 204) return {};
  
  let data = {};
  try { data = await r.json(); } catch {}
  if (!r.ok) throw new Error(data.error || 'حدث خطأ في الاتصال');
  return data;
}

export const assetUrl = (url) => url?.startsWith('http') ? url : `${API_BASE}${url || ''}`;
