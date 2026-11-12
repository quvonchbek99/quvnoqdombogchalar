# Kuvi ovoz kutubxonasi: har bir gapni Azure (Madina — f, Sardor — m) orqali mp3 qilib saqlaydi.
# Sekin ishlaydi (daqiqasiga ~8 ta), saytdagi o'quvchilarning bepul limitini band qilmaslik uchun.
import json, os, re, subprocess, time, sys
OUT = '/home/claude/quvnoqdombogchalar/ovoz/k'
W = 'https://kuvi-ovoz.quvonchmash12.workers.dev/tts'
def norm(t): return re.sub(r'\s+', ' ', re.sub(r'\.\.\.', '…', re.sub(r"[ʻʼ‘’`´]", "'", t.lower()))).strip()
def h(s):
    x = 2166136261
    for ch in s.encode('utf-16-le').decode('utf-16-le'):
        x ^= ord(ch); x = (x * 16777619) & 0xffffffff
    return format(x, 'x') + format(len(s), 'x')
def orth(t): return re.sub(r"([oOgG])['‘’`ʼ]", lambda m: m.group(1) + 'ʻ', t)
ph = json.load(open(os.path.join(os.path.dirname(__file__), 'phrases.json')))
os.makedirs(OUT + '/f', exist_ok=True); os.makedirs(OUT + '/m', exist_ok=True)
man = {}
for p in ph: man[norm(p['t'])] = h(norm(p['t']))
json.dump({'v': 1, 'k': man}, open(OUT + '/lib.json', 'w'), ensure_ascii=False, separators=(',', ':'))
jobs = [(p, g) for p in ph for g in ('f', 'm')]
done = 0; t0 = time.time()
for i, (p, g) in enumerate(jobs):
    fn = f"{OUT}/{g}/{man[norm(p['t'])]}.mp3"
    if os.path.exists(fn) and os.path.getsize(fn) > 500: done += 1; continue
    body = json.dumps({'text': orth(p['t']), 'mood': p.get('m') or 'neutral', 'g': g, 'lang': 'uz'})
    for att in range(6):
        r = subprocess.run(['curl', '-s', '--max-time', '30', '-o', fn + '.tmp', '-w', '%{http_code}', '-H', 'Origin: https://kuvonch.uz',
                            '-H', 'Content-Type: application/json', '-d', body, W], capture_output=True, text=True)
        code = r.stdout.strip()
        if code == '200' and os.path.getsize(fn + '.tmp') > 500: os.replace(fn + '.tmp', fn); break
        time.sleep(30 if code == '429' else 10)
    else:
        print('XATO', g, p['t'], flush=True)
    done += 1
    if done % 20 == 0: print(f"{done}/{len(jobs)} tayyor, {int(time.time()-t0)} s", flush=True)
    time.sleep(7.2)
print('TUGADI', done, len(jobs), int(time.time() - t0), 's', flush=True)
