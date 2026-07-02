# بوابة الفلك | AstroGate

موقع فلكي عربي مبني بـ Next.js 16، يقدّم حسابات فلكية حقيقية (خريطة فلكية، توافق أبراج، خريطة
عبور، عودة شمسية، تقويم قمري، تتبّع الرجوع الظاهري) وأبراجًا يومية/أسبوعية مولَّدة بالذكاء
الاصطناعي، بتصميم "Deep Space" غامر (هيرو ثلاثي الأبعاد، خلفية نجوم متحركة، زجاجية).

الموقع المباشر: **https://astrogate-pi.vercel.app**

## الميزات

- **حاسبة الخريطة الفلكية** — مواقع الكواكب، الطالع، البيوت (نظام Whole Sign)
- **توافق الأبراج (Synastry)** — الجوانب الفلكية بين خريطتين + مؤشر توافق رقمي توضيحي
- **الأبراج اليومية/الأسبوعية** — مولَّدة بـ Claude API بناءً على المواقع الفلكية الحالية فعليًا
- **خريطة العبور** — تأثير الكواكب الحالية على خريطتك الأصلية
- **العودة الشمسية** — خريطة عيد ميلادك الفلكي لأي سنة ومكان
- **تقويم القمر** و**تتبّع الكواكب الراجعة**
- **خرائط محفوظة محليًا** (بدون حساب مستخدم، عبر localStorage)
- **مقالات تعليمية** عن أساسيات التنجيم

## التقنيات

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · React Three Fiber · Framer
Motion · `astronomy-engine` (حسابات فلكية) · `@anthropic-ai/sdk` (توليد الأبراج) · Vercel Blob
(تخزين مؤقت دائم) · Vercel Cron (تحديث يومي تلقائي)

## البدء محليًا

```bash
npm install
cp .env.local.example .env.local   # ثم أضف ANTHROPIC_API_KEY إن رغبت بتفعيل الأبراج بالذكاء الاصطناعي
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

### أوامر مفيدة

| الأمر | الوصف |
|---|---|
| `npm run dev` | تشغيل خادم التطوير |
| `npm run build` | بناء نسخة الإنتاج |
| `npm run lint` | فحص الكود بـ ESLint |
| `npm run verify:astro` | تحقق رقمي من صحة حساب الطالع مقابل مراجع معروفة |
| `npm run verify:solar-return` | تحقق رقمي من دقة حساب العودة الشمسية |
| `npm run refresh-horoscopes -- daily\|weekly` | توليد الأبراج يدويًا محليًا (يحتاج `ANTHROPIC_API_KEY`) |

## متغيرات البيئة

انظر [`.env.local.example`](.env.local.example):

- `ANTHROPIC_API_KEY` — مطلوب لتوليد الأبراج اليومية/الأسبوعية بالذكاء الاصطناعي (من
  [console.anthropic.com](https://console.anthropic.com))
- `CRON_SECRET` — يحمي مسار `POST/GET /api/horoscope/refresh` من الاستدعاء العشوائي؛ Vercel يرسله
  تلقائيًا كـ `Authorization: Bearer` عند تفعيل Vercel Cron
- `BLOB_READ_WRITE_TOKEN` — يُضاف تلقائيًا عند ربط مخزن Vercel Blob بالمشروع (للتخزين المؤقت الدائم
  في الإنتاج؛ محليًا يُستخدم نظام الملفات في `/data` بدلاً منه)

## البنية

```
app/                 صفحات ومسارات API (App Router)
components/          مكونات React (chart, forms, tools, three, effects, ui, saved-charts)
lib/astro/           كل الحسابات الفلكية (كواكب، طالع، بيوت، عبور، عودة شمسية، توافق، رجوع ظاهري...)
lib/geocoding/       تحديد المواقع (قائمة مدن احتياطية + Nominatim)
lib/ai/              توليد الأبراج عبر Claude API
lib/cache/           تخزين مؤقت (Vercel Blob في الإنتاج / نظام ملفات محليًا)
lib/saved-charts/    حفظ الخرائط في localStorage
content/articles/    المقالات التعليمية (MDX)
content/data/        قائمة المدن الاحتياطية
scripts/             سكربتات تحقق وتحديث يدوية
```

## النشر

المشروع مرتبط بـ GitHub ويُنشر تلقائيًا على Vercel عند كل push إلى `main`. جدولة Vercel Cron
(`vercel.json`) تُحدّث الأبراج اليومية تلقائيًا كل يوم.

## ملاحظات معروفة

- نظام البيوت الفلكية المستخدم حاليًا هو **Whole Sign** فقط (لا Placidus أو غيره بعد).
- قائمة المدن الاحتياطية تغطي أهم مدن العالم العربي وعواصم عالمية؛ أي مدينة أخرى تُحل تلقائيًا عبر
  Nominatim (OpenStreetMap).
- مؤشر التوافق الرقمي في صفحة توافق الأبراج **تقديري توضيحي وليس علميًا** — موضّح داخل الصفحة.
