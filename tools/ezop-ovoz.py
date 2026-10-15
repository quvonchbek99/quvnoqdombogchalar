#!/usr/bin/env python3
"""Ezop masallari uchun o'zbekcha neyron ovoz (ezop-ovoz/*.mp3) yaratadi.

Har bir masal uchun uchta klip bo'ladi:
  <id>.mp3         — sarlavha + matn + savol
  <id>-takror.mp3  — matn + savol (takrorlash)
  <id>-izoh.mp3    — "Noto'g'ri. " + izoh
Va bir martalik "togri.mp3" ("To'g'ri").

Mavjud va bo'sh bo'lmagan fayllar qayta yaratilmaydi. Matn o'zgargan masal uchun
eski faylni o'chirib, skriptni qayta ishga tushiring.

Ishlatish (repo ildizidan):
  python3 tools/ezop-ovoz.py
Talab: python3, node, pip paketi edge-tts (yo'q bo'lsa o'zi o'rnatadi).
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "ezop-ovoz")
VOICE = "uz-UZ-MadinaNeural"
RATE = "-5%"
CA_BUNDLE = "/root/.ccr/ca-bundle.crt"  # sandbox proksi sertifikati (bo'lsa)


def ensure_edge_tts():
    try:
        import edge_tts  # noqa: F401
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", "edge-tts",
                        "--break-system-packages"], check=False)


def load_items():
    js = (
        "global.window={};require(" + json.dumps(os.path.join(ROOT, "ezop-masallar.js")) + ");"
        "const out=[];for(const m of window.EZOP_MASALLAR){"
        "out.push({key:m.id,text:m.sarlavha+'. '+m.matn+' '+m.savol});"
        "out.push({key:m.id+'-takror',text:m.matn+' '+m.savol});"
        "out.push({key:m.id+'-izoh',text:\"Noto'g'ri. \"+m.izoh});}"
        "out.push({key:'togri',text:\"To'g'ri\"});"
        "console.log(JSON.stringify(out));"
    )
    r = subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def synth(text, path):
    """edge-tts ni chaqiradi. Proksi sertifikati bo'lsa, certifi shu faylga yo'naltiriladi."""
    code = (
        "import sys\n"
        "import os\n"
        "if os.path.exists(%r):\n"
        "    import certifi\n"
        "    certifi.where = lambda: %r\n"
        "import edge_tts.__main__ as m\n"
        "sys.argv=['edge-tts']+sys.argv[1:]\n"
        "m.main()\n"
    ) % (CA_BUNDLE, CA_BUNDLE)
    args = [sys.executable, "-c", code, "--voice", VOICE, "--rate=" + RATE,
            "--text", text, "--write-media", path]
    r = subprocess.run(args, capture_output=True, text=True, timeout=180)
    return r.returncode == 0 and os.path.exists(path) and os.path.getsize(path) > 0


def main():
    os.makedirs(OUT, exist_ok=True)
    ensure_edge_tts()
    items = load_items()
    ok, fail = 0, []
    for it in items:
        path = os.path.join(OUT, it["key"] + ".mp3")
        if os.path.exists(path) and os.path.getsize(path) > 0:
            ok += 1
            continue
        if synth(it["text"], path):
            ok += 1
        else:
            fail.append(it["key"])
    print("ovoz: %d/%d tayyor" % (ok, len(items)))
    if fail:
        print("xato (brauzer ovozi ishlatiladi):", ", ".join(fail))
    return 0


if __name__ == "__main__":
    sys.exit(main())
