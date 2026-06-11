# Delivery Friends

تطبيق ويب لإدارة طلبات التوصيل بثلاثة أدوار:
- العميل
- الكابتن
- الأدمن

## التشغيل المحلي
1. انسخ `.env.example` إلى `.env`
2. ضع قيم Supabase:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. ثبّت الحزم وشغّل Vite:
   - `npm install`
   - `npm run dev`

## قاعدة البيانات
استخدم ملف `supabase/schema.sql` لإنشاء الجداول وRLS policies في Supabase.

## النشر
- Frontend: Vercel
- Backend/DB: Supabase
