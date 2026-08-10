# مشروع خدمات التموين

نسخة GitHub Pages جاهزة للواجهة وتجربة دورة الطلب.

## مهم قبل الاستخدام الحقيقي
الوضع الحالي يعمل كـ Demo: الطلبات تحفظ في `localStorage` داخل نفس المتصفح، لذلك لن تصل إليك من أجهزة الناس.

لتحويله إلى نظام حقيقي:
1. أنشئ مشروع Supabase.
2. أنشئ جدول `requests` وStorage bucket خاص للمرفقات.
3. فعّل Auth لحساب الإدارة.
4. ضع `url` و`anonKey` في `js/config.js`.
5. طبّق RLS بحيث لا تكون بيانات الطلبات أو المرفقات عامة.
6. اربط `request.js` و`track.js` و`admin.js` بواجهات Supabase.
7. لا تضع `service_role` key في ملفات GitHub أو المتصفح.

## تشغيل محلي
افتح `index.html` أو شغله عبر Live Server في VS Code.

## رفع GitHub Pages
- أنشئ Repository جديد.
- ارفع كل الملفات بنفس المجلدات.
- Settings > Pages > Deploy from branch > main / root.
- افتح رابط GitHub Pages الذي سيظهر لك.

## بيانات دخول لوحة Demo
البريد: admin@example.com
كلمة المرور: 123456

غيّرها عند التجربة، ولا تعتمد على هذا الدخول في الإنتاج.

## V6
- تغيير شامل للألوان والواجهة الرئيسية مع Hero SVG أوضح.
- بحث داخل قائمة المناطق مرتبط بالمحافظة.
- بيانات موسعة لـ 27 محافظة على مستوى المدن والأحياء والمناطق الرئيسية.
- رقم تليفون الزوج إلزامي في كل الطلبات.
- ضم الزوجة: اسم الزوج والزوجة + بطاقة الزوج وجه وظهر + بطاقة الزوجة وجه وظهر.

## V7 fixes
- Fixed duplicate `GOVERNORATES` declaration that prevented `app.js` from running; services now render again.
- Fixed news ticker animation conflict; news now moves slowly, pauses on hover, and news items are clickable.
- Added Egypt live clock, Gregorian date, Hijri date, and a shared visitor counter.


## بيانات دخول الإدارة
- اسم المستخدم: `Mohamed`
- كلمة المرور: `Med@7111992`
- الدخول من زر **🔐 الإدارة** في الـNavbar أو مباشرة من `admin.html`.

> ملاحظة: هذه حماية واجهة Front-end فقط، وليست نظام مصادقة آمنًا لبيانات حساسة على GitHub Pages.


V24: متابعة الطلبات تستخدم localStorage محليًا. للاختبار المحلي الموثوق استخدم Live Server/localhost بدل فتح الملفات مباشرة بـ file://.
