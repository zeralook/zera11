# ZERA — Vercel setup

هذه النسخة مصممة لـ Vercel. البيانات والملفات لا تُحفظ على قرص السيرفر؛ تستخدم Vercel Blob الخاص.

## قبل أول Deploy
1. في Vercel افتح Storage → Create Database → Blob واختر **Private**. اربطه بالمشروع حتى يضاف `BLOB_READ_WRITE_TOKEN` تلقائياً. Vercel يدعم Private Blob للملفات الحساسة ويجب أن تكون قراءات الملفات الخاصة عبر Function.
2. أضف Environment Variables التالية إلى Production وPreview:
   - `JWT_SECRET` = سر عشوائي 32+ حرفاً
   - `ADMIN_EMAIL` = إيميل المدير
   - `ADMIN_PASSWORD` = كلمة مرور المدير (12+ حرفاً)
   - `WHATSAPP_NUMBER` = رقم واتساب بصيغة دولية بدون +
   - `INSTAGRAM_HANDLE` = اسم حساب الإنستغرام
   - `MASTERCARD_NUMBER` = رقم الدفع الذي تريد إظهاره للزبون (لا تضع CVV أو PIN)
3. Deploy.

## ملاحظات
- صور المنتجات تحفظ في Private Blob وتُعرض عبر API، لذلك لا توجد ملفات محلية تعتمد عليها النسخة.
- وصولات الدفع تُحفظ خاصة، ويُنشأ رابط مؤقت لمدة 24 ساعة لإرساله مع الطلب.
- رفع الصور محدود إلى 4MB للصورة بسبب حدود طلبات Vercel Functions.
- لوحة المدير تدعم حتى 12 صورة للجنطة، وأول صورة هي الرئيسية.
- لا تضف `BLOB_READ_WRITE_TOKEN` إلى `VITE_...` أو إلى الكود.
