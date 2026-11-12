# Kuvi ovoz kutubxonasi ro'yxatini yangilaydi: faqat ikkala ovozi (f — Madina, m — Sardor) tayyor gaplar lib.json'ga kiradi.
# Yonida royxat.txt — qaysi fayl qaysi gap ekani (o'z ovozingiz bilan almashtirish uchun).
import json, os, re, sys
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'ovoz', 'k')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
def norm(t): return re.sub(r'\s+', ' ', re.sub(r'\.\.\.', '…', re.sub(r"[ʻʼ‘’`´]", "'", t.lower()))).strip()
def h(s):
    x = 2166136261
    for ch in s:
        x ^= ord(ch); x = (x * 16777619) & 0xffffffff
    return format(x, 'x') + format(len(s), 'x')
ph = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'phrases.json')))
k, rows = {}, []
for p in ph:
    n = norm(p['t']); hh = h(n)
    if all(os.path.exists(f"{D}/{g}/{hh}.mp3") and os.path.getsize(f"{D}/{g}/{hh}.mp3") > 500 for g in 'fm'):
        k[n] = hh; rows.append(f"{hh}.mp3\t{p['t']}")
json.dump({'v': 1, 'k': k}, open(f"{D}/lib.json", 'w'), ensure_ascii=False, separators=(',', ':'))
open(f"{D}/royxat.txt", 'w').write(
    "Kuvi ovoz kutubxonasi — har bir gap ikki ovozda: f/ papkada Madina (ayol), m/ papkada Sardor (erkak).\n"
    "O'z ovozingizda yozib, xuddi shu nomdagi .mp3 bilan almashtirsangiz, Kuvi o'sha gapni sizning ovozingizda aytadi.\n\n"
    "Fayl nomi\tGap\n" + "\n".join(rows) + "\n")
print(len(k), 'ta gap tayyor /', len(ph))
