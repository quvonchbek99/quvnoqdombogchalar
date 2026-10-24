#!/usr/bin/env python3
"""Ezop masali uchun 9:16 (1080x1920) qisqa video va Instagram/YouTube izohini yaratadi.

Natija: media/ezop/<id>.mp4 va media/ezop/<id>.json (sarlavha, izoh matni, hashtaglar).
Sahnalar: sarlavha -> matn -> savol+variantlar -> to'g'ri javob+izoh -> xulosa.
Har sahna o'zbekcha ovoz (edge-tts, tools/ezop-ovoz.py dagi synth) bilan.

Ishlatish (repo ildizidan):
  python3 tools/ezop-video.py --id ez-059
  python3 tools/ezop-video.py            # bugungi (Toshkent) sanasi bo'yicha masal
Talab: python3, node, ffmpeg, Pillow, edge-tts.
"""
import argparse
import datetime
import importlib.util
import json
import os
import subprocess
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "media", "ezop")
TMP_DIR = os.environ.get("EZOP_TMP", "/tmp/ezop-video-work")
W, H = 1080, 1920
BG_TOP, BG_BOT = (10, 34, 34), (18, 66, 62)
PANEL = (15, 42, 42, 210)
ACC = (94, 230, 199)
GOLD = (242, 196, 109)
WHITE = (255, 255, 255)
SOFT = (200, 225, 220)
FONT_B = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/google-fonts/Poppins-Regular.ttf"
FPS = 30
TAIL = 0.6  # har sahnadan keyin kichik pauza (soniya)

BASE_TAGS = ["#kuvonchacademy", "#ezopmasallari", "#masal", "#hikmat", "#ibratlihikoya",
             "#ertak", "#bolalaruchun", "#ozbekcha", "#oquvchilar", "#reels"]


def load_fable(fable_id=None):
    js = (
        "global.window={};require(" + json.dumps(os.path.join(ROOT, "ezop-masallar.js")) + ");"
        "const a=window.EZOP_MASALLAR;"
        "console.log(JSON.stringify(a));"
    )
    r = subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True)
    items = json.loads(r.stdout)
    if fable_id:
        for m in items:
            if m["id"] == fable_id:
                return m
        raise SystemExit("masal topilmadi: " + fable_id)
    # Toshkent sanasi bo'yicha: yil boshidan kunlar soni, masallar soniga modul
    today = datetime.datetime.utcnow() + datetime.timedelta(hours=5)
    idx = today.timetuple().tm_yday % len(items)
    return items[idx]


def gradient_bg():
    img = Image.new("RGB", (W, H), BG_TOP)
    px = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        c = tuple(int(BG_TOP[i] + (BG_BOT[i] - BG_TOP[i]) * t) for i in range(3))
        px.line([(0, y), (W, y)], fill=c)
    return img


def wrap_lines(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_block(draw, lines, font, y, color, line_gap=16, center=True):
    for ln in lines:
        w = draw.textlength(ln, font=font)
        x = (W - w) / 2 if center else 90
        draw.text((x, y), ln, font=font, fill=color)
        y += font.size + line_gap
    return y


def header(img):
    d = ImageDraw.Draw(img, "RGBA")
    d.rectangle([0, 0, W, 118], fill=(15, 42, 42, 210))
    d.rectangle([0, 118, W, 122], fill=ACC)
    f = ImageFont.truetype(FONT_B, 64)
    t = "kuvonch.uz"
    d.text(((W - d.textlength(t, font=f)) / 2, 22), t, font=f, fill=ACC)
    return d


def scene_title(m):
    img = gradient_bg()
    d = header(img)
    f_series = ImageFont.truetype(FONT_B, 54)
    f_title = ImageFont.truetype(FONT_B, 92)
    s = "EZOP MASALLARI"
    d.text(((W - d.textlength(s, font=f_series)) / 2, 640), s, font=f_series, fill=GOLD)
    lines = wrap_lines(d, m["sarlavha"], f_title, W - 160)
    draw_block(d, lines, f_title, 740, WHITE, line_gap=18)
    s2 = "Ezop · mil. avv. ~620–564 yillar"
    f_small = ImageFont.truetype(FONT_R, 40)
    d.text(((W - d.textlength(s2, font=f_small)) / 2, 1500), s2, font=f_small, fill=SOFT)
    return img, m["sarlavha"] + "."


def scene_story(m):
    img = gradient_bg()
    d = header(img)
    f = ImageFont.truetype(FONT_R, 58)
    lines = wrap_lines(d, m["matn"], f, W - 160)
    total = len(lines) * (f.size + 16)
    draw_block(d, lines, f, max(260, (H - total) // 2), WHITE)
    return img, m["matn"]


def scene_question(m):
    img = gradient_bg()
    d = header(img)
    fq = ImageFont.truetype(FONT_B, 66)
    fv = ImageFont.truetype(FONT_R, 44)
    fl = ImageFont.truetype(FONT_B, 48)
    lines = wrap_lines(d, m["savol"], fq, W - 160)
    y = draw_block(d, lines, fq, 480, GOLD, line_gap=16)
    y += 90
    letters = ["A", "B", "C"]
    for i, v in enumerate(m["variantlar"]):
        d.rounded_rectangle([70, y, W - 70, y + 230], radius=34, fill=(15, 42, 42, 220),
                            outline=(94, 230, 199, 140), width=3)
        d.text((110, y + 30), letters[i], font=fl, fill=ACC)
        vl = wrap_lines(d, v, fv, W - 300)
        yy = y + 30
        for ln in vl[:3]:
            d.text((190, yy), ln, font=fv, fill=WHITE)
            yy += fv.size + 10
        y += 260
    narr = m["savol"] + " Variantlar: " + ". ".join(
        "%s. %s" % (letters[i], v) for i, v in enumerate(m["variantlar"])) + "."
    return img, narr


def scene_answer(m):
    img = gradient_bg()
    d = header(img)
    fh = ImageFont.truetype(FONT_B, 60)
    fv = ImageFont.truetype(FONT_B, 56)
    fi = ImageFont.truetype(FONT_R, 44)
    t = "To'g'ri javob"
    d.text(((W - d.textlength(t, font=fh)) / 2, 520), t, font=fh, fill=ACC)
    vl = wrap_lines(d, m["variantlar"][m["javob"]], fv, W - 200)
    y = draw_block(d, vl, fv, 640, WHITE, line_gap=14)
    il = wrap_lines(d, m["izoh"], fi, W - 200)
    draw_block(d, il, fi, y + 90, SOFT, line_gap=12)
    narr = "To'g'ri javob: " + m["variantlar"][m["javob"]] + ". " + m["izoh"]
    return img, narr


def scene_outro():
    img = gradient_bg()
    d = header(img)
    fb = ImageFont.truetype(FONT_B, 72)
    fr = ImageFont.truetype(FONT_R, 50)
    t1 = "Fikringizni izohda yozing"
    t2 = "Ko'proq masal va darslar: kuvonch.uz"
    lines1 = wrap_lines(d, t1, fb, W - 160)
    y = draw_block(d, lines1, fb, 760, GOLD, line_gap=18)
    lines2 = wrap_lines(d, t2, fr, W - 160)
    draw_block(d, lines2, fr, y + 60, WHITE)
    return img, "Fikringizni izohda yozing."


def tts_module():
    path = os.path.join(ROOT, "tools", "ezop-ovoz.py")
    spec = importlib.util.spec_from_file_location("ezop_ovoz", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=nw=1:nk=1", path], capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def build(m, out_path):
    os.makedirs(TMP_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    tts = tts_module()
    tts.RATE = "+0%"
    scenes = [scene_title(m), scene_story(m), scene_question(m), scene_answer(m)]
    seg_files = []
    for i, (img, narr) in enumerate(scenes):
        png = os.path.join(TMP_DIR, "s%d.png" % i)
        mp3 = os.path.join(TMP_DIR, "s%d.mp3" % i)
        seg = os.path.join(TMP_DIR, "seg%d.mp4" % i)
        img.save(png)
        if not tts.synth(narr, mp3):
            raise SystemExit("ovoz yaratilmadi: sahna %d" % i)
        dur = duration(mp3) + TAIL
        subprocess.run([
            "ffmpeg", "-y", "-loglevel", "error",
            "-loop", "1", "-framerate", str(FPS), "-i", png,
            "-i", mp3,
            "-af", "apad", "-t", "%.2f" % dur,
            "-c:v", "libx264", "-tune", "stillimage", "-preset", "medium", "-crf", "20",
            "-pix_fmt", "yuv420p", "-r", str(FPS),
            "-c:a", "aac", "-b:a", "160k", "-ar", "44100", "-ac", "1",
            seg], check=True)
        seg_files.append(seg)
    listfile = os.path.join(TMP_DIR, "list.txt")
    with open(listfile, "w") as f:
        for s in seg_files:
            f.write("file '%s'\n" % s)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
                    "-i", listfile, "-c", "copy", "-movflags", "+faststart", out_path], check=True)


def caption(m):
    mavzu_tag = "#" + m["mavzu"].replace("'", "").replace("’", "")
    tags = BASE_TAGS + [mavzu_tag, "#aesop", "#ezop", "#hikoya", "#uzbek"]
    text = (
        "🦊 %s\n\n"
        "%s\n\n"
        "💡 Xulosa: %s\n\n"
        "Sizningcha, qaysi javob to'g'ri? Izohda yozing 👇\n\n"
        "📚 Ko'proq masal va darslar: kuvonch.uz\n\n"
        "%s"
    ) % (m["sarlavha"], m["matn"], m["izoh"], " ".join(tags[:15]))
    return text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--id", help="masal id, masalan ez-059")
    args = ap.parse_args()
    m = load_fable(args.id)
    out_mp4 = os.path.join(OUT, m["id"] + ".mp4")
    build(m, out_mp4)
    meta = {"id": m["id"], "sarlavha": m["sarlavha"], "file": "media/ezop/%s.mp4" % m["id"],
            "caption": caption(m)}
    with open(os.path.join(OUT, m["id"] + ".json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print(json.dumps(meta, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
