# SKILL: Ilmiy yozish — Kuvi AI shundan boshlanadi

Manba: foydalanuvchi bergan «Ilmiy yozish dasturlari» suhbati (2026-11-21). Kuvi AI'ning asosiy talabi — **to'liq matematik
format**: formulalar, teoremalar va isbotlar professional ilmiy ish sifatida yoziladi. Modelga boradigan ixcham matn
`agentlar.js` dagi `skill.formula` va `skill.ilmiy` da; bu fayl — odam uchun to'liq tavsif.

## 1. Matematiklar qaysi dasturda nima qiladi

| Dastur | Nima uchun |
|---|---|
| **LaTeX / Overleaf** — eng tavsiya etiladi | ilmiy maqola va dissertatsiya, murakkab formulalar, teorema va isbotlar, bibliografiya va avtomatik raqamlash, Springer / Elsevier / AMS formatlari |
| **Wolfram Mathematica** | murakkab matematik hisob, differensial tenglamalar, grafiklar, integrallar, simvolik hisob |
| **MATLAB** | sonli hisob, differensial tenglamalar sistemasi, matematik modellashtirish va grafiklar |
| **Microsoft Word + MathType** | dissertatsiya va diplom ishlari, formulalarni tahrirlash, OTM talab qiladigan Word formatidagi hujjat |
| **Maple** | analitik hisob, integral va hosilalar, differensial tenglamalarni yechish |
| **Zotero** | ilmiy adabiyotlar va manbalarni boshqarish |

| Ilmiy ish turi | Dastur |
|---|---|
| Matematik dissertatsiya | LaTeX |
| Xalqaro ilmiy maqola | LaTeX |
| Murakkab formulalar | LaTeX |
| Matematik hisoblash | Mathematica |
| Grafik va modellashtirish | MATLAB |
| Word formatidagi dissertatsiya | Word + MathType |
| Simvolik hisoblash | Maple |

Odatiy to'plam: **Overleaf** (yozish) + **Mathematica** (formulalar va hisob) + **MATLAB** (yechim grafiklari) + **Zotero** (adabiyotlar).

## 2. Kuvi AI buni qanday bajaradi

- **LaTeX/Overleaf darajasi** — har formula `$...$` / `$$...$$` da, KaTeX bilan chiroyli chiziladi; javob «⬇ .tex» yoki
  «🌿 Overleaf» tugmasi bilan to'liq LaTeX hujjatga aylanadi (amsmath, amssymb, amsthm, mhchem).
- **Word + MathType** — «📝 Word» tugmasi formulalarni MathML qilib nusxalaydi (Word tenglamaga aylantiradi);
  yakka formulani bosish — LaTeX nusxa (Word: Alt+= → LaTeX).
- **Mathematica / Maple / MATLAB** — hisob yoki grafik kerak bo'lsa Kuvi tegishli kodni ham beradi.
- **Zotero** — manbalarni to'qimaydi; aniq bilmasa «manbani tekshirish kerak» deb belgilaydi.
- **Ilmiy uslub** — Ta'rif, Teorema, Lemma, Natija, Isbot (∎), raqamlangan formulalar `\tag{1}`.

## 3. Foydalanuvchi bilan aniqlashtiriladigan savollar

1. Maqsad: magistrlik dissertatsiyasi · xalqaro (Scopus) maqola · PhD dissertatsiyasi · ilmiy monografiya.
2. Format: LaTeX · Word + MathType · ikkalasi.
3. Daraja: professional, to'liq matematik format (Kuvi AI shu darajadan boshlanadi) · eng kuchli avtomatlashtirilgan tizim · noldan o'rganish.
