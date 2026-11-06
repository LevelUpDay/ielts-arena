# IELTS Arena

Bitta saytda IELTS tayyorgarlik: **Listening**, **Reading**, **Concentration** (diqqat mashqlari), va tez kunda **Speaking** / **Writing**.

Chess.com uslubidagi reyting tizimi: har bir bo'lim uchun alohida reyting (100–3000) va daraja (Beginner → Advanced). Har bir yakunlangan mashq Elo asosida reytingni yangilaydi va mashqlar sizning darajangizga moslab tanlanadi.

## Texnologiyalar

- React + Vite + Tailwind CSS (SPA)
- Supabase — autentifikatsiya (email/parol) va ma'lumotlar bazasi (profil, reytinglar, urinishlar tarixi)
- Brauzerning `speechSynthesis` API'si — Listening audio uchun (tashqi audio fayl kerak emas)

## Loyihani ishga tushirish

```bash
npm install
npm run dev
```

Supabase ulanish ma'lumotlari `src/lib/supabase.js` da (publishable/anon kalit — mijoz tomonida ochiq bo'lishi xavfsiz).

## Baza sxemasi

- `profiles` — foydalanuvchi profili (username, display_name)
- `skill_ratings` — har bir bo'lim (`listening`/`reading`/`concentration`/`speaking`/`writing`) uchun reyting
- `attempts` — har bir mashq urinishining tarixi (reyting o'zgarishi bilan)

Ro'yxatdan o'tganda trigger avtomatik profil va 5 ta bo'lim uchun boshlang'ich reyting (400) yaratadi.

## Hozirgi holat

- ✅ Listening — 14 xil mashq turi (raqamlar, imlo, matching, multiple choice va h.k.)
- ✅ Reading — 6 xil savol turi (T/F/NG, gap-fill, matching headings, sentence endings, summary completion, multiple choice) + original matnlar
- ✅ Concentration — Stroop test, N-Back, reaksiya tezligi
- 🔜 Speaking, Writing
